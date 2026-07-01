import * as React from 'react'
import type { TopicWiseAnalysis } from '@/features/recommendations/types'

interface ConceptMasteryHeatmapProps {
  analysis: TopicWiseAnalysis | undefined
  loading: boolean
}

export function ConceptMasteryHeatmap({ analysis, loading }: ConceptMasteryHeatmapProps): React.ReactElement {
  if (loading || !analysis) {
    return (
      <div className="bg-white p-6 rounded-lg border border-slate-100 min-h-[300px] flex flex-col justify-between animate-pulse">
        <div className="h-5 bg-slate-100 rounded w-1/3" />
        <div className="space-y-3 mt-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 bg-slate-100 rounded" />
          ))}
        </div>
      </div>
    )
  }

  const { labels, scores, proficiencies, assessmentCounts } = analysis

  const getProficiencyColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'expert':
        return 'text-blue-600 bg-blue-50 border-blue-100'
      case 'proficient':
        return 'text-emerald-600 bg-emerald-50 border-emerald-100'
      case 'intermediate':
        return 'text-slate-600 bg-slate-50 border-slate-100'
      case 'novice':
      case 'needs work':
        return 'text-amber-600 bg-amber-50 border-amber-100'
      default:
        return 'text-slate-600 bg-slate-50 border-slate-100'
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-slate-100 min-h-[300px] flex flex-col hover:shadow-sm transition-shadow duration-200">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-800">Concept Mastery Heatmap</h3>
        <p className="text-xs text-slate-400 mt-0.5">Topic-wise readiness breakdown</p>
      </div>

      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
              <th className="pb-3 font-semibold">Topic</th>
              <th className="pb-3 font-semibold text-center">Score</th>
              <th className="pb-3 font-semibold text-center">Proficiency</th>
              <th className="pb-3 font-semibold text-right">Assessments</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-xs">
            {labels.map((label, idx) => {
              const score = scores[idx]
              const level = proficiencies[idx]
              const count = assessmentCounts[idx]

              return (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors duration-150">
                  {/* Topic Label */}
                  <td className="py-3.5 font-medium text-slate-800">{label}</td>

                  {/* Score */}
                  <td className="py-3.5 text-center font-semibold text-slate-900">
                    <div className="flex items-center justify-center gap-2">
                      <span className="w-8 text-right">{score}%</span>
                      <div className="w-12 bg-slate-100 h-1.5 rounded-full overflow-hidden hidden sm:block">
                        <div 
                          className={`h-full rounded-full ${score >= 80 ? 'bg-blue-600' : score >= 60 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                          style={{ width: `${score}%` }} 
                        />
                      </div>
                    </div>
                  </td>

                  {/* Proficiency */}
                  <td className="py-3.5 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getProficiencyColor(level)}`}>
                      {level}
                    </span>
                  </td>

                  {/* Assessments Completed */}
                  <td className="py-3.5 text-right text-slate-500 font-medium">{count} completed</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
