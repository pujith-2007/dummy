import * as React from 'react'

export interface AssessmentItem {
  id: number
  name: string
  category: string
  score: number
  date: string
  status: 'Passed' | 'Needs Review'
}

interface AssessmentHistoryProps {
  loading: boolean
  assessments: AssessmentItem[]
  onAddAssessment: (name: string, category: string, score: number) => void
  onDeleteAssessment: (id: number) => void
}

export function AssessmentHistory({
  loading,
  assessments,
  onAddAssessment,
  onDeleteAssessment
}: AssessmentHistoryProps): React.ReactElement {
  const [selectedId, setSelectedId] = React.useState<number | null>(null)
  const [sortField, setSortField] = React.useState<'name' | 'score' | 'date'>('date')
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('desc')

  const [newName, setNewName] = React.useState('')
  const [newCategory, setNewCategory] = React.useState('Frontend')
  const [newScore, setNewScore] = React.useState<number>(80)

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm animate-pulse space-y-4 h-64">
        <div className="h-4 bg-slate-100 rounded w-1/4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 bg-slate-100 rounded" />
          ))}
        </div>
      </div>
    )
  }

  const sortedAssessments = [...assessments].sort((a, b) => {
    const valA = a[sortField]
    const valB = b[sortField]
    if (typeof valA === 'string' && typeof valB === 'string') {
      return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA)
    }
    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortOrder === 'asc' ? valA - valB : valB - valA
    }
    return 0
  })

  const handleSort = (field: 'name' | 'score' | 'date') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return
    onAddAssessment(newName, newCategory, newScore)
    setNewName('')
    setNewScore(80)
  }

  const activeReport = assessments.find((a) => a.id === selectedId)

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Recent Assessment History</h3>
          <p className="text-xs text-slate-400 mt-0.5">Logs of your recently submitted readiness tests. Click a row to expand detailed reports.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 rounded-lg bg-slate-50 border border-slate-100 space-y-3">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Log New Test Result</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Assessment Name</label>
            <input
              type="text"
              required
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g., Docker Container Basics"
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Category</label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded bg-white text-slate-800 focus:outline-none focus:border-blue-500"
            >
              <option value="Frontend">Frontend</option>
              <option value="Databases">Databases</option>
              <option value="DevOps">DevOps</option>
              <option value="UI/UX">UI/UX</option>
              <option value="TypeScript">TypeScript</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Score (0 - 100)</label>
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                max="100"
                required
                value={newScore}
                onChange={(e) => setNewScore(Number(e.target.value))}
                className="w-20 text-xs px-3 py-2 border border-slate-200 rounded bg-white text-slate-800 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2 px-4 rounded transition-colors"
              >
                Add Log
              </button>
            </div>
          </div>
        </div>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-bold select-none">
              <th onClick={() => handleSort('name')} className="pb-3 font-semibold cursor-pointer hover:text-slate-700 transition-colors">
                Assessment Name {sortField === 'name' && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
              <th className="pb-3 font-semibold">Category</th>
              <th onClick={() => handleSort('score')} className="pb-3 font-semibold cursor-pointer hover:text-slate-700 transition-colors text-center">
                Score {sortField === 'score' && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
              <th onClick={() => handleSort('date')} className="pb-3 font-semibold cursor-pointer hover:text-slate-700 transition-colors">
                Date {sortField === 'date' && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
              <th className="pb-3 font-semibold text-center">Status</th>
              <th className="pb-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {sortedAssessments.map((item) => (
              <tr
                key={item.id}
                onClick={() => setSelectedId(selectedId === item.id ? null : item.id)}
                className={`cursor-pointer transition-colors ${
                  selectedId === item.id ? 'bg-blue-50/20' : 'hover:bg-slate-50/50'
                }`}
              >
                <td className="py-3 font-bold text-slate-800">{item.name}</td>
                <td className="py-3">
                  <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded uppercase">
                    {item.category}
                  </span>
                </td>
                <td className="py-3 font-bold text-slate-700 text-center">{item.score}%</td>
                <td className="py-3 text-slate-400 font-medium">{item.date}</td>
                <td className="py-3 text-center">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.status === 'Passed' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="py-3 text-right">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteAssessment(item.id)
                      if (selectedId === item.id) setSelectedId(null)
                    }}
                    className="text-red-500 hover:text-red-700 font-semibold text-[10px] uppercase tracking-wider hover:underline px-2 py-1"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {activeReport && (
        <div className="mt-4 p-4 border border-blue-100 bg-blue-50/10 rounded-lg space-y-2.5 relative animate-fade-in">
          <button
            type="button"
            onClick={() => setSelectedId(null)}
            className="absolute top-3 right-3 text-xs font-bold text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Assessment Report</h4>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Topic Title</span>
              <span className="font-semibold text-slate-700">{activeReport.name}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Category</span>
              <span className="font-semibold text-slate-700">{activeReport.category}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Achieved Score</span>
              <span className="font-bold text-slate-800">{activeReport.score}%</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Coach Advice</span>
              <span className="font-medium text-slate-500">
                {activeReport.score >= 80
                  ? 'Excellent score! You have proven strong proficiency in this area.'
                  : 'We recommend going through the CI/CD recommended sandbox to patch this skill gap.'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
