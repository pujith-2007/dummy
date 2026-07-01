/**
 * insight-generation-service.ts
 *
 * Pure functions for generating human-readable insights, learning gap labels,
 * trend summaries, and trend classification from performance data.
 */

import type {
	PerformanceLevel,
	TrendClassification,
	TrendPointInput,
	TrendSummary,
} from "@/features/skill-gap-analysis/types/performance-analysis.types";

// ---------------------------------------------------------------------------
// Trend helpers
// ---------------------------------------------------------------------------

export function computeImprovementRate(trendPoints: TrendPointInput[]): number {
	if (trendPoints.length < 2) return 0;
	const first = trendPoints[0].percentage;
	const last = trendPoints[trendPoints.length - 1].percentage;
	return Math.round((last - first) * 100) / 100;
}

export function computeConsistencyScore(trendPoints: TrendPointInput[]): number {
	if (trendPoints.length < 2) return 100;
	const scores = trendPoints.map((p) => p.percentage);
	const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
	const variance = scores.reduce((acc, s) => acc + (s - mean) ** 2, 0) / scores.length;
	const stdDev = Math.sqrt(variance);
	// Consistency: lower std deviation = higher score, capped at 100
	return Math.round(Math.max(0, 100 - stdDev) * 100) / 100;
}

export function classifyTrend(trendPoints: TrendPointInput[]): TrendClassification {
	if (trendPoints.length < 2) return "stable";
	const rate = computeImprovementRate(trendPoints);
	const consistency = computeConsistencyScore(trendPoints);
	if (rate > 5 && consistency > 70) return "consistently-improving";
	if (rate < -5 && consistency > 70) return "consistently-declining";
	if (consistency < 50) return "volatile";
	return "stable";
}

export function buildTrendSummary(trend?: TrendPointInput[]): TrendSummary | undefined {
	if (!trend || trend.length === 0) return undefined;
	const start = trend[0].percentage;
	const end = trend[trend.length - 1].percentage;
	const change = Math.round((end - start) * 100) / 100;
	return {
		startingPercentage: start,
		endingPercentage: end,
		change,
		direction: change > 1 ? "improving" : change < -1 ? "declining" : "stable",
		labels: trend.map((p) => p.label),
	};
}

// ---------------------------------------------------------------------------
// Insight generators
// ---------------------------------------------------------------------------

export function buildInsights(params: {
	scorePercentage: number;
	performanceLevel: PerformanceLevel;
	strengths: string[];
	weaknesses: string[];
	trendSummary?: TrendSummary;
}): string[] {
	const insights: string[] = [];

	if (params.performanceLevel === "excellent") {
		insights.push("Outstanding performance! You are excelling across key competencies.");
	} else if (params.performanceLevel === "strong") {
		insights.push("Good performance with solid foundational skills demonstrated.");
	} else if (params.performanceLevel === "average") {
		insights.push("Average performance detected — focused practice is recommended.");
	} else {
		insights.push(
			"Performance needs improvement. Review core concepts and seek additional resources.",
		);
	}

	if (params.strengths.length > 0) {
		insights.push(`Strong areas: ${params.strengths.slice(0, 3).join(", ")}.`);
	}

	if (params.weaknesses.length > 0) {
		insights.push(`Focus on improving: ${params.weaknesses.slice(0, 3).join(", ")}.`);
	}

	if (params.trendSummary) {
		if (params.trendSummary.direction === "improving") {
			insights.push(
				`Your scores are trending upward (+${params.trendSummary.change}%) — keep it up!`,
			);
		} else if (params.trendSummary.direction === "declining") {
			insights.push(
				`Your scores have declined by ${Math.abs(params.trendSummary.change)}% recently. Consider a review session.`,
			);
		}
	}

	return insights;
}

export function buildLearningGaps(weaknesses: string[]): string[] {
	return weaknesses.map((w) => `Gap identified in: ${w}`);
}
