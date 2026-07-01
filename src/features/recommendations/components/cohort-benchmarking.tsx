import * as React from 'react'
import type { TrendAnalysis } from '../types'

interface CohortBenchmarkingProps {
  trend: TrendAnalysis | undefined
  loading: boolean
}

export function CohortBenchmarking({ trend, loading }: CohortBenchmarkingProps): React.ReactElement {
  if (loading || !trend) {
    return (
      <div className="bg-white p-6 rounded-lg border border-slate-100 min-h-[300px] flex flex-col justify-between animate-pulse">
        <div className="h-5 bg-slate-100 rounded w-1/3" />
        <div className="space-y-4 my-6">
          <div className="h-12 bg-slate-100 rounded" />
          <div className="h-12 bg-slate-100 rounded" />
        </div>
        <div className="h-4 bg-slate-100 rounded w-1/2" />
      </div>
    )
  }

  const { direction, improvementRate, consistencyScore, trendClassification } = trend

  // Cohort Benchmarks comparison values
  const cohortAverageScore = 74
  const studentReadinessScore = 82

  return (
    <div className="bg-white p-6 rounded-lg border border-slate-100 min-h-[300px] flex flex-col justify-between hover:shadow-sm transition-shadow duration-200">
      <div>
        <h3 className="text-sm font-semibold text-slate-800">Cohort Benchmarking</h3>
        <p className="text-xs text-slate-400 mt-0.5">Comparison against peer group</p>
      </div>

      <div className="grid grid-cols-2 gap-4 my-4">
        {/* Trend Classification Card */}
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Trend Mode</span>
          <div className="text-sm font-semibold text-slate-800 mt-1 flex items-center gap-1.5">
            <span className={`text-xs ${direction === 'up' ? 'text-emerald-600' : 'text-amber-600'}`}>
              {direction === 'up' ? '▲' : '▼'}
            </span>
            {trendClassification}
          </div>
        </div>

        {/* Consistency Score Card */}
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Consistency Score</span>
          <div className="text-sm font-semibold text-slate-800 mt-1">
            {consistencyScore}% <span className="text-xs font-normal text-slate-400">(Avg: 72%)</span>
          </div>
        </div>
      </div>

      {/* Visual comparison bar graph */}
      <div className="space-y-3">
        <span className="text-xs font-medium text-slate-500">Readiness Score Comparison</span>
        
        {/* User bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-medium text-slate-600">
            <span>You</span>
            <span>{studentReadinessScore} (Proficient)</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full rounded-full" style={{ width: `${studentReadinessScore}%` }} />
          </div>
        </div>

        {/* Cohort average bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-medium text-slate-500">
            <span>Cohort Average</span>
            <span>{cohortAverageScore} (Developing)</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-slate-300 h-full rounded-full" style={{ width: `${cohortAverageScore}%` }} />
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-slate-500">
        Improvement rate is <span className="font-semibold text-emerald-600">+{improvementRate}%</span> compared to last month.
      </div>
    </div>
  )
}
