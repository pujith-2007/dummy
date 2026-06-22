import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { 
  BookOpen, 
  AlertCircle, 
  LogOut, 
  TrendingUp, 
  ShieldCheck, 
  User, 
  BrainCircuit,
  ArrowRight,
  Award,
  Play,
  Lock,
  ExternalLink,
  CheckCircle2,
  FileText,
  UploadCloud,
  Loader2,
  Check,
  ChevronRight
} from 'lucide-react'
import { useState, useEffect } from 'react'

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

export const Route = createFileRoute('/_authenticated/portal')({
  component: UserPortalPage,
})

function UserPortalPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null)
  
  // Student State (synchronized with backend)
  const [readinessScore, setReadinessScore] = useState(82.5)
  const [verifiedSkillsCount, setVerifiedSkillsCount] = useState(14)
  const [activeGapsCount, setActiveGapsCount] = useState(2)
  const [readinessTarget, setReadinessTarget] = useState(85)

  // Dynamic quizzes fetched from the server
  const [quizzes, setQuizzes] = useState<Quiz[]>([])

  // Dynamic roadmap steps fetched from the server
  const [roadmapSteps, setRoadmapSteps] = useState<RoadmapStep[]>([])

  // Filters for Recommendations
  const [recommendationFilter, setRecommendationFilter] = useState('All')

  // Resume Analyzer States
  const [resumeFile, setResumeFile] = useState<string | null>(null)
  const [analysisState, setAnalysisState] = useState<'idle' | 'analyzing' | 'complete'>('idle')
  const [parsingStep, setParsingStep] = useState(0)

  // Quiz Engine State
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<number[]>([])
  const [quizScore, setQuizScore] = useState<number | null>(null)

  // Real Backend Assessment States
  const [activeAssessmentId, setActiveAssessmentId] = useState<string | null>(null)
  const [activeQuestions, setActiveQuestions] = useState<{ id: string; question: string; options: string[] }[]>([])
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false)
  const [quizError, setQuizError] = useState<string | null>(null)

  // Fetch student scorecard and settings from backend on mount and poll for updates
  useEffect(() => {
    const fetchState = () => {
      fetch('http://localhost:3000/api/state')
        .then(res => res.json())
        .then(data => {
          const devon = data.students.find((s: { email: string; score: string; verifiedSkillsCount: number; activeGapsCount: number }) => s.email === 'vance.d@university.edu')
          if (devon) {
            setReadinessScore(parseFloat(devon.score))
            setVerifiedSkillsCount(devon.verifiedSkillsCount)
            setActiveGapsCount(devon.activeGapsCount)
          }
          setReadinessTarget(data.settings.readinessTarget)

          // Dynamically map backend assessments to the student quizzes view
          const mappedQuizzes = data.assessments.map((asm: { title: string; questions: number; difficulty: string }) => {
            const rewardVal = asm.difficulty === 'Advanced' ? '+2.8%' : asm.difficulty === 'Medium' ? '+1.5%' : '+1.0%'
            return {
              name: asm.title,
              questions: asm.questions,
              duration: asm.difficulty === 'Advanced' ? '25 mins' : asm.difficulty === 'Medium' ? '15 mins' : '10 mins',
              reward: `${rewardVal} Readiness Index`
            }
          })
          setQuizzes(mappedQuizzes)
          setRoadmapSteps(data.roadmap || [])
        })
        .catch(err => console.error('[Error] Failed to fetch portal state:', err))
    }

    fetchState()
    const interval = setInterval(fetchState, 4000)
    return () => clearInterval(interval)
  }, [])

  const handleLogout = () => {
    localStorage.setItem('isAuthenticated', 'false')
    navigate({ to: '/home' })
  }

  // Simulated Resume Parser Steps
  const parsingStepsText = [
    'Parsing PDF text content...',
    'Extracting key skills & technologies...',
    'Matching projects with industry benchmarks...',
    'Recalculating competency scores...',
  ]

  const handleStartAnalysis = (fileName: string) => {
    setResumeFile(fileName)
    setAnalysisState('analyzing')
    setParsingStep(0)
    
    // Simulate step-by-step parsing progress
    setTimeout(() => setParsingStep(1), 1000)
    setTimeout(() => setParsingStep(2), 2200)
    setTimeout(() => setParsingStep(3), 3400)
    setTimeout(() => {
      setAnalysisState('complete')
      // Boost readiness score locally and backend sync
      const newScore = 86.7
      const newSkills = 17
      const newGaps = 1
      
      setReadinessScore(newScore)
      setVerifiedSkillsCount(newSkills)
      setActiveGapsCount(newGaps)

      fetch('http://localhost:3000/api/student/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'vance.d@university.edu',
          score: newScore,
          verifiedSkillsCount: newSkills,
          activeGapsCount: newGaps
        })
      })
      .then(res => res.json())
      .then(() => {
        alert('AI analysis complete! Your readiness index was updated by +4.2% based on verified projects.')
      })
      .catch(err => console.error('[Error] Failed to sync student score:', err))
    }, 4500)
  }

  const handleResetResume = () => {
    setResumeFile(null)
    setAnalysisState('idle')
    setParsingStep(0)
  }



  const handleStartQuiz = (quizName: string) => {
    setSelectedQuiz(quizName)
    setIsLoadingQuiz(true)
    setQuizError(null)
    setCurrentQuestionIdx(0)
    setQuizAnswers([])
    setQuizScore(null)
    setActiveQuestions([])

    // Start assessment on backend proxy
    fetch('http://localhost:3000/api/assessment/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        track: quizName,
        questionCount: 5 // Generate 5 questions via AI model
      })
    })
    .then(res => {
      if (!res.ok) {
        throw new Error('Failed to initialize AI scoring engine assessment.');
      }
      return res.json()
    })
    .then(data => {
      setActiveAssessmentId(data.assessmentId);
      // Now fetch questions
      return fetch(`http://localhost:3000/api/assessment/questions/${data.assessmentId}`);
    })
    .then(res => {
      if (!res.ok) {
        throw new Error('Failed to retrieve AI assessment questions.');
      }
      return res.json()
    })
    .then(data => {
      if (data.questions && data.questions.length > 0) {
        setActiveQuestions(data.questions);
      } else {
        throw new Error('No questions returned from scoring engine.');
      }
      setIsLoadingQuiz(false);
    })
    .catch(err => {
      console.error('[Quiz Start Error]', err);
      setQuizError(err instanceof Error ? err.message : 'Scoring engine is offline. Please check that backend server is running on port 3001.');
      setIsLoadingQuiz(false);
    });
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
      const answersLetters = quizAnswers.map(idx => ['A', 'B', 'C', 'D'][idx])

      fetch('http://localhost:3000/api/assessment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assessmentId: activeAssessmentId,
          answers: answersLetters
        })
      })
      .then(res => {
        if (!res.ok) {
          throw new Error('Submission failed on SRE scoring engine.')
        }
        return res.json()
      })
      .then(result => {
        setIsLoadingQuiz(false)
        setQuizScore(result.correctAnswers)

        const percentage = result.score
        if (percentage >= 60) {
          const boost = selectedQuiz?.includes('Generics') ? 1.5 : selectedQuiz?.includes('Optimization') ? 2.8 : 1.0
          const newScore = Math.min(100, Number((readinessScore + boost).toFixed(1)))
          const newSkills = verifiedSkillsCount + 1

          setReadinessScore(newScore)
          setVerifiedSkillsCount(newSkills)

          fetch('http://localhost:3000/api/student/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: 'vance.d@university.edu',
              score: newScore,
              verifiedSkillsCount: newSkills
            })
          })
          .then(res => res.json())
          .then(() => {
            alert(`You passed! You scored ${result.correctAnswers}/${result.totalQuestions} (${percentage}%). Your Readiness Index has been recalculated!`)
          })
          .catch(err => console.error('[Error] Failed to sync student quiz score:', err))
        } else {
          alert(`You scored ${result.correctAnswers}/${result.totalQuestions} (${percentage}%). Keep practicing to boost your readiness score!`)
        }
      })
      .catch(err => {
        console.error('[Quiz Submit Error]', err)
        alert('Failed to submit exam to the backend. Please check connection.')
        setIsLoadingQuiz(false)
      })
    }
  }

  // Roadmap steps are now dynamically fetched from the backend server.

  // Mock Personal Recommended Resources
  const recommendedResources = [
    { title: 'System Design Primer', publisher: 'GitHub OpenSource', type: 'System Architecture', duration: '8 hours', link: 'https://github.com/donnemartin/system-design-primer', progress: 45 },
    { title: 'React 19 State Best Practices', publisher: 'SkillSync AI Docs', type: 'Languages', duration: '20 mins', link: '#', progress: 80 },
    { title: 'Introduction to Docker Containers', publisher: 'Docker Official', type: 'DevOps', duration: '45 mins', link: '#', progress: 0 },
    { title: 'Vector DB Indexing Concepts', publisher: 'SkillSync AI Docs', type: 'AI Systems', duration: '30 mins', link: '#', progress: 10 },
  ]

  // Filter recommendations matching the filter choice
  const filteredResources = recommendationFilter === 'All'
    ? recommendedResources
    : recommendedResources.filter(res => res.type === recommendationFilter)

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-700 font-sans antialiased">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-slate-200/80 bg-white flex flex-col justify-between shrink-0">
        <div>
          {/* Logo */}
          <div className="h-16 flex items-center gap-2.5 px-6 border-b border-slate-200/60">
            <div className="p-1.5 rounded-lg bg-indigo-50 border border-indigo-105 text-indigo-600">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold font-heading text-slate-900 tracking-tight">
              SkillSync <span className="text-indigo-600 font-normal">Student</span>
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${activeTab === 'overview' ? 'bg-indigo-50/70 border border-indigo-100/50 text-indigo-600' : 'text-slate-550 hover:text-slate-905 hover:bg-slate-50 border border-transparent'}`}
            >
              <User className="w-4 h-4" />
              My Readiness
            </button>

            <button
              onClick={() => setActiveTab('resume')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${activeTab === 'resume' ? 'bg-indigo-50/70 border border-indigo-100/50 text-indigo-600' : 'text-slate-550 hover:text-slate-905 hover:bg-slate-50 border border-transparent'}`}
            >
              <FileText className="w-4 h-4" />
              Resume Analyzer
            </button>

            <button
              onClick={() => setActiveTab('roadmap')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${activeTab === 'roadmap' ? 'bg-indigo-50/70 border border-indigo-100/50 text-indigo-600' : 'text-slate-550 hover:text-slate-905 hover:bg-slate-50 border border-transparent'}`}
            >
              <TrendingUp className="w-4 h-4" />
              Skills Roadmap
            </button>

            <button
              onClick={() => setActiveTab('quizzes')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${activeTab === 'quizzes' ? 'bg-indigo-50/70 border border-indigo-100/50 text-indigo-600' : 'text-slate-550 hover:text-slate-905 hover:bg-slate-50 border border-transparent'}`}
            >
              <BookOpen className="w-4 h-4" />
              Practice Quizzes
            </button>

            <button
              onClick={() => setActiveTab('credentials')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${activeTab === 'credentials' ? 'bg-indigo-50/70 border border-indigo-100/50 text-indigo-600' : 'text-slate-550 hover:text-slate-905 hover:bg-slate-50 border border-transparent'}`}
            >
              <Award className="w-4 h-4" />
              My Credentials
            </button>
          </nav>
        </div>

        {/* User / Logout Section */}
        <div className="p-4 border-t border-slate-200/80 space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center font-bold text-sm text-white shadow-sm">
              DV
            </div>
            <div>
              <span className="text-sm font-bold block text-slate-800 font-heading">Devon Vance</span>
              <span className="text-xs text-slate-400 block font-light">Student - Cohort A</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold border border-rose-105 bg-rose-50/80 hover:bg-rose-100 text-rose-650 transition-all duration-200 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Logout Portal
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-8 flex items-center justify-between shrink-0 sticky top-0 z-10">
          <div>
            <span className="text-sm text-slate-400 font-semibold">Student Dashboard</span>
            <h2 className="text-base font-bold text-slate-800 font-heading">Welcome back, Devon!</h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-xs px-2.5 py-1 rounded-md font-bold bg-emerald-50 text-emerald-755 border border-emerald-100">
              MAJOR: SOFTWARE ENGINEERING
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 p-8 space-y-8 max-w-7xl mx-auto w-full">
          
          {/* Overview Tab Content */}
          {activeTab === 'overview' && (
            <>
              {/* Headline Title */}
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-heading">Your Student Readiness</h1>
                <p className="text-slate-500 mt-1">Track your competency indexes, active skill gaps, and learning recommendation paths.</p>
              </div>

              {/* Premium Technical Assessment Navigation Banner */}
              <div className="p-6 rounded-2xl border border-indigo-100 bg-indigo-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm animate-fade-in">
                <div className="flex gap-4">
                  <div className="p-3 w-12 h-12 bg-white border border-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
                    <BrainCircuit className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 font-heading">AI-Powered Skill Assessment</h2>
                    <p className="text-xs text-slate-600 mt-1 max-w-xl">
                      Evaluate your programming knowledge dynamically. The SRE engine uses LLM technology to generate unique, proctored questions tailored to your chosen syllabus tracks, directly updating your placement readiness score.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('quizzes')}
                  className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-sm flex items-center gap-2 hover:scale-[1.02] hover:shadow-hover-glow shrink-0"
                >
                  <Play className="w-3.5 h-3.5 fill-white text-white" />
                  Take Assessment
                </button>
              </div>

              {/* KPI Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Metric 1 */}
                <div className="p-6 rounded-2xl border border-slate-200/80 bg-white shadow-card-subtle hover:shadow-hover-glow transition-all duration-300 hover:-translate-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-550">Readiness Score</span>
                    <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                      <TrendingUp className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-slate-900 font-heading">{readinessScore}%</span>
                    <span className="text-xs text-emerald-600 font-semibold flex items-center gap-0.5">
                      +2.1% this week
                    </span>
                  </div>
                  <span className="text-xs text-slate-455 mt-2 block">Top 15% of your class cohort</span>
                </div>

                {/* Metric 2 */}
                <div className="p-6 rounded-2xl border border-slate-200/80 bg-white shadow-card-subtle hover:shadow-hover-glow transition-all duration-300 hover:-translate-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-550">Mastered Techs</span>
                    <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                      <ShieldCheck className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-slate-900 font-heading">{verifiedSkillsCount}</span>
                    <span className="text-xs text-slate-500 font-semibold">Skills</span>
                  </div>
                  <span className="text-xs text-slate-455 mt-2 block">Verified in technical exams</span>
                </div>

                {/* Metric 3 */}
                <div className="p-6 rounded-2xl border border-slate-200/80 bg-white shadow-card-subtle hover:shadow-hover-glow transition-all duration-300 hover:-translate-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-555">Active Skill Gaps</span>
                    <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-100">
                      <AlertCircle className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-slate-900 font-heading">{activeGapsCount}</span>
                    <span className="text-xs text-rose-600 font-semibold">Remaining</span>
                  </div>
                  <span className="text-xs text-slate-455 mt-2 block">Recommendations generated</span>
                </div>

                {/* Metric 4 */}
                <div 
                  onClick={() => setActiveTab('quizzes')}
                  className="p-6 rounded-2xl border border-slate-200/80 bg-white shadow-card-subtle hover:shadow-hover-glow transition-all duration-300 hover:-translate-y-0.5 cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-555 group-hover:text-indigo-600 transition-colors">Practice Quizzes</span>
                    <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-650 border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      <Award className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-slate-900 font-heading">{quizzes.length}</span>
                    <span className="text-xs text-indigo-600 font-semibold">Available</span>
                  </div>
                  <span className="text-xs text-indigo-650 font-semibold mt-2 block flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Launch SRE Engine →
                  </span>
                </div>
              </div>

              {/* Roadmap & Recommendations splits */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left side: Roadmap view */}
                <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card-subtle">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 font-heading">Your Competency Roadmap</h2>
                      <span className="text-xs text-slate-500">Your step-by-step progress to graduation readiness.</span>
                    </div>
                    <button
                      onClick={() => setActiveTab('roadmap')}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-705 cursor-pointer"
                    >
                      Enlarge View
                    </button>
                  </div>

                  <div className="space-y-6 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                    {roadmapSteps.map((step, idx) => (
                      <div key={idx} className="flex gap-4 relative">
                        {/* Status icon circle */}
                        <div className={`w-12 h-12 rounded-full shrink-0 flex items-center justify-center border z-10 ${
                          step.status === 'Mastered' 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                            : step.status === 'In Progress'
                              ? 'bg-indigo-50 text-indigo-600 border-indigo-100 animate-pulse'
                              : 'bg-slate-50 text-slate-400 border-slate-200'
                        }`}>
                          {step.status === 'Mastered' ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : step.status === 'In Progress' ? (
                            <Play className="w-5 h-5 fill-indigo-650 text-indigo-600" />
                          ) : (
                            <Lock className="w-4 h-4" />
                          )}
                        </div>

                        {/* Card box */}
                        <div className="flex-1 p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in">
                          <div>
                            <span className="text-sm font-bold block text-slate-800">{step.title}</span>
                            <span className="text-xs text-slate-500 block mt-0.5">{step.desc}</span>
                            <span className="text-[10px] text-slate-400 font-semibold mt-1 block">{step.date}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            {step.grade !== '--' && (
                              <span className="text-xs px-2.5 py-1 bg-white border border-slate-200 text-slate-800 rounded font-bold">
                                Grade: {step.grade}
                              </span>
                            )}
                            {step.status === 'In Progress' && (
                              <button
                                onClick={() => setActiveTab('quizzes')}
                                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition-all cursor-pointer shadow-sm flex items-center gap-1"
                              >
                                Resume
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right side: Learning recommendations */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card-subtle flex flex-col justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 mb-1 font-heading">Recommended for You</h2>
                    <span className="text-xs text-slate-500 block mb-4">AI-generated materials to solve your active skill gaps.</span>

                    {/* Filter controls */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {['All', 'Languages', 'System Architecture', 'DevOps'].map((filt) => (
                        <button
                          key={filt}
                          onClick={() => setRecommendationFilter(filt)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                            recommendationFilter === filt
                              ? 'bg-indigo-50 border-indigo-200 text-indigo-650'
                              : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-850'
                          }`}
                        >
                          {filt}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-4">
                      {filteredResources.map((res, idx) => (
                        <a 
                          href={res.link} 
                          target={res.link !== '#' ? '_blank' : undefined} 
                          rel="noreferrer"
                          key={idx} 
                          className="block p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-100 hover:border-slate-300 transition-all duration-205 group hover:shadow-card-subtle"
                        >
                          <div className="flex justify-between items-start">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100/50">
                              {res.type}
                            </span>
                            <span className="text-xs text-slate-400">{res.duration}</span>
                          </div>
                          <span className="text-sm font-bold block text-slate-800 mt-2.5 group-hover:text-indigo-650 transition-colors flex items-center gap-1 font-heading">
                            {res.title}
                            <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </span>
                          <span className="text-xs text-slate-500 block mt-0.5">{res.publisher}</span>

                          {/* Study Progress Indicator */}
                          <div className="mt-3 space-y-1">
                            <div className="flex justify-between text-[10px] font-bold text-slate-400">
                              <span>Module Progress</span>
                              <span>{res.progress}%</span>
                            </div>
                            <div className="w-full h-1 bg-slate-200/60 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-600 transition-all duration-300" style={{ width: `${res.progress}%` }} />
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-100 text-amber-800 text-xs mt-6">
                    <span className="font-bold block text-amber-900 font-heading">🎯 Focus Area: System Design</span>
                    Your readiness rating is currently 60% in this category. Completing the "System Design Primer" will help solve this gap!
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Resume Analyzer Tab */}
          {activeTab === 'resume' && (
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-heading">AI Resume Analyzer</h1>
                <p className="text-slate-500 mt-1">Upload your software engineering resume. Our parser will analyze technical project complexity, verify technologies, and update your Readiness profile.</p>
              </div>

              {analysisState === 'idle' && (
                <div className="max-w-3xl mx-auto">
                  {/* Drag and Drop Zone */}
                  <div className="border-2 border-dashed border-slate-200/80 rounded-2xl bg-white p-12 text-center flex flex-col items-center justify-center transition-all hover:border-indigo-300 hover:shadow-card-subtle">
                    <div className="p-4 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 mb-6 animate-bounce">
                      <UploadCloud className="w-10 h-10" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 font-heading">Upload your resume document</h3>
                    <p className="text-sm text-slate-500 mt-1.5 max-w-sm leading-relaxed">Drag and drop your file here, or click to choose from your device. Supports PDF, DOCX (Max 5MB).</p>
                    
                    <div className="mt-8 flex flex-wrap gap-3 justify-center">
                      <button
                        onClick={() => handleStartAnalysis('devon_vance_swe_resume.pdf')}
                        className="px-4 py-2.5 bg-indigo-650 hover:bg-indigo-750 text-white font-semibold text-xs rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-2 hover:scale-[1.02] hover:shadow-hover-glow"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Simulate Upload: Devon_Vance_Resume.pdf
                      </button>
                      <button
                        onClick={() => handleStartAnalysis('aria_sterling_ml_resume.pdf')}
                        className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-2 hover:scale-[1.02]"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Simulate Upload: Aria_Sterling_Resume.pdf
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {analysisState === 'analyzing' && (
                <div className="max-w-md mx-auto p-8 rounded-2xl border border-slate-200 bg-white shadow-card-subtle space-y-6 text-center animate-pulse">
                  <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto" />
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 font-heading">Analyzing Resume Content</h3>
                    <p className="text-xs text-slate-400 mt-1">Cross-referencing verified skills with target software roles...</p>
                  </div>

                  {/* Parsing steps progress list */}
                  <div className="text-left space-y-3 pt-4 border-t border-slate-100">
                    {parsingStepsText.map((step, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-sm">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${
                          parsingStep > idx 
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
                            : parsingStep === idx 
                              ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                              : 'bg-slate-50 border-slate-200 text-slate-300'
                        }`}>
                          {parsingStep > idx ? (
                            <Check className="w-3 h-3" />
                          ) : parsingStep === idx ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                          )}
                        </div>
                        <span className={`font-medium ${parsingStep === idx ? 'text-slate-900' : 'text-slate-400'}`}>
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {analysisState === 'complete' && (
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Left Column: Parsed resume details */}
                  <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-card-subtle space-y-6">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 font-heading">{resumeFile}</h3>
                          <span className="text-xs text-slate-500 font-light block">File parsed successfully via AI parser</span>
                        </div>
                      </div>
                      <button
                        onClick={handleResetResume}
                        className="text-xs text-slate-500 hover:text-slate-700 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg cursor-pointer"
                      >
                        Upload Another
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-455 block">Extracted Skill Strengths</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {['React.js (Verified)', 'TypeScript', 'Node.js', 'PostgreSQL', 'Git & CI/CD', 'API Development', 'TailwindCSS'].map((skill, sIdx) => (
                            <span key={sIdx} className="px-2.5 py-1 bg-indigo-50 border border-indigo-100/50 text-indigo-700 text-xs rounded-lg font-semibold">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-455 block mt-2">Parsed Project Achievements</span>
                        <div className="space-y-3 mt-2">
                          <div className="p-3 bg-slate-50/50 border border-slate-100 rounded-lg">
                            <span className="text-sm font-bold block text-slate-800 font-heading">E-Commerce Microservices Architecture</span>
                            <p className="text-xs text-slate-600 mt-1 leading-relaxed">Verified implementation of Redis caches, load balancer routing, and dynamic index searches using pg_trgm. Checked grade equivalent: **Exceeds Benchmarks (A)**</p>
                          </div>
                          <div className="p-3 bg-slate-50/50 border border-slate-100 rounded-lg">
                            <span className="text-sm font-bold block text-slate-800 font-heading">SkillSync Score Engine Integration</span>
                            <p className="text-xs text-slate-600 mt-1 leading-relaxed">Integrated custom React hooks with TanStack router layers and automated ESLint configurations.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: AI Insights & Score adjustment */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card-subtle flex flex-col justify-between">
                    <div className="space-y-6">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-450">Analysis Outcome</span>
                        <h3 className="text-xl font-bold text-slate-900 mt-2 block font-heading">Resume Boost Recalculated</h3>
                      </div>

                      <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 text-center shadow-inner">
                        <span className="text-xs font-semibold text-indigo-650 block">Readiness Score Boosted</span>
                        <span className="text-3xl font-black text-indigo-700 block mt-1">+4.2%</span>
                        <span className="text-xs text-slate-455 block mt-1 font-semibold">Readiness Index adjusted to 86.7%</span>
                      </div>

                      <div className="space-y-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-455 block">Gap Resolutions</span>
                        <div className="flex items-start gap-2.5 text-xs text-slate-600">
                          <CheckCircle2 className="w-4 h-4 text-emerald-505 shrink-0 mt-0.5" />
                          <span>**Verified Git/CI/CD** competency from parsed internship project history. Gap successfully resolved.</span>
                        </div>
                        <div className="flex items-start gap-2.5 text-xs text-slate-600">
                          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          <span>**System Design** is mentioned, but lacks complex cluster scaling records. Keep practicing this in roadmap.</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveTab('overview')}
                      className="w-full py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-all shadow-md cursor-pointer mt-6 flex justify-center items-center gap-1.5"
                    >
                      View Readiness Overview
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Roadmap Tab */}
          {activeTab === 'roadmap' && (
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-heading">Your Technical Skills Roadmap</h1>
                <p className="text-slate-500 mt-1">A structured curriculum mapping your progression towards industry employability standards.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {roadmapSteps.map((step, idx) => (
                  <div key={idx} className="p-6 rounded-2xl border border-slate-200/80 bg-white shadow-card-subtle flex flex-col justify-between min-h-[220px] hover:shadow-hover-glow transition-all duration-300">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded ${
                          step.status === 'Mastered' 
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                            : step.status === 'In Progress' 
                              ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' 
                              : 'bg-slate-50 text-slate-400 border border-slate-200'
                        }`}>
                          {step.status}
                        </span>
                        {step.grade !== '--' && (
                          <span className="text-xs font-bold text-slate-800">Grade: {step.grade}</span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mt-4 leading-tight font-heading">{step.title}</h3>
                      <p className="text-xs text-slate-550 mt-2 leading-relaxed">{step.desc}</p>
                    </div>

                    <span className="text-[10px] text-slate-400 font-semibold block mt-4">{step.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Practice Quizzes Tab */}
          {activeTab === 'quizzes' && (
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-heading">Practice Assessments</h1>
                <p className="text-slate-500 mt-1">Complete modular assessments to resolve gaps and raise your overall competency score.</p>
              </div>

              {selectedQuiz ? (
                <div className="p-8 border border-slate-200/80 rounded-2xl bg-white shadow-card-subtle max-w-2xl mx-auto space-y-6 animate-fade-in">
                  {isLoadingQuiz ? (
                    <div className="text-center py-12 space-y-4">
                      <Loader2 className="w-12 h-12 text-indigo-650 animate-spin mx-auto" />
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 font-heading">AI Scoring Engine Active</h3>
                        <p className="text-sm text-slate-500 mt-1">Generating technical MCQ modules & syncing proctor metrics...</p>
                      </div>
                    </div>
                  ) : quizError ? (
                    <div className="text-center py-8 space-y-4">
                      <div className="p-3 w-14 h-14 bg-rose-50 border border-rose-100 rounded-full flex items-center justify-center mx-auto text-rose-600">
                        <AlertCircle className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 font-heading">Connection Error</h3>
                        <p className="text-sm text-slate-500 mt-1">{quizError}</p>
                      </div>
                      <div className="flex gap-4 justify-center">
                        <button
                          onClick={() => handleStartQuiz(selectedQuiz)}
                          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl cursor-pointer shadow-sm transition-all"
                        >
                          Retry Connection
                        </button>
                        <button
                          onClick={() => setSelectedQuiz(null)}
                          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl cursor-pointer shadow-sm transition-all"
                        >
                          Back to Quizzes
                        </button>
                      </div>
                    </div>
                  ) : quizScore !== null ? (
                    /* Quiz Results Card */
                    <div className="text-center py-6 space-y-6">
                      <div className="p-3 w-14 h-14 bg-indigo-50 border border-indigo-100 rounded-full flex items-center justify-center mx-auto text-indigo-600">
                        <Award className="w-8 h-8" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-indigo-650 uppercase tracking-wider block">Quiz Completed</span>
                        <h2 className="text-2xl font-bold text-slate-900 mt-1 font-heading">{selectedQuiz}</h2>
                      </div>
                      <div className="py-4 border-y border-slate-100 max-w-xs mx-auto">
                        <span className="text-slate-500 block text-xs">Your Score</span>
                        <span className="text-4xl font-extrabold text-indigo-650 font-heading">
                          {quizScore} / {activeQuestions.length}
                        </span>
                        <span className="text-xs text-slate-400 block mt-1">
                          ({Math.round((quizScore / activeQuestions.length) * 100)}% Accuracy)
                        </span>
                      </div>

                      <div className="flex gap-4 justify-center">
                        <button
                          onClick={() => setSelectedQuiz(null)}
                          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl cursor-pointer shadow-sm transition-all"
                        >
                          Practice More Quizzes
                        </button>
                        <button
                          onClick={() => setActiveTab('overview')}
                          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl cursor-pointer shadow-sm transition-all flex items-center gap-1"
                        >
                          Check My Readiness
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Active Quiz Questions */
                    <>
                      <div className="border-b border-slate-100 pb-4 flex justify-between items-center">
                        <div>
                          <span className="text-xs font-bold text-indigo-650 uppercase tracking-wider block">Active Exam</span>
                          <h2 className="text-xl font-bold text-slate-900 mt-1 font-heading">{selectedQuiz}</h2>
                        </div>
                        <button 
                          onClick={() => setSelectedQuiz(null)}
                          className="text-slate-400 hover:text-slate-650 text-xs font-bold px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/85 rounded-lg cursor-pointer"
                        >
                          Exit Quiz
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-450">
                          <span>Question {currentQuestionIdx + 1} of {activeQuestions.length}</span>
                          <span className="text-indigo-600">Verified Proctoring Enabled</span>
                        </div>
                        <p className="text-slate-800 font-semibold text-base leading-relaxed font-heading">
                          {activeQuestions[currentQuestionIdx]?.question}
                        </p>

                        <div className="space-y-3 pt-2">
                          {activeQuestions[currentQuestionIdx]?.options.map((opt, oIdx) => (
                            <button
                              key={oIdx}
                              onClick={() => handleSelectQuizOption(oIdx)}
                              className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left cursor-pointer transition-all ${
                                quizAnswers[currentQuestionIdx] === oIdx
                                  ? 'bg-indigo-50/70 border-indigo-200 text-indigo-700 font-semibold'
                                  : 'bg-slate-50/50 border-slate-100 hover:bg-slate-50 hover:border-slate-250 text-slate-700'
                              }`}
                            >
                              <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                quizAnswers[currentQuestionIdx] === oIdx
                                  ? 'border-indigo-600 bg-indigo-600 text-white'
                                  : 'border-slate-300 bg-white'
                              }`}>
                                {quizAnswers[currentQuestionIdx] === oIdx && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                              </div>
                              <span className="text-sm font-medium">{opt}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={handleNextQuizQuestion}
                        disabled={quizAnswers[currentQuestionIdx] === undefined}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-705 text-white font-semibold rounded-xl transition-all shadow-md cursor-pointer text-sm disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-1"
                      >
                        {currentQuestionIdx < activeQuestions.length - 1 ? 'Next Question' : 'Submit Exam'}
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              ) : (
                /* Quizzes Grid Listing */
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {quizzes.map((quiz, idx) => (
                    <div key={idx} className="p-6 rounded-2xl border border-slate-200/80 bg-white shadow-card-subtle flex flex-col justify-between min-h-[220px] hover:shadow-hover-glow transition-all duration-300">
                      <div>
                        <span className="text-xs font-bold text-indigo-705 uppercase tracking-wider bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                          {quiz.duration}
                        </span>
                        <h3 className="text-lg font-bold text-slate-900 mt-4 leading-snug font-heading">{quiz.name}</h3>
                        <span className="text-xs text-slate-500 mt-2 block">{quiz.questions} multiple choice questions</span>
                        <span className="text-xs text-emerald-650 font-semibold mt-1 block">{quiz.reward} potential reward</span>
                      </div>

                      <button
                        onClick={() => handleStartQuiz(quiz.name)}
                        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl mt-6 transition-all flex justify-center items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <Play className="w-3.5 h-3.5 fill-white text-white" />
                        Start Test
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Credentials Certificate Hub */}
          {activeTab === 'credentials' && (
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-heading">My Verified Credentials</h1>
                <p className="text-slate-500 mt-1">Access, download, and share your officially parsed competency certifications.</p>
              </div>

              {readinessScore >= readinessTarget ? (
                /* Unlocked Certificate Card */
                <div className="max-w-2xl mx-auto rounded-2xl border-4 border-double border-indigo-200 bg-white p-8 shadow-card-subtle relative overflow-hidden animate-fade-in">
                  {/* Decorative gold badge/banner */}
                  <div className="absolute top-[-10px] right-[-10px] w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 border border-indigo-100 opacity-20" />
                  
                  <div className="text-center space-y-6">
                    <div className="p-3 w-16 h-16 bg-indigo-50 border border-indigo-100 rounded-full flex items-center justify-center mx-auto text-indigo-600 animate-pulse">
                      <ShieldCheck className="w-10 h-10" />
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] font-extrabold tracking-widest text-indigo-650 uppercase block font-sans">Official Credential Registry</span>
                      <h2 className="text-2xl font-black text-slate-900 font-heading">COMPETENCY CERTIFICATE</h2>
                      <span className="text-xs text-slate-400 block italic mt-1">This certifies that</span>
                    </div>

                    <div className="py-2">
                      <span className="text-2xl font-black text-indigo-700 tracking-tight block font-heading underline decoration-indigo-300 decoration-wavy">Devon Vance</span>
                      <span className="text-sm text-slate-600 block mt-2 max-w-md mx-auto leading-relaxed">
                        has achieved a verified readiness index rating of **{readinessScore}%** in the Software Engineering catalog curriculum.
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 max-w-md mx-auto text-left pt-6 border-t border-slate-100">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Registry Hash ID</span>
                        <span className="text-xs font-mono font-semibold text-slate-700 block mt-0.5">SS-2026-A89E-7FBC</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Verified Skills</span>
                        <span className="text-xs font-semibold text-slate-700 block mt-0.5">{verifiedSkillsCount} verified tech stacks</span>
                      </div>
                    </div>

                    <div className="pt-6 flex gap-4 justify-center">
                      <button
                        onClick={() => alert('Certificate downloaded to downloads directory!')}
                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-md cursor-pointer transition-all"
                      >
                        Download PDF Certificate
                      </button>
                      <button
                        onClick={() => alert('Shareable link copied to clipboard!')}
                        className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-md cursor-pointer transition-all"
                      >
                        Copy Share Link
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Locked State Card */
                <div className="max-w-xl mx-auto rounded-2xl border border-slate-200 bg-white p-10 shadow-card-subtle text-center space-y-6">
                  <div className="p-4 w-16 h-16 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                    <Lock className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 font-heading">Competency Credential Locked</h3>
                    <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
                      You must achieve a verified **Readiness Index score of {readinessTarget}%** or higher to unlock and retrieve your verified blockchain certificate.
                    </p>
                  </div>

                  {/* Progress display */}
                  <div className="space-y-2 max-w-xs mx-auto pt-4 border-t border-slate-100">
                    <div className="flex justify-between text-xs font-bold text-slate-500">
                      <span>Your Current Index</span>
                      <span className="text-indigo-650">{readinessScore}%</span>
                    </div>
                    <div className="w-full h-2 rounded bg-slate-100 overflow-hidden">
                      <div 
                        className="h-full bg-indigo-600 transition-all duration-300"
                        style={{ width: `${(readinessScore / readinessTarget) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 block text-left">Target requirement: {readinessTarget}% index</span>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={() => setActiveTab('quizzes')}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-705 text-white font-semibold text-xs rounded-xl transition-all shadow-sm cursor-pointer"
                    >
                      Complete Practice Quizzes
                    </button>
                    <button
                      onClick={() => setActiveTab('resume')}
                      className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-all shadow-sm cursor-pointer"
                    >
                      Analyze My Resume
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Settings tab */}
          {activeTab === 'settings' && (
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-heading">Profile Settings</h1>
                <p className="text-slate-500 mt-1 font-sans">Manage your personal email alerts, notification bindings, and account credentials.</p>
              </div>

              <div className="max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 shadow-card-subtle space-y-6">
                <div className="space-y-1">
                  <span className="text-sm font-bold text-slate-950 block font-heading">Email Notifications</span>
                  <p className="text-xs text-slate-455">Receive custom notifications when instructors assign new assessments or when the AI engine generates new study recommendations.</p>
                  <label className="flex items-center gap-2 pt-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500" />
                    Enable automatic email updates
                  </label>
                </div>

                <div className="space-y-1 pt-6 border-t border-slate-100">
                  <span className="text-sm font-bold text-slate-950 block font-heading">Verified Profile Key</span>
                  <p className="text-xs text-slate-455">A secure hash key representing your verification credentials inside the campus blockchain network.</p>
                  <code className="block p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-655 mt-2">
                    usr_devon_vance_89ea7fbc1278adbc
                  </code>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
