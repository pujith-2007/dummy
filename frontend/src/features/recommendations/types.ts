export interface ScoreTimelinePoint {
  label: string
  score: number
  accuracy: number
}

export interface TopTopicItem {
  label: string
  score: number
}

export interface GradeDistributionItem {
  grade: string
  count: number
}

export interface DashboardOverview {
  overallScore: number
  overallGrade: string
  performanceLevel: string
  totalAssessments: number
  scoreTimeline: ScoreTimelinePoint[]
  gradeDistribution: GradeDistributionItem[]
  topTopics: TopTopicItem[]
}

export interface TopicWiseAnalysis {
  labels: string[]
  scores: number[]
  proficiencies: string[]
  assessmentCounts: number[]
}

export interface TrendAnalysis {
  direction: 'up' | 'down' | 'stable'
  improvementRate: number
  consistencyScore: number
  trendClassification: string
}

export interface PerformanceSummary {
  strengths: string[]
  weaknesses: string[]
  insights: string[]
}

export interface RecommendationItem {
  id: string
  title: string
  type: 'course' | 'lab' | 'project' | 'article'
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  duration: string
  targetSkill: string
  url: string
  relevanceScore: number
  description: string
}

export interface ActivityData {
  streak: number
  points: number
  rank: string
  level: number
  progress: number
  activeDays: { label: string; completed: boolean; active: boolean }[]
}

export interface DashboardData {
  overview: DashboardOverview
  topicAnalysis: TopicWiseAnalysis
  trendAnalysis: TrendAnalysis
  performanceSummary: PerformanceSummary
  recommendations: RecommendationItem[]
  activity: ActivityData
}
