import * as React from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, Smartphone, ArrowRight } from 'lucide-react'

interface LoginFormProps {
  role: 'student' | 'instructor'
  onForgotPassword: () => void
  onSuccess: () => void
}

export function LoginForm({ role, onForgotPassword, onSuccess }: LoginFormProps): React.ReactElement {
  const [loginMethod, setLoginMethod] = React.useState<'password' | 'otp'>('password')
  const [isLoading, setIsLoading] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate login
    setTimeout(() => {
      setIsLoading(false)
      onSuccess()
    }, 1500)
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-100">
          Welcome back, {role === 'student' ? 'Student' : 'Instructor'}!
        </h2>
        <p className="text-sm text-slate-400">
          Please enter your details to sign in.
        </p>
      </div>

      <div className="flex bg-slate-900/80 p-1 rounded-lg border border-slate-800/50">
        <button
          onClick={() => setLoginMethod('password')}
          className={`flex-1 text-sm font-medium py-2 rounded-md transition-all ${
            loginMethod === 'password' ? 'bg-[#0B0F19] text-slate-100 shadow-sm border border-slate-700/50' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Password
        </button>
        <button
          onClick={() => setLoginMethod('otp')}
          className={`flex-1 text-sm font-medium py-2 rounded-md transition-all ${
            loginMethod === 'otp' ? 'bg-[#0B0F19] text-slate-100 shadow-sm border border-slate-700/50' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Sign in with OTP
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              {loginMethod === 'password' ? 'Email Address' : 'Phone Number'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {loginMethod === 'password' ? (
                  <Mail className="h-5 w-5 text-slate-500" />
                ) : (
                  <Smartphone className="h-5 w-5 text-slate-500" />
                )}
              </div>
              <input
                type={loginMethod === 'password' ? 'email' : 'tel'}
                required
                className="block w-full pl-10 pr-3 py-3 border border-slate-700/50 rounded-lg text-sm placeholder-slate-500 focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-colors bg-slate-950/80 text-slate-200 backdrop-blur-sm"
                placeholder={loginMethod === 'password' ? 'you@example.com' : '+1 (555) 000-0000'}
              />
            </div>
          </div>

          {loginMethod === 'password' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="text-xs font-semibold text-[#6366F1] hover:text-indigo-400"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="password"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-slate-700/50 rounded-lg text-sm placeholder-slate-500 focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-colors bg-slate-950/80 text-slate-200 backdrop-blur-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 bg-[#6366F1] hover:bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_4px_14px_rgba(99,102,241,0.39)]"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Sign In <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-800/50" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-[#0B0F19] text-slate-500">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <button type="button" className="flex justify-center items-center py-2.5 border border-slate-800/50 bg-slate-950/40 rounded-lg hover:bg-slate-800 transition-colors">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
        </button>
        <button type="button" className="flex justify-center items-center py-2.5 border border-slate-800/50 bg-slate-950/40 rounded-lg hover:bg-slate-800 transition-colors text-[#1877F2]">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </button>
        <button type="button" className="flex justify-center items-center py-2.5 border border-slate-800/50 bg-slate-950/40 rounded-lg hover:bg-slate-800 transition-colors text-[#1DA1F2]">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
          </svg>
        </button>
      </div>
    </motion.div>
  )
}
