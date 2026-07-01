import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  UploadCloud, 
  FileText, 
  Loader2, 
  Check, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  TrendingUp,
  Brain,
  AlertTriangle,
  Code,
  Layers,
  Sparkles,
  Zap,
  BookOpen,
  Calendar,
  Send,
  User,
  Bot,
  RefreshCw,
  Search
} from 'lucide-react'
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts'

interface ResumeAnalyzerViewProps {
  analysisState: 'idle' | 'analyzing' | 'complete'
  parsingStep: number
  resumeFile: string | null
  handleStartAnalysis: (fileOrName: File | string) => void
  handleResetResume: () => void
  setActiveTab: (tab: string) => void
  extractedData?: any
  analysisError?: string | null
  uploadedResumes: any[]
  chatMessages: any[]
  isChatTyping: boolean
  handleSendChatMessage: (msg: string) => void
  jdMatchResult: any
  isMatchingJd: boolean
  handleJdMatch: (jd: string) => void
  versionComparisonResult: any
  isComparingVersions: boolean
  handleCompareVersions: (idxA: number, idxB: number) => void
  compIdxA: number
  compIdxB: number
  setCompIdxA: (idx: number) => void
  setCompIdxB: (idx: number) => void
}

type SubTabType = 'overview' | 'ats' | 'skills' | 'projects' | 'roadmap' | 'jd-match' | 'compare' | 'chat'

const parsingStepsText = [
  'Parsing document text content...',
  'Extracting key sections & structures...',
  'Normalizing spaces & hidden characters...',
  'Formatting into LangChain Document objects...',
]

export function ResumeAnalyzerView({
  analysisState,
  parsingStep,
  resumeFile,
  handleStartAnalysis,
  handleResetResume,
  setActiveTab,
  extractedData,
  analysisError,
  uploadedResumes,
  chatMessages,
  isChatTyping,
  handleSendChatMessage,
  jdMatchResult,
  isMatchingJd,
  handleJdMatch,
  versionComparisonResult,
  isComparingVersions,
  handleCompareVersions,
  compIdxA,
  compIdxB,
  setCompIdxA,
  setCompIdxB
}: ResumeAnalyzerViewProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const compareFileInputRef = React.useRef<HTMLInputElement>(null)
  const [activeSubTab, setActiveSubTab] = React.useState<SubTabType>('overview')
  const [jdText, setJdText] = React.useState('')
  const [chatInput, setChatInput] = React.useState('')

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleStartAnalysis(e.target.files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleStartAnalysis(e.dataTransfer.files[0])
    }
  }

  const triggerChatSend = (msgText: string) => {
    if (!msgText.trim()) return
    handleSendChatMessage(msgText)
    setChatInput('')
  }

  // Safe accessor to analysis object
  const analysis = extractedData?.analysis || null

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="space-y-8 p-6 md:p-8 rounded-2xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-900 shadow-sm relative overflow-hidden transition-all duration-500"
    >
      {/* Glowing accent circles in the background */}
      <div className="absolute top-[-20%] left-[-10%] w-72 h-72 rounded-full bg-indigo-600/5 dark:bg-indigo-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-80 h-80 rounded-full bg-purple-600/5 dark:bg-purple-600/10 blur-[120px] pointer-events-none" />

      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 relative z-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-400 dark:from-indigo-200 dark:via-indigo-400 dark:to-purple-400 font-heading">
            AI Resume Intelligence Platform
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm">Upload software engineering resumes. Extract details, analyze ATS compatibility, compute role alignment, and roadmap learning paths.</p>
        </div>
        {analysisState === 'complete' && (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleResetResume}
            className="self-start sm:self-auto px-4 py-2.5 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-950/60 border border-indigo-300 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-300 rounded-xl cursor-pointer text-xs flex items-center gap-2 font-bold shadow-sm transition-all duration-300"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Upload New Resume
          </motion.button>
        )}
      </div>

      {analysisError && (
        <div className="max-w-3xl mx-auto mb-6 p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-500/30 rounded-2xl flex items-start gap-2.5 text-xs text-red-600 dark:text-red-400 relative z-10">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Analysis Failed</span>
            <span>{analysisError}</span>
          </div>
        </div>
      )}

      {analysisState === 'idle' && (
        <div className="max-w-3xl mx-auto relative z-10">
          <motion.div 
            whileHover={{ scale: 1.005, borderColor: '#6366F1' }}
            whileTap={{ scale: 0.995 }}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-indigo-200 dark:border-indigo-950 hover:border-indigo-500/50 rounded-2xl bg-white dark:bg-slate-950/30 p-12 text-center flex flex-col items-center justify-center transition-all hover:bg-indigo-50/30 dark:hover:bg-indigo-950/5 shadow-inner cursor-pointer group hover:shadow-[0_0_30px_rgba(99,102,241,0.05)]"
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={onFileChange} 
              accept=".pdf,.docx,.doc,.txt" 
              className="hidden" 
            />
            <div className="p-5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-900/50 text-[#6366F1] mb-6 animate-bounce shadow-sm dark:shadow-[0_0_20px_rgba(99,102,241,0.2)]">
              <UploadCloud className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 font-heading">Upload resume document</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 max-w-sm leading-relaxed">Drag and drop your file here, or click to choose from your device. Supports PDF, DOCX, DOC, TXT (Max 10MB).</p>
            
            <div className="mt-8 flex flex-wrap gap-3 justify-center" onClick={(e) => e.stopPropagation()}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleStartAnalysis('devon_vance_swe_resume.pdf')}
                className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-xs rounded-xl shadow-lg hover:shadow-indigo-500/20 transition-all cursor-pointer flex items-center gap-2"
              >
                <FileText className="w-3.5 h-3.5" />
                Simulate Upload: Devon_Vance_Resume.pdf
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleStartAnalysis('aria_sterling_ml_resume.pdf')}
                className="px-4 py-2.5 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                <FileText className="w-3.5 h-3.5" />
                Simulate Upload: Aria_Sterling_Resume.pdf
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      {analysisState === 'analyzing' && (
        <div className="max-w-md mx-auto p-8 rounded-2xl border border-indigo-100 dark:border-indigo-950/60 bg-white dark:bg-slate-950/30 shadow-2xl space-y-6 text-center animate-pulse relative z-10">
          <Loader2 className="w-10 h-10 text-[#6366F1] animate-spin mx-auto" />
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 font-heading">Extracting & Analyzing Resume</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Nvidia Llama 3.1 is computing intelligence metrics...</p>
          </div>

          <div className="text-left space-y-3 pt-4 border-t border-indigo-100 dark:border-indigo-950/40">
            {parsingStepsText.map((step, idx) => (
              <div key={idx} className="flex items-center gap-3 text-sm">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${
                  parsingStep > idx 
                    ? 'bg-emerald-100 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-500' 
                    : parsingStep === idx 
                      ? 'bg-indigo-100 dark:bg-indigo-950/50 border-indigo-300 dark:border-indigo-500/30 text-[#6366F1]'
                      : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-600'
                }`}>
                  {parsingStep > idx ? (
                    <Check className="w-3 h-3" />
                  ) : parsingStep === idx ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-700" />
                  )}
                </div>
                <span className={`font-medium ${parsingStep === idx ? 'text-slate-800 dark:text-slate-100' : 'text-slate-400 dark:text-slate-500'}`}>
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {analysisState === 'complete' && analysis && (
        <div className="space-y-6 relative z-10">
          {/* Sub-tab Navigation Bar */}
          <div className="flex border-b border-indigo-100 dark:border-indigo-950/60 overflow-x-auto gap-2 scrollbar-none pb-0.5">
            {[
              { id: 'overview', label: 'Overview Dashboard' },
              { id: 'ats', label: 'ATS Intelligence' },
              { id: 'skills', label: 'Skill Intelligence' },
              { id: 'projects', label: 'Project Intelligence' },
              { id: 'roadmap', label: 'Personalized Roadmap' },
              { id: 'jd-match', label: 'Job Description Match' },
              { id: 'compare', label: 'Version Comparison' },
              { id: 'chat', label: 'AI Resume Assistant' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as SubTabType)}
                className={`px-4 py-2.5 text-xs font-bold rounded-t-lg border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeSubTab === tab.id
                    ? 'border-[#6366F1] text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/30 shadow-[inset_0_1px_1px_rgba(99,102,241,0.1)] dark:shadow-[inset_0_1px_1px_rgba(99,102,241,0.2)]'
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-900/30'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sub-tab Content Area with framer-motion AnimatePresence */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSubTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            >
              
              {/* 1. OVERVIEW DASHBOARD */}
              {activeSubTab === 'overview' && (
                <div className="space-y-6">
                  {/* Basic Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 rounded-2xl border border-indigo-100 dark:border-indigo-950/50 bg-white dark:bg-slate-900/20 p-6 flex flex-col justify-between shadow-md">
                      <div className="space-y-1">
                        <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 font-heading tracking-tight">{analysis.basicInfo.name || 'Candidate Profile'}</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap gap-x-4 gap-y-1 mt-1 font-semibold">
                          <span>📧 {analysis.basicInfo.email || 'N/A'}</span>
                          <span>📞 {analysis.basicInfo.phone || 'N/A'}</span>
                          <span className="text-indigo-600 dark:text-indigo-400">💼 Level: {analysis.scores.careerLevel || 'Entry'}</span>
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2.5 mt-6 pt-4 border-t border-indigo-100 dark:border-indigo-950/40">
                        {analysis.basicInfo.github && (
                          <motion.a whileHover={{ y: -2 }} href={analysis.basicInfo.github} target="_blank" rel="noreferrer" className="px-3 py-1.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 text-xs rounded-lg font-semibold transition-all">GitHub</motion.a>
                        )}
                        {analysis.basicInfo.linkedin && (
                          <motion.a whileHover={{ y: -2 }} href={analysis.basicInfo.linkedin} target="_blank" rel="noreferrer" className="px-3 py-1.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 text-xs rounded-lg font-semibold transition-all">LinkedIn</motion.a>
                        )}
                        {analysis.basicInfo.portfolio && (
                          <motion.a whileHover={{ y: -2 }} href={analysis.basicInfo.portfolio} target="_blank" rel="noreferrer" className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-[#6366F1]/30 hover:border-indigo-300 dark:hover:border-[#6366F1] text-indigo-600 dark:text-indigo-300 text-xs rounded-lg font-semibold transition-all">Portfolio Site</motion.a>
                        )}
                      </div>
                    </div>

                    {/* Main Radial/Ring Score Overview */}
                    <div className="rounded-2xl border border-indigo-100 dark:border-indigo-950/50 bg-white dark:bg-slate-900/20 p-6 flex flex-col justify-center items-center text-center shadow-md">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1 font-heading">Overall Resume Score</span>
                      <div className="relative w-36 h-36 flex items-center justify-center my-3 group">
                        <div className="absolute inset-2 rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 blur-md group-hover:bg-indigo-500/20 transition-all duration-300" />
                        <div className="absolute inset-0 rounded-full border-8 border-slate-100 dark:border-slate-950/60" />
                        <div className="absolute inset-0 rounded-full border-8 border-t-indigo-500 border-r-purple-500 border-b-indigo-500/20 border-l-slate-100 dark:border-l-slate-950/60 rotate-45 transition-all duration-500" />
                        <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-500 dark:from-indigo-200 dark:to-purple-200 font-heading">{analysis.scores.overallScore}%</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-semibold">Completeness: {analysis.scores.completeness}% | Confidence: {analysis.scores.resumeConfidenceScore}%</p>
                    </div>
                  </div>

                  {/* Core Index Metrics Grid with Staggered Entrance and spring animations */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { name: 'ATS Score', val: analysis.scores.atsScore, from: 'from-indigo-600 to-indigo-500 dark:from-indigo-400 dark:to-indigo-300', bar: 'bg-indigo-500' },
                      { name: 'Industry Readiness', val: analysis.scores.industryReadiness, from: 'from-emerald-600 to-emerald-500 dark:from-emerald-400 dark:to-emerald-300', bar: 'bg-emerald-500' },
                      { name: 'Professionalism', val: analysis.scores.professionalismScore, from: 'from-cyan-600 to-cyan-500 dark:from-cyan-400 dark:to-cyan-300', bar: 'bg-cyan-500' },
                      { name: 'Project Quality', val: analysis.scores.projectQualityScore, from: 'from-amber-600 to-amber-500 dark:from-amber-400 dark:to-amber-300', bar: 'bg-amber-500' },
                      { name: 'Experience Strength', val: analysis.scores.experienceStrength, from: 'from-rose-600 to-rose-500 dark:from-rose-400 dark:to-rose-300', bar: 'bg-rose-500' },
                      { name: 'Skill Relevance', val: analysis.scores.skillRelevance, from: 'from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400', bar: 'bg-indigo-500' },
                      { name: 'Keyword Density', val: analysis.scores.keywordDensity, from: 'from-teal-600 to-teal-500 dark:from-teal-400 dark:to-teal-300', bar: 'bg-teal-500' },
                      { name: 'Innovation Index', val: analysis.scores.innovationScore, from: 'from-fuchsia-600 to-fuchsia-500 dark:from-fuchsia-400 dark:to-fuchsia-300', bar: 'bg-fuchsia-500' }
                    ].map((score, sIdx) => (
                      <motion.div 
                        key={sIdx} 
                        whileHover={{ y: -4, scale: 1.02 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                        className="p-4 bg-gradient-to-br from-indigo-50/30 to-white dark:from-slate-900/60 dark:to-indigo-950/10 border border-indigo-100/70 dark:border-indigo-950/50 rounded-2xl flex flex-col justify-between shadow-sm dark:shadow-md hover:border-indigo-500/20 dark:hover:border-indigo-500/30 transition-all duration-300"
                      >
                        <span className="text-[10px] font-bold text-slate-500 uppercase block font-heading">{score.name}</span>
                        <span className={`text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r ${score.from} block mt-1.5 font-heading`}>{score.val}%</span>
                        <div className="w-full bg-slate-200 dark:bg-slate-950 h-1.5 rounded-full mt-2 overflow-hidden shadow-inner">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${score.val}%` }}
                            transition={{ duration: 0.8, delay: 0.1 * sIdx }}
                            className={`h-full ${score.bar}`} 
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Role Compatibility Radar and Completeness Breakdowns */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Radar Chart */}
                    <div className="rounded-2xl border border-indigo-100 dark:border-indigo-950/50 bg-white dark:bg-slate-900/20 p-6 flex flex-col justify-between shadow-md">
                      <div>
                        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 font-heading">Role Compatibility Analysis</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Computed score match alignment against core technical roles.</p>
                      </div>
                      <div className="h-64 my-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={analysis.roleCompatibility}>
                            <PolarGrid stroke="#475569" strokeOpacity={0.2} />
                            <PolarAngleAxis dataKey="role" stroke="#64748B" fontSize={9} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={8} />
                            <Radar name="Compatibility" dataKey="compatibilityPercent" stroke="#6366F1" fill="#6366F1" fillOpacity={0.3} />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Completeness Breakdown Checklists */}
                    <div className="rounded-2xl border border-indigo-100 dark:border-indigo-950/50 bg-white dark:bg-slate-900/20 p-6 space-y-4 shadow-md">
                      <div>
                        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 font-heading">Resume Completeness Checklist</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Identify missing components to increase recruiter discoverability.</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
                        {Object.entries(analysis.completenessBreakdown).map(([section, data]: [string, any], idx) => {
                          const isComplete = data.status.toLowerCase() === 'completed';
                          return (
                            <motion.div 
                              key={idx} 
                              whileHover={{ scale: 1.01 }}
                              className={`p-3 rounded-xl border flex flex-col justify-between shadow-sm transition-all duration-300 ${
                                isComplete 
                                  ? 'bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-900/20 text-emerald-800 dark:text-emerald-400' 
                                  : 'bg-red-50/50 dark:bg-red-950/10 border-red-100 dark:border-red-900/20 text-red-800 dark:text-red-400'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                {isComplete ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-500 shrink-0" />
                                ) : (
                                  <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-500 shrink-0" />
                                )}
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block truncate">{section.replace(/([A-Z])/g, ' $1').trim()}</span>
                              </div>
                              {!isComplete && data.suggestions && (
                                <p className="text-[10px] text-red-600 dark:text-red-300 mt-1.5 italic leading-tight">{data.suggestions}</p>
                              )}
                            </motion.div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. ATS INTELLIGENCE */}
              {activeSubTab === 'ats' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Score Summary Box */}
                    <div className="rounded-2xl border border-indigo-100 dark:border-indigo-950/50 bg-white dark:bg-slate-900/20 p-6 text-center flex flex-col justify-center items-center shadow-md">
                      <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 font-heading">ATS Engine Rating</h3>
                      <div className="text-5xl font-black text-indigo-600 dark:text-indigo-400 my-4 font-heading">{analysis.scores.atsScore}%</div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Your resume exceeds 81% of common candidate patterns in fullstack pipelines.</p>
                    </div>

                    {/* Quick Recommendation Alert */}
                    <div className="md:col-span-2 rounded-2xl border border-indigo-100 dark:border-indigo-500/20 bg-indigo-50/50 dark:bg-indigo-950/10 p-6 flex flex-col justify-between shadow-md relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 blur-2xl rounded-full" />
                      <div className="flex gap-3 relative z-10">
                        <Sparkles className="w-5 h-5 text-indigo-500 dark:text-indigo-400 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">Top Optimization Tip</h4>
                          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                            {analysis.recommendations[0]?.recommendation || "Ensure your resume has live deployment links for all complex projects. Adding links boosts overall ATS readability by up to 7%."}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-indigo-100 dark:border-indigo-950/40 flex justify-between items-center text-xs relative z-10">
                        <span className="text-slate-500 dark:text-slate-400">Impact Improvement:</span>
                        <span className="font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-500/20">+{analysis.recommendations[0]?.estimatedAtsImprovement || 7} ATS Points</span>
                      </div>
                    </div>
                  </div>

                  {/* Comprehensive Breakdown */}
                  <div className="space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block font-heading">Section Compatibility Breakdown</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(analysis.atsBreakdown).map(([section, data]: [string, any], idx) => (
                        <motion.div 
                          key={idx} 
                          whileHover={{ scale: 1.01 }}
                          className="p-4 bg-gradient-to-br from-indigo-50/20 to-white dark:from-slate-900/60 dark:to-indigo-950/10 border border-indigo-100/70 dark:border-indigo-950/50 rounded-2xl space-y-2 shadow-sm dark:shadow-md hover:border-indigo-500/10 dark:hover:border-indigo-500/20 transition-all duration-300"
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 font-heading">{section}</span>
                            <span className={`text-xs font-bold ${data.score >= 85 ? 'text-emerald-600 dark:text-emerald-400' : data.score >= 70 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`}>
                              {data.score}/100
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{data.explanation}</p>
                          {data.suggestedFix && data.suggestedFix !== 'None' && data.suggestedFix !== 'None required' && (
                            <div className="pt-2.5 border-t border-indigo-100 dark:border-indigo-950/40 mt-2 text-[11px] flex justify-between items-center">
                              <span className="text-slate-600 dark:text-slate-300"><strong className="text-amber-500 font-medium">Fix:</strong> {data.suggestedFix}</span>
                              {data.estimatedAtsImprovement > 0 && (
                                <span className="shrink-0 text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/20 px-2 py-0.5 rounded text-[9px]">+{data.estimatedAtsImprovement} ATS</span>
                              )}
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 3. SKILL INTELLIGENCE */}
              {activeSubTab === 'skills' && (
                <div className="space-y-6">
                  {/* Category coverage progress bar chart */}
                  <div className="rounded-2xl border border-indigo-100 dark:border-indigo-950/50 bg-white dark:bg-slate-900/20 p-6 shadow-md">
                    <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 font-heading mb-4">Skill Category Representation</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analysis.skills.categories} layout="vertical" margin={{ left: 20 }}>
                          <CartesianGrid stroke="#475569" strokeOpacity={0.2} strokeDasharray="3 3" />
                          <XAxis type="number" domain={[0, 100]} stroke="#64748B" fontSize={10} />
                          <YAxis dataKey="name" type="category" stroke="#64748B" fontSize={9} />
                          <Tooltip contentStyle={{ backgroundColor: '#0B0F19', border: '1px solid #312E81', borderRadius: '10px' }} />
                          <Bar dataKey="coveragePercent" name="Coverage %" fill="#6366F1" radius={[0, 4, 4, 0]}>
                            {analysis.skills.categories.map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#6366F1' : '#818CF8'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Skills Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {analysis.skills.categories.map((cat: any, idx: number) => (
                      <motion.div 
                        key={idx} 
                        whileHover={{ scale: 1.01 }}
                        className="p-5 bg-gradient-to-br from-indigo-50/20 to-white dark:from-slate-900/60 dark:to-indigo-950/10 border border-indigo-100/70 dark:border-indigo-950/50 rounded-2xl space-y-4 shadow-md"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 font-heading flex items-center gap-1.5">
                              <Code className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                              {cat.name}
                            </h4>
                            <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">Matched count: {cat.skillCount} | Demand: {cat.industryDemand}</span>
                          </div>
                          <span className="text-xs bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/40 text-indigo-600 dark:text-indigo-300 px-2 py-0.5 rounded-lg font-bold">
                            {cat.coveragePercent}% Coverage
                          </span>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-500 block">Extracted Skills</span>
                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                              {cat.skills.map((s: string, sIdx: number) => (
                                <motion.span 
                                  key={sIdx} 
                                  whileHover={{ scale: 1.05, y: -1 }}
                                  className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-500/10 text-indigo-600 dark:text-indigo-300 text-xs rounded-md shadow-sm font-medium inline-block cursor-default"
                                >
                                  {s}
                                </motion.span>
                              ))}
                            </div>
                          </div>

                          {cat.missingSkills && cat.missingSkills.length > 0 && (
                            <div>
                              <span className="text-[10px] uppercase font-bold text-red-500 dark:text-red-400 block">Missing Critical Skills</span>
                              <div className="flex flex-wrap gap-1.5 mt-1.5">
                                {cat.missingSkills.map((s: string, sIdx: number) => (
                                  <span key={sIdx} className="px-2 py-0.5 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/20 text-red-600 dark:text-red-300 text-xs rounded-md flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                    {s}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {cat.emergingSkills && cat.emergingSkills.length > 0 && (
                            <div>
                              <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block">Emerging Tech (2026 Trends)</span>
                              <div className="flex flex-wrap gap-1.5 mt-1.5">
                                {cat.emergingSkills.map((s: string, sIdx: number) => (
                                  <span key={sIdx} className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/20 text-emerald-600 dark:text-emerald-300 text-xs rounded-md">
                                    {s}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. PROJECT INTELLIGENCE */}
              {activeSubTab === 'projects' && (
                <div className="space-y-6">
                  {/* Feature highlight header */}
                  <div className="rounded-2xl border border-indigo-100 dark:border-indigo-950/50 bg-white dark:bg-slate-900/20 p-6 shadow-md">
                    <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 font-heading">AI Project Deep Dive</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Calculated depth and feature detection matrices for parsed repository projects.</p>
                  </div>

                  {/* Projects List */}
                  <div className="space-y-6">
                    {analysis.projects.map((proj: any, idx: number) => (
                      <motion.div 
                        key={idx} 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 * idx }}
                        className="p-6 bg-gradient-to-br from-white to-indigo-50/30 dark:from-slate-900/50 dark:to-[#131526]/50 border border-indigo-100 dark:border-indigo-950/50 rounded-2xl grid grid-cols-1 lg:grid-cols-3 gap-6 shadow-sm dark:shadow-md"
                      >
                        {/* Title and stats */}
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 font-heading flex items-center gap-2">
                              <Layers className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                              {proj.name}
                            </h4>
                            <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold block mt-1">Deployment: {proj.deploymentStatus || 'Local Only'}</span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3 pt-2">
                            <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-xl text-center border border-indigo-100 dark:border-indigo-950/30">
                              <span className="text-[10px] text-slate-500 font-bold uppercase block">Complexity</span>
                              <span className="text-lg font-black text-indigo-600 dark:text-indigo-300">{proj.complexityScore}%</span>
                            </div>
                            <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-xl text-center border border-indigo-100 dark:border-indigo-950/30">
                              <span className="text-[10px] text-slate-500 font-bold uppercase block">Technical Depth</span>
                              <span className="text-lg font-black text-indigo-500 dark:text-[#818CF8]">{proj.technicalDepth}%</span>
                            </div>
                            <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-xl text-center border border-indigo-100 dark:border-indigo-950/30">
                              <span className="text-[10px] text-slate-500 font-bold uppercase block">Innovation</span>
                              <span className="text-lg font-black text-fuchsia-600 dark:text-fuchsia-400">{proj.innovationScore}%</span>
                            </div>
                            <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-xl text-center border border-indigo-100 dark:border-indigo-950/30">
                              <span className="text-[10px] text-slate-500 font-bold uppercase block">Resume Value</span>
                              <span className="text-lg font-black text-amber-600">{proj.resumeValue}%</span>
                            </div>
                          </div>
                        </div>

                        {/* Description, features, and text details */}
                        <div className="lg:col-span-2 space-y-4">
                          <div>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Description</span>
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{proj.description}</p>
                          </div>

                      {/* Feature chips */}
                          {proj.detectedFeatures && proj.detectedFeatures.length > 0 && (
                            <div>
                              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Detected Architectural Features</span>
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {proj.detectedFeatures.map((feat: string, fIdx: number) => (
                                  <motion.span 
                                    key={fIdx} 
                                    whileHover={{ scale: 1.05 }}
                                    className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm inline-block"
                                  >
                                    <Zap className="w-3 h-3 text-[#6366F1]" />
                                    {feat}
                                  </motion.span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Strengths & weaknesses */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                            <div className="space-y-1.5">
                              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase block">Strengths</span>
                              <ul className="text-xs text-slate-500 dark:text-slate-400 list-disc list-inside space-y-1 pl-1">
                                {proj.strengths.map((str: string, sIdx: number) => <li key={sIdx} className="leading-relaxed">{str}</li>)}
                              </ul>
                            </div>
                            <div className="space-y-1.5">
                              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase block">Improvement Areas</span>
                              <ul className="text-xs text-slate-500 dark:text-slate-400 list-disc list-inside space-y-1 pl-1">
                                {proj.improvements.map((imp: string, iIdx: number) => <li key={iIdx} className="leading-relaxed">{imp}</li>)}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. PERSONALIZED ROADMAP */}
              {activeSubTab === 'roadmap' && (
                <div className="space-y-6">
                  {/* Timeline Header */}
                  <div className="rounded-2xl border border-indigo-100 dark:border-indigo-950/50 bg-white dark:bg-slate-900/20 p-6 shadow-md">
                    <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 font-heading">Adaptive Tech Learning Roadmap</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Chronological checklist of courses, open-source projects, and certification tracks modeled from your profile gaps.</p>
                  </div>

                  {/* Timeline steps */}
                  <div className="space-y-8 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-indigo-100 dark:before:bg-indigo-950/50 pl-8 pb-4">
                    {[
                      { key: 'immediate', title: 'Immediate Steps (Next Week)', items: analysis.roadmap.immediate || [] },
                      { key: 'thirtyDays', title: '30 Days Milestones', items: analysis.roadmap.thirtyDays || [] },
                      { key: 'sixtyDays', title: '60 Days Goals', items: analysis.roadmap.sixtyDays || [] },
                      { key: 'ninetyDays', title: '90 Days Milestones', items: analysis.roadmap.ninetyDays || [] },
                      { key: 'sixMonths', title: '6 Months Vision', items: analysis.roadmap.sixMonths || [] }
                    ].map((phase, pIdx) => {
                      if (phase.items.length === 0) return null;
                      return (
                        <div key={pIdx} className="relative space-y-3">
                          {/* Timeline dot */}
                          <div className="absolute -left-11 top-0.5 w-6.5 h-6.5 rounded-full bg-white dark:bg-slate-950 border-2 border-indigo-300 dark:border-indigo-500 flex items-center justify-center text-[10px] text-indigo-500 dark:text-indigo-400 font-bold shadow-md dark:shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                            {pIdx + 1}
                          </div>

                          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 font-heading flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                            {phase.title}
                          </h4>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {phase.items.map((item: any, iIdx: number) => (
                              <motion.div 
                                key={iIdx} 
                                whileHover={{ scale: 1.01 }}
                                className="p-4 bg-gradient-to-br from-white to-indigo-50/20 dark:from-slate-900/60 dark:to-indigo-950/10 border border-indigo-100 dark:border-indigo-950/50 rounded-2xl flex flex-col justify-between shadow-sm dark:shadow-md"
                              >
                                <div>
                                  <div className="flex justify-between items-start gap-2">
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{item.title}</span>
                                    <span className="shrink-0 text-[9px] font-bold bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/40 text-indigo-600 dark:text-indigo-300 px-1.5 py-0.5 rounded">
                                      {item.type}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{item.details}</p>
                                </div>
                                <div className="mt-4 pt-2 border-t border-indigo-100 dark:border-indigo-950/40 flex justify-between items-center text-[10px] text-slate-400 dark:text-slate-500">
                                  <span>Estimated time:</span>
                                  <span className="font-bold text-indigo-600 dark:text-indigo-300">{item.estimatedTime}</span>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* 6. JOB DESCRIPTION MATCH */}
              {activeSubTab === 'jd-match' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Pasting Box */}
                    <div className="lg:col-span-1 p-6 bg-white dark:bg-slate-900/20 border border-indigo-100 dark:border-indigo-950/50 rounded-2xl space-y-4 shadow-md">
                      <div>
                        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 font-heading">Paste Job Description</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Input target JD text below to compare compatibility.</p>
                      </div>
                      
                      <textarea
                        value={jdText}
                        onChange={(e) => setJdText(e.target.value)}
                        placeholder="Paste job requirements, skills, and details here..."
                        className="w-full h-64 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-indigo-950/80 rounded-xl p-3 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 resize-none leading-relaxed font-sans shadow-inner"
                      />

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleJdMatch(jdText)}
                        disabled={isMatchingJd || !jdText.trim()}
                        className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-lg transition-all cursor-pointer flex justify-center items-center gap-1.5"
                      >
                        {isMatchingJd ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Comparing...
                          </>
                        ) : (
                          <>
                            <Search className="w-3.5 h-3.5" />
                            Run Compatibility Match
                          </>
                        )}
                      </motion.button>
                    </div>

                    {/* Outcome Display */}
                    <div className="lg:col-span-2 space-y-6">
                      <AnimatePresence mode="wait">
                        {jdMatchResult ? (
                          <motion.div 
                            key="jd-result"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="space-y-6"
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                              {/* Overall compatibility */}
                              <div className="p-6 bg-white dark:bg-slate-900/20 border border-indigo-100 dark:border-indigo-950/50 rounded-2xl text-center flex flex-col justify-center items-center shadow-md">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Overall Match Score</span>
                                <div className="text-5xl font-black text-indigo-600 dark:text-indigo-400 font-heading">{jdMatchResult.overallMatch}%</div>
                                <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-2 font-semibold">ATS compatibility match: {jdMatchResult.atsMatch}%</span>
                              </div>

                              {/* Priorities checklist */}
                              <div className="p-6 bg-white dark:bg-slate-900/20 border border-indigo-100 dark:border-indigo-950/50 rounded-2xl space-y-3 shadow-md">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Core Gaps Priority</span>
                                <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-disc list-inside">
                                  {jdMatchResult.learningPriority.map((item: string, idx: number) => (
                                    <li key={idx} className="leading-tight">{item}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            {/* Skills match split */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/20 rounded-xl space-y-2">
                                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase block font-heading">Matched Tech Stack</span>
                                <div className="flex flex-wrap gap-1">
                                  {jdMatchResult.matchedSkills.map((s: string, idx: number) => (
                                    <span key={idx} className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/20 text-emerald-700 dark:text-emerald-300 text-xs rounded-md font-semibold">
                                      {s}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <div className="p-4 bg-red-50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/20 rounded-xl space-y-2">
                                <span className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider block font-heading">Missing Keywords & Skills</span>
                                <div className="flex flex-wrap gap-1">
                                  {jdMatchResult.missingSkills.map((s: string, idx: number) => (
                                    <span key={idx} className="px-2 py-0.5 bg-red-100 dark:bg-red-950/20 border border-red-200 dark:border-red-900/20 text-red-700 dark:text-red-300 text-xs rounded-md font-semibold">
                                      {s}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Suggested changes list */}
                            <div className="p-5 bg-white dark:bg-slate-900/20 border border-indigo-100 dark:border-indigo-950/50 rounded-2xl space-y-3 shadow-md">
                              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block font-heading">Recommended Resume Adjustments</span>
                              <ul className="text-xs text-slate-500 dark:text-slate-400 list-disc list-inside space-y-1.5 leading-relaxed">
                                {jdMatchResult.recommendedResumeChanges.map((change: string, idx: number) => (
                                  <li key={idx} className="leading-relaxed">{change}</li>
                                ))}
                              </ul>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div 
                            key="jd-empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="h-full border-2 border-dashed border-slate-200 dark:border-indigo-950/50 rounded-2xl flex flex-col justify-center items-center p-12 text-center text-slate-400 dark:text-slate-500"
                          >
                            <Search className="w-8 h-8 text-slate-300 dark:text-indigo-950/80 mb-3 animate-pulse" />
                            <span className="text-xs font-bold">No Match Run Yet</span>
                            <p className="text-[11px] text-slate-400 dark:text-slate-500 max-w-xs mt-1 leading-relaxed">Paste a job specification in the panel and run compatibility match to analyze gaps.</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              )}

              {/* 7. VERSION COMPARISON */}
              {activeSubTab === 'compare' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Version Selector panel */}
                    <div className="lg:col-span-1 p-6 bg-white dark:bg-slate-900/20 border border-indigo-100 dark:border-indigo-950/50 rounded-2xl space-y-4 shadow-md">
                      <div>
                        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 font-heading">Compare Resume Versions</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Select two uploaded files from history to trace diff scores.</p>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1 font-heading">Old Version (A)</label>
                          <select
                            value={compIdxA}
                            onChange={(e) => setCompIdxA(Number(e.target.value))}
                            className="w-full bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-indigo-950/80 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                          >
                            {uploadedResumes.map((res: any, idx: number) => (
                              <option key={idx} value={idx}>{res.name} ({new Date(res.timestamp).toLocaleTimeString()})</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1 font-heading">New Version (B)</label>
                          <div className="flex gap-2">
                            <select
                              value={compIdxB}
                              onChange={(e) => setCompIdxB(Number(e.target.value))}
                              className="flex-1 bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-indigo-950/80 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                            >
                              {uploadedResumes.map((res: any, idx: number) => (
                                <option key={idx} value={idx}>{res.name} ({new Date(res.timestamp).toLocaleTimeString()})</option>
                              ))}
                            </select>
                            <button
                              type="button"
                              onClick={() => compareFileInputRef.current?.click()}
                              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] rounded-xl flex items-center justify-center font-bold shadow-sm transition-all duration-300"
                            >
                              Upload
                            </button>
                            <input 
                              type="file"
                              ref={compareFileInputRef}
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleStartAnalysis(e.target.files[0])
                                }
                              }}
                              accept=".pdf,.docx,.doc,.txt"
                              className="hidden"
                            />
                          </div>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleCompareVersions(compIdxA, compIdxB)}
                        disabled={isComparingVersions || uploadedResumes.length < 2}
                        className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-lg transition-all cursor-pointer flex justify-center items-center gap-1.5"
                      >
                        {isComparingVersions ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Comparing...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-3.5 h-3.5" />
                            Run Differential Scan
                          </>
                        )}
                      </motion.button>
                      {uploadedResumes.length < 2 && (
                        <p className="text-[10px] text-amber-600 dark:text-amber-500/80 text-center leading-tight">
                          * Please upload at least 2 resumes to compare changes.
                        </p>
                      )}
                    </div>

                    {/* Diff Output Display */}
                    <div className="lg:col-span-2 space-y-6">
                      <AnimatePresence mode="wait">
                        {versionComparisonResult ? (
                          <motion.div 
                            key="compare-result"
                            initial={{ opacity: 0, scale: 0.97 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.97 }}
                            className="space-y-6"
                          >
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                              <div className="p-4 bg-white dark:bg-slate-900/20 border border-indigo-100 dark:border-indigo-950/50 rounded-xl text-center shadow-md">
                                <span className="text-[10px] font-bold text-slate-500 uppercase block">Score Boost</span>
                                <span className={`text-2xl font-black block mt-1 ${
                                  versionComparisonResult.resumeScoreDifference >= 0 ? 'text-emerald-500' : 'text-red-500'
                                }`}>
                                  {versionComparisonResult.resumeScoreDifference >= 0 ? '+' : ''}
                                  {versionComparisonResult.resumeScoreDifference}%
                                </span>
                              </div>
                              <div className="p-4 bg-white dark:bg-slate-900/20 border border-indigo-100 dark:border-indigo-950/50 rounded-xl text-center shadow-md">
                                <span className="text-[10px] font-bold text-slate-500 uppercase block">ATS Difference</span>
                                <span className={`text-2xl font-black block mt-1 ${
                                  versionComparisonResult.atsImprovement >= 0 ? 'text-emerald-500' : 'text-red-500'
                                }`}>
                                  {versionComparisonResult.atsImprovement >= 0 ? '+' : ''}
                                  {versionComparisonResult.atsImprovement} Points
                                </span>
                              </div>
                              <div className="p-4 bg-white dark:bg-slate-900/20 border border-indigo-100 dark:border-indigo-950/50 rounded-xl text-center col-span-2 sm:col-span-1 shadow-md">
                                <span className="text-[10px] font-bold text-slate-500 uppercase block">New Skills Identified</span>
                                <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 block mt-1">{versionComparisonResult.newSkills.length}</span>
                              </div>
                            </div>

                            {/* Lists */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/20 rounded-xl space-y-1.5">
                                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase block font-heading">Added Skills</span>
                                {versionComparisonResult.newSkills.length > 0 ? (
                                  <div className="flex flex-wrap gap-1">
                                    {versionComparisonResult.newSkills.map((s: string, idx: number) => (
                                      <span key={idx} className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/20 text-emerald-700 dark:text-emerald-300 text-xs rounded-md font-semibold">{s}</span>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-xs text-slate-400 dark:text-slate-500 block">No new skills added.</span>
                                )}
                              </div>

                              <div className="p-4 bg-red-50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/20 rounded-xl space-y-1.5">
                                <span className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase block font-heading">Removed Skills</span>
                                {versionComparisonResult.removedSkills.length > 0 ? (
                                  <div className="flex flex-wrap gap-1">
                                    {versionComparisonResult.removedSkills.map((s: string, idx: number) => (
                                      <span key={idx} className="px-2 py-0.5 bg-red-100 dark:bg-red-950/20 border border-red-200 dark:border-red-900/20 text-red-700 dark:text-red-300 text-xs rounded-md font-semibold">{s}</span>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-xs text-slate-400 dark:text-slate-500 block">No skills removed.</span>
                                )}
                              </div>
                            </div>

                            {/* Project upgrades */}
                            <div className="p-5 bg-white dark:bg-slate-900/20 border border-indigo-100 dark:border-indigo-950/50 rounded-2xl space-y-3 shadow-md">
                              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block font-heading">Improved Projects & Achievements</span>
                              <ul className="text-xs text-slate-500 dark:text-slate-400 list-disc list-inside space-y-1 leading-relaxed">
                                {versionComparisonResult.improvedProjects.map((p: string, idx: number) => (
                                  <li key={idx}>{p}</li>
                                ))}
                              </ul>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div 
                            key="compare-empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="h-full border-2 border-dashed border-slate-200 dark:border-indigo-950/50 rounded-2xl flex flex-col justify-center items-center p-12 text-center text-slate-400 dark:text-slate-500"
                          >
                            <RefreshCw className="w-8 h-8 text-slate-300 dark:text-indigo-950/80 mb-3 animate-pulse" />
                            <span className="text-xs font-bold">No Comparison Scanned</span>
                            <p className="text-[11px] text-slate-400 dark:text-slate-500 max-w-xs mt-1 leading-relaxed">Select OLD vs NEW files in the panel and trigger scan to identify changes.</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              )}

              {/* 8. AI RESUME ASSISTANT (CHAT) */}
              {activeSubTab === 'chat' && (
                <div className="rounded-2xl border border-indigo-100 dark:border-indigo-950/50 bg-[#F8FAFC] dark:bg-[#0B0F19]/90 p-6 flex flex-col h-[60vh] justify-between shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#6366F1]/5 blur-3xl rounded-full" />
                  {/* Messages Viewport */}
                  <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-4 scrollbar-thin relative z-10">
                    {chatMessages.map((msg, idx) => (
                      <motion.div 
                        key={idx} 
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.25 }}
                        className={`flex items-end gap-2.5 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                      >
                        <div className={`w-6.5 h-6.5 rounded-full flex items-center justify-center shrink-0 ${
                          msg.role === 'user' ? 'bg-indigo-600' : 'bg-white dark:bg-slate-855 border border-slate-200 dark:border-slate-700'
                        }`}>
                          {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />}
                        </div>
                        <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-indigo-600 text-white rounded-br-none shadow-sm font-medium'
                            : 'bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-indigo-950/60 rounded-bl-none shadow-sm'
                        }`}>
                          {msg.text}
                        </div>
                      </motion.div>
                    ))}
                    {isChatTyping && (
                      <div className="flex items-end gap-2.5 max-w-[85%]">
                        <div className="w-6.5 h-6.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                          <Bot className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                        </div>
                        <div className="p-3 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-indigo-950/60 rounded-bl-none flex gap-1 items-center shadow-sm">
                          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Chat Input / prompt chips */}
                  <div className="pt-4 border-t border-slate-200 dark:border-indigo-950/40 space-y-4 shrink-0 relative z-10">
                    {/* Prompt chips */}
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Why is my ATS score low?",
                        "What skills should I learn next?",
                        "Which project is my strongest?",
                        "What should I improve first?"
                      ].map((chip, idx) => (
                        <motion.button
                          key={idx}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => triggerChatSend(chip)}
                          className="px-3 py-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-indigo-955 hover:border-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-200 text-slate-500 dark:text-slate-400 text-[10px] rounded-lg cursor-pointer font-bold transition-all shadow-sm"
                        >
                          {chip}
                        </motion.button>
                      ))}
                    </div>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault()
                        triggerChatSend(chatInput)
                      }}
                      className="flex items-center gap-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-indigo-950 rounded-xl p-1.5 focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/10 transition-all"
                    >
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Ask your AI coach a question about your parsed resume metrics..."
                        className="flex-1 bg-transparent border-none text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-0 px-3 py-2"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={!chatInput.trim() || isChatTyping}
                        className="p-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 disabled:opacity-50 text-white cursor-pointer transition-all"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </motion.button>
                    </form>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  )
}
