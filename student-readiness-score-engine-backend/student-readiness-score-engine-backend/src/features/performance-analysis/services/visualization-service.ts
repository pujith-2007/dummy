import { prisma } from "@/database";
import {
	STRENGTH_THRESHOLD,
	TREND_HISTORY_LIMIT,
	WEAKNESS_THRESHOLD,
} from "../constants/grading.constants";
import type {
	DashboardChartData,
	PerformanceGrade,
	TopicAnalysisChartData,
	TopicProficiency,
	TrendChartData,
} from "../types/performance-analysis.types";
import {
	classifyTrend,
	computeConsistencyScore,
	computeImprovementRate,
} from "./insight-generation-service";
import {
	getGrade,
	getPerformanceLevel,
	getTopicProficiency,
	roundToTwo,
} from "./score-analysis-service";

// ---------------------------------------------------------------------------
// Dashboard — all key metrics in one chart-friendly payload
// ---------------------------------------------------------------------------

export async function getDashboardData(studentId: string): Promise<DashboardChartData | null> {
	const analyses = await prisma.performanceAnalysis.findMany({
		where: { studentId },
		include: { topicMetrics: true },
		orderBy: { createdAt: "asc" },
		take: TREND_HISTORY_LIMIT,
	});

	if (analyses.length === 0) return null;

	const scoreSum = analyses.reduce((acc, a) => acc + a.scorePercentage, 0);
	const overallScore = roundToTwo(scoreSum / analyses.length);
	const overallGrade = getGrade(overallScore);
	const performanceLevel = getPerformanceLevel(overallScore);

	// Timeline
	const scoreTimeline = {
		labels: analyses.map((a) => a.createdAt.toISOString().slice(0, 10)),
		scores: analyses.map((a) => roundToTwo(a.scorePercentage)),
		accuracies: analyses.map((a) => roundToTwo(a.accuracyPercentage)),
	};

	// Grade distribution
	const gradeKeys: PerformanceGrade[] = ["A+", "A", "B", "C", "D", "F"];
	const gradeCounts: Record<PerformanceGrade, number> = {
		"A+": 0,
		A: 0,
		B: 0,
		C: 0,
		D: 0,
		F: 0,
	};
	for (const a of analyses) {
		const g = a.grade as PerformanceGrade;
		if (g in gradeCounts) gradeCounts[g]++;
	}
	const gradeDistribution = {
		labels: gradeKeys,
		counts: gradeKeys.map((g) => gradeCounts[g]),
	};

	// Top topics by average score
	const topicStats: Record<string, { sumPct: number; count: number }> = {};
	for (const a of analyses) {
		for (const m of a.topicMetrics) {
			if (!topicStats[m.topic]) topicStats[m.topic] = { sumPct: 0, count: 0 };
			topicStats[m.topic].sumPct += m.percentage;
			topicStats[m.topic].count++;
		}
	}
	const sortedTopics = Object.entries(topicStats)
		.map(([topic, s]) => ({ topic, avg: roundToTwo(s.sumPct / s.count) }))
		.sort((a, b) => b.avg - a.avg)
		.slice(0, 5);

	const topTopics = {
		labels: sortedTopics.map((t) => t.topic),
		scores: sortedTopics.map((t) => t.avg),
	};

	return {
		studentId,
		overallScore,
		overallGrade,
		performanceLevel,
		totalAssessments: analyses.length,
		scoreTimeline,
		gradeDistribution,
		topTopics,
	};
}

// ---------------------------------------------------------------------------
// Topic analysis — chart-friendly per-topic averages
// ---------------------------------------------------------------------------

export async function getTopicAnalysisData(
	studentId: string,
): Promise<TopicAnalysisChartData | null> {
	const analyses = await prisma.performanceAnalysis.findMany({
		where: { studentId },
		include: { topicMetrics: true },
	});

	if (analyses.length === 0) return null;

	const topicStats: Record<string, { sumPct: number; count: number }> = {};
	for (const a of analyses) {
		for (const m of a.topicMetrics) {
			if (!topicStats[m.topic]) topicStats[m.topic] = { sumPct: 0, count: 0 };
			topicStats[m.topic].sumPct += m.percentage;
			topicStats[m.topic].count++;
		}
	}

	const sorted = Object.entries(topicStats)
		.map(([topic, s]) => ({
			topic,
			avg: roundToTwo(s.sumPct / s.count),
			count: s.count,
		}))
		.sort((a, b) => b.avg - a.avg);

	return {
		studentId,
		labels: sorted.map((t) => t.topic),
		scores: sorted.map((t) => t.avg),
		proficiencies: sorted.map((t) => getTopicProficiency(t.avg) as TopicProficiency),
		assessmentCounts: sorted.map((t) => t.count),
	};
}

// ---------------------------------------------------------------------------
// Trend data — score timeline with trend metadata
// ---------------------------------------------------------------------------

export async function getTrendData(studentId: string): Promise<TrendChartData | null> {
	const analyses = await prisma.performanceAnalysis.findMany({
		where: { studentId },
		orderBy: { createdAt: "asc" },
		take: TREND_HISTORY_LIMIT,
	});

	if (analyses.length === 0) return null;

	const trendPoints = analyses.map((a) => ({
		label: a.createdAt.toISOString().slice(0, 10),
		percentage: a.scorePercentage,
	}));

	const improvementRate = computeImprovementRate(trendPoints);
	const consistencyScore = computeConsistencyScore(trendPoints);
	const trendClassification = classifyTrend(trendPoints);

	const first = trendPoints[0]?.percentage ?? 0;
	const last = trendPoints.at(-1)?.percentage ?? first;
	const change = roundToTwo(last - first);
	const direction = change > 1 ? "improving" : change < -1 ? "declining" : "stable";

	return {
		studentId,
		labels: trendPoints.map((p) => p.label),
		scores: trendPoints.map((p) => roundToTwo(p.percentage)),
		accuracies: analyses.map((a) => roundToTwo(a.accuracyPercentage)),
		direction,
		improvementRate,
		consistencyScore,
		trendClassification,
	};
}

// ---------------------------------------------------------------------------
// Summary helpers used by performance-analysis-service
// ---------------------------------------------------------------------------

export function computeTopicAverages(
	topicStats: Record<string, { sumPct: number; count: number }>,
): Array<{
	topic: string;
	averageScore: number;
	assessmentsCount: number;
	proficiency: TopicProficiency;
}> {
	return Object.entries(topicStats).map(([topic, stats]) => {
		const avgPct = roundToTwo(stats.sumPct / stats.count);
		return {
			topic,
			averageScore: avgPct,
			assessmentsCount: stats.count,
			proficiency: getTopicProficiency(avgPct),
		};
	});
}

export function extractStrongestSkills(
	topicAverages: Array<{ topic: string; averageScore: number }>,
): string[] {
	return topicAverages.filter((t) => t.averageScore >= STRENGTH_THRESHOLD).map((t) => t.topic);
}

export function extractWeakestSkills(
	topicAverages: Array<{ topic: string; averageScore: number }>,
): string[] {
	return topicAverages.filter((t) => t.averageScore < WEAKNESS_THRESHOLD).map((t) => t.topic);
}
