import cors from "cors";
import express, { type Express } from "express";
import { env } from "@/config/env";
import { assessmentRouter } from "@/features/assessments";
import { documentExtractionRouter } from "@/features/ai-agents";
import { healthRouter } from "@/features/health/routes/health-routes";
import { performanceAnalysisRouter } from "@/features/skill-gap-analysis/routes/performance-analysis-routes";
import { errorHandler } from "@/middleware/error-handler";
import { notFound } from "@/middleware/not-found";

const app: Express = express();

app.use(
	cors({
		origin: [env.BETTER_AUTH_URL, "http://localhost:5173", "http://127.0.0.1:5173"],
		credentials: true,
	}),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/health", healthRouter);
app.use("/api/assessment", assessmentRouter);
app.use("/api/document-extraction", documentExtractionRouter);
app.use("/api/performance-analysis", performanceAnalysisRouter);

app.use(notFound);
app.use(errorHandler);

export { app };
