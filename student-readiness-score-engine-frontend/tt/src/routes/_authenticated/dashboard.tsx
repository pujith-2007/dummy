import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { 
  LayoutDashboard, 
  BookOpen, 
  AlertCircle, 
  Sparkles, 
  Settings, 
  LogOut, 
  Search, 
  Bell, 
  TrendingUp, 
  ShieldCheck, 
  UserCheck, 
  BrainCircuit,
  ArrowRight,
  Plus,
  Award,
  Lock
} from 'lucide-react'
import { useState, useEffect } from 'react'

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: DashboardPage,
})

interface RoadmapStep {
  title: string
  desc: string
  grade: string
  status: string
  date: string
}

interface Student {
  name: string
  email: string
  major: string
  score: string
  status: string
  trend: string
  verifiedSkillsCount?: number
  activeGapsCount?: number
}

interface Assessment {
  title: string
  skill: string
  difficulty: string
  questions: number
  completions: string
  avgScore: string
}

interface Remediation {
  skill: string
  course: string
  studentsCount: number
  completed: number
  cohort: string
}

function DashboardPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [showNotification, setShowNotification] = useState(true)

  // Students Data State
  const [students, setStudents] = useState<Student[]>([])

  // Assessment Form State
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [newTitle, setNewTitle] = useState('')
  const [newSkill, setNewSkill] = useState('System Design')
  const [newDifficulty, setNewDifficulty] = useState('Medium')
  const [newQuestions, setNewQuestions] = useState(15)

  // Remediation Assignment State
  const [remediations, setRemediations] = useState<Remediation[]>([])
  const [selectedRemediationSkill, setSelectedRemediationSkill] = useState('React 19 & Concurrent Mode')
  const [selectedRemediationCourse, setSelectedRemediationCourse] = useState('React 19 State Best Practices')
  const [selectedCohort, setSelectedCohort] = useState('Cohort A')

  // AI Configuration Settings State
  const [autoRemediation, setAutoRemediation] = useState(true)
  const [integrityGuardLevel, setIntegrityGuardLevel] = useState('strict')
  const [readinessTarget, setReadinessTarget] = useState(85)

  // Roadmap State
  const [roadmap, setRoadmap] = useState<RoadmapStep[]>([])
  const [newRoadmapTitle, setNewRoadmapTitle] = useState('')
  const [newRoadmapDesc, setNewRoadmapDesc] = useState('')
  const [newRoadmapGrade, setNewRoadmapGrade] = useState('--')
  const [newRoadmapStatus, setNewRoadmapStatus] = useState('Locked')
  const [newRoadmapDate, setNewRoadmapDate] = useState('')

  // Fetch initial state from backend API on mount
  useEffect(() => {
    fetch('http://localhost:3000/api/state')
      .then(res => res.json())
      .then(data => {
        setStudents(data.students)
        setAssessments(data.assessments)
        setRemediations(data.remediations)
        setAutoRemediation(data.settings.autoRemediation)
        setIntegrityGuardLevel(data.settings.integrityGuardLevel)
        setReadinessTarget(data.settings.readinessTarget)
        setRoadmap(data.roadmap || [])
      })
      .catch(err => console.error('[Error] Failed to fetch initial state:', err))
  }, [])

  const handleCreateAssessment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle) return
    
    fetch('http://localhost:3000/api/assessments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: newTitle,
        skill: newSkill,
        difficulty: newDifficulty,
        questions: Number(newQuestions)
      })
    })
    .then(res => res.json())
    .then(newAsm => {
      setAssessments(prev => [...prev, newAsm])
      setNewTitle('')
      alert('Assessment created and assigned to Cohort 2026-A!')
    })
    .catch(err => console.error('[Error] Failed to create assessment:', err))
  }

  const handleAssignRemediation = (e: React.FormEvent) => {
    e.preventDefault()
    
    fetch('http://localhost:3000/api/remediations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        skill: selectedRemediationSkill,
        course: selectedRemediationCourse,
        cohort: selectedCohort
      })
    })
    .then(res => res.json())
    .then(newRem => {
      setRemediations(prev => [...prev, newRem])
      alert(`Remediation path '${selectedRemediationCourse}' has been successfully assigned to ${selectedCohort}!`)
    })
    .catch(err => console.error('[Error] Failed to assign remediation:', err))
  }

  const handleCreateRoadmapStep = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newRoadmapTitle || !newRoadmapDesc) return

    fetch('http://localhost:3000/api/roadmap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: newRoadmapTitle,
        desc: newRoadmapDesc,
        grade: newRoadmapGrade,
        status: newRoadmapStatus,
        date: newRoadmapDate
      })
    })
    .then(res => res.json())
    .then(newStep => {
      setRoadmap(prev => [...prev, newStep])
      setNewRoadmapTitle('')
      setNewRoadmapDesc('')
      setNewRoadmapGrade('--')
      setNewRoadmapStatus('Locked')
      setNewRoadmapDate('')
      alert('Syllabus Roadmap step created and published successfully!')
    })
    .catch(err => console.error('[Error] Failed to create roadmap step:', err))
  }

  const updateSettings = (updated: { autoRemediation?: boolean, integrityGuardLevel?: string, readinessTarget?: number }) => {
    fetch('http://localhost:3000/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    })
    .then(res => res.json())
    .then(newSet => {
      if (newSet.autoRemediation !== undefined) setAutoRemediation(newSet.autoRemediation)
      if (newSet.integrityGuardLevel !== undefined) setIntegrityGuardLevel(newSet.integrityGuardLevel)
      if (newSet.readinessTarget !== undefined) {
        setReadinessTarget(newSet.readinessTarget)
        // Refresh students statuses
        fetch('http://localhost:3000/api/state')
          .then(res => res.json())
          .then(data => setStudents(data.students))
      }
    })
    .catch(err => console.error('[Error] Failed to update settings:', err))
  }

  const handleLogout = () => {
    localStorage.setItem('isAuthenticated', 'false')
    navigate({ to: '/home' })
  }

  // Mock Gaps Data
  const skillGaps = [
    { skill: 'System Design', category: 'Software Architecture', severity: 'High', studentsAffected: 42, color: 'text-rose-600 bg-rose-50 border-rose-100' },
    { skill: 'React 19 & Concurrent Mode', category: 'Frontend Development', severity: 'Medium', studentsAffected: 28, color: 'text-amber-600 bg-amber-50 border-amber-105' },
    { skill: 'Docker & Kubernetes', category: 'DevOps & Cloud Orchestration', severity: 'Medium', studentsAffected: 25, color: 'text-amber-600 bg-amber-50 border-amber-105' },
    { skill: 'Vector Databases (Chroma/PG)', category: 'Artificial Intelligence', severity: 'Low', studentsAffected: 15, color: 'text-blue-600 bg-blue-50 border-blue-105' },
  ]

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-700 font-sans antialiased">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-slate-200/80 bg-white flex flex-col justify-between shrink-0">
        <div>
          {/* Logo */}
          <div className="h-16 flex items-center gap-2.5 px-6 border-b border-slate-200/60">
            <div className="p-1.5 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold font-heading text-slate-900 tracking-tight">
              SkillSync <span className="text-indigo-600 font-normal">Console</span>
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${activeTab === 'overview' ? 'bg-indigo-50/70 border border-indigo-100/50 text-indigo-600' : 'text-slate-550 hover:text-slate-905 hover:bg-slate-50 border border-transparent'}`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Overview
            </button>

            <button
              onClick={() => setActiveTab('assessments')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${activeTab === 'assessments' ? 'bg-indigo-50/70 border border-indigo-100/50 text-indigo-600' : 'text-slate-550 hover:text-slate-905 hover:bg-slate-50 border border-transparent'}`}
            >
              <BookOpen className="w-4 h-4" />
              Assessments
            </button>

            <button
              onClick={() => setActiveTab('gaps')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${activeTab === 'gaps' ? 'bg-indigo-50/70 border border-indigo-100/50 text-indigo-600' : 'text-slate-550 hover:text-slate-905 hover:bg-slate-50 border border-transparent'}`}
            >
              <AlertCircle className="w-4 h-4" />
              Skill Gaps
            </button>

            <button
              onClick={() => setActiveTab('roadmap')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${activeTab === 'roadmap' ? 'bg-indigo-50/70 border border-indigo-100/50 text-indigo-600' : 'text-slate-550 hover:text-slate-905 hover:bg-slate-50 border border-transparent'}`}
            >
              <TrendingUp className="w-4 h-4" />
              Skills Roadmap
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${activeTab === 'settings' ? 'bg-indigo-50/70 border border-indigo-100/50 text-indigo-600' : 'text-slate-550 hover:text-slate-905 hover:bg-slate-50 border border-transparent'}`}
            >
              <Settings className="w-4 h-4" />
              System Settings
            </button>
          </nav>
        </div>

        {/* User / Logout Section */}
        <div className="p-4 border-t border-slate-200/80 space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-650 flex items-center justify-center font-bold text-sm text-white shadow-sm">
              AP
            </div>
            <div>
              <span className="text-sm font-bold block text-slate-800 font-heading">Admin Portal</span>
              <span className="text-xs text-slate-400 block font-light">coordinator@inst.edu</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold border border-rose-105 bg-rose-50/80 hover:bg-rose-100 text-rose-650 transition-all duration-200 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Logout Securely
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md px-8 flex items-center justify-between shrink-0 sticky top-0 z-10">
          <div className="flex items-center gap-4 w-96">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search students, skills or cohorts..."
                className="w-full h-9 pl-9 pr-4 rounded-lg bg-slate-50 border border-slate-200/80 focus:border-indigo-500/30 text-sm focus:outline-none transition-all placeholder:text-slate-400 text-slate-800"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 rounded-lg text-slate-450 hover:text-slate-800 hover:bg-slate-50 transition-colors relative cursor-pointer">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500" />
            </button>
            <div className="h-8 w-px bg-slate-200" />
            <div className="text-xs px-2.5 py-1 rounded-md font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
              COHORT 2026-A
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* Notification Banner */}
          {showNotification && (
            <div className="flex items-start justify-between p-4 rounded-xl border border-indigo-100 bg-indigo-50/50 text-indigo-900 shadow-card-subtle animate-fade-in">
              <div className="flex gap-3">
                <Sparkles className="w-5 h-5 shrink-0 mt-0.5 text-indigo-600" />
                <div>
                  <span className="font-bold block text-indigo-850 font-heading">Ready for scoring!</span>
                  <span className="text-sm text-slate-600">The AI model has parsed the latest 15 student submissions and updated the competency metrics.</span>
                </div>
              </div>
              <button 
                onClick={() => setShowNotification(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold px-1.5 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* Tab Content Router */}
          {activeTab === 'overview' && (
            <>
              {/* Header Title */}
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-heading">System Readiness Dashboard</h1>
                <p className="text-slate-500 mt-1">Real-time indicators tracking educational outcomes and core software competency rates.</p>
              </div>

              {/* KPI Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Metric 1 */}
                <div className="p-6 rounded-2xl border border-slate-200/80 bg-white shadow-card-subtle hover:shadow-hover-glow transition-all duration-300 hover:-translate-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-550">Readiness Score</span>
                    <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                      <UserCheck className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-slate-900 font-heading">{readinessTarget}% Target</span>
                    <span className="text-xs text-emerald-600 font-semibold flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3" />
                      +3.4%
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 mt-2 block">Weighted cohort capability index</span>
                </div>

                {/* Metric 2 */}
                <div className="p-6 rounded-2xl border border-slate-200/80 bg-white shadow-card-subtle hover:shadow-hover-glow transition-all duration-300 hover:-translate-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-550">Active Evaluated</span>
                    <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-655 border border-indigo-100">
                      <BookOpen className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-slate-900 font-heading">412</span>
                    <span className="text-xs text-indigo-605 font-semibold">Students</span>
                  </div>
                  <span className="text-xs text-slate-455 mt-2 block">Active profiles in this cohort</span>
                </div>

                {/* Metric 3 */}
                <div className="p-6 rounded-2xl border border-slate-200/80 bg-white shadow-card-subtle hover:shadow-hover-glow transition-all duration-300 hover:-translate-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-555">Open Skill Gaps</span>
                    <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-100">
                      <AlertCircle className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-slate-900 font-heading">{skillGaps.length}</span>
                    <span className="text-xs text-rose-600 font-semibold">Critical</span>
                  </div>
                  <span className="text-xs text-slate-455 mt-2 block">Competency blocks needing triage</span>
                </div>

                {/* Metric 4 */}
                <div className="p-6 rounded-2xl border border-slate-200/80 bg-white shadow-card-subtle hover:shadow-hover-glow transition-all duration-300 hover:-translate-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-555">Integrity Profile</span>
                    <span className="p-1.5 rounded-lg bg-cyan-50 text-cyan-600 border border-cyan-100">
                      <ShieldCheck className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-slate-900 font-heading">
                      {integrityGuardLevel === 'strict' ? '99.8%' : integrityGuardLevel === 'medium' ? '94.2%' : '88.5%'}
                    </span>
                    <span className="text-xs text-cyan-650 font-semibold">{integrityGuardLevel.toUpperCase()}</span>
                  </div>
                  <span className="text-xs text-slate-455 mt-2 block">Zero validation failures logged</span>
                </div>
              </div>

              {/* Data Visuals Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Students Roster Card */}
                <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white shadow-card-subtle overflow-hidden">
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 font-heading">Recent Student Readiness Profile</h2>
                      <span className="text-xs text-slate-500">Top evaluated students and active flags.</span>
                    </div>
                    <button 
                      onClick={() => setActiveTab('assessments')}
                      className="inline-flex items-center gap-1 text-xs font-bold text-indigo-650 hover:text-indigo-700 cursor-pointer"
                    >
                      View All
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 font-bold text-xs uppercase tracking-wider">
                          <th className="py-3 px-6">Name</th>
                          <th className="py-3 px-6">Major</th>
                          <th className="py-3 px-6">Ready Index</th>
                          <th className="py-3 px-6">Evaluation Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {students.map((student, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/40 transition-colors">
                            <td className="py-4 px-6">
                              <span className="font-semibold block text-slate-800">{student.name}</span>
                              <span className="text-xs text-slate-455 block">{student.email}</span>
                            </td>
                            <td className="py-4 px-6 text-slate-605">{student.major}</td>
                            <td className="py-4 px-6">
                              <span className={`font-mono font-bold ${student.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {student.score}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                                student.status === 'Ready' 
                                  ? 'text-emerald-600 bg-emerald-50/50 border-emerald-105' 
                                  : student.status === 'Gap Detected' 
                                    ? 'text-amber-600 bg-amber-50/50 border-amber-105' 
                                    : 'text-rose-600 bg-rose-50/50 border-rose-105'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  student.status === 'Ready' 
                                    ? 'bg-emerald-500' 
                                    : student.status === 'Gap Detected' 
                                      ? 'bg-amber-500' 
                                      : 'bg-rose-500'
                                }`} />
                                {student.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right: Critical Gaps Matrix */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card-subtle flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h2 className="text-lg font-bold text-slate-900 font-heading">Critical Skill Gaps</h2>
                        <span className="text-xs text-slate-500">Core software curriculum deficits.</span>
                      </div>
                      <button 
                        onClick={() => setActiveTab('gaps')}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-650 hover:bg-slate-50 cursor-pointer"
                      >
                        <AlertCircle className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      {skillGaps.map((gap, idx) => (
                        <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50/30 flex justify-between items-center">
                          <div>
                            <span className="text-sm font-bold block text-slate-800">{gap.skill}</span>
                            <span className="text-xs text-slate-455 block mt-0.5">{gap.category}</span>
                          </div>
                          <div className="text-right">
                            <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded border ${gap.color}`}>
                              {gap.severity}
                            </span>
                            <span className="text-xs text-slate-455 block mt-1">{gap.studentsAffected} Students</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('gaps')}
                    className="w-full py-2.5 mt-6 border border-slate-200 bg-slate-50 hover:bg-slate-100 text-sm font-semibold rounded-xl text-slate-600 hover:text-slate-800 transition-colors flex justify-center items-center gap-2 cursor-pointer shadow-sm animate-pulse"
                  >
                    Manage Curriculum Paths
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Active Assessments Tab Console */}
          {activeTab === 'assessments' && (
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-heading">Assessments Management</h1>
                <p className="text-slate-550 mt-1">Design, assign, and audit competency test models for your student cohorts.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Create Assessment Form */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card-subtle h-fit">
                  <h3 className="text-lg font-bold text-slate-900 font-heading mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-indigo-605" />
                    Create Assessment
                  </h3>

                  <form onSubmit={handleCreateAssessment} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assessment Title</label>
                      <input
                        type="text"
                        required
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="e.g. Docker Container Pipelines"
                        className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500/30 text-sm focus:outline-none text-slate-800"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Focus Skill Area</label>
                      <select 
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700 focus:outline-none"
                      >
                        <option>System Design</option>
                        <option>TypeScript</option>
                        <option>React 19</option>
                        <option>DevOps & Cloud</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Difficulty</label>
                        <select 
                          value={newDifficulty}
                          onChange={(e) => setNewDifficulty(e.target.value)}
                          className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700 focus:outline-none"
                        >
                          <option>Beginner</option>
                          <option>Medium</option>
                          <option>Advanced</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Questions</label>
                        <input
                          type="number"
                          required
                          min="5"
                          max="50"
                          value={newQuestions}
                          onChange={(e) => setNewQuestions(Number(e.target.value))}
                          className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none text-slate-850"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer mt-4"
                    >
                      Assign Assessment
                    </button>
                  </form>
                </div>

                {/* List of active assessments */}
                <div className="lg:col-span-2 space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 font-heading mb-2">Active Assigned Models</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {assessments.map((item, idx) => (
                      <div key={idx} className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between min-h-[160px]">
                        <div>
                          <div className="flex justify-between items-start">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100 text-indigo-650">
                              {item.skill}
                            </span>
                            <span className="text-xs font-semibold text-slate-455">{item.difficulty}</span>
                          </div>
                          <h4 className="text-base font-bold text-slate-900 mt-3 leading-snug font-heading">{item.title}</h4>
                          <span className="text-xs text-slate-500 mt-1 block">{item.questions} Quiz questions</span>
                        </div>

                        <div className="mt-4 border-t border-slate-100 pt-3 flex justify-between items-center text-xs">
                          <div>
                            <span className="text-slate-400 block font-light">Completion Rate</span>
                            <span className="font-bold text-slate-800">{item.completions}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-slate-400 block font-light">Avg Score</span>
                            <span className="font-bold text-indigo-650">{item.avgScore}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Curriculum Remediation tab */}
          {activeTab === 'gaps' && (
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-heading">Curriculum Gaps & Remediations</h1>
                <p className="text-slate-550 mt-1">Cross-reference gaps and assign auto-remediation syllabus modules to affected students.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Allocation form */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card-subtle h-fit">
                  <h3 className="text-lg font-bold text-slate-900 font-heading mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-indigo-605" />
                    Assign Remediation Path
                  </h3>

                  <form onSubmit={handleAssignRemediation} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Cohort Deficit</label>
                      <select 
                        value={selectedRemediationSkill}
                        onChange={(e) => {
                          setSelectedRemediationSkill(e.target.value)
                          // Auto map syllabus matching
                          if (e.target.value.includes('Docker')) setSelectedRemediationCourse('Introduction to Containers')
                          else if (e.target.value.includes('React')) setSelectedRemediationCourse('React 19 State Best Practices')
                          else setSelectedRemediationCourse('System Design Primer')
                        }}
                        className="w-full h-10 px-3 rounded-xl bg-slate-55 border border-slate-200 text-sm text-slate-700 focus:outline-none"
                      >
                        <option>System Design</option>
                        <option>React 19 & Concurrent Mode</option>
                        <option>Docker & Kubernetes</option>
                        <option>Vector Databases (Chroma/PG)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned Syllabus Module</label>
                      <input
                        type="text"
                        disabled
                        value={selectedRemediationCourse}
                        className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none text-slate-400"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assign to Cohort</label>
                      <select 
                        value={selectedCohort}
                        onChange={(e) => setSelectedCohort(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl bg-slate-55 border border-slate-200 text-sm text-slate-700 focus:outline-none"
                      >
                        <option>Cohort A</option>
                        <option>Cohort B</option>
                        <option>All Gaps Cohorts</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm cursor-pointer mt-4"
                    >
                      Allocate Module
                    </button>
                  </form>
                </div>

                {/* List of active remediations */}
                <div className="lg:col-span-2 space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 font-heading mb-2 font-heading">Allocated Remediation Logs</h3>

                  <div className="space-y-3">
                    {remediations.map((item, idx) => {
                      const percentage = Math.round((item.completed / item.studentsCount) * 100)
                      return (
                        <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-sm font-bold text-slate-800 block font-heading">{item.course}</span>
                              <span className="text-xs text-slate-500 block">Syllabus targeting gap in **{item.skill}**</span>
                            </div>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100 text-indigo-600">
                              {item.cohort}
                            </span>
                          </div>

                          {/* Progress bar */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs font-semibold text-slate-500">
                              <span>Student Completion Progress</span>
                              <span>{item.completed} / {item.studentsCount} ({percentage}%)</span>
                            </div>
                            <div className="w-full h-2 rounded bg-slate-100 overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-450 transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Skills Roadmap tab */}
          {activeTab === 'roadmap' && (
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-heading">Skills Roadmap Curriculum</h1>
                <p className="text-slate-550 mt-1">Design, assign status, and publish chronological curriculum progression modules for the student cohort.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Create Roadmap Step Form */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card-subtle h-fit">
                  <h3 className="text-lg font-bold text-slate-900 font-heading mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-indigo-605" />
                    Add Roadmap Step
                  </h3>

                  <form onSubmit={handleCreateRoadmapStep} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Step Title</label>
                      <input
                        type="text"
                        required
                        value={newRoadmapTitle}
                        onChange={(e) => setNewRoadmapTitle(e.target.value)}
                        placeholder="e.g. Vector Databases (Chroma/PG)"
                        className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500/30 text-sm focus:outline-none text-slate-800"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Syllabus / Description</label>
                      <textarea
                        required
                        value={newRoadmapDesc}
                        onChange={(e) => setNewRoadmapDesc(e.target.value)}
                        placeholder="e.g. Index scaling, HNSW configurations, semantic embeddings retrieval patterns"
                        rows={3}
                        className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500/30 text-sm focus:outline-none text-slate-800"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Target Date / Timeline</label>
                      <input
                        type="text"
                        required
                        value={newRoadmapDate}
                        onChange={(e) => setNewRoadmapDate(e.target.value)}
                        placeholder="e.g. Expected Jul 2026"
                        className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500/30 text-sm focus:outline-none text-slate-800"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Evaluation Status</label>
                        <select 
                          value={newRoadmapStatus}
                          onChange={(e) => setNewRoadmapStatus(e.target.value)}
                          className="w-full h-10 px-3 rounded-xl bg-slate-55 border border-slate-200 text-sm text-slate-700 focus:outline-none"
                        >
                          <option value="Mastered">Mastered</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Locked">Locked</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Grade (Optional)</label>
                        <select
                          value={newRoadmapGrade}
                          onChange={(e) => setNewRoadmapGrade(e.target.value)}
                          className="w-full h-10 px-3 rounded-xl bg-slate-55 border border-slate-200 text-sm text-slate-700 focus:outline-none"
                        >
                          <option value="--">--</option>
                          <option value="A">A</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B">B</option>
                          <option value="B-">B-</option>
                          <option value="C+">C+</option>
                          <option value="C">C</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer mt-4"
                    >
                      Publish Step
                    </button>
                  </form>
                </div>

                {/* List of active roadmap steps */}
                <div className="lg:col-span-2 space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 font-heading mb-2">Cohort Roadmap Steps Progression</h3>
                  
                  <div className="space-y-6 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                    {roadmap.map((item, idx) => (
                      <div key={idx} className="flex gap-4 relative">
                        {/* Status icon circle */}
                        <div className={`w-12 h-12 rounded-full shrink-0 flex items-center justify-center border z-10 bg-white ${
                          item.status === 'Mastered' 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                            : item.status === 'In Progress'
                              ? 'bg-indigo-50 text-indigo-600 border-indigo-100 animate-pulse'
                              : 'bg-slate-50 text-slate-400 border-slate-200'
                        }`}>
                          {item.status === 'Mastered' ? (
                            <ShieldCheck className="w-5 h-5" />
                          ) : item.status === 'In Progress' ? (
                            <TrendingUp className="w-5 h-5 text-indigo-600" />
                          ) : (
                            <Lock className="w-4 h-4" />
                          )}
                        </div>

                        {/* Card box */}
                        <div className="flex-1 p-5 rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div>
                            <span className="text-sm font-bold block text-slate-900 font-heading">{item.title}</span>
                            <span className="text-xs text-slate-550 block mt-1 leading-relaxed">{item.desc}</span>
                            <span className="text-[10px] text-slate-455 font-semibold mt-2 block">{item.date}</span>
                          </div>
                          
                          <div className="flex flex-col items-end gap-2 shrink-0">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${
                              item.status === 'Mastered'
                                ? 'bg-emerald-50 border-emerald-100 text-emerald-650'
                                : item.status === 'In Progress'
                                  ? 'bg-indigo-50 border-indigo-105 text-indigo-650 animate-pulse'
                                  : 'bg-slate-50 border-slate-200 text-slate-400'
                            }`}>
                              {item.status}
                            </span>
                            {item.grade !== '--' && (
                              <span className="text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                                Grade: {item.grade}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* System Settings tab */}
          {activeTab === 'settings' && (
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-heading">System Config Settings</h1>
                <p className="text-slate-500 mt-1">Fine-tune the AI readiness engine and assessment rules variables.</p>
              </div>

              <div className="max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 shadow-card-subtle space-y-8">
                {/* Parameter 1: Auto Remediation */}
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <span className="text-base font-bold text-slate-900 block font-heading">Auto-Remediation Delivery</span>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-md">Automatically allocate learning recommendations in student portal when competency score falls below target index.</p>
                  </div>
                  <button
                    onClick={() => updateSettings({ autoRemediation: !autoRemediation })}
                    className={`w-12 h-6 rounded-full transition-all relative ${autoRemediation ? 'bg-indigo-600' : 'bg-slate-200'}`}
                  >
                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${autoRemediation ? 'right-1' : 'left-1'}`} />
                  </button>
                </div>

                {/* Parameter 2: Integrity Strictness */}
                <div className="space-y-2.5 pt-4 border-t border-slate-100">
                  <span className="text-base font-bold text-slate-900 block font-heading">Integrity Monitor Guard Level</span>
                  <p className="text-xs text-slate-500 leading-relaxed">Adjust credential authentication checks and proctor logging strictness limits.</p>
                  
                  <div className="flex gap-3 pt-2">
                    {['strict', 'medium', 'off'].map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => updateSettings({ integrityGuardLevel: lvl })}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                          integrityGuardLevel === lvl 
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-650 font-bold' 
                            : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        {lvl.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Parameter 3: Threshold index slider */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-center text-sm font-semibold">
                    <span className="text-base font-bold text-slate-900 block font-heading">Readiness Score Threshold Target</span>
                    <span className="text-indigo-605 font-bold">{readinessTarget}%</span>
                  </div>
                  <p className="text-xs text-slate-555 leading-relaxed">Establish target graduation benchmark score. Students falling below this threshold are flagged in roster lists.</p>
                  
                  <div className="pt-4 flex items-center gap-4">
                    <span className="text-xs text-slate-400">70%</span>
                    <input
                      type="range"
                      min="70"
                      max="95"
                      value={readinessTarget}
                      onChange={(e) => {
                        const val = Number(e.target.value)
                        setReadinessTarget(val)
                        updateSettings({ readinessTarget: val })
                      }}
                      className="flex-1 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <span className="text-xs text-slate-400">95%</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
