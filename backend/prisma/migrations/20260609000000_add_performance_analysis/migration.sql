-- CreateTable
CREATE TABLE "performance_analyses" (
	"id" TEXT NOT NULL,
	"studentId" TEXT NOT NULL,
	"assessmentId" TEXT,
	"totalQuestions" INTEGER NOT NULL,
	"attemptedQuestions" INTEGER NOT NULL,
	"correctAnswers" INTEGER NOT NULL,
	"scorePercentage" DOUBLE PRECISION NOT NULL,
	"accuracyPercentage" DOUBLE PRECISION NOT NULL,
	"grade" TEXT NOT NULL,
	"performanceLevel" TEXT NOT NULL,
	"strengths" JSONB NOT NULL,
	"weaknesses" JSONB NOT NULL,
	"insights" JSONB NOT NULL,
	"trendSummary" JSONB,
	"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT "performance_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "performance_topic_metrics" (
	"id" TEXT NOT NULL,
	"analysisId" TEXT NOT NULL,
	"topic" TEXT NOT NULL,
	"correctAnswers" INTEGER NOT NULL,
	"attemptedQuestions" INTEGER NOT NULL,
	"percentage" DOUBLE PRECISION NOT NULL,
	"proficiency" TEXT NOT NULL,
	"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT "performance_topic_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "performance_analyses_studentId_idx" ON "performance_analyses"("studentId");

-- CreateIndex
CREATE INDEX "performance_analyses_assessmentId_idx" ON "performance_analyses"("assessmentId");

-- CreateIndex
CREATE INDEX "performance_topic_metrics_analysisId_idx" ON "performance_topic_metrics"("analysisId");

-- AddForeignKey
ALTER TABLE "performance_analyses"
ADD CONSTRAINT "performance_analyses_studentId_fkey"
FOREIGN KEY ("studentId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "performance_topic_metrics"
ADD CONSTRAINT "performance_topic_metrics_analysisId_fkey"
FOREIGN KEY ("analysisId") REFERENCES "performance_analyses"("id") ON DELETE CASCADE ON UPDATE CASCADE;