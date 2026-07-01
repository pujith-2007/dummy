import * as React from 'react'

import type { ActivityData } from '../types'

interface StreakCalendarProps {
  loading: boolean
  activity?: ActivityData
}

export function StreakCalendar({ loading, activity }: StreakCalendarProps): React.ReactElement {
  if (loading) {
    return (
      <div className="bg-white p-4 rounded-xl border border-slate-100 animate-pulse h-28" />
    )
  }

  const days = activity?.activeDays || [
    { label: 'Mon', completed: true, active: false },
    { label: 'Tue', completed: true, active: false },
    { label: 'Wed', completed: true, active: false },
    { label: 'Thu', completed: true, active: false },
    { label: 'Fri', completed: true, active: false },
    { label: 'Sat', completed: true, active: false },
    { label: 'Sun', completed: true, active: true }
  ]

  const streak = activity?.streak || 7

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-100 hover:shadow-sm transition-shadow duration-200 space-y-3">
      <div className="flex justify-between items-center">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Weekly Activity Tracker</h4>
        <span className="text-[10px] text-blue-600 bg-blue-50 font-bold px-2 py-0.5 rounded-full">
          🔥 {streak} Day Streak
        </span>
      </div>

      <div className="grid grid-cols-7 gap-2.5">
        {days.map((day) => (
          <div
            key={day.label}
            className={`p-2 rounded-lg flex flex-col items-center justify-between border transition-all duration-200 ${
              day.active
                ? 'border-blue-300 bg-blue-50/20'
                : 'border-slate-50 bg-white hover:border-slate-200'
            }`}
          >
            <span className="text-[10px] font-bold text-slate-400">{day.label}</span>
            <div className="mt-1.5 flex items-center justify-center h-5 w-5">
              {day.completed ? (
                <span className="text-sm" title="Completed">🔥</span>
              ) : (
                <span className="h-1.5 w-1.5 rounded-full bg-slate-200" title="Missed" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
