import * as React from 'react'
import { motion } from 'framer-motion'
import { User, Phone, Mail, ArrowRight, CheckCircle2 } from 'lucide-react'

interface RegisterAccordionProps {
  onSuccess: () => void
}

export function RegisterAccordion({ onSuccess }: RegisterAccordionProps): React.ReactElement {
  const [step, setStep] = React.useState<1 | 2>(1)
  const [isLoading, setIsLoading] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setStep(2)
      setTimeout(() => {
        onSuccess()
      }, 2000)
    }, 1500)
  }

  if (step === 2) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center space-y-4 py-8"
      >
        <div className="w-16 h-16 bg-indigo-900/50 border border-[#6366F1]/30 rounded-full flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
          <CheckCircle2 className="w-8 h-8 text-[#6366F1]" />
        </div>
        <h3 className="text-xl font-bold text-slate-100 text-center">Account Created Successfully!</h3>
        <p className="text-sm text-slate-400 text-center max-w-xs">
          Welcome aboard! Redirecting you to the dashboard...
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-100">Create an Account</h2>
        <p className="text-sm text-slate-400">Join us to start learning today.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-slate-500" />
            </div>
            <input
              type="text"
              required
              className="block w-full pl-10 pr-3 py-3 border border-slate-700/50 rounded-lg text-sm placeholder-slate-500 focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-colors bg-slate-950/80 text-slate-200 backdrop-blur-sm"
              placeholder="John Doe"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-slate-500" />
            </div>
            <input
              type="email"
              required
              className="block w-full pl-10 pr-3 py-3 border border-slate-700/50 rounded-lg text-sm placeholder-slate-500 focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-colors bg-slate-950/80 text-slate-200 backdrop-blur-sm"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            Phone Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-slate-500" />
            </div>
            <input
              type="tel"
              required
              className="block w-full pl-10 pr-3 py-3 border border-slate-700/50 rounded-lg text-sm placeholder-slate-500 focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-colors bg-slate-950/80 text-slate-200 backdrop-blur-sm"
              placeholder="+1 (555) 000-0000"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 bg-[#6366F1] hover:bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2 shadow-[0_4px_14px_rgba(99,102,241,0.39)]"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Create Account <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </motion.div>
  )
}
