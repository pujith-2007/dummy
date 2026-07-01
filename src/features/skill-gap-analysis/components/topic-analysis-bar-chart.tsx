import * as React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts'

interface TopicAnalysisProps {
  topicScores: Record<string, number>
}

const getBarColor = (score: number) => {
  if (score >= 85) return '#10B981' // Emerald (Mastered)
  if (score >= 70) return '#3b82f6' // Blue (Proficient)
  if (score >= 50) return '#f59e0b' // Amber (Needs Improvement)
  return '#ef4444' // Red (Novice)
}

export function TopicPerformanceBarChart({ topicScores }: TopicAnalysisProps): React.ReactElement {
  if (!topicScores || Object.keys(topicScores).length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center text-slate-500 animate-pulse">
        Loading topics...
      </div>
    )
  }

  const data = Object.keys(topicScores).map(topic => ({
    topic,
    score: topicScores[topic]
  }))

  return (
    <div className="h-full w-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-slate-100 font-heading">Topic Performance</h3>
        <p className="text-xs text-slate-400 mt-0.5">Competency across core skill areas</p>
      </div>
      <div className="flex-1 min-h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2d" vertical={false} />
            <XAxis 
              dataKey="topic" 
              stroke="#64748b" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false}
              tickMargin={10}
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip 
              cursor={{ fill: '#1e1e2d', opacity: 0.4 }}
              contentStyle={{ backgroundColor: '#0B0F19', borderColor: '#1e1e2d', borderRadius: '8px', color: '#f8fafc', fontSize: '12px' }}
              itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
              formatter={(value) => [`${value}%`, 'Score']}
            />
            <Bar dataKey="score" radius={[4, 4, 0, 0]} maxBarSize={50}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
