import type { Request, Response } from "express";
import type { ZodIssue } from "zod";
import { AppError } from "@/utils/app-error";
import { sendSuccess } from "@/utils/response";
import { paginationSchema } from "../schemas/pagination-schema";
import { performanceAnalysisSchema } from "../schemas/performance-analysis-schema";
import {
	analyzeAndStorePerformance,
	getAnalysisById,
	getHistoryByStudent,
	getSummaryByStudent,
} from "../services/performance-analysis-service";
import {
	getDashboardData,
	getTopicAnalysisData,
	getTrendData,
} from "@/features/recommendations/services/visualization-service";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatZodErrors(issues: ZodIssue[]): string {
	return issues
		.map((issue) => {
			const path = issue.path.join(".");
			return path.length > 0 ? `${path}: ${issue.message}` : issue.message;
		})
		.join("; ");
}

function requireStudentId(req: Request): string {
	const { studentId } = req.params;
	if (typeof studentId !== "string" || studentId.trim().length === 0) {
		throw new AppError("studentId param is required and must be a non-empty string", 400);
	}
	return studentId;
}

// ---------------------------------------------------------------------------
// POST /compute
// ---------------------------------------------------------------------------

export async function createPerformanceAnalysis(req: Request, res: Response) {
	const parsed = performanceAnalysisSchema.safeParse(req.body);

	if (!parsed.success) {
		throw new AppError(
			formatZodErrors(parsed.error.issues) || "Invalid performance analysis payload",
			400,
		);
	}

	const analysis = await analyzeAndStorePerformance(parsed.data);
	return sendSuccess(res, analysis, "Performance analysis generated", 201);
}

// ---------------------------------------------------------------------------
// GET /student/:studentId
// ---------------------------------------------------------------------------

export async function getStudentPerformanceHistory(req: Request, res: Response) {
	const studentId = requireStudentId(req);

	const parsedQuery = paginationSchema.safeParse(req.query);
	if (!parsedQuery.success) {
		throw new AppError("Invalid pagination parameters", 400);
	}

	const { page, limit } = parsedQuery.data;
	const history = await getHistoryByStudent(studentId, { page, limit });
	return sendSuccess(res, history, "Student performance history retrieved", 200);
}

// ---------------------------------------------------------------------------
// GET /student/:studentId/summary
// ---------------------------------------------------------------------------

export async function getStudentPerformanceSummary(req: Request, res: Response) {
	const studentId = requireStudentId(req);

	const summary = await getSummaryByStudent(studentId);
	if (!summary) {
		throw new AppError("No performance records found for this student", 404);
	}

	return sendSuccess(res, summary, "Student performance summary retrieved", 200);
}

// ---------------------------------------------------------------------------
// GET /student/:studentId/dashboard
// ---------------------------------------------------------------------------

export async function getStudentDashboard(req: Request, res: Response) {
	const studentId = requireStudentId(req);

	const dashboard = await getDashboardData(studentId);
	if (!dashboard) {
		throw new AppError("No performance records found for this student", 404);
	}

	return sendSuccess(res, dashboard, "Student dashboard data retrieved", 200);
}

// ---------------------------------------------------------------------------
// GET /student/:studentId/topic-analysis
// ---------------------------------------------------------------------------

export async function getStudentTopicAnalysis(req: Request, res: Response) {
	const studentId = requireStudentId(req);

	const topicData = await getTopicAnalysisData(studentId);
	if (!topicData) {
		throw new AppError("No topic data found for this student", 404);
	}

	return sendSuccess(res, topicData, "Student topic analysis retrieved", 200);
}

// ---------------------------------------------------------------------------
// GET /student/:studentId/trends
// ---------------------------------------------------------------------------

export async function getStudentTrends(req: Request, res: Response) {
	const studentId = requireStudentId(req);

	const trendData = await getTrendData(studentId);
	if (!trendData) {
		throw new AppError("No trend data found for this student", 404);
	}

	return sendSuccess(res, trendData, "Student trend data retrieved", 200);
}

// ---------------------------------------------------------------------------
// GET /:id
// ---------------------------------------------------------------------------

export async function getPerformanceAnalysisDetail(req: Request, res: Response) {
	const { id } = req.params;
	if (typeof id !== "string" || id.trim().length === 0) {
		throw new AppError("Analysis ID param is required and must be a non-empty string", 400);
	}

	const analysis = await getAnalysisById(id);
	if (!analysis) {
		throw new AppError("Performance analysis record not found", 404);
	}

	return sendSuccess(res, analysis, "Performance analysis details retrieved", 200);
}
