import * as React from 'react'
import type { TrendAnalysis, DashboardOverview } from '../types'

interface TrendSummaryCardProps {
  trend: TrendAnalysis | undefined
  loading: boolean
}

export function TrendSummaryCard({ trend, loading }: TrendSummaryCardProps): React.ReactElement {
  if (loading || !trend) {
    return (
      <div className="bg-white p-6 rounded-lg border border-slate-100 h-40 flex flex-col justify-between animate-pulse">
        <div className="h-4 bg-slate-100 rounded w-1/3" />
        <div className="h-8 bg-slate-100 rounded w-1/2 my-2" />
        <div className="h-4 bg-slate-100 rounded w-2/3" />
      </div>
    )
  }

  const { direction, improvementRate, trendClassification, consistencyScore } = trend

  return (
    <div className="bg-white p-6 rounded-lg border border-slate-100 h-40 flex flex-col justify-between hover:shadow-sm transition-shadow duration-200">
      <div>
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Trend & Velocity</h3>
      </div>
      <div className="flex items-baseline gap-2 mt-2">
        <span className={`text-4xl font-bold ${direction === 'up' ? 'text-emerald-600' : 'text-slate-900'}`}>
          {direction === 'up' ? '+' : ''}{improvementRate}%
        </span>
        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
          {direction === 'up' ? '▲ Upward' : '▼ Downward'}
        </span>
      </div>
      <div className="mt-2 text-xs text-slate-500 font-medium flex justify-between items-center">
        <span>
          Classification: <span className="text-slate-700 font-semibold">{trendClassification}</span>
        </span>
        <span className="text-[10px] bg-slate-50 text-slate-600 font-bold px-2 py-0.5 rounded border border-slate-100">
          Consistency: {consistencyScore}%
        </span>
      </div>
    </div>
  )
}

interface MasterySummaryCardProps {
  overview: DashboardOverview | undefined
  loading: boolean
}

export function MasterySummaryCard({ overview, loading }: MasterySummaryCardProps): React.ReactElement {
  if (loading || !overview) {
    return (
      <div className="bg-white p-6 rounded-lg border border-slate-100 h-40 flex flex-col justify-between animate-pulse">
        <div className="h-4 bg-slate-100 rounded w-1/3" />
        <div className="h-8 bg-slate-100 rounded w-1/2 my-2" />
        <div className="h-4 bg-slate-100 rounded w-2/3" />
      </div>
    )
  }

  const { totalAssessments, topTopics } = overview

  return (
    <div className="bg-white p-6 rounded-lg border border-slate-100 h-40 flex flex-col justify-between hover:shadow-sm transition-shadow duration-200">
      <div>
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Assessments & Topics</h3>
      </div>
      <div className="flex items-baseline gap-2 mt-2">
        <span className="text-4xl font-bold text-slate-900">{totalAssessments}</span>
        <span className="text-xs font-semibold text-slate-500 uppercase">Completed</span>
      </div>
      <div className="mt-2 text-xs text-slate-500 truncate">
        Lead Skill: <span className="text-slate-700 font-semibold">{topTopics[0]?.label || 'None'}</span>
      </div>
    </div>
  )
}
