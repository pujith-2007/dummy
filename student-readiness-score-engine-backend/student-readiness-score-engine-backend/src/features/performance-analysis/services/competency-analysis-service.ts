/**
 * competency-analysis-service.ts
 *
 * Pure functions for building topic breakdowns, strengths, and weaknesses
 * from raw performance input. No DB operations.
 */

import { STRENGTH_THRESHOLD, WEAKNESS_THRESHOLD } from "../constants/grading.constants";
import type {
	PerformanceAnalysisInput,
	TopicPerformanceResult,
} from "../types/performance-analysis.types";
import { getTopicProficiency, roundToTwo } from "./score-analysis-service";

// ---------------------------------------------------------------------------
// Topic breakdown
// ---------------------------------------------------------------------------

export function buildTopicBreakdown(input: PerformanceAnalysisInput): TopicPerformanceResult[] {
	if (!input.topics || input.topics.length === 0) return [];

	return input.topics.map((t) => {
		const attempted = t.attemptedQuestions ?? t.correctAnswers;
		const percentage = attempted === 0 ? 0 : roundToTwo((t.correctAnswers / attempted) * 100);
		return {
			topic: t.topic,
			correctAnswers: t.correctAnswers,
			attemptedQuestions: attempted,
			percentage,
			proficiency: getTopicProficiency(percentage),
		};
	});
}

// ---------------------------------------------------------------------------
// Strengths and weaknesses from topic breakdown
// ---------------------------------------------------------------------------

export function buildStrengths(topicBreakdown: TopicPerformanceResult[]): string[] {
	return topicBreakdown.filter((t) => t.percentage >= STRENGTH_THRESHOLD).map((t) => t.topic);
}

export function buildWeaknesses(topicBreakdown: TopicPerformanceResult[]): string[] {
	return topicBreakdown.filter((t) => t.percentage < WEAKNESS_THRESHOLD).map((t) => t.topic);
}
