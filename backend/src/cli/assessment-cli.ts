import "dotenv/config";
import { stdin as input, stdout as output } from "node:process";
import readline from "node:readline/promises";
import { assessmentService } from "../features/assessments/services/assessment.service";
import type {
	Assessment,
	AssessmentResult,
	Question,
} from "../features/assessments/types/assessment.types";

const rl = readline.createInterface({ input, output });

const validAnswers = ["A", "B", "C", "D"];

function formatQuestion(question: Question, index: number): void {
	console.log(`\nQuestion ${index + 1}: ${question.question}`);
	for (const option of question.options) {
		console.log(`  ${option}`);
	}
}

function normalizeAnswer(answer: string): string {
	return answer.trim().toUpperCase();
}

async function askInput(prompt: string): Promise<string> {
	return (await rl.question(prompt)).trim();
}

async function promptForAnswer(_question: Question, index: number): Promise<string> {
	while (true) {
		const answer = normalizeAnswer(await askInput(`Answer for question ${index + 1} (A/B/C/D): `));

		if (validAnswers.includes(answer)) {
			return answer;
		}

		console.log("Please enter A, B, C, or D.");
	}
}

function printResult(
	assessmentId: string,
	questions: Question[],
	answers: string[],
	score: number,
	correctAnswers: number,
	grade: string,
): void {
	console.log(`\nAssessment complete: ${assessmentId}`);
	console.log(`Score: ${score}% (${correctAnswers}/${questions.length})`);
	console.log(`Grade: ${grade}\n`);

	questions.forEach((question, index) => {
		const submitted = answers[index];
		const correct = question.correctAnswer.trim().toUpperCase();
		const indicator = submitted === correct ? "✓" : "✗";

		console.log(`Question ${index + 1}: ${question.question}`);
		console.log(`  Your answer: ${submitted}`);
		console.log(`  Correct answer: ${correct} ${indicator}\n`);
	});
}

async function main(): Promise<void> {
	console.log("=== Assessment CLI ===");

	const track = await askInput("Track/topic: ");
	if (!track) {
		console.error("Track is required.");
		process.exit(1);
	}

	const countInput = await askInput("How many questions? (1-20, default 5): ");
	const questionCount = countInput ? Number(countInput) : 5;

	if (!Number.isInteger(questionCount) || questionCount < 1 || questionCount > 20) {
		console.error("questionCount must be an integer between 1 and 20.");
		process.exit(1);
	}

	console.log("\nGenerating questions... this may take a moment.\n");

	let assessment: Assessment;
	try {
		assessment = await assessmentService.startAssessment(track, questionCount);
	} catch (error: unknown) {
		console.error("Failed to generate assessment:", error instanceof Error ? error.message : error);
		process.exit(1);
	}

	const answers: string[] = [];

	for (const [index, question] of assessment.questions.entries()) {
		formatQuestion(question, index);
		const answer = await promptForAnswer(question, index);
		answers.push(answer);
	}

	console.log("\nSubmitting your answers...\n");

	let result: AssessmentResult;
	try {
		result = assessmentService.submitAssessment(assessment.id, answers);
	} catch (error: unknown) {
		console.error("Failed to submit assessment:", error instanceof Error ? error.message : error);
		process.exit(1);
	}

	printResult(
		assessment.id,
		assessment.questions,
		answers,
		result.score,
		result.correctAnswers,
		result.grade,
	);
	rl.close();
}

main().catch((error) => {
	console.error("Unexpected error:", error instanceof Error ? error.message : error);
	rl.close();
	process.exit(1);
});
