// ---------------------------------------------------------------------------
// Primitive scalars
// ---------------------------------------------------------------------------

export type PerformanceGrade = "A+" | "A" | "B" | "C" | "D" | "F";

export type PerformanceLevel = "excellent" | "strong" | "average" | "needs-improvement";

export type TopicProficiency = "mastered" | "proficient" | "developing" | "needs-improvement";

export type TrendDirection = "improving" | "declining" | "stable";

export type TrendClassification =
	| "consistently-improving"
	| "consistently-declining"
	| "volatile"
	| "stable";

// ---------------------------------------------------------------------------
// Input shapes
// ---------------------------------------------------------------------------

export interface TopicPerformanceInput {
	topic: string;
	correctAnswers: number;
	attemptedQuestions?: number;
}

export interface TrendPointInput {
	label: string;
	percentage: number;
}

export interface PerformanceAnalysisInput {
	studentId: string;
	assessmentId?: string;
	totalQuestions: number;
	correctAnswers: number;
	attemptedQuestions?: number;
	topics?: TopicPerformanceInput[];
	trend?: TrendPointInput[];
}

// ---------------------------------------------------------------------------
// Result shapes
// ---------------------------------------------------------------------------

export interface TopicPerformanceResult {
	topic: string;
	correctAnswers: number;
	attemptedQuestions: number;
	percentage: number;
	proficiency: TopicProficiency;
}

export interface TrendSummary {
	startingPercentage: number;
	endingPercentage: number;
	change: number;
	direction: TrendDirection;
	labels: string[];
}

/** Core per-assessment result. */
export interface PerformanceAnalysisResult {
	id?: string;
	studentId: string;
	assessmentId?: string;
	totalQuestions: number;
	attemptedQuestions: number;
	correctAnswers: number;
	overallScore: number;
	scorePercentage: number;
	accuracyPercentage: number;
	grade: PerformanceGrade;
	performanceLevel: PerformanceLevel;
	strengths: string[];
	weaknesses: string[];
	topicBreakdown: TopicPerformanceResult[];
	insights: string[];
	learningGaps: string[];
	trendSummary?: TrendSummary;
	storedAt?: string;
	generatedAt: string;
}

// ---------------------------------------------------------------------------
// Aggregated summary
// ---------------------------------------------------------------------------

export interface TopicAverage {
	topic: string;
	averageScore: number;
	assessmentsCount: number;
	proficiency: TopicProficiency;
}

export interface TrendDataPoint {
	id: string;
	assessmentId: string | null;
	scorePercentage: number;
	accuracyPercentage: number;
	createdAt: string;
	grade: string;
}

export interface StudentPerformanceSummary {
	studentId: string;
	totalAssessments: number;
	averageScore: number;
	averageAccuracy: number;
	overallPerformanceLevel: PerformanceLevel;
	overallGrade: PerformanceGrade;
	gradeDistribution: Record<PerformanceGrade, number>;
	topicAverages: TopicAverage[];
	strongestSkills: string[];
	weakestSkills: string[];
	improvementRate: number;
	consistencyScore: number;
	trendClassification: TrendClassification;
	recentTrend: TrendDataPoint[];
}

// ---------------------------------------------------------------------------
// Visualization / chart-ready shapes
// ---------------------------------------------------------------------------

export interface DashboardChartData {
	studentId: string;
	overallScore: number;
	overallGrade: PerformanceGrade;
	performanceLevel: PerformanceLevel;
	totalAssessments: number;
	scoreTimeline: {
		labels: string[];
		scores: number[];
		accuracies: number[];
	};
	gradeDistribution: {
		labels: PerformanceGrade[];
		counts: number[];
	};
	topTopics: {
		labels: string[];
		scores: number[];
	};
}

export interface TopicAnalysisChartData {
	studentId: string;
	labels: string[];
	scores: number[];
	proficiencies: TopicProficiency[];
	assessmentCounts: number[];
}

export interface TrendChartData {
	studentId: string;
	labels: string[];
	scores: number[];
	accuracies: number[];
	direction: TrendDirection;
	improvementRate: number;
	consistencyScore: number;
	trendClassification: TrendClassification;
}

// ---------------------------------------------------------------------------
// Ranking helpers
// ---------------------------------------------------------------------------

export interface RankingEntry {
	topic: string;
	percentage: number;
	proficiency: TopicProficiency;
}
