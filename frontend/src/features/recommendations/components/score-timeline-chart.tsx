import * as React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'

interface TrendAnalysisProps {
  trendData: any[]
}

export function TrendAnalysisLineChart({ trendData }: TrendAnalysisProps): React.ReactElement {
  if (!trendData || trendData.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center text-slate-500 animate-pulse">
        Loading trends...
      </div>
    )
  }

  return (
    <div className="h-full w-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-slate-100 font-heading">Performance Trends</h3>
        <p className="text-xs text-slate-400 mt-0.5">Chronological readiness score vs accuracy</p>
      </div>
      <div className="flex-1 min-h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2d" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="#64748b" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              padding={{ left: 10, right: 10 }}
            />
            <YAxis 
              yAxisId="left" 
              stroke="#64748b" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              stroke="#64748b" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0B0F19', borderColor: '#1e1e2d', borderRadius: '8px', color: '#f8fafc', fontSize: '12px' }}
              itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="score" 
              name="Readiness Score"
              stroke="#6366F1" 
              strokeWidth={3}
              dot={{ r: 4, fill: '#6366F1', strokeWidth: 2, stroke: '#030712' }}
              activeDot={{ r: 6, fill: '#818cf8', stroke: '#030712' }}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="accuracy" 
              name="Test Accuracy"
              stroke="#10B981" 
              strokeWidth={3}
              dot={{ r: 4, fill: '#10B981', strokeWidth: 2, stroke: '#030712' }}
              activeDot={{ r: 6, fill: '#34d399', stroke: '#030712' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
