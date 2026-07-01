import axios, { type AxiosInstance } from "axios";
import type { AIQuestion, AIQuestionsResponse } from "../types/assessment.types";

const NVIDIA_BASE_URL = "https://integrate.api.nvidia.com/v1";
const DEFAULT_MODEL = "meta/llama-3.1-70b-instruct";

function buildPrompt(track: string, questionCount: number): string {
	return `You are an expert technical interviewer. Generate exactly ${questionCount} multiple-choice questions (MCQs) for the topic: "${track}".

Rules:
- Each question must have exactly 4 options labeled A, B, C, D.
- The correctAnswer field must be exactly one of: "A", "B", "C", or "D".
- Questions should vary in difficulty (easy, medium, hard).
- Do NOT include any explanation or commentary outside the JSON.

Respond ONLY with a valid JSON object in this exact shape:
{
  "questions": [
    {
      "question": "...",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "correctAnswer": "A"
    }
  ]
}`;
}

function createAIClient(apiKey: string): AxiosInstance {
	return axios.create({
		baseURL: NVIDIA_BASE_URL,
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`,
		},
		timeout: 60_000,
	});
}

function validateAIResponse(data: unknown): AIQuestionsResponse {
	if (typeof data !== "object" || data === null) {
		throw new Error("AI response is not a valid object.");
	}

	const obj = data as Record<string, unknown>;

	if (!Array.isArray(obj.questions) || obj.questions.length === 0) {
		throw new Error('AI response missing "questions" array.');
	}

	const questions: AIQuestion[] = obj.questions.map((q: unknown, index: number) => {
		if (typeof q !== "object" || q === null) {
			throw new Error(`Question at index ${index} is invalid.`);
		}

		const qObj = q as Record<string, unknown>;

		if (typeof qObj.question !== "string" || !qObj.question.trim()) {
			throw new Error(`Question at index ${index} is missing "question" text.`);
		}

		if (
			!Array.isArray(qObj.options) ||
			qObj.options.length !== 4 ||
			!qObj.options.every((o: unknown) => typeof o === "string")
		) {
			throw new Error(`Question at index ${index} must have exactly 4 string options.`);
		}

		if (
			typeof qObj.correctAnswer !== "string" ||
			!["A", "B", "C", "D"].includes(qObj.correctAnswer.trim().toUpperCase())
		) {
			throw new Error(
				`Question at index ${index} has an invalid "correctAnswer". Must be A, B, C, or D.`,
			);
		}

		return {
			question: qObj.question.trim(),
			options: qObj.options as string[],
			correctAnswer: (qObj.correctAnswer as string).trim().toUpperCase(),
		};
	});

	return { questions };
}

export class QuestionGeneratorService {
	private apiKey: string;

	constructor() {
		const key = process.env.NVIDIA_API_KEY;
		if (!key?.trim()) {
			throw new Error("AI API key is missing. Please configure NVIDIA_API_KEY in .env");
		}
		this.apiKey = key.trim();
	}

	async generate(track: string, questionCount: number): Promise<AIQuestion[]> {
		const client = createAIClient(this.apiKey);
		const prompt = buildPrompt(track, questionCount);

		let rawText: string;

		try {
			const response = await client.post("/chat/completions", {
				model: DEFAULT_MODEL,
				messages: [{ role: "user", content: prompt }],
				temperature: 0.7,
				max_tokens: 4096,
			});

			const choice = response.data?.choices?.[0];
			rawText = choice?.message?.content ?? "";

			if (!rawText.trim()) {
				throw new Error("AI returned an empty response.");
			}
		} catch (err: unknown) {
			if (axios.isAxiosError(err)) {
				const status = err.response?.status;
				const message = err.response?.data?.detail ?? err.response?.data?.message ?? err.message;
				throw new Error(`AI API request failed (HTTP ${status ?? "?"}): ${message}`);
			}
			throw err;
		}

		// Strip markdown code fences if present
		const jsonText = rawText
			.replace(/^```(?:json)?\s*/i, "")
			.replace(/\s*```$/i, "")
			.trim();

		let parsed: unknown;
		try {
			parsed = JSON.parse(jsonText);
		} catch {
			throw new Error(`AI returned non-JSON content. Raw response: ${rawText.slice(0, 300)}`);
		}

		const validated = validateAIResponse(parsed);
		return validated.questions;
	}
}

export const questionGeneratorService = new QuestionGeneratorService();
