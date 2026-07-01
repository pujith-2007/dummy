import { type IRouter, Router } from "express";
import {
	createPerformanceAnalysis,
	getPerformanceAnalysisDetail,
	getStudentDashboard,
	getStudentPerformanceHistory,
	getStudentPerformanceSummary,
	getStudentTopicAnalysis,
	getStudentTrends,
} from "../controllers/performance-analysis-controller";

const router: IRouter = Router();

// Core analysis routes
router.post("/compute", createPerformanceAnalysis);

// Student-scoped routes
router.get("/student/:studentId", getStudentPerformanceHistory);
router.get("/student/:studentId/summary", getStudentPerformanceSummary);

// Visualization routes
router.get("/student/:studentId/dashboard", getStudentDashboard);
router.get("/student/:studentId/topic-analysis", getStudentTopicAnalysis);
router.get("/student/:studentId/trends", getStudentTrends);

// Single analysis record (keep last so it doesn't shadow more specific routes)
router.get("/:id", getPerformanceAnalysisDetail);

export { router as performanceAnalysisRouter };
