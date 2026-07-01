import type { Request, Response } from "express";
import { AppError } from "@/utils/app-error";
import { sendSuccess } from "@/utils/response";
import { documentExtractionService } from "../services/document-extraction-service";
import { resumeIntelligenceService } from "../services/resume-intelligence-service";

export async function extractDocumentText(req: Request, res: Response) {
	const file = req.file;

	if (!file) {
		throw new AppError(
			"No file uploaded. Please upload a PDF, DOCX, DOC, or TXT file under the 'file' field.",
			400,
		);
	}

	const result = await documentExtractionService.extractText({
		originalname: file.originalname,
		mimetype: file.mimetype,
		buffer: file.buffer,
		size: file.size,
	});

	// Invoke the new AI Resume Intelligence Engine after the text is extracted
	const analysis = await resumeIntelligenceService.analyzeResume(result.text);

	return sendSuccess(
		res,
		{
			...result,
			analysis,
		},
		"Document text extracted and analyzed successfully",
		200,
	);
}

export async function matchJobDescription(req: Request, res: Response) {
	const { resumeData, jobDescription } = req.body;

	if (!resumeData || !jobDescription) {
		throw new AppError("resumeData and jobDescription are required", 400);
	}

	const match = await resumeIntelligenceService.matchJobDescription(resumeData, jobDescription);
	return sendSuccess(res, match, "Job description match completed", 200);
}

export async function compareResumeVersions(req: Request, res: Response) {
	const { versionA, versionB } = req.body;

	if (!versionA || !versionB) {
		throw new AppError("versionA and versionB are required", 400);
	}

	const comparison = await resumeIntelligenceService.compareResumeVersions(versionA, versionB);
	return sendSuccess(res, comparison, "Resume versions compared successfully", 200);
}

export async function chatWithResume(req: Request, res: Response) {
	const { resumeData, messages } = req.body;

	if (!resumeData || !messages || !Array.isArray(messages)) {
		throw new AppError("resumeData and messages array are required", 400);
	}

	const responseText = await resumeIntelligenceService.chatWithResume(resumeData, messages);
	return sendSuccess(res, { text: responseText }, "Chat message processed successfully", 200);
}
