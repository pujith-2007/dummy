import { Router } from "express";
import {
	getQuestions,
	startAssessment,
	submitAssessment,
} from "../controllers/assessment.controller";

const router = Router();

/**
 * POST /assessment/start
 * Body: { track: string; questionCount?: number }
 * Returns: { assessmentId, track, questionCount, createdAt }
 */
router.post("/start", startAssessment);

router.get("/start", (_req, res) => {
	res.json({
		success: true,
		message:
			"The assessment endpoint is active! Please send a POST request with { track, questionCount } to start an assessment.",
	});
});

/**
 * GET /assessment/questions/:assessmentId
 * Params: assessmentId
 * Returns: { assessmentId, questions[] }
 */
router.get("/questions/:assessmentId", getQuestions);

/**
 * POST /assessment/submit
 * Body: { assessmentId: string; answers: string[] }
 */
router.post("/submit", submitAssessment);

export default router;
