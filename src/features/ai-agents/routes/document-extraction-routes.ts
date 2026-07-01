import { Router } from "express";
import { upload } from "@/middleware/upload";
import {
	extractDocumentText,
	matchJobDescription,
	compareResumeVersions,
	chatWithResume,
} from "../controllers/document-extraction-controller";

const router = Router();

/**
 * POST /api/document-extraction/extract
 * Request: multipart/form-data with field "file"
 * Response: ApiResponse with DocumentExtractionResult & analysis
 */
router.post("/extract", upload.single("file"), extractDocumentText);

/**
 * POST /api/document-extraction/match-jd
 * Request: JSON with resumeData and jobDescription
 */
router.post("/match-jd", matchJobDescription);

/**
 * POST /api/document-extraction/compare-versions
 * Request: JSON with versionA and versionB
 */
router.post("/compare-versions", compareResumeVersions);

/**
 * POST /api/document-extraction/chat
 * Request: JSON with resumeData and messages array
 */
router.post("/chat", chatWithResume);

export default router;
