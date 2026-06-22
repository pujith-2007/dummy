import { z } from "zod";

const topicPerformanceSchema = z.object({
	topic: z.string().trim().min(1),
	correctAnswers: z.coerce.number().int().min(0),
	attemptedQuestions: z.coerce.number().int().min(1).optional(),
});

const trendPointSchema = z.object({
	label: z.string().trim().min(1),
	percentage: z.coerce.number().min(0).max(100),
});

export const performanceAnalysisSchema = z
	.object({
		studentId: z.string().trim().min(1, "studentId is required"),
		assessmentId: z.string().trim().min(1).optional(),
		totalQuestions: z.coerce.number().int().positive("totalQuestions must be a positive integer"),
		correctAnswers: z.coerce.number().int().min(0),
		attemptedQuestions: z.coerce.number().int().positive().optional(),
		topics: z.array(topicPerformanceSchema).default([]),
		trend: z.array(trendPointSchema).default([]),
	})
	.superRefine((value, ctx) => {
		if (value.correctAnswers > value.totalQuestions) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "correctAnswers cannot exceed totalQuestions",
				path: ["correctAnswers"],
			});
		}

		if (value.attemptedQuestions !== undefined && value.attemptedQuestions > value.totalQuestions) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "attemptedQuestions cannot exceed totalQuestions",
				path: ["attemptedQuestions"],
			});
		}

		for (const [index, topic] of value.topics.entries()) {
			if (
				topic.attemptedQuestions !== undefined &&
				topic.correctAnswers > topic.attemptedQuestions
			) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "correctAnswers cannot exceed attemptedQuestions",
					path: ["topics", index, "correctAnswers"],
				});
			}
		}
	});

export type PerformanceAnalysisPayload = z.infer<typeof performanceAnalysisSchema>;
