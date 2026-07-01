import * as React from 'react'

interface SkillsRoadmapViewProps {
  roadmapSteps: any[]
}

export function SkillsRoadmapView({ roadmapSteps }: SkillsRoadmapViewProps) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-heading">Your Technical Skills Roadmap</h1>
        <p className="text-slate-400 mt-1">A structured curriculum mapping your progression towards industry employability standards.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {roadmapSteps.map((step, idx) => (
          <div key={idx} className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0F19]/80 shadow-sm flex flex-col justify-between min-h-[220px] hover:border-indigo-500/50 transition-all duration-300">
            <div>
              <div className="flex justify-between items-start">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded ${
                  step.status === 'Mastered' 
                    ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-500 border border-emerald-200 dark:border-emerald-500/30' 
                    : step.status === 'In Progress' 
                      ? 'bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-[#6366F1] border border-indigo-200 dark:border-[#6366F1]/30' 
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-500 border border-slate-200 dark:border-slate-800'
                }`}>
                  {step.status}
                </span>
                {step.grade !== '--' && (
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Grade: {step.grade}</span>
                )}
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mt-4 leading-tight font-heading">{step.title}</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">{step.desc}</p>
            </div>

            <span className="text-[10px] text-slate-500 font-semibold block mt-4">{step.date}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
