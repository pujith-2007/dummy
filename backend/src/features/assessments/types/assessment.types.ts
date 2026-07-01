export interface Question {
	id: string;
	question: string;
	options: string[];
	correctAnswer: string;
}

export interface Assessment {
	id: string;
	track: string;
	questions: Question[];
	createdAt: Date;
}

export interface Submission {
	assessmentId: string;
	answers: string[];
}

export interface AssessmentResult {
	assessmentId: string;
	score: number;
	totalQuestions: number;
	correctAnswers: number;
	grade: string;
}

export interface StartAssessmentInput {
	track: string;
	questionCount: number;
}

export interface AIQuestion {
	question: string;
	options: string[];
	correctAnswer: string;
}

export interface AIQuestionsResponse {
	questions: AIQuestion[];
}
