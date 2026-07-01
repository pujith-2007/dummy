import type { Request } from "express";
import multer from "multer";
import { AppError } from "@/utils/app-error";

// Configure memory storage to process files directly in-memory without writing to disk
const storage = multer.memoryStorage();

// Supported MIME types for document extraction
const SUPPORTED_MIME_TYPES = [
	"application/pdf",
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
	"application/msword", // .doc
	"text/plain",
];

// File type validation filter
const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
	if (SUPPORTED_MIME_TYPES.includes(file.mimetype)) {
		cb(null, true);
	} else {
		cb(
			new AppError(
				`Unsupported file format: ${file.mimetype}. Supported formats are PDF, DOCX, DOC, and TXT.`,
				400,
			),
		);
	}
};

// Configured multer upload instance
export const upload = multer({
	storage,
	fileFilter,
	limits: {
		fileSize: 10 * 1024 * 1024, // Limit to 10MB
	},
});
