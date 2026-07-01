import * as React from 'react'
import type { DashboardOverview } from '../types'

interface ReadinessScoreCardProps {
  overview: DashboardOverview | undefined
  loading: boolean
}

export function ReadinessScoreCard({ overview, loading }: ReadinessScoreCardProps): React.ReactElement {
  if (loading || !overview) {
    return (
      <div className="bg-white p-6 rounded-lg border border-slate-100 h-40 flex flex-col justify-between animate-pulse">
        <div className="h-4 bg-slate-100 rounded w-1/3" />
        <div className="flex items-baseline gap-2 mt-2">
          <div className="h-10 bg-slate-100 rounded w-16" />
          <div className="h-6 bg-slate-100 rounded w-10" />
        </div>
        <div className="h-4 bg-slate-100 rounded w-2/3 mt-2" />
      </div>
    )
  }

  const { overallScore, overallGrade, performanceLevel } = overview

  return (
    <div className="bg-white p-6 rounded-lg border border-slate-100 h-40 flex flex-col justify-between hover:shadow-sm transition-shadow duration-200">
      <div>
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Your Readiness Score</h3>
      </div>
      <div className="flex items-baseline gap-2 mt-2">
        <span className="text-4xl font-bold text-slate-900">{overallScore}</span>
        <span className="text-sm font-semibold text-slate-500">/100</span>
        <span className="ml-auto text-2xl font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-md">
          {overallGrade}
        </span>
      </div>
      <div className="mt-2 flex flex-col gap-1.5">
        <div className="text-xs text-slate-600 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Status: <span className="font-semibold text-slate-800">{performanceLevel}</span>
        </div>
        <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
          <div
            className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${overallScore}%` }}
          />
        </div>
      </div>
    </div>
  )
}
