import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, KeyRound, ArrowRight, CheckCircle2, ChevronLeft } from 'lucide-react'

interface ForgotPasswordFlowProps {
  onBack: () => void
  onSuccess: () => void
}

export function ForgotPasswordFlow({ onBack, onSuccess }: ForgotPasswordFlowProps): React.ReactElement {
  const [step, setStep] = React.useState<1 | 2 | 3>(1)
  const [isLoading, setIsLoading] = React.useState(false)

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setStep(2)
    }, 1500)
  }

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setStep(3)
      setTimeout(() => {
        onSuccess()
      }, 2000)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <button 
        onClick={onBack}
        className="flex items-center text-sm font-semibold text-slate-400 hover:text-slate-200 transition-colors"
      >
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to login
      </button>

      <div className="relative min-h-[250px]">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute inset-0"
            >
              <div className="space-y-2 mb-6">
                <h2 className="text-2xl font-bold text-slate-100">Reset Password</h2>
                <p className="text-sm text-slate-400">Enter your email and we'll send you an OTP.</p>
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-4">
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

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 bg-[#6366F1] hover:bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_4px_14px_rgba(99,102,241,0.39)]"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Send OTP <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute inset-0"
            >
              <div className="space-y-2 mb-6">
                <h2 className="text-2xl font-bold text-slate-100">Enter OTP</h2>
                <p className="text-sm text-slate-400">We sent a 6-digit code to your email.</p>
              </div>

              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Verification Code
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <KeyRound className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      className="block w-full pl-10 pr-3 py-3 border border-slate-700/50 rounded-lg text-sm placeholder-slate-500 tracking-widest font-mono focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-colors bg-slate-950/80 text-slate-200 backdrop-blur-sm"
                      placeholder="000000"
                    />
                  </div>
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
                      Verify & Sign In <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center space-y-4 py-8"
            >
              <div className="w-16 h-16 bg-indigo-900/50 border border-[#6366F1]/30 rounded-full flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                <CheckCircle2 className="w-8 h-8 text-[#6366F1]" />
              </div>
              <h3 className="text-xl font-bold text-slate-100 text-center">Verified Successfully!</h3>
              <p className="text-sm text-slate-400 text-center max-w-xs">
                Your password has been reset. Redirecting you to the dashboard...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
