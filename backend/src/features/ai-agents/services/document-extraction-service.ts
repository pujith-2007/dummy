import { Document } from "@langchain/core/documents";
import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";
import WordExtractor from "word-extractor";
import { AppError } from "@/utils/app-error";

export interface ExtractionInputFile {
	originalname: string;
	mimetype: string;
	buffer: Buffer;
	size: number;
}

export interface DocumentExtractionResult {
	success: boolean;
	text: string;
	metadata: {
		filename: string;
		extension: string;
		mimeType: string;
		pages?: number;
		characterCount: number;
		wordCount: number;
		extractedAt: Date;
	};
	documents: Document[];
}

export class DocumentExtractionService {
	async extractText(file: ExtractionInputFile): Promise<DocumentExtractionResult> {
		const startTime = Date.now();
		const filename = file.originalname;
		const mimeType = file.mimetype;
		const extension = filename.split(".").pop()?.toLowerCase() || "";

		console.log(
			`[DocumentExtraction] Starting extraction for ${filename} (${mimeType}), size: ${file.size} bytes`,
		);

		if (!file.buffer || file.buffer.length === 0) {
			throw new AppError(`The uploaded file "${filename}" is empty.`, 400);
		}

		let rawText = "";
		let pages: number | undefined;

		try {
			if (mimeType === "application/pdf" || extension === "pdf") {
				let parser: PDFParse | undefined;
				try {
					parser = new PDFParse({
						data: new Uint8Array(file.buffer),
						verbosity: 0,
					});
					const textResult = await parser.getText();
					rawText = textResult.text;
					pages = textResult.pages.length;
				} catch (err: unknown) {
					const error = err as Error;
					// Check if it's an encrypted PDF or general parsing issue
					if (
						error.message &&
						(error.message.includes("encrypted") || error.message.includes("Password"))
					) {
						throw new AppError(
							`Failed to parse PDF "${filename}": Document is encrypted/password-protected.`,
							400,
						);
					}
					throw new AppError(`Failed to parse PDF "${filename}": ${error.message || error}`, 400);
				} finally {
					if (parser) {
						await parser.destroy().catch(() => {});
					}
				}
			} else if (
				mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
				extension === "docx"
			) {
				try {
					const result = await mammoth.extractRawText({ buffer: file.buffer });
					rawText = result.value;
				} catch (err: unknown) {
					const error = err as Error;
					throw new AppError(`Failed to parse DOCX "${filename}": ${error.message || error}`, 400);
				}
			} else if (mimeType === "application/msword" || extension === "doc") {
				try {
					const extractor = new WordExtractor();
					const doc = await extractor.extract(file.buffer);
					rawText = doc.getBody();
				} catch (err: unknown) {
					const error = err as Error;
					throw new AppError(`Failed to parse DOC "${filename}": ${error.message || error}`, 400);
				}
			} else if (mimeType === "text/plain" || extension === "txt") {
				try {
					rawText = file.buffer.toString("utf-8");
				} catch (err: unknown) {
					const error = err as Error;
					throw new AppError(`Failed to parse TXT "${filename}": ${error.message || error}`, 400);
				}
			} else {
				throw new AppError(
					`Unsupported file type: ${mimeType} (.${extension}). Supported formats are PDF, DOCX, DOC, and TXT.`,
					400,
				);
			}
		} catch (err) {
			if (err instanceof AppError) throw err;
			throw new AppError(
				`An error occurred during extraction of "${filename}": ${err instanceof Error ? err.message : err}`,
				500,
			);
		}

		const cleanedText = this.normalizeText(rawText);

		if (cleanedText.length === 0) {
			throw new AppError(`The file "${filename}" contains no readable text.`, 400);
		}

		const characterCount = cleanedText.length;
		const wordCount = cleanedText.split(/\s+/).filter(Boolean).length;
		const duration = Date.now() - startTime;

		// Log detailed extraction metadata
		console.log(
			`[DocumentExtraction] Extraction complete: filename="${filename}", mimeType="${mimeType}", duration=${duration}ms, status="success", characterCount=${characterCount}, wordCount=${wordCount}`,
		);

		// Build the LangChain Document object
		const documents = [
			new Document({
				pageContent: cleanedText,
				metadata: {
					filename,
					mimeType,
					uploadedAt: new Date().toISOString(),
				},
			}),
		];

		return {
			success: true,
			text: cleanedText,
			metadata: {
				filename,
				extension,
				mimeType,
				pages,
				characterCount,
				wordCount,
				extractedAt: new Date(),
			},
			documents,
		};
	}

	private normalizeText(text: string): string {
		if (!text) return "";
		return text
			.replace(/\r\n/g, "\n")
			.replace(/\r/g, "\n")
			.replace(/[\u200B-\u200D\uFEFF]/g, "")
			.replace(/[ \t]+/g, " ")
			.split("\n")
			.map((line) => line.trim())
			.join("\n")
			.replace(/\n{3,}/g, "\n\n")
			.trim();
	}
}

export const documentExtractionService = new DocumentExtractionService();
