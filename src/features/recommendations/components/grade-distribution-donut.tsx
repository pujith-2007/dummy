import * as React from 'react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'

interface GradeDistributionProps {
  data: any[]
}

const COLORS: Record<string, string> = {
  'A+': '#10B981', // Emerald
  'A': '#34d399',  // Light Emerald
  'B': '#3b82f6',  // Blue
  'C': '#f59e0b',  // Amber
  'D': '#ef4444',  // Red
  'F': '#7f1d1d'   // Dark Red
}

export function GradeDistributionDonut({ data }: GradeDistributionProps): React.ReactElement {
  if (!data || data.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center text-slate-500 animate-pulse">
        Loading distribution...
      </div>
    )
  }

  return (
    <div className="h-full w-full flex flex-col">
      <div className="mb-2">
        <h3 className="text-sm font-bold text-slate-100 font-heading">Grade Distribution</h3>
        <p className="text-xs text-slate-400 mt-0.5">Historical assessment results</p>
      </div>
      <div className="flex-1 min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              nameKey="grade"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.grade] || '#6366F1'} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#0B0F19', borderColor: '#1e1e2d', borderRadius: '8px', color: '#f8fafc', fontSize: '12px' }}
              itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
              formatter={(value) => [`${value}%`, 'Percentage']}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              wrapperStyle={{ fontSize: '11px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
