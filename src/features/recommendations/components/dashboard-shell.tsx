import * as React from 'react'
import { ShieldCheck, FileText, Map, BookOpen, Award, BrainCircuit, LogOut, Loader2, MessageSquare, Moon, Sun } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'

import { MyReadinessView } from './sub-layouts/my-readiness-view'
import { ResumeAnalyzerView } from '@/features/profile-analysis/components/resume-analyzer-view'
import { SkillsRoadmapView } from '@/features/skill-gap-analysis/components/skills-roadmap-view'
import { PracticeQuizzesView } from '@/features/assessments/components/practice-quizzes-view'
import { CredentialsView } from '@/features/profile-analysis/components/credentials-view'
import { AICareerCoach } from './ai-career-coach'

const MOCK_RESUMES: Record<string, any> = {
  'devon_vance_swe_resume.pdf': {
    text: "Devon Vance\nEmail: devon.vance.swe@gmail.com\nPhone: +1 (555) 019-2834\nGitHub: github.com/devonvance\nBuilt Civic Issue Resolution Platform using React, Node.js, and PostgreSQL.",
    metadata: { filename: "devon_vance_swe_resume.pdf", pages: 1 },
    analysis: {
      basicInfo: {
        name: "Devon Vance",
        email: "devon.vance.swe@gmail.com",
        phone: "+1 (555) 019-2834",
        linkedin: "https://linkedin.com/in/devon-vance",
        github: "https://github.com/devonvance",
        portfolio: "https://devonvance.dev"
      },
      scores: {
        overallScore: 84,
        atsScore: 81,
        completeness: 88,
        industryReadiness: 85,
        careerLevel: "Entry",
        professionalismScore: 92,
        projectQualityScore: 86,
        experienceStrength: 70,
        skillRelevance: 88,
        keywordDensity: 82,
        grammarReadability: 95,
        leadershipScore: 75,
        professionalAlignment: 90,
        innovationScore: 80,
        careerReadiness: 85,
        resumeConfidenceScore: 89
      },
      roleCompatibility: [
        { role: "Backend Engineer", compatibilityPercent: 88 },
        { role: "Full Stack Developer", compatibilityPercent: 84 },
        { role: "DevOps Engineer", compatibilityPercent: 72 },
        { role: "Systems Engineer", compatibilityPercent: 65 }
      ],
      completenessBreakdown: {
        contactInformation: { status: "Completed", suggestions: "" },
        summaryStatement: { status: "Completed", suggestions: "" },
        skillsSection: { status: "Completed", suggestions: "" },
        projectsSection: { status: "Completed", suggestions: "" },
        certificationsSection: { status: "Missing", suggestions: "Consider adding AWS or Docker certifications." },
        educationSection: { status: "Completed", suggestions: "" }
      },
      atsBreakdown: {
        "Formatting & Layout": { score: 90, explanation: "Standard single column format with readable font hierarchy.", suggestedFix: "None", estimatedAtsImprovement: 0 },
        "Contact Information": { score: 100, explanation: "Includes active email, phone number, LinkedIn, and GitHub links.", suggestedFix: "None", estimatedAtsImprovement: 0 },
        "Action Verbs Density": { score: 80, explanation: "Good usage of strong verbs like 'Built', 'Designed', and 'Optimized'.", suggestedFix: "Ensure all bullets start with active verbs.", estimatedAtsImprovement: 4 },
        "Skills Alignment": { score: 75, explanation: "Matches core technical requirements, but lacks some cloud keywords.", suggestedFix: "Add 'AWS', 'Kubernetes' if you have experience with them.", estimatedAtsImprovement: 6 }
      },
      skills: {
        categories: [
          {
            name: "Programming Languages",
            skillCount: 3,
            coveragePercent: 85,
            industryDemand: "High",
            skills: ["JAVASCRIPT", "TYPESCRIPT", "C++"],
            missingSkills: ["Go", "Rust"],
            emergingSkills: ["Mojo"],
            suggestedLearningPriority: "High"
          },
          {
            name: "Backend",
            skillCount: 2,
            coveragePercent: 75,
            industryDemand: "High",
            skills: ["NODE.JS", "EXPRESS"],
            missingSkills: ["NestJS"],
            emergingSkills: ["Elysia"],
            suggestedLearningPriority: "High"
          },
          {
            name: "Frontend",
            skillCount: 3,
            coveragePercent: 80,
            industryDemand: "High",
            skills: ["REACT", "TAILWIND", "REDUX"],
            missingSkills: ["Next.js"],
            emergingSkills: ["Astro"],
            suggestedLearningPriority: "Medium"
          }
        ]
      },
      projects: [
        {
          name: "Civic Issue Resolution Platform",
          description: "A fullstack collaborative portal for neighborhood issue tracking.",
          complexityScore: 84,
          technicalDepth: 80,
          innovationScore: 78,
          resumeValue: 85,
          deploymentStatus: "Deployed",
          detectedFeatures: ["JWT Auth", "PostgreSQL", "React", "Node.js"],
          strengths: ["Clean code structure", "State management"],
          improvements: ["Add Docker containerization", "Integrate automated tests"]
        }
      ],
      roadmap: {
        immediate: [
          { title: "Learn Docker Basics", type: "DevOps", details: "Build container configurations for local databases.", estimatedTime: "3 days" }
        ],
        thirtyDays: [
          { title: "Next.js Performance tuning", type: "Frontend", details: "Optimize server actions and static rendering routes.", estimatedTime: "10 days" }
        ]
      },
      recommendations: [
        { recommendation: "Add Docker container configurations for Civic platform.", estimatedAtsImprovement: 5 }
      ]
    }
  },
  'aria_sterling_ml_resume.pdf': {
    text: "Aria Sterling\nEmail: aria.sterling@gmail.com\nPhone: +1 (555) 019-9988\nGitHub: github.com/ariasterling\nBuilt Semantic Search Engine using BERT and PyTorch.",
    metadata: { filename: "aria_sterling_ml_resume.pdf", pages: 1 },
    analysis: {
      basicInfo: {
        name: "Aria Sterling",
        email: "aria.sterling@gmail.com",
        phone: "+1 (555) 019-9988",
        linkedin: "https://linkedin.com/in/aria-sterling",
        github: "https://github.com/ariasterling",
        portfolio: "https://aria.dev"
      },
      scores: {
        overallScore: 88,
        atsScore: 85,
        completeness: 92,
        industryReadiness: 90,
        careerLevel: "Entry",
        professionalismScore: 94,
        projectQualityScore: 89,
        experienceStrength: 82,
        skillRelevance: 91,
        keywordDensity: 85,
        grammarReadability: 96,
        leadershipScore: 78,
        professionalAlignment: 92,
        innovationScore: 85,
        careerReadiness: 89,
        resumeConfidenceScore: 91
      },
      roleCompatibility: [
        { role: "AI Engineer", compatibilityPercent: 92 },
        { role: "Machine Learning Engineer", compatibilityPercent: 95 },
        { role: "Data Scientist", compatibilityPercent: 88 },
        { role: "Backend Engineer", compatibilityPercent: 76 }
      ],
      completenessBreakdown: {
        contactInformation: { status: "Completed", suggestions: "" },
        summaryStatement: { status: "Completed", suggestions: "" },
        skillsSection: { status: "Completed", suggestions: "" },
        projectsSection: { status: "Completed", suggestions: "" },
        certificationsSection: { status: "Completed", suggestions: "" },
        educationSection: { status: "Completed", suggestions: "" }
      },
      atsBreakdown: {
        "Formatting & Layout": { score: 95, explanation: "Standard single column format with readable font hierarchy.", suggestedFix: "None", estimatedAtsImprovement: 0 },
        "Contact Information": { score: 100, explanation: "Includes active email, phone number, LinkedIn, and GitHub links.", suggestedFix: "None", estimatedAtsImprovement: 0 },
        "Action Verbs Density": { score: 88, explanation: "Good usage of strong verbs like 'Built', 'Designed', and 'Optimized'.", suggestedFix: "Use more quantifiable accomplishments.", estimatedAtsImprovement: 3 },
        "Skills Alignment": { score: 90, explanation: "Matches core technical requirements.", suggestedFix: "None", estimatedAtsImprovement: 0 }
      },
      skills: {
        categories: [
          {
            name: "Programming Languages",
            skillCount: 3,
            coveragePercent: 90,
            industryDemand: "High",
            skills: ["PYTHON", "C++", "SQL"],
            missingSkills: ["Julia", "R"],
            emergingSkills: ["Mojo"],
            suggestedLearningPriority: "High"
          },
          {
            name: "AI & LLM",
            skillCount: 3,
            coveragePercent: 88,
            industryDemand: "High",
            skills: ["PYTORCH", "SCIKIT-LEARN", "HUGGINGFACE"],
            missingSkills: ["LangChain", "Vector DB"],
            emergingSkills: ["LlamaIndex"],
            suggestedLearningPriority: "High"
          },
          {
            name: "Databases",
            skillCount: 2,
            coveragePercent: 70,
            industryDemand: "High",
            skills: ["MONGODB", "MYSQL"],
            missingSkills: ["Redis"],
            emergingSkills: ["SurrealDB"],
            suggestedLearningPriority: "Medium"
          }
        ]
      },
      projects: [
        {
          name: "Semantic Search Engine",
          description: "A Python system using BERT embeddings for document search scaling.",
          complexityScore: 90,
          technicalDepth: 88,
          innovationScore: 85,
          resumeValue: 90,
          deploymentStatus: "Deployed",
          detectedFeatures: ["BERT", "PyTorch", "FastAPI", "MongoDB"],
          strengths: ["High innovation index", "Performance scaling"],
          improvements: ["Integrate RAG cache"]
        }
      ],
      roadmap: {
        immediate: [
          { title: "Learn LangChain & RAG", type: "AI", details: "Build contextual search queries with LLMs.", estimatedTime: "5 days" }
        ],
        thirtyDays: [
          { title: "Model Deployment SageMaker", type: "DevOps", details: "Host PyTorch model checkpoints on AWS SageMaker.", estimatedTime: "14 days" }
        ]
      },
      recommendations: [
        { recommendation: "Integrate vector database query filters.", estimatedAtsImprovement: 6 }
      ]
    }
  }
};

type TabType = 'readiness' | 'resume' | 'roadmap' | 'quizzes' | 'credentials' | 'chat'

interface Quiz {
  name: string
  questions: number
  duration: string
  reward: string
}

interface RoadmapStep {
  title: string
  desc: string
  grade: string
  status: string
  date: string
}

export function DashboardShell(): React.ReactElement {
  const navigate = useNavigate()
  const [loading, setLoading] = React.useState<boolean>(true)
  const [activeTab, setActiveTab] = React.useState<TabType>('readiness')
  const [theme, setTheme] = React.useState<'dark' | 'light'>('dark')

  // Sync theme with document.documentElement for global Tailwind dark mode
  React.useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  // Global State logic pulled from teammate's portal.tsx
  const [readinessScore, setReadinessScore] = React.useState(82.5)
  const [verifiedSkillsCount, setVerifiedSkillsCount] = React.useState(14)
  const [activeGapsCount, setActiveGapsCount] = React.useState(2)
  const [readinessTarget, setReadinessTarget] = React.useState(85)
  
  const [quizzes, setQuizzes] = React.useState<Quiz[]>([])
  const [roadmapSteps, setRoadmapSteps] = React.useState<RoadmapStep[]>([])
  const [recommendationFilter, setRecommendationFilter] = React.useState('All')
  
  // Chart & Analysis States
  const [topicScores, setTopicScores] = React.useState<Record<string, number>>({
    'React': 70,
    'Databases': 55,
    'DSA': 60,
    'System Design': 40
  })
  const [trendData, setTrendData] = React.useState<any[]>([])
  const [gradeDistribution, setGradeDistribution] = React.useState<any[]>([])

  // Resume Analyzer States
  const [resumeFile, setResumeFile] = React.useState<string | null>(null)
  const [analysisState, setAnalysisState] = React.useState<'idle' | 'analyzing' | 'complete'>('idle')
  const [parsingStep, setParsingStep] = React.useState(0)
  const [extractedData, setExtractedData] = React.useState<any>(null)
  const [analysisError, setAnalysisError] = React.useState<string | null>(null)
  const [uploadedResumes, setUploadedResumes] = React.useState<any[]>([])
  const [compIdxA, setCompIdxA] = React.useState(0)
  const [compIdxB, setCompIdxB] = React.useState(0)
  const [chatMessages, setChatMessages] = React.useState<any[]>([
    { role: 'bot', text: "Hi! I am your AI Resume Assistant. Ask me anything about your parsed resume intelligence (e.g. 'Why is my ATS score low?', 'What skills should I learn next?', 'Which project is my strongest?')." }
  ])
  const [isChatTyping, setIsChatTyping] = React.useState(false)
  const [jdMatchResult, setJdMatchResult] = React.useState<any>(null)
  const [isMatchingJd, setIsMatchingJd] = React.useState(false)
  const [versionComparisonResult, setVersionComparisonResult] = React.useState<any>(null)
  const [isComparingVersions, setIsComparingVersions] = React.useState(false)

  // Quiz Engine State
  const [selectedQuiz, setSelectedQuiz] = React.useState<string | null>(null)
  const [currentQuestionIdx, setCurrentQuestionIdx] = React.useState(0)
  const [quizAnswers, setQuizAnswers] = React.useState<number[]>([])
  const [quizScore, setQuizScore] = React.useState<number | null>(null)
  const [activeAssessmentId, setActiveAssessmentId] = React.useState<string | null>(null)
  const [activeQuestions, setActiveQuestions] = React.useState<any[]>([])
  const [isLoadingQuiz, setIsLoadingQuiz] = React.useState(false)
  const [quizError, setQuizError] = React.useState<string | null>(null)

  // Mock Performance summary for AI Coach
  const performanceSummary = {
    strengths: ['Excellent usage of React functional components', 'Strong SQL database layout design'],
    weaknesses: ['Unfamiliarity with CI/CD deployment pipelines'],
    insights: ['Focusing on deployment pipeline exercises will bridge your primary fullstack skill gap.']
  }

  const recommendedResources = [
    { title: 'System Design Primer', publisher: 'GitHub OpenSource', type: 'System Architecture', duration: '8 hours', link: 'https://github.com/donnemartin/system-design-primer', progress: 45 },
    { title: 'React 19 State Best Practices', publisher: 'SkillSync AI Docs', type: 'Languages', duration: '20 mins', link: '#', progress: 80 },
    { title: 'Introduction to Docker Containers', publisher: 'Docker Official', type: 'DevOps', duration: '45 mins', link: '#', progress: 0 },
    { title: 'Vector DB Indexing Concepts', publisher: 'SkillSync AI Docs', type: 'AI Systems', duration: '30 mins', link: '#', progress: 10 },
  ]
  
  const filteredResources = recommendationFilter === 'All'
    ? recommendedResources
    : recommendedResources.filter(res => res.type === recommendationFilter)

  React.useEffect(() => {
    const fetchState = async () => {
      const studentId = 'student_123'
      const baseUrl = 'http://localhost:3001/api'
      
      try {
        const [dashRes, topicRes, trendsRes, summaryRes] = await Promise.all([
          fetch(`${baseUrl}/performance-analysis/student/${studentId}/dashboard`),
          fetch(`${baseUrl}/performance-analysis/student/${studentId}/topic-analysis`),
          fetch(`${baseUrl}/performance-analysis/student/${studentId}/trends`),
          fetch(`${baseUrl}/performance-analysis/student/${studentId}/summary`)
        ])

        if (!dashRes.ok) throw new Error('Dashboard API unavailable')

        const dashData = await dashRes.json()
        const topicData = await topicRes.json()
        const trendsData = await trendsRes.json()
        
        setReadinessScore(dashData.readinessScore || 82.5)
        setVerifiedSkillsCount(dashData.verifiedSkillsCount || 14)
        setActiveGapsCount(dashData.activeGapsCount || 2)
        setTopicScores(topicData.scores || {
          'React': 70, 'Databases': 55, 'DSA': 60, 'System Design': 40
        })
        setTrendData(trendsData.trends || [])
        setGradeDistribution(dashData.gradeDistribution || [])
      } catch (err) {
        console.log('Using local mock structured JSON state since backend is unavailable.', err)
        // Fallback mandates
        setReadinessScore(82.5)
        setVerifiedSkillsCount(14)
        setActiveGapsCount(2)
        setTopicScores({
          'React': 70, 'Databases': 55, 'DSA': 60, 'System Design': 40
        })
        setTrendData([
          { date: 'Week 1', score: 65, accuracy: 70 },
          { date: 'Week 2', score: 68, accuracy: 72 },
          { date: 'Week 3', score: 75, accuracy: 78 },
          { date: 'Week 4', score: 82.5, accuracy: 85 }
        ])
        setGradeDistribution([
          { grade: 'A+', value: 15 },
          { grade: 'A', value: 30 },
          { grade: 'B', value: 40 },
          { grade: 'C', value: 10 },
          { grade: 'D', value: 5 },
          { grade: 'F', value: 0 }
        ])
        
        setQuizzes([
          { name: 'React Advanced Patterns', questions: 5, duration: '15 mins', reward: '+1.5% Readiness Index' },
          { name: 'SQL Query Optimization', questions: 5, duration: '15 mins', reward: '+1.5% Readiness Index' },
          { name: 'TypeScript Generics', questions: 5, duration: '10 mins', reward: '+1.0% Readiness Index' }
        ])
        setRoadmapSteps([
          { title: 'React Fundamentals', desc: 'Hooks, Context, State', grade: 'A-', status: 'Mastered', date: 'Jan 2026' },
          { title: 'Backend Databases', desc: 'SQL Normalization, NoSQL', grade: 'B+', status: 'Mastered', date: 'Feb 2026' },
          { title: 'System Architecture', desc: 'Microservices, Event-Driven', grade: '--', status: 'In Progress', date: 'Mar 2026' },
          { title: 'DevOps Pipelines', desc: 'CI/CD, Docker', grade: '--', status: 'Locked', date: 'Pending' }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchState()
  }, [])

  const handleLogout = () => {
    localStorage.setItem('isAuthenticated', 'false')
    navigate({ to: '/' })
  }

  const handleSetActiveTab = (tab: string) => {
    setActiveTab(tab as TabType)
  }

  const handleStartAnalysis = async (fileOrName: File | string) => {
    if (typeof fileOrName === 'string') {
      setResumeFile(fileOrName)
      setAnalysisState('analyzing')
      setParsingStep(0)
      setExtractedData(null)
      setAnalysisError(null)
      
      setTimeout(() => setParsingStep(1), 600)
      setTimeout(() => setParsingStep(2), 1400)
      setTimeout(() => setParsingStep(3), 2200)
      setTimeout(() => {
        const mockData = MOCK_RESUMES[fileOrName] || MOCK_RESUMES['devon_vance_swe_resume.pdf']
        setExtractedData(mockData)
        setUploadedResumes(prev => {
          const exists = prev.some(r => r.name === fileOrName)
          const nextList = exists ? prev : [...prev, { name: fileOrName, timestamp: new Date(), ...mockData }]
          if (nextList.length >= 2) {
            setCompIdxA(0) // First uploaded resume
            setCompIdxB(nextList.length - 1) // Newly uploaded resume
            setTimeout(() => {
              triggerComparison(0, nextList.length - 1, nextList)
            }, 100)
          }
          return nextList
        })
        setAnalysisState('complete')
        setReadinessScore(mockData.analysis.scores.overallScore)
        setVerifiedSkillsCount(17)
        setActiveGapsCount(1)

        setChatMessages([
          { role: 'bot', text: `Hi Pujith! I've loaded your simulated resume "${fileOrName}" and calculated its intelligence scores. What aspect of your score would you like to improve first?` }
        ])
        setJdMatchResult(null)
        setVersionComparisonResult(null)
      }, 3000)
      return
    }

    const file = fileOrName
    setResumeFile(file.name)
    setAnalysisState('analyzing')
    setParsingStep(0)
    setExtractedData(null)
    setAnalysisError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      // Start uploading/parsing
      setParsingStep(1)
      
      const response = await fetch('http://localhost:3001/api/document-extraction/extract', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.message || 'Failed to extract text from document')
      }

      const resJson = await response.json()
      
      // Update loading status steps dynamically
      setParsingStep(2)
      await new Promise(resolve => setTimeout(resolve, 800))
      
      setParsingStep(3)
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const dataPayload = resJson.data
      setExtractedData(dataPayload)
      setUploadedResumes(prev => {
        const nextList = [...prev, { name: file.name, timestamp: new Date(), ...dataPayload }]
        if (nextList.length >= 2) {
          setCompIdxA(0) // First uploaded resume
          setCompIdxB(nextList.length - 1) // Newly uploaded resume
          setTimeout(() => {
            triggerComparison(0, nextList.length - 1, nextList)
          }, 100)
        }
        return nextList
      })
      setAnalysisState('complete')
      
      // Reset contextual chats for this new resume
      setChatMessages([
        { role: 'bot', text: `Hi Pujith! I've loaded your resume "${file.name}" and calculated its intelligence scores. What aspect of your score would you like to improve first?` }
      ])
      setJdMatchResult(null)
      setVersionComparisonResult(null)

      // Update profile scores based on real parsed resume metrics
      if (dataPayload.analysis?.scores?.overallScore) {
        setReadinessScore(dataPayload.analysis.scores.overallScore)
      } else {
        setReadinessScore(prev => Math.min(100, Number((prev + 4.2).toFixed(1))))
      }
      setVerifiedSkillsCount(prev => prev + 3)
    } catch (err: any) {
      console.error(err)
      setAnalysisError(err.message || 'Error uploading file')
      setAnalysisState('idle')
    }
  }

  const handleResetResume = () => {
    setResumeFile(null)
    setAnalysisState('idle')
    setParsingStep(0)
    setExtractedData(null)
    setAnalysisError(null)
    setJdMatchResult(null)
    setVersionComparisonResult(null)
  }

  const handleJdMatch = async (jobDescription: string) => {
    if (!extractedData?.analysis) return
    setIsMatchingJd(true)
    try {
      const response = await fetch('http://localhost:3001/api/document-extraction/match-jd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeData: extractedData.analysis,
          jobDescription
        })
      })
      if (!response.ok) throw new Error('Failed to match job description')
      const data = await response.json()
      setJdMatchResult(data.data)
    } catch (err) {
      console.error(err)
    } finally {
      setIsMatchingJd(false)
    }
  }

  const handleSendChatMessage = async (userMessage: string) => {
    if (!extractedData?.analysis) return
    const newMessages = [...chatMessages, { role: 'user', text: userMessage }]
    setChatMessages(newMessages)
    setIsChatTyping(true)
    try {
      const response = await fetch('http://localhost:3001/api/document-extraction/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeData: extractedData.analysis,
          messages: newMessages
        })
      })
      if (!response.ok) throw new Error('Chat failed')
      const data = await response.json()
      setChatMessages(prev => [...prev, { role: 'bot', text: data.data.text }])
    } catch (err) {
      console.error(err)
      setChatMessages(prev => [...prev, { role: 'bot', text: 'Sorry, I encountered an error communicating with the chat service.' }])
    } finally {
      setIsChatTyping(false)
    }
  }

  const triggerComparison = async (idxA: number, idxB: number, currentList: any[]) => {
    const verA = currentList[idxA]
    const verB = currentList[idxB]
    if (!verA || !verB) return
    setIsComparingVersions(true)
    try {
      const response = await fetch('http://localhost:3001/api/document-extraction/compare-versions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          versionA: verA.analysis,
          versionB: verB.analysis
        })
      })
      if (!response.ok) throw new Error('Comparison failed')
      const data = await response.json()
      setVersionComparisonResult(data.data)
    } catch (err) {
      console.error(err)
    } finally {
      setIsComparingVersions(false)
    }
  }

  const handleCompareVersions = async (idxA: number, idxB: number) => {
    await triggerComparison(idxA, idxB, uploadedResumes)
  }

  const handleStartQuiz = (quizName: string) => {
    setSelectedQuiz(quizName)
    setIsLoadingQuiz(true)
    setQuizError(null)
    setCurrentQuestionIdx(0)
    setQuizAnswers([])
    setQuizScore(null)
    setActiveQuestions([])

    // Simulated quiz fetch
    setTimeout(() => {
      setActiveQuestions([
        { id: '1', question: 'What is the primary advantage of using a Virtual DOM in React?', options: ['It allows direct DOM manipulation', 'It improves performance by minimizing actual DOM updates', 'It replaces CSS completely', 'It runs entirely on the server'] },
        { id: '2', question: 'Which hook is best suited for fetching data on component mount?', options: ['useEffect', 'useState', 'useRef', 'useContext'] },
        { id: '3', question: 'What does a dependency array in useEffect do?', options: ['Re-renders the component infinitely', 'Tells React when to re-run the effect', 'Caches API responses', 'Deletes the component from the DOM'] }
      ])
      setIsLoadingQuiz(false)
    }, 1500)
  }

  const handleSelectQuizOption = (optIdx: number) => {
    const newAnswers = [...quizAnswers]
    newAnswers[currentQuestionIdx] = optIdx
    setQuizAnswers(newAnswers)
  }

  const handleNextQuizQuestion = () => {
    if (currentQuestionIdx < activeQuestions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1)
    } else {
      setIsLoadingQuiz(true)
      setTimeout(() => {
        setIsLoadingQuiz(false)
        const correct = Math.floor(Math.random() * (activeQuestions.length + 1)) // Random score for mock
        setQuizScore(correct)
        if (correct >= activeQuestions.length * 0.6) {
          setReadinessScore(prev => Math.min(100, Number((prev + 1.5).toFixed(1))))
          setVerifiedSkillsCount(prev => prev + 1)
        }
      }, 1500)
    }
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="animate-pulse space-y-6 w-full max-w-7xl mx-auto p-4 md:p-8">
          <div className="h-32 bg-[#FFFFFF] dark:bg-[#0B0F19] rounded-2xl border border-slate-200 dark:border-indigo-900/30 shadow-[0_1px_3px_rgba(0,0,0,0.05)] dark:shadow-none" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-40 bg-[#FFFFFF] dark:bg-[#0B0F19] rounded-2xl border border-slate-200 dark:border-indigo-900/30 shadow-[0_1px_3px_rgba(0,0,0,0.05)] dark:shadow-none" />
            <div className="h-40 bg-[#FFFFFF] dark:bg-[#0B0F19] rounded-2xl border border-slate-200 dark:border-indigo-900/30 shadow-[0_1px_3px_rgba(0,0,0,0.05)] dark:shadow-none" />
            <div className="h-40 bg-[#FFFFFF] dark:bg-[#0B0F19] rounded-2xl border border-slate-200 dark:border-indigo-900/30 shadow-[0_1px_3px_rgba(0,0,0,0.05)] dark:shadow-none" />
          </div>
          <div className="h-[400px] bg-[#FFFFFF] dark:bg-[#0B0F19] rounded-2xl border border-slate-200 dark:border-indigo-900/30 shadow-[0_1px_3px_rgba(0,0,0,0.05)] dark:shadow-none" />
        </div>
      )
    }

    switch (activeTab) {
      case 'resume':
        return <ResumeAnalyzerView 
          analysisState={analysisState}
          parsingStep={parsingStep}
          resumeFile={resumeFile}
          handleStartAnalysis={handleStartAnalysis}
          handleResetResume={handleResetResume}
          setActiveTab={handleSetActiveTab}
          extractedData={extractedData}
          analysisError={analysisError}
          uploadedResumes={uploadedResumes}
          chatMessages={chatMessages}
          isChatTyping={isChatTyping}
          handleSendChatMessage={handleSendChatMessage}
          jdMatchResult={jdMatchResult}
          isMatchingJd={isMatchingJd}
          handleJdMatch={handleJdMatch}
          versionComparisonResult={versionComparisonResult}
          isComparingVersions={isComparingVersions}
          handleCompareVersions={handleCompareVersions}
          compIdxA={compIdxA}
          compIdxB={compIdxB}
          setCompIdxA={setCompIdxA}
          setCompIdxB={setCompIdxB}
        />
      case 'roadmap':
        return <SkillsRoadmapView roadmapSteps={roadmapSteps} />
      case 'quizzes':
        return <PracticeQuizzesView 
          quizzes={quizzes}
          selectedQuiz={selectedQuiz}
          isLoadingQuiz={isLoadingQuiz}
          quizError={quizError}
          quizScore={quizScore}
          activeQuestions={activeQuestions}
          currentQuestionIdx={currentQuestionIdx}
          quizAnswers={quizAnswers}
          handleStartQuiz={handleStartQuiz}
          setSelectedQuiz={setSelectedQuiz}
          handleSelectQuizOption={handleSelectQuizOption}
          handleNextQuizQuestion={handleNextQuizQuestion}
          setActiveTab={handleSetActiveTab}
        />
      case 'credentials':
        return <CredentialsView 
          readinessScore={readinessScore}
          readinessTarget={readinessTarget}
          verifiedSkillsCount={verifiedSkillsCount}
          setActiveTab={handleSetActiveTab}
        />
      case 'chat':
        return (
          <div className="p-6 rounded-2xl border bg-white dark:bg-[#0B0F19] border-slate-200 dark:border-slate-900 shadow-[0_1px_3px_rgba(0,0,0,0.05)] dark:shadow-none w-full h-[80vh]">
            <AICareerCoach 
              setReadinessScore={setReadinessScore}
              setVerifiedSkillsCount={setVerifiedSkillsCount}
              setActiveGapsCount={setActiveGapsCount}
              setTopicScores={setTopicScores}
            />
          </div>
        )
      case 'readiness':
      default:
        return (
          <MyReadinessView 
            readinessScore={readinessScore}
            verifiedSkillsCount={verifiedSkillsCount}
            activeGapsCount={activeGapsCount}
            quizzesCount={quizzes.length}
            roadmapSteps={roadmapSteps}
            recommendationFilter={recommendationFilter}
            setRecommendationFilter={setRecommendationFilter}
            filteredResources={filteredResources}
            setActiveTab={handleSetActiveTab}
            performanceSummary={performanceSummary}
            recommendations={recommendedResources}
            loading={loading}
            setReadinessScore={setReadinessScore}
            setVerifiedSkillsCount={setVerifiedSkillsCount}
            setActiveGapsCount={setActiveGapsCount}
            topicScores={topicScores}
            setTopicScores={setTopicScores}
            trendData={trendData}
            gradeDistribution={gradeDistribution}
          />
        )
    }
  }

  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'resume': return 'Resume Analyzer'
      case 'roadmap': return 'Skills Roadmap'
      case 'quizzes': return 'Practice Quizzes'
      case 'credentials': return 'My Credentials'
      case 'chat': return 'SkillSync AI Chatbot'
      case 'readiness': default: return 'Student Dashboard'
    }
  }

  // Theme variable helpers removed in favor of pure Tailwind dark: utility classes

  return (
    <div className="flex min-h-screen w-full font-sans transition-colors duration-300 bg-[#E8EFF1] dark:bg-[#030712] text-[#08141A] dark:text-white selection:bg-[#6366F1]/30 pb-20 md:pb-0">
      <aside className="hidden md:flex w-64 border-r min-h-screen flex-col justify-between shrink-0 shadow-[4px_0_24px_rgba(3,7,18,0.05)] z-20 sticky top-0 bg-[#FFFFFF] dark:bg-[#0B0F19] border-transparent dark:border-slate-900">
        <div className="flex flex-col">
          <div className="h-16 flex items-center gap-2.5 px-6 border-b border-transparent dark:border-slate-900">
            <div className="p-1.5 rounded-lg bg-indigo-950 border border-[#6366F1]/30 text-[#6366F1]">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold font-heading tracking-tight text-[#08141A] dark:text-white">
              SkillSync <span className="text-[#6366F1] font-normal">AI</span>
            </span>
          </div>

          <nav className="flex flex-col space-y-2 p-4 mt-2">
            {[
              { id: 'readiness', icon: ShieldCheck, label: 'My Readiness' },
              { id: 'resume', icon: FileText, label: 'Resume Analyzer' },
              { id: 'roadmap', icon: Map, label: 'Skills Roadmap' },
              { id: 'quizzes', icon: BookOpen, label: 'Practice Quizzes' },
              { id: 'credentials', icon: Award, label: 'My Credentials' },
              { id: 'chat', icon: MessageSquare, label: 'SkillSync AI Chatbot' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`relative flex items-center w-full px-4 py-3 text-sm rounded-xl text-left transition-all duration-300 ease-out group gap-3 border ${
                  activeTab === tab.id
                    ? 'bg-indigo-50/50 dark:bg-[#9FA1FF]/10 text-indigo-600 dark:text-[#9FA1FF] border-transparent dark:border-[#9FA1FF]/30 shadow-[0_1px_3px_rgba(0,0,0,0.05)] dark:shadow-[0_0_15px_rgba(99,102,241,0.15)] font-bold'
                    : 'bg-transparent border-transparent text-[#383838] dark:text-slate-400 hover:bg-[#E8EFF1] dark:hover:bg-slate-900/80 hover:text-[#08141A] dark:hover:text-slate-200 hover:border-transparent dark:hover:border-slate-800'
                }`}
              >
                <tab.icon className={`w-4 h-4 transition-colors ${activeTab === tab.id ? 'text-indigo-600 dark:text-[#9FA1FF]' : 'text-[#383838] dark:text-slate-500 group-hover:text-[#08141A] dark:group-hover:text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t space-y-4 border-transparent dark:border-slate-900 bg-[#E8EFF1] dark:bg-slate-950/40">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-semibold text-[#383838] dark:text-slate-400">THEME</span>
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-1.5 rounded-lg border transition-colors bg-[#FFFFFF] dark:bg-slate-800 border-transparent dark:border-slate-700 text-indigo-600 dark:text-yellow-400 shadow-[0_1px_3px_rgba(0,0,0,0.05)] dark:shadow-none"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#6366F1] to-cyan-400 flex items-center justify-center font-bold text-sm text-white shadow-sm ring-2 ring-slate-950">
              RY
            </div>
            <div>
              <span className="text-sm font-bold block font-heading text-[#08141A] dark:text-white">Rahul Yadav</span>
              <span className="text-xs text-[#383838] dark:text-slate-400 block font-light">Student - Cohort A</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold border border-rose-900/50 bg-rose-950/30 hover:bg-rose-900/50 hover:border-rose-800 text-rose-500 transition-all duration-200 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Logout Portal
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        <header className="h-16 border-b backdrop-blur-md p-6 flex items-center justify-between sticky top-0 z-10 shadow-[0_1px_3px_rgba(0,0,0,0.05)] dark:shadow-none bg-[#FFFFFF]/90 dark:bg-[#0B0F19]/60 border-transparent dark:border-slate-900">
          <div>
            <span className="text-xs text-[#6366F1] font-semibold tracking-wider uppercase">{getHeaderTitle()}</span>
            <h2 className="text-lg font-bold mt-0.5 font-heading text-[#08141A] dark:text-white">Welcome back, Rahul Yadav!</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-[10px] px-3 py-1.5 rounded-lg font-bold bg-[#D9F9DF] text-emerald-900 border border-transparent dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-500/30 tracking-widest uppercase">
              MAJOR: SOFTWARE ENGINEERING
            </div>
          </div>
        </header>

        <div className="flex-1 p-4 md:p-8 max-w-[1400px] w-full mx-auto">
          {renderContent()}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 w-full backdrop-blur-md border-t z-50 px-2 py-2 flex justify-between items-center pb-safe bg-[#FFFFFF]/95 dark:bg-[#0B0F19]/95 border-transparent dark:border-slate-900 shadow-[0_-1px_3px_rgba(0,0,0,0.05)] dark:shadow-none">
        {[
          { id: 'readiness', icon: ShieldCheck, label: 'Readiness' },
          { id: 'resume', icon: FileText, label: 'Resume' },
          { id: 'roadmap', icon: Map, label: 'Roadmap' },
          { id: 'quizzes', icon: BookOpen, label: 'Quizzes' },
          { id: 'chat', icon: MessageSquare, label: 'AI Chat' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`flex flex-col items-center justify-center w-full py-1 gap-1 transition-all duration-300 ${
              activeTab === tab.id
                ? 'text-indigo-600 dark:text-[#9FA1FF]'
                : 'text-[#383838] dark:text-slate-500 hover:text-[#08141A] dark:hover:text-slate-300'
            }`}
          >
            <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'fill-indigo-900/20' : ''}`} />
            <span className="text-[9px] font-semibold">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
