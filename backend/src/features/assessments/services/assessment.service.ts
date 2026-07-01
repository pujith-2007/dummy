import { v4 as uuidv4 } from "uuid";
import { assessmentStore } from "../data/assessment.store";
import type { Assessment, AssessmentResult, Question } from "../types/assessment.types";
import { questionGeneratorService } from "./question-generator.service";
import { scoringService } from "./scoring.service";

export class AssessmentService {
	async startAssessment(track: string, questionCount: number): Promise<Assessment> {
		const aiQuestions = await questionGeneratorService.generate(track, questionCount);

		const questions: Question[] = aiQuestions.map((q) => ({
			id: uuidv4(),
			question: q.question,
			options: q.options,
			correctAnswer: q.correctAnswer,
		}));

		const assessment: Assessment = {
			id: uuidv4(),
			track,
			questions,
			createdAt: new Date(),
		};

		assessmentStore.save(assessment);

		return assessment;
	}

	getQuestions(assessmentId: string): Question[] {
		const assessment = assessmentStore.findById(assessmentId);

		if (!assessment) {
			const err = new Error(`Assessment not found: ${assessmentId}`);
			(err as NodeJS.ErrnoException).code = "NOT_FOUND";
			throw err;
		}

		return assessment.questions;
	}

	submitAssessment(assessmentId: string, answers: string[]): AssessmentResult {
		const assessment = assessmentStore.findById(assessmentId);

		if (!assessment) {
			const err = new Error(`Assessment not found: ${assessmentId}`);
			(err as NodeJS.ErrnoException).code = "NOT_FOUND";
			throw err;
		}

		if (answers.length !== assessment.questions.length) {
			const err = new Error(
				`Expected ${assessment.questions.length} answers but received ${answers.length}.`,
			);
			(err as NodeJS.ErrnoException).code = "BAD_REQUEST";
			throw err;
		}

		return scoringService.grade(assessmentId, assessment.questions, answers);
	}
}

export const assessmentService = new AssessmentService();
