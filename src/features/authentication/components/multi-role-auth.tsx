import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GraduationCap, Briefcase } from 'lucide-react'
import { LoginForm } from './login-form'
import { RegisterAccordion } from './register-accordion'
import { ForgotPasswordFlow } from './forgot-password-flow'
import { useNavigate } from '@tanstack/react-router'

type AuthView = 'login' | 'register' | 'forgot-password'
type Role = 'student' | 'instructor'

export function MultiRoleAuth(): React.ReactElement {
  const [view, setView] = React.useState<AuthView>('login')
  const [role, setRole] = React.useState<Role>('student')

  const navigate = useNavigate()

  const handleSuccess = () => {
    navigate({ to: '/dashboard' })
  }

  return (
    <div className="min-h-screen bg-[#030712] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[60%] rounded-full bg-indigo-500/10 blur-[120px]" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="h-14 w-14 bg-gradient-to-br from-[#6366F1] to-[#4F46E5] rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.3)] flex items-center justify-center mb-3">
            <span className="text-white font-bold text-3xl">S</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">SkillSync AI</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Readiness Engine</p>
        </div>
      </div>

      <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-[#0B0F19]/80 backdrop-blur-xl py-8 px-4 shadow-[0_8px_30px_rgb(0,0,0,0.4)] sm:rounded-2xl sm:px-10 border border-slate-800/50">
          
          {/* Role Tabs - Only show when not in forgot password view */}
          {view !== 'forgot-password' && (
            <div className="flex space-x-1 bg-slate-900/80 p-1 rounded-xl mb-8 border border-slate-800/50">
              <button
                onClick={() => setRole('student')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  role === 'student' 
                    ? 'bg-[#6366F1] text-white shadow-md' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <GraduationCap className="w-4 h-4" /> Student
              </button>
              <button
                onClick={() => setRole('instructor')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  role === 'instructor' 
                    ? 'bg-[#6366F1] text-white shadow-md' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Briefcase className="w-4 h-4" /> Instructor
              </button>
            </div>
          )}

          {/* View Container */}
          <div className="relative">
            <AnimatePresence mode="wait">
              {view === 'login' && (
                <motion.div key="login"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <LoginForm 
                    role={role} 
                    onForgotPassword={() => setView('forgot-password')} 
                    onSuccess={handleSuccess} 
                  />
                  <div className="mt-6 text-center">
                    <p className="text-sm text-slate-400">
                      Don't have an account?{' '}
                      <button 
                        onClick={() => setView('register')}
                        className="font-semibold text-[#6366F1] hover:text-indigo-400 transition-colors"
                      >
                        Create one now
                      </button>
                    </p>
                  </div>
                </motion.div>
              )}

              {view === 'register' && (
                <motion.div key="register"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <RegisterAccordion onSuccess={handleSuccess} />
                  <div className="mt-6 text-center">
                    <p className="text-sm text-slate-400">
                      Already have an account?{' '}
                      <button 
                        onClick={() => setView('login')}
                        className="font-semibold text-[#6366F1] hover:text-indigo-400 transition-colors"
                      >
                        Sign in
                      </button>
                    </p>
                  </div>
                </motion.div>
              )}

              {view === 'forgot-password' && (
                <motion.div key="forgot-password"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <ForgotPasswordFlow 
                    onBack={() => setView('login')} 
                    onSuccess={handleSuccess} 
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        <p className="text-[10px] text-slate-400 text-center mt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  )
}
