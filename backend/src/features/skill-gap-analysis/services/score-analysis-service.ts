/**
 * score-analysis-service.ts
 *
 * Pure functions for computing grades, performance levels, and topic proficiency.
 * No side effects or DB calls.
 */

import type {
	PerformanceGrade,
	PerformanceLevel,
	TopicProficiency,
} from "../types/performance-analysis.types";

export function roundToTwo(value: number): number {
	return Math.round(value * 100) / 100;
}

export function getGrade(scorePercentage: number): PerformanceGrade {
	if (scorePercentage >= 95) return "A+";
	if (scorePercentage >= 85) return "A";
	if (scorePercentage >= 70) return "B";
	if (scorePercentage >= 55) return "C";
	if (scorePercentage >= 40) return "D";
	return "F";
}

export function getPerformanceLevel(scorePercentage: number): PerformanceLevel {
	if (scorePercentage >= 85) return "excellent";
	if (scorePercentage >= 70) return "strong";
	if (scorePercentage >= 55) return "average";
	return "needs-improvement";
}

export function getTopicProficiency(percentage: number): TopicProficiency {
	if (percentage >= 85) return "mastered";
	if (percentage >= 70) return "proficient";
	if (percentage >= 50) return "developing";
	return "needs-improvement";
}
