import * as React from 'react'

import type { ActivityData } from '@/features/recommendations/types'

interface UserProfileSummaryProps {
  loading: boolean
  activity?: ActivityData
}

export function UserProfileSummary({ loading, activity }: UserProfileSummaryProps): React.ReactElement {
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl border border-slate-100 animate-pulse space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-slate-100" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-100 rounded w-1/2" />
            <div className="h-3 bg-slate-100 rounded w-1/3" />
          </div>
        </div>
      </div>
    )
  }

  const r = 24
  const circ = 2 * Math.PI * r
  
  const level = activity?.level || 1
  const progress = (activity?.progress || 0) / 100
  const streak = activity?.streak || 0
  const points = activity?.points || 0
  const rank = activity?.rank || 'Top 50%'

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-100 hover:shadow-md transition-all duration-300 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
            AJ
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">Alex Johnson</h4>
            <p className="text-[10px] text-slate-400 font-semibold uppercase">Premium SRE Account</p>
          </div>
        </div>
        
        <div className="relative h-12 w-12 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 60 60">
            <circle
              cx="30"
              cy="30"
              r={r}
              className="stroke-slate-100 fill-transparent"
              strokeWidth="4"
            />
            <circle
              cx="30"
              cy="30"
              r={r}
              className="stroke-blue-600 fill-transparent transition-all duration-500"
              strokeWidth="4"
              strokeDasharray={circ}
              strokeDashoffset={circ * (1 - progress)}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute text-[9px] font-bold text-slate-700">Lvl {level}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center border-t border-slate-50 pt-4">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Streak</span>
          <span className="text-sm font-extrabold text-slate-800 mt-1 block">🔥 {streak} Days</span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Points</span>
          <span className="text-sm font-extrabold text-slate-800 mt-1 block">🎯 {points} Pts</span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Rank</span>
          <span className="text-sm font-extrabold text-slate-800 mt-1 block">🏆 {rank}</span>
        </div>
      </div>

      <div className="text-[10px] text-slate-500 font-semibold text-center bg-slate-50 py-1.5 rounded-lg border border-slate-100/50">
        {Math.round(progress * 100)}% progress to Level {level + 1}. Keep going!
      </div>
    </div>
  )
}
