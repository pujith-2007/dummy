import { z } from "zod";

export const startAssessmentSchema = z.object({
	track: z.string({ error: "track is required" }).min(1, "track cannot be empty").trim(),
	questionCount: z
		.number()
		.int("questionCount must be an integer")
		.min(1, "questionCount must be at least 1")
		.max(20, "questionCount cannot exceed 20")
		.optional()
		.default(10),
});

export const submitAssessmentSchema = z.object({
	assessmentId: z
		.string({ error: "assessmentId is required" })
		.min(1, "assessmentId cannot be empty"),
	answers: z
		.array(z.string(), { error: "answers is required" })
		.min(1, "answers array cannot be empty"),
});

export type StartAssessmentDto = z.infer<typeof startAssessmentSchema>;
export type SubmitAssessmentDto = z.infer<typeof submitAssessmentSchema>;
