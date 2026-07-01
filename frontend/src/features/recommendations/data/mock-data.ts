import type { DashboardData } from '../types'

export const MOCK_DASHBOARD_DATA: DashboardData = {
  overview: {
    overallScore: 82,
    overallGrade: 'A-',
    performanceLevel: 'Proficient',
    totalAssessments: 45,
    scoreTimeline: [
      { label: 'Jan', score: 68, accuracy: 72 },
      { label: 'Feb', score: 72, accuracy: 76 },
      { label: 'Mar', score: 75, accuracy: 78 },
      { label: 'Apr', score: 74, accuracy: 80 },
      { label: 'May', score: 79, accuracy: 82 },
      { label: 'Jun', score: 82, accuracy: 85 }
    ],
    gradeDistribution: [
      { grade: 'A', count: 15 },
      { grade: 'B', count: 42 },
      { grade: 'C', count: 28 },
      { grade: 'D', count: 10 },
      { grade: 'F', count: 5 }
    ],
    topTopics: [
      { label: 'React Hooks & Context', score: 92 },
      { label: 'SQL Normalization', score: 88 },
      { label: 'TypeScript Generics', score: 85 }
    ]
  },
  topicAnalysis: {
    labels: ['React Hooks', 'SQL Schema', 'CI/CD Pipelines', 'CSS Responsive Layouts', 'TS Generics'],
    scores: [90, 85, 45, 60, 80],
    proficiencies: ['Expert', 'Proficient', 'Novice', 'Needs Work', 'Expert'],
    assessmentCounts: [12, 8, 3, 7, 10]
  },
  trendAnalysis: {
    direction: 'up',
    improvementRate: 14.7,
    consistencyScore: 88,
    trendClassification: 'Consistent Growth'
  },
  activity: {
    streak: 5,
    points: 1250,
    rank: 'Gold',
    level: 4,
    progress: 75,
    activeDays: [
      { label: 'Mon', completed: true, active: false },
      { label: 'Tue', completed: true, active: false },
      { label: 'Wed', completed: true, active: false },
      { label: 'Thu', completed: true, active: false },
      { label: 'Fri', completed: true, active: false },
      { label: 'Sat', completed: false, active: false },
      { label: 'Sun', completed: false, active: true },
    ]
  },
  performanceSummary: {
    strengths: [
      'Excellent usage of React functional components and hooks structure.',
      'Strong SQL database layout design and query optimization skills.',
      'Highly type-safe declarations utilizing advanced TypeScript types.'
    ],
    weaknesses: [
      'Unfamiliarity with CI/CD deployment pipelines and automated script setups.',
      'Requires adjustments on complex responsive CSS Flexbox/Grid alignment.'
    ],
    insights: [
      'Focusing on deployment pipeline exercises will bridge your primary fullstack skill gap.',
      'Consistent weekly practice (88% consistency) is driving the upward trend.'
    ]
  },
  recommendations: [
    {
      id: 'rec-1',
      title: 'CI/CD Pipelines: From Zero to Production Automation',
      type: 'course',
      difficulty: 'Intermediate',
      duration: '4h 30m',
      targetSkill: 'CI/CD Pipelines',
      url: 'https://example.com/courses/cicd',
      relevanceScore: 95,
      description: 'Learn pipelines basics, Github Actions triggers, and containerized deployments.'
    },
    {
      id: 'rec-2',
      title: 'Responsive Flexbox & CSS Grid Sandbox',
      type: 'lab',
      difficulty: 'Beginner',
      duration: '1h 15m',
      targetSkill: 'CSS Responsive Layouts',
      url: 'https://example.com/labs/css',
      relevanceScore: 88,
      description: 'Interactive coding lab checking alignments, media queries, and responsive grid layouts.'
    },
    {
      id: 'rec-3',
      title: 'Build a Fully-Automated Production Deploy Script',
      type: 'project',
      difficulty: 'Advanced',
      duration: '6h 00m',
      targetSkill: 'CI/CD Pipelines',
      url: 'https://example.com/projects/deploy',
      relevanceScore: 92,
      description: 'Hands-on practice task configuring script automations, securing SSH, and deploying pipelines.'
    }
  ]
}
