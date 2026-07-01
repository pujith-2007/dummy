/**
 * performance-analysis-service.ts
 *
 * Orchestration layer — coordinates the four domain services and handles all
 * Prisma read/write operations for the performance-analysis feature.
 * Contains NO business logic itself.
 */

import { prisma } from "@/database";
import { TREND_HISTORY_LIMIT } from "@/features/recommendations/constants/grading.constants";
import type {
	PerformanceAnalysisInput,
	PerformanceAnalysisResult,
	PerformanceGrade,
	PerformanceLevel,
	StudentPerformanceSummary,
	TopicProficiency,
	TrendDataPoint,
} from "../types/performance-analysis.types";
import {
	buildStrengths,
	buildTopicBreakdown,
	buildWeaknesses,
} from "./competency-analysis-service";
import {
	buildInsights,
	buildLearningGaps,
	buildTrendSummary,
	classifyTrend,
	computeConsistencyScore,
	computeImprovementRate,
} from "@/features/recommendations/services/insight-generation-service";
import { getGrade, getPerformanceLevel, roundToTwo } from "./score-analysis-service";
import {
	computeTopicAverages,
	extractStrongestSkills,
	extractWeakestSkills,
} from "@/features/recommendations/services/visualization-service";

// ---------------------------------------------------------------------------
// Pure orchestration (no DB)
// ---------------------------------------------------------------------------

export function analyzePerformance(input: PerformanceAnalysisInput): PerformanceAnalysisResult {
	const totalQuestions = input.totalQuestions;
	const attemptedQuestions = Math.min(input.attemptedQuestions ?? totalQuestions, totalQuestions);
	const correctAnswers = Math.min(input.correctAnswers, attemptedQuestions);

	const scorePercentage =
		totalQuestions === 0 ? 0 : roundToTwo((correctAnswers / totalQuestions) * 100);
	const accuracyPercentage =
		attemptedQuestions === 0 ? 0 : roundToTwo((correctAnswers / attemptedQuestions) * 100);

	const topicBreakdown = buildTopicBreakdown(input);
	const strengths = buildStrengths(topicBreakdown);
	const weaknesses = buildWeaknesses(topicBreakdown);
	const trendSummary = buildTrendSummary(input.trend);
	const grade = getGrade(scorePercentage);
	const performanceLevel = getPerformanceLevel(scorePercentage);

	const insights = buildInsights({
		scorePercentage,
		performanceLevel,
		strengths,
		weaknesses,
		trendSummary,
	});
	const learningGaps = buildLearningGaps(weaknesses);

	return {
		studentId: input.studentId,
		assessmentId: input.assessmentId,
		totalQuestions,
		attemptedQuestions,
		correctAnswers,
		overallScore: scorePercentage,
		scorePercentage,
		accuracyPercentage,
		grade,
		performanceLevel,
		strengths,
		weaknesses,
		topicBreakdown,
		insights,
		learningGaps,
		trendSummary,
		generatedAt: new Date().toISOString(),
	};
}

// ---------------------------------------------------------------------------
// Analyse + persist
// ---------------------------------------------------------------------------

export async function analyzeAndStorePerformance(
	input: PerformanceAnalysisInput,
): Promise<PerformanceAnalysisResult> {
	const analysis = analyzePerformance(input);

	const saved = await prisma.performanceAnalysis.create({
		data: {
			studentId: analysis.studentId,
			assessmentId: analysis.assessmentId,
			totalQuestions: analysis.totalQuestions,
			attemptedQuestions: analysis.attemptedQuestions,
			correctAnswers: analysis.correctAnswers,
			scorePercentage: analysis.scorePercentage,
			accuracyPercentage: analysis.accuracyPercentage,
			grade: analysis.grade,
			performanceLevel: analysis.performanceLevel,
			strengths: analysis.strengths,
			weaknesses: analysis.weaknesses,
			insights: analysis.insights,
			trendSummary: analysis.trendSummary as any,
			topicMetrics: {
				create: analysis.topicBreakdown.map((t) => ({
					topic: t.topic,
					correctAnswers: t.correctAnswers,
					attemptedQuestions: t.attemptedQuestions,
					percentage: t.percentage,
					proficiency: t.proficiency,
				})),
			},
		},
	});

	return {
		...analysis,
		id: saved.id,
		storedAt: saved.createdAt.toISOString(),
	};
}

// ---------------------------------------------------------------------------
// History (paginated)
// ---------------------------------------------------------------------------

export async function getHistoryByStudent(
	studentId: string,
	options: { page?: number; limit?: number } = {},
) {
	const page = Math.max(1, options.page ?? 1);
	const limit = Math.max(1, options.limit ?? 10);
	const skip = (page - 1) * limit;

	const [items, total] = await Promise.all([
		prisma.performanceAnalysis.findMany({
			where: { studentId },
			include: { topicMetrics: true },
			orderBy: { createdAt: "desc" },
			skip,
			take: limit,
		}),
		prisma.performanceAnalysis.count({ where: { studentId } }),
	]);

	return {
		items: items.map((item: any) => ({
			id: item.id,
			studentId: item.studentId,
			assessmentId: item.assessmentId ?? undefined,
			totalQuestions: item.totalQuestions,
			attemptedQuestions: item.attemptedQuestions,
			correctAnswers: item.correctAnswers,
			overallScore: item.scorePercentage,
			scorePercentage: item.scorePercentage,
			accuracyPercentage: item.accuracyPercentage,
			grade: item.grade as PerformanceGrade,
			performanceLevel: item.performanceLevel as PerformanceLevel,
			strengths: item.strengths as string[],
			weaknesses: item.weaknesses as string[],
			topicBreakdown: item.topicMetrics.map((m: any) => ({
				topic: m.topic,
				correctAnswers: m.correctAnswers,
				attemptedQuestions: m.attemptedQuestions,
				percentage: m.percentage,
				proficiency: m.proficiency as TopicProficiency,
			})),
			insights: item.insights as string[],
			storedAt: item.createdAt.toISOString(),
			generatedAt: item.updatedAt.toISOString(),
		})),
		pagination: {
			page,
			limit,
			total,
			totalPages: Math.ceil(total / limit),
		},
	};
}

// ---------------------------------------------------------------------------
// Single record
// ---------------------------------------------------------------------------

export async function getAnalysisById(id: string): Promise<PerformanceAnalysisResult | null> {
	const item = await prisma.performanceAnalysis.findUnique({
		where: { id },
		include: { topicMetrics: true },
	});

	if (!item) return null;

	return {
		id: item.id,
		studentId: item.studentId,
		assessmentId: item.assessmentId ?? undefined,
		totalQuestions: item.totalQuestions,
		attemptedQuestions: item.attemptedQuestions,
		correctAnswers: item.correctAnswers,
		overallScore: item.scorePercentage,
		scorePercentage: item.scorePercentage,
		accuracyPercentage: item.accuracyPercentage,
		grade: item.grade as PerformanceGrade,
		performanceLevel: item.performanceLevel as PerformanceLevel,
		strengths: item.strengths as string[],
		weaknesses: item.weaknesses as string[],
		topicBreakdown: item.topicMetrics.map((m: any) => ({
			topic: m.topic,
			correctAnswers: m.correctAnswers,
			attemptedQuestions: m.attemptedQuestions,
			percentage: m.percentage,
			proficiency: m.proficiency as TopicProficiency,
		})),
		insights: item.insights as string[],
		trendSummary: (item.trendSummary as any) ?? undefined,
		learningGaps: buildLearningGaps(item.weaknesses as string[]),
		storedAt: item.createdAt.toISOString(),
		generatedAt: item.updatedAt.toISOString(),
	};
}

// ---------------------------------------------------------------------------
// Student summary
// ---------------------------------------------------------------------------

export async function getSummaryByStudent(
	studentId: string,
): Promise<StudentPerformanceSummary | null> {
	const analyses = await prisma.performanceAnalysis.findMany({
		where: { studentId },
		include: { topicMetrics: true },
		orderBy: { createdAt: "desc" },
	});

	if (analyses.length === 0) return null;

	const totalAssessments = analyses.length;
	let totalScorePctSum = 0;
	let totalAccuracyPctSum = 0;
	const gradeCount: Record<PerformanceGrade, number> = {
		"A+": 0,
		A: 0,
		B: 0,
		C: 0,
		D: 0,
		F: 0,
	};
	const topicStats: Record<string, { sumPct: number; count: number }> = {};

	for (const analysis of analyses) {
		totalScorePctSum += analysis.scorePercentage;
		totalAccuracyPctSum += analysis.accuracyPercentage;

		const grade = analysis.grade as PerformanceGrade;
		if (grade in gradeCount) gradeCount[grade]++;

		for (const metric of analysis.topicMetrics) {
			const name = metric.topic.trim();
			if (!topicStats[name]) topicStats[name] = { sumPct: 0, count: 0 };
			topicStats[name].sumPct += metric.percentage;
			topicStats[name].count++;
		}
	}

	const averageScore = roundToTwo(totalScorePctSum / totalAssessments);
	const averageAccuracy = roundToTwo(totalAccuracyPctSum / totalAssessments);
	const overallGrade = getGrade(averageScore);
	const overallPerformanceLevel = getPerformanceLevel(averageScore);
	const topicAverages = computeTopicAverages(topicStats);
	const strongestSkills = extractStrongestSkills(topicAverages);
	const weakestSkills = extractWeakestSkills(topicAverages);

	// Trend helpers — operate on the most-recent records in chronological order
	const trendPoints = analyses
		.slice(0, TREND_HISTORY_LIMIT)
		.reverse()
		.map((a: any) => ({
			label: a.createdAt.toISOString().slice(0, 10),
			percentage: a.scorePercentage,
		}));

	const improvementRate = computeImprovementRate(trendPoints);
	const consistencyScore = computeConsistencyScore(trendPoints);
	const trendClassification = classifyTrend(trendPoints);

	const recentTrend: TrendDataPoint[] = analyses
		.slice(0, TREND_HISTORY_LIMIT)
		.reverse()
		.map((a: any) => ({
			id: a.id,
			assessmentId: a.assessmentId,
			scorePercentage: a.scorePercentage,
			accuracyPercentage: a.accuracyPercentage,
			createdAt: a.createdAt.toISOString(),
			grade: a.grade,
		}));

	return {
		studentId,
		totalAssessments,
		averageScore,
		averageAccuracy,
		overallPerformanceLevel,
		overallGrade,
		gradeDistribution: gradeCount,
		topicAverages,
		strongestSkills,
		weakestSkills,
		improvementRate,
		consistencyScore,
		trendClassification,
		recentTrend,
	};
}
