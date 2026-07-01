import * as React from 'react'

interface StudyResourcesSliderProps {
  loading: boolean
}

export function StudyResourcesSlider({ loading }: StudyResourcesSliderProps): React.ReactElement {
  const [activeIndex, setActiveIndex] = React.useState(0)

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-xl border border-slate-100 animate-pulse h-28" />
    )
  }

  const tips = [
    { id: 1, title: 'SQL Tip', text: 'Write standard SQL keywords in UPPERCASE (e.g. SELECT, FROM) to improve query structure scanning.', category: 'Databases' },
    { id: 2, title: 'Type Safety Tip', text: 'Prefer Record<string, unknown> over using explicit any to ensure robust compiler validations.', category: 'TypeScript' },
    { id: 3, title: 'CI/CD Optimization', text: 'Add npm cache actions in your CI/CD scripts to speed up deployment pipeline executions.', category: 'DevOps' }
  ]

  const nextSlide = () => {
    setActiveIndex((prev) => (prev === tips.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? tips.length - 1 : prev - 1))
  }

  const activeTip = tips[activeIndex]

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-100 hover:shadow-sm transition-shadow duration-200 flex flex-col justify-between h-36">
      <div className="flex justify-between items-center">
        <span className="text-[9px] uppercase font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
          {activeTip.category}
        </span>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={prevSlide}
            className="h-5 w-5 flex items-center justify-center rounded bg-slate-50 border border-slate-100 text-xs font-bold text-slate-500 hover:bg-slate-100"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={nextSlide}
            className="h-5 w-5 flex items-center justify-center rounded bg-slate-50 border border-slate-100 text-xs font-bold text-slate-500 hover:bg-slate-100"
          >
            ›
          </button>
        </div>
      </div>

      <div className="my-2 flex-1 flex flex-col justify-center">
        <h5 className="text-[11px] font-bold text-slate-800 leading-tight">{activeTip.title}</h5>
        <p className="text-[10px] text-slate-500 mt-1 leading-relaxed line-clamp-2">
          {activeTip.text}
        </p>
      </div>

      {/* Slide Indicators */}
      <div className="flex justify-center gap-1.5 pt-1">
        {tips.map((_, idx) => (
          <span
            key={idx}
            className={`h-1.5 w-1.5 rounded-full transition-all ${
              activeIndex === idx ? 'bg-blue-600 w-3' : 'bg-slate-200'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
