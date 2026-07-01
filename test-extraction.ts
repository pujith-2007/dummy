import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { documentExtractionService } from "./src/features/document-extraction/services/document-extraction-service";
import { AppError } from "./src/utils/app-error";

async function runExtractionTests() {
	console.log("=========================================");
	console.log("🧪 RUNNING DOCUMENT EXTRACTION SERVICE TESTS");
	console.log("=========================================\n");

	let passed = 0;
	let failed = 0;

	async function runTest(name: string, fn: () => Promise<void>) {
		try {
			await fn();
			console.log(`✅ Passed: ${name}`);
			passed++;
		} catch (error: any) {
			console.error(`❌ Failed: ${name}`);
			console.error(error);
			failed++;
		}
	}

	// 1. TXT Extraction
	await runTest("TXT Text Extraction", async () => {
		const txtBuffer = Buffer.from(
			"Hello world! This is a test file for the text extraction service.\n\nIt contains some paragraphs.\n",
		);
		const file = {
			originalname: "test.txt",
			mimetype: "text/plain",
			buffer: txtBuffer,
			size: txtBuffer.length,
		};
		const result = await documentExtractionService.extractText(file);
		assert.strictEqual(result.success, true);
		assert.match(result.text, /Hello world!/);
		assert.match(result.text, /paragraphs\./);
		assert.strictEqual(result.metadata.extension, "txt");
		assert.strictEqual(result.metadata.mimeType, "text/plain");
		assert.strictEqual(result.documents.length, 1);
		assert.strictEqual(result.documents[0].pageContent, result.text);
	});

	// 2. PDF Extraction (Fixture)
	await runTest("PDF Text Extraction", async () => {
		const pdfPath = path.join(__dirname, "tests", "fixtures", "test.pdf");
		if (!fs.existsSync(pdfPath)) {
			throw new Error(`PDF fixture not found at ${pdfPath}. Run file copy first.`);
		}
		const pdfBuffer = fs.readFileSync(pdfPath);
		const file = {
			originalname: "test.pdf",
			mimetype: "application/pdf",
			buffer: pdfBuffer,
			size: pdfBuffer.length,
		};
		const result = await documentExtractionService.extractText(file);
		assert.strictEqual(result.success, true);
		assert.strictEqual(result.metadata.extension, "pdf");
		assert.strictEqual(result.metadata.mimeType, "application/pdf");
		assert.ok(result.metadata.pages && result.metadata.pages > 0);
		assert.ok(result.text.length > 0);
		assert.strictEqual(result.documents.length, 1);
	});

	// 3. DOCX Extraction (Fixture)
	await runTest("DOCX Text Extraction", async () => {
		const docxPath = path.join(__dirname, "tests", "fixtures", "test.docx");
		if (!fs.existsSync(docxPath)) {
			throw new Error(`DOCX fixture not found at ${docxPath}. Run file copy first.`);
		}
		const docxBuffer = fs.readFileSync(docxPath);
		const file = {
			originalname: "test.docx",
			mimetype: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
			buffer: docxBuffer,
			size: docxBuffer.length,
		};
		const result = await documentExtractionService.extractText(file);
		assert.strictEqual(result.success, true);
		assert.strictEqual(result.metadata.extension, "docx");
		assert.ok(result.text.length > 0);
		assert.strictEqual(result.documents.length, 1);
	});

	// 4. DOC Extraction (Fixture)
	await runTest("DOC Text Extraction", async () => {
		const docPath = path.join(__dirname, "tests", "fixtures", "test.doc");
		if (!fs.existsSync(docPath)) {
			throw new Error(`DOC fixture not found at ${docPath}. Run file copy first.`);
		}
		const docBuffer = fs.readFileSync(docPath);
		const file = {
			originalname: "test.doc",
			mimetype: "application/msword",
			buffer: docBuffer,
			size: docBuffer.length,
		};
		const result = await documentExtractionService.extractText(file);
		assert.strictEqual(result.success, true);
		assert.strictEqual(result.metadata.extension, "doc");
		assert.ok(result.text.length > 0);
		assert.strictEqual(result.documents.length, 1);
	});

	// 5. Empty File Handling
	await runTest("Empty File Error Handling", async () => {
		const emptyBuffer = Buffer.alloc(0);
		const file = {
			originalname: "empty.txt",
			mimetype: "text/plain",
			buffer: emptyBuffer,
			size: 0,
		};
		try {
			await documentExtractionService.extractText(file);
			assert.fail("Should have thrown AppError for empty file");
		} catch (error: any) {
			assert.ok(error instanceof AppError);
			assert.strictEqual(error.statusCode, 400);
			assert.match(error.message, /empty/i);
		}
	});

	// 6. Unsupported Format Handling
	await runTest("Unsupported Format Error Handling", async () => {
		const buffer = Buffer.from("<html><body>Hello</body></html>");
		const file = {
			originalname: "test.html",
			mimetype: "text/html",
			buffer,
			size: buffer.length,
		};
		try {
			await documentExtractionService.extractText(file);
			assert.fail("Should have thrown AppError for unsupported format");
		} catch (error: any) {
			assert.ok(error instanceof AppError);
			assert.strictEqual(error.statusCode, 400);
			assert.match(error.message, /Unsupported file type/i);
		}
	});

	// 7. Corrupted PDF Handling
	await runTest("Corrupted PDF Handling", async () => {
		const corruptedPdfBuffer = Buffer.from("JVBERi0xLjQKJVRlc3QgQ29ycnVwdGVkCg=="); // Invalid header only
		const file = {
			originalname: "corrupted.pdf",
			mimetype: "application/pdf",
			buffer: corruptedPdfBuffer,
			size: corruptedPdfBuffer.length,
		};
		try {
			await documentExtractionService.extractText(file);
			assert.fail("Should have failed to parse corrupted PDF");
		} catch (error: any) {
			assert.ok(error instanceof AppError);
			assert.strictEqual(error.statusCode, 400);
			assert.match(error.message, /Failed to parse PDF/i);
		}
	});

	console.log("\n=========================================");
	console.log(`📊 TEST RESULTS: ${passed} Passed, ${failed} Failed`);
	console.log("=========================================\n");

	if (failed > 0) {
		process.exit(1);
	} else {
		process.exit(0);
	}
}

runExtractionTests();
