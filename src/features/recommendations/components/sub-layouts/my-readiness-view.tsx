import * as React from 'react'
import { BrainCircuit, Play, TrendingUp, ShieldCheck, AlertCircle, Award, CheckCircle2, Lock, ExternalLink } from 'lucide-react'
import { GradeDistributionDonut } from '../grade-distribution-donut'
import { TopicPerformanceBarChart } from '@/features/skill-gap-analysis/components/topic-analysis-bar-chart'
import { TrendAnalysisLineChart } from '../score-timeline-chart'

interface MyReadinessViewProps {
  readinessScore: number
  verifiedSkillsCount: number
  activeGapsCount: number
  quizzesCount: number
  roadmapSteps: any[]
  recommendationFilter: string
  setRecommendationFilter: (filter: string) => void
  filteredResources: any[]
  setActiveTab: (tab: string) => void
  performanceSummary: any
  recommendations: any[]
  loading: boolean
  setReadinessScore: (score: number) => void
  setVerifiedSkillsCount: (count: number) => void
  setActiveGapsCount: (count: number) => void
  topicScores: Record<string, number>
  setTopicScores: (scores: Record<string, number>) => void
  trendData: any[]
  gradeDistribution: any[]
}

export function MyReadinessView({
  readinessScore,
  verifiedSkillsCount,
  activeGapsCount,
  quizzesCount,
  roadmapSteps,
  recommendationFilter,
  setRecommendationFilter,
  filteredResources,
  setActiveTab,
  performanceSummary,
  recommendations,
  loading,
  setReadinessScore,
  setVerifiedSkillsCount,
  setActiveGapsCount,
  topicScores,
  setTopicScores,
  trendData,
  gradeDistribution
}: MyReadinessViewProps) {
  return (
    <div className="flex flex-col space-y-5">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#08141A] dark:text-white font-heading">Your Student Readiness</h1>
        <p className="text-[#383838] dark:text-slate-400 mt-1">Track your competency indexes, active skill gaps, and learning recommendation paths.</p>
      </div>

      {/* Premium Technical Assessment Navigation Banner */}
      <div className="p-6 rounded-2xl border border-transparent dark:border-slate-900 bg-[#FFFFFF] dark:bg-[#0B0F19]/80 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)] dark:shadow-none">
        <div className="flex gap-4">
          <div className="p-3 w-12 h-12 bg-slate-900 border border-indigo-500/30 rounded-xl flex items-center justify-center text-[#6366F1] shadow-sm shrink-0">
            <BrainCircuit className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#08141A] dark:text-white font-heading">AI-Powered Skill Assessment</h2>
            <p className="text-xs text-[#383838] dark:text-slate-400 mt-1 max-w-xl">
              Evaluate your programming knowledge dynamically. The SRE engine uses LLM technology to generate unique, proctored questions tailored to your chosen syllabus tracks, directly updating your placement readiness score.
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setReadinessScore(84.1)
            setVerifiedSkillsCount(15)
            setActiveGapsCount(1)
            setActiveTab('quizzes')
          }}
          className="px-5 py-3 bg-[#6366F1] hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-[0_0_15px_rgba(99,102,241,0.3)] flex items-center gap-2 hover:scale-[1.02] shrink-0"
        >
          <Play className="w-3.5 h-3.5 fill-white text-white" />
          Take Assessment
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-2xl border border-transparent dark:border-slate-900 bg-[#FFFFFF] dark:bg-[#0B0F19]/80 shadow-[0_1px_3px_rgba(0,0,0,0.05)] dark:shadow-none hover:border-indigo-500/50 transition-all duration-300 h-full flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#383838] dark:text-slate-400">Readiness Score</span>
            <span className="p-1.5 rounded-lg bg-indigo-950 text-[#6366F1] border border-indigo-900">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-[#08141A] dark:text-white font-heading">{readinessScore}%</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
              +2.1% this week
            </span>
          </div>
          <span className="text-xs text-[#383838] dark:text-slate-500 mt-2 block">Top 15% of your class cohort</span>
        </div>

        <div className="p-6 rounded-2xl border border-transparent dark:border-slate-900 bg-[#FFFFFF] dark:bg-[#0B0F19]/80 shadow-[0_1px_3px_rgba(0,0,0,0.05)] dark:shadow-none hover:border-indigo-500/50 transition-all duration-300 h-full flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#383838] dark:text-slate-400">Mastered Techs</span>
            <span className="p-1.5 rounded-lg bg-[#D9F9DF] text-emerald-900 dark:bg-emerald-950 text-emerald-500 border border-transparent dark:border-emerald-900">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-[#08141A] dark:text-white font-heading">{verifiedSkillsCount}</span>
            <span className="text-xs text-[#383838] dark:text-slate-400 font-semibold">Skills</span>
          </div>
          <span className="text-xs text-[#383838] dark:text-slate-500 mt-2 block">Verified in technical exams</span>
        </div>

        <div className="p-6 rounded-2xl border border-transparent dark:border-slate-900 bg-[#FFFFFF] dark:bg-[#0B0F19]/80 shadow-[0_1px_3px_rgba(0,0,0,0.05)] dark:shadow-none hover:border-indigo-500/50 transition-all duration-300 h-full flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#383838] dark:text-slate-400">Active Skill Gaps</span>
            <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-500 border border-transparent dark:border-rose-900">
              <AlertCircle className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-[#08141A] dark:text-white font-heading">{activeGapsCount}</span>
            <span className="text-xs text-rose-600 dark:text-rose-500 font-semibold">Remaining</span>
          </div>
          <span className="text-xs text-[#383838] dark:text-slate-500 mt-2 block">Recommendations generated</span>
        </div>

        <div 
          onClick={() => setActiveTab('quizzes')}
          className="p-6 rounded-2xl border border-transparent dark:border-slate-900 bg-[#FFFFFF] dark:bg-[#0B0F19]/80 shadow-[0_1px_3px_rgba(0,0,0,0.05)] dark:shadow-none hover:border-[#6366F1] transition-all duration-300 cursor-pointer group h-full flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#383838] dark:text-slate-400 group-hover:text-[#6366F1] transition-colors">Practice Quizzes</span>
            <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-[#6366F1] border border-transparent dark:border-indigo-900 group-hover:bg-[#6366F1] group-hover:text-white transition-all">
              <Award className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-[#08141A] dark:text-white font-heading">{quizzesCount}</span>
            <span className="text-xs text-[#6366F1] font-semibold">Available</span>
          </div>
          <span className="text-xs text-[#6366F1] font-semibold mt-2 block flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Launch SRE Engine →
          </span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 mt-6">
        <div className="lg:col-span-1 rounded-2xl border border-transparent dark:border-slate-900 bg-[#FFFFFF] dark:bg-[#0B0F19]/80 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] dark:shadow-none min-h-[300px]">
           <GradeDistributionDonut data={gradeDistribution} />
        </div>
        <div className="lg:col-span-2 rounded-2xl border border-transparent dark:border-slate-900 bg-[#FFFFFF] dark:bg-[#0B0F19]/80 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] dark:shadow-none min-h-[300px]">
           <TopicPerformanceBarChart topicScores={topicScores} />
        </div>
        <div className="lg:col-span-3 rounded-2xl border border-transparent dark:border-slate-900 bg-[#FFFFFF] dark:bg-[#0B0F19]/80 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] dark:shadow-none min-h-[300px]">
           <TrendAnalysisLineChart trendData={trendData} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Full width: Roadmap */}
        <div className="lg:col-span-3 space-y-6">
          <div className="rounded-2xl border border-transparent dark:border-indigo-900/30 bg-[#FFFFFF] dark:bg-[#0B0F19]/80 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)] dark:shadow-none">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-bold text-[#08141A] dark:text-white font-heading">Your Competency Roadmap</h2>
                <span className="text-xs text-[#383838] dark:text-slate-400">Your step-by-step progress to graduation readiness.</span>
              </div>
              <button
                onClick={() => setActiveTab('roadmap')}
                className="text-xs font-bold text-[#6366F1] hover:text-indigo-400 cursor-pointer"
              >
                Enlarge View
              </button>
            </div>

            <div className="space-y-6 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-px before:bg-[#E8EFF1] dark:before:bg-slate-800">
              {roadmapSteps.map((step, idx) => (
                <div key={idx} className="flex gap-4 relative">
                  <div className={`w-12 h-12 rounded-full shrink-0 flex items-center justify-center border z-10 ${
                    step.status === 'Mastered' 
                      ? 'bg-[#D9F9DF] dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-500 border-transparent dark:border-emerald-500/30' 
                      : step.status === 'In Progress'
                        ? 'bg-indigo-50/50 dark:bg-indigo-950/50 text-[#6366F1] border-transparent dark:border-[#6366F1]/30 animate-pulse'
                        : 'bg-[#E8EFF1] dark:bg-slate-900 text-slate-400 dark:text-slate-600 border-transparent dark:border-slate-800'
                  }`}>
                    {step.status === 'Mastered' ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : step.status === 'In Progress' ? (
                      <Play className="w-5 h-5 fill-[#6366F1] text-[#6366F1]" />
                    ) : (
                      <Lock className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1 p-4 rounded-xl border border-transparent dark:border-slate-800 bg-[#E8EFF1] dark:bg-[#111827] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:shadow-none">
                    <div>
                      <span className="text-sm font-bold block text-[#08141A] dark:text-slate-200">{step.title}</span>
                      <span className="text-xs text-[#383838] dark:text-slate-400 block mt-0.5">{step.desc}</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-500 font-semibold mt-1 block">{step.date}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {step.grade !== '--' && (
                        <span className="text-xs px-2.5 py-1 bg-[#FFFFFF] dark:bg-slate-800 border border-transparent dark:border-slate-700 text-[#08141A] dark:text-slate-300 rounded font-bold shadow-[0_1px_2px_rgba(0,0,0,0.05)] dark:shadow-none">
                          Grade: {step.grade}
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
    </div>
  )
}
