import * as React from 'react'
import { ShieldCheck, Lock } from 'lucide-react'

interface CredentialsViewProps {
  readinessScore: number
  readinessTarget: number
  verifiedSkillsCount: number
  setActiveTab: (tab: string) => void
}

export function CredentialsView({
  readinessScore,
  readinessTarget,
  verifiedSkillsCount,
  setActiveTab
}: CredentialsViewProps) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-heading">My Verified Credentials</h1>
        <p className="text-slate-400 mt-1">Access, download, and share your officially parsed competency certifications.</p>
      </div>

      {readinessScore >= readinessTarget ? (
        <div className="max-w-2xl mx-auto rounded-2xl border-4 border-double border-slate-200 dark:border-indigo-900/50 bg-white dark:bg-[#0B0F19]/90 p-8 shadow-sm relative overflow-hidden animate-fade-in">
          <div className="absolute top-[-10px] right-[-10px] w-24 h-24 bg-indigo-900/30 rounded-full flex items-center justify-center text-[#6366F1] border border-[#6366F1]/30 opacity-20" />
          
          <div className="text-center space-y-6">
            <div className="p-3 w-16 h-16 bg-indigo-950/50 border border-[#6366F1]/30 rounded-full flex items-center justify-center mx-auto text-[#6366F1] animate-pulse">
              <ShieldCheck className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-extrabold tracking-widest text-indigo-400 uppercase block font-sans">Official Credential Registry</span>
              <h2 className="text-2xl font-black text-slate-100 font-heading">COMPETENCY CERTIFICATE</h2>
              <span className="text-xs text-slate-500 block italic mt-1">This certifies that</span>
            </div>

            <div className="py-2">
              <span className="text-2xl font-black text-[#6366F1] tracking-tight block font-heading underline decoration-indigo-500/50 decoration-wavy">Devon Vance</span>
              <span className="text-sm text-slate-400 block mt-2 max-w-md mx-auto leading-relaxed">
                has achieved a verified readiness index rating of **{readinessScore}%** in the Software Engineering catalog curriculum.
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto text-left pt-6 border-t border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Registry Hash ID</span>
                <span className="text-xs font-mono font-semibold text-slate-300 block mt-0.5">SS-2026-A89E-7FBC</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Verified Skills</span>
                <span className="text-xs font-semibold text-slate-300 block mt-0.5">{verifiedSkillsCount} verified tech stacks</span>
              </div>
            </div>

            <div className="pt-6 flex gap-4 justify-center">
              <button
                onClick={() => alert('Certificate downloaded to downloads directory!')}
                className="px-5 py-2.5 bg-[#6366F1] hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-sm cursor-pointer transition-all"
              >
                Download PDF Certificate
              </button>
              <button
                onClick={() => alert('Shareable link copied to clipboard!')}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl shadow-sm cursor-pointer transition-all border border-slate-700"
              >
                Copy Share Link
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-xl mx-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0F19]/80 p-10 shadow-sm text-center space-y-6">
          <div className="p-4 w-16 h-16 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-500">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 font-heading">Competency Credential Locked</h3>
            <p className="text-sm text-slate-800 dark:text-slate-200 mt-2 max-w-sm mx-auto leading-relaxed">
              You must achieve a verified **Readiness Index score of {readinessTarget}%** or higher to unlock and retrieve your verified blockchain certificate.
            </p>
          </div>

          <div className="space-y-2 max-w-xs mx-auto pt-4 border-t border-slate-800">
            <div className="flex justify-between text-xs font-bold text-slate-400">
              <span>Your Current Index</span>
              <span className="text-[#6366F1]">{readinessScore}%</span>
            </div>
            <div className="w-full h-2 rounded bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-[#6366F1] transition-all duration-300"
                style={{ width: `${(readinessScore / readinessTarget) * 100}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-500 block text-left">Target requirement: {readinessTarget}% index</span>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setActiveTab('quizzes')}
              className="px-5 py-2.5 bg-[#6366F1] hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl transition-all shadow-sm cursor-pointer"
            >
              Complete Practice Quizzes
            </button>
            <button
              onClick={() => setActiveTab('resume')}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl transition-all shadow-sm cursor-pointer border border-slate-700"
            >
              Analyze My Resume
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
