import type { AssessmentResult, Question } from "../types/assessment.types";

type Grade = "Excellent" | "Good" | "Average" | "Needs Improvement";

function calculateGrade(score: number): Grade {
	if (score >= 90) return "Excellent";
	if (score >= 75) return "Good";
	if (score >= 50) return "Average";
	return "Needs Improvement";
}

export class ScoringService {
	grade(assessmentId: string, questions: Question[], answers: string[]): AssessmentResult {
		const totalQuestions = questions.length;

		const correctAnswers = questions.reduce((count, question, index) => {
			const submitted = (answers[index] ?? "").trim().toUpperCase();
			const expected = question.correctAnswer.trim().toUpperCase();
			return submitted === expected ? count + 1 : count;
		}, 0);

		const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

		return {
			assessmentId,
			score,
			totalQuestions,
			correctAnswers,
			grade: calculateGrade(score),
		};
	}
}

export const scoringService = new ScoringService();
