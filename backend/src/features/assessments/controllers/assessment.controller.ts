import type { Request, Response } from "express";
import { assessmentService } from "../services/assessment.service";
import { startAssessmentSchema, submitAssessmentSchema } from "../validators/assessment.validator";

export async function startAssessment(req: Request, res: Response): Promise<void> {
	try {
		const parsed = startAssessmentSchema.safeParse(req.body);

		if (!parsed.success) {
			res.status(400).json({
				error: "Validation failed",
				details: parsed.error.flatten().fieldErrors,
			});
			return;
		}

		const { track, questionCount } = parsed.data;
		const assessment = await assessmentService.startAssessment(track, questionCount);

		res.status(201).json({
			assessmentId: assessment.id,
			track: assessment.track,
			questionCount: assessment.questions.length,
			createdAt: assessment.createdAt,
		});
	} catch (err: unknown) {
		const message = err instanceof Error ? err.message : "Failed to start assessment";

		if (message.includes("AI API key is missing") || message.includes("AI API request failed")) {
			res.status(502).json({ error: message });
			return;
		}

		console.error("[startAssessment]", err);
		res.status(500).json({ error: message });
	}
}

export async function getQuestions(req: Request, res: Response): Promise<void> {
	try {
		const { assessmentId } = req.params;

		if (!assessmentId || typeof assessmentId !== "string") {
			res.status(400).json({
				error: "Validation failed",
				details: { assessmentId: ["assessmentId is required"] },
			});
			return;
		}

		const questions = await assessmentService.getQuestions(assessmentId);

		res.status(200).json({
			assessmentId,
			questions: questions.map(({ id, question, options }) => ({
				id,
				question,
				options,
			})),
		});
	} catch (err: unknown) {
		const error = err as NodeJS.ErrnoException;

		if (error.code === "NOT_FOUND") {
			res.status(404).json({ error: error.message });
			return;
		}

		console.error("[getQuestions]", err);
		res.status(500).json({
			error: err instanceof Error ? err.message : "Failed to fetch questions",
		});
	}
}

export async function submitAssessment(req: Request, res: Response): Promise<void> {
	try {
		const parsed = submitAssessmentSchema.safeParse(req.body);

		if (!parsed.success) {
			res.status(400).json({
				error: "Validation failed",
				details: parsed.error.flatten().fieldErrors,
			});
			return;
		}

		const { assessmentId, answers } = parsed.data;
		const result = assessmentService.submitAssessment(assessmentId, answers);

		res.status(200).json(result);
	} catch (err: unknown) {
		const error = err as NodeJS.ErrnoException;

		if (error.code === "NOT_FOUND") {
			res.status(404).json({ error: error.message });
			return;
		}

		if (error.code === "BAD_REQUEST") {
			res.status(400).json({ error: error.message });
			return;
		}

		console.error("[submitAssessment]", err);
		res.status(500).json({
			error: err instanceof Error ? err.message : "Failed to submit assessment",
		});
	}
}
