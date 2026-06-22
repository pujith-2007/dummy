import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { GraduationCap, ArrowRight, Lock, Mail, Sparkles } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/auth/login/')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate login for access
    localStorage.setItem('isAuthenticated', 'true')
    navigate({ to: '/dashboard' })
  }

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-700 flex flex-col justify-center items-center px-6 py-12 overflow-hidden font-sans antialiased">
      {/* Background Mesh Gradients */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[100px]" />
        <div className="absolute bottom-[20%] right-[20%] w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-[100px]" />
      </div>

      {/* Glassmorphic Login Card */}
      <div className="relative z-10 w-full max-w-md bg-white border border-slate-200/80 rounded-2xl p-8 shadow-card-subtle">
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 mb-4">
            <GraduationCap className="w-8 h-8" />
          </div>
          <span className="text-xl font-bold font-heading text-slate-900 tracking-tight">
            SkillSync <span className="text-indigo-600 font-normal">Analytics</span>
          </span>
          <p className="text-sm text-slate-500 mt-2 text-center leading-relaxed">Sign in to coordinate cohorts and track readiness.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 font-sans">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="professor@university.edu"
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500/30 text-sm focus:outline-none transition-all placeholder:text-slate-400 text-slate-805"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 font-sans">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-450 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500/30 text-sm focus:outline-none transition-all placeholder:text-slate-400 text-slate-805"
              />
            </div>
          </div>

          <button
            type="submit"
            className="group w-full h-11 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-hover-glow flex items-center justify-center gap-2 cursor-pointer text-sm"
          >
            Authenticate Credentials
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 duration-200" />
          </button>
        </form>

        <div className="mt-8 border-t border-slate-100 pt-6 text-center text-xs text-slate-500">
          <span className="flex items-center justify-center gap-1.5 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
            Click login with any inputs to view simulation.
          </span>
        </div>
      </div>

      {/* Back to Home Link */}
      <button
        onClick={() => navigate({ to: '/home' })}
        className="relative z-10 mt-6 text-xs text-slate-500 hover:text-indigo-600 transition-colors font-semibold cursor-pointer"
      >
        ← Return to Landing Page
      </button>
    </div>
  )
}
