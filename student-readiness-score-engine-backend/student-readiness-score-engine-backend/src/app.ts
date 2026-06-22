import cors from "cors";
import express, { type Express } from "express";
import { env } from "@/config/env";
import { assessmentRouter } from "@/features/assessment";
import { healthRouter } from "@/features/health/routes/health-routes";
import { performanceAnalysisRouter } from "@/features/performance-analysis/routes/performance-analysis-routes";
import { errorHandler } from "@/middleware/error-handler";
import { notFound } from "@/middleware/not-found";

const app: Express = express();

app.use(
	cors({
		origin: env.BETTER_AUTH_URL,
		credentials: true,
	}),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/health", healthRouter);
app.use("/api/assessment", assessmentRouter);
app.use("/api/performance-analysis", performanceAnalysisRouter);

app.use(notFound);
app.use(errorHandler);

export { app };
