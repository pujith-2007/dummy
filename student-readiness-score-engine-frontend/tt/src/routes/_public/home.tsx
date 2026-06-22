import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { 
  GraduationCap, 
  TrendingUp, 
  Compass, 
  BarChart3, 
  Sparkles,
  ShieldAlert,
  Zap,
  Laptop,
  Upload,
  BookOpen,
  Star,
  CheckCircle2,
  FileText,
  HelpCircle,
  Database,
  Cpu,
  Users,
  Network,
  ChevronDown,
  Activity,
  Award,
  RefreshCw,
  Sliders
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'

export const Route = createFileRoute('/_public/home')({
  component: HomePage,
})

// Custom hook for count-up animation
function useCounter(target: number, duration: number = 1000, active: boolean = false) {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    if (!active) return
    let startTimestamp: number | null = null
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)
      setCount(Math.floor(progress * target))
      if (progress < 1) {
        window.requestAnimationFrame(step)
      } else {
        setCount(target)
      }
    }
    window.requestAnimationFrame(step)
  }, [target, duration, active])
  
  return count
}

// Reusable 3D Tilt Card Component
interface TiltCardProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

function TiltCard({ children, className = '', delay = 0 }: TiltCardProps) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useTransform(y, [-0.5, 0.5], [8, -8])
  const rotateY = useTransform(x, [-0.5, 0.5], [-8, 8])

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const relativeX = (event.clientX - rect.left) / width - 0.5
    const relativeY = (event.clientY - rect.top) / height - 0.5
    x.set(relativeX)
    y.set(relativeY)
  }

  function handleMouseLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Scroll Reveal Wrapper using Framer Motion
interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right'
}

function ScrollReveal({ children, className = '', delay = 0, direction = 'up' }: ScrollRevealProps) {
  const offset = {
    up: { y: 15, x: 0 },
    down: { y: -15, x: 0 },
    left: { x: 15, y: 0 },
    right: { x: -15, y: 0 }
  }[direction]

  return (
    <motion.div
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-10px' }}
      transition={{ duration: 0.35, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function HomePage() {
  const navigate = useNavigate()
  
  // Navigation transitions
  const handleEnterDashboard = (portalType: 'student' | 'instructor' = 'student') => {
    localStorage.setItem('isAuthenticated', 'true')
    
    const overlay = document.getElementById('route-transition-overlay')
    if (overlay) {
      overlay.classList.remove('opacity-0', 'pointer-events-none')
      overlay.classList.add('opacity-100')
      setTimeout(() => {
        navigate({ to: portalType === 'student' ? '/portal' : '/dashboard' })
      }, 450)
    } else {
      navigate({ to: portalType === 'student' ? '/portal' : '/dashboard' })
    }
  }

  // Scroll triggering stats
  const [statsInView, setStatsInView] = useState(false)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    if (statsRef.current) {
      observer.observe(statsRef.current)
    }
    return () => observer.disconnect()
  }, [])

  const countStudents = useCounter(15000, 1200, statsInView)
  const countSkills = useCounter(250, 1200, statsInView)
  const countAccuracy = useCounter(98, 1200, statsInView)
  const countPaths = useCounter(120, 1200, statsInView)

  // Magnetic final button properties
  const finalCtaRef = useRef<HTMLButtonElement>(null)
  const [magneticStyle, setMagneticStyle] = useState<{ transform: string }>({ transform: 'translate3d(0px, 0px, 0px)' })

  const handleMagneticMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = finalCtaRef.current
    if (!btn) return
    const rect = btn.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    setMagneticStyle({ transform: `translate3d(${x * 0.35}px, ${y * 0.35}px, 0px)` })
  }

  const handleMagneticLeave = () => {
    setMagneticStyle({ transform: 'translate3d(0px, 0px, 0px)' })
  }

  // Mockup view switcher
  const [previewTab, setPreviewTab] = useState<'student' | 'instructor'>('student')

  // Curriculum tracker switcher
  const [activeTrack, setActiveTrack] = useState<'frontend' | 'backend' | 'devops' | 'ai'>('frontend')

  // FAQ Accordion State
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null)

  const toggleFaq = (idx: number) => {
    setOpenFaqIdx(openFaqIdx === idx ? null : idx)
  }

  // Simulated Telemetry Activity Log Schema
  interface AssessmentEvent {
    id: string
    student: string
    university: string
    track: string
    action: string
    detail: string
    delta: string
    isPositive: boolean
    timestamp: string
  }

  // Simulated Real-Time Activity Stream state
  const [activities, setActivities] = useState<AssessmentEvent[]>([
    {
      id: 'init-1',
      student: 'Aria Sterling',
      university: 'Stanford University',
      track: 'Frontend Engineering',
      action: 'Completed React 19 Domain Quiz',
      detail: 'Scored 94% on Async Suspense structures',
      delta: '+4.5%',
      isPositive: true,
      timestamp: 'Just now'
    },
    {
      id: 'init-2',
      student: 'Devon Vance',
      university: 'MIT',
      track: 'Backend Engineering',
      action: 'Parsed Portfolio Projects',
      detail: 'Matched Prisma/Postgres schemas with 91% similarity',
      delta: '+6.2%',
      isPositive: true,
      timestamp: '2m ago'
    },
    {
      id: 'init-3',
      student: 'Liam Vance',
      university: 'UC Berkeley',
      track: 'DevOps & Infra',
      action: 'Verified Docker Certification',
      detail: 'Loaded on-chain blockchain registry signature',
      delta: 'Verified',
      isPositive: true,
      timestamp: '5m ago'
    },
    {
      id: 'init-4',
      student: 'Marcus Miller',
      university: 'Georgia Tech',
      track: 'AI & Data Systems',
      action: 'Completed LLM Proctor Assessment',
      detail: 'Cosine similarity score calibrated on-chain',
      delta: '+3.8%',
      isPositive: true,
      timestamp: '12m ago'
    }
  ])

  useEffect(() => {
    const studentNames = ['Sophia Lin', 'Ethan Hall', 'Olivia Martinez', 'Nathan Wright', 'Chloe Smith', 'Lucas Jones', 'Mia Davis', 'Alexander Wang']
    const universities = ['University of Michigan', 'UT Austin', 'Carnegie Mellon', 'University of Washington', 'Vanderbilt', 'CalTech', 'Georgia Tech', 'Cornell']
    const tracks = ['Frontend Engineering', 'Backend Engineering', 'DevOps & Infra', 'AI & Data Systems']
    const actions = [
      { action: 'Uploaded CV PDF', detail: 'NLP pipeline extracted 18 skills tags', delta: '+2.8%', isPositive: true },
      { action: 'Completed Quiz: Node/Express', detail: 'Proctored score: 88% on Middleware API limits', delta: '+3.5%', isPositive: true },
      { action: 'Synced GitHub Portfolio', detail: 'Scanned 12 TypeScript repositories & PR frequency', delta: '+5.0%', isPositive: true },
      { action: 'Completed Quiz: Vector DBs', detail: 'Scored 92% on Pinecone similarity lookups', delta: '+4.0%', isPositive: true },
      { action: 'Resolved Skill Deficit', detail: 'Completed Dynamic Routing curriculum roadmap item', delta: '+2.0%', isPositive: true },
      { action: 'Verified Credentials Seal', detail: 'Secure cryptographic block credentials issued', delta: 'Authenticated', isPositive: true }
    ]

    const interval = setInterval(() => {
      const randomName = studentNames[Math.floor(Math.random() * studentNames.length)]
      const randomUni = universities[Math.floor(Math.random() * universities.length)]
      const randomTrack = tracks[Math.floor(Math.random() * tracks.length)]
      const randomAct = actions[Math.floor(Math.random() * actions.length)]
      
      const newEvent: AssessmentEvent = {
        id: Math.random().toString(36).substr(2, 9),
        student: randomName,
        university: randomUni,
        track: randomTrack,
        action: randomAct.action,
        detail: randomAct.detail,
        delta: randomAct.delta,
        isPositive: randomAct.isPositive,
        timestamp: 'Just now'
      }

      setActivities((prev) => {
        // Shift timestamps of existing items
        const updated = prev.map(ev => {
          if (ev.timestamp === 'Just now') return { ...ev, timestamp: '1m ago' }
          if (ev.timestamp.endsWith('m ago')) {
            const mins = parseInt(ev.timestamp)
            return { ...ev, timestamp: `${mins + 1}m ago` }
          }
          return ev
        })
        return [newEvent, ...updated.slice(0, 4)]
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  // Career Readiness Calculator State
  const [calcProjects, setCalcProjects] = useState<number>(3)
  const [calcQuizScore, setCalcQuizScore] = useState<number>(75)
  const [calcResumeMatch, setCalcResumeMatch] = useState<number>(70)
  const [calcTargetRole, setCalcTargetRole] = useState<'frontend' | 'backend' | 'devops' | 'ai'>('frontend')

  // Calculate readiness score
  const estimatedReadiness = Math.min(
    100,
    Math.round(((calcResumeMatch * 0.3) + (calcQuizScore * 0.4) + (Math.min(10, calcProjects) * 10 * 0.3)) * 10) / 10
  )

  // Derive target placement details
  const getReadinessLevel = (score: number) => {
    if (score >= 90) return { name: 'Platinum Plus', color: 'text-emerald-600 bg-emerald-50 border-emerald-100', sal: '$120k - $160k+', eligibility: 'Top tier AI labs, Vercel, Stripe, Google shortlists' }
    if (score >= 80) return { name: 'Gold Verified', color: 'text-[#C7A86D] bg-[#E2B86C]/10 border-[#E2B86C]/20', sal: '$90k - $120k', eligibility: 'Mid-level SWE, prominent startup hubs, tech consultants' }
    if (score >= 70) return { name: 'Silver Qualified', color: 'text-indigo-600 bg-indigo-50 border-indigo-100', sal: '$70k - $90k', eligibility: 'Associate developer, QA engineers, tech support, internships' }
    return { name: 'Bronze Alert', color: 'text-rose-600 bg-rose-50 border-rose-100', sal: '$50k - $70k', eligibility: 'Requires prompt remediation curricula to unlock hiring pools' }
  }

  const readinessInfo = getReadinessLevel(estimatedReadiness)

  return (
    <div className="relative min-h-screen bg-[#FDFBF7] text-[#2d3748] overflow-x-hidden font-sans antialiased selection:bg-[#E2B86C]/30 selection:text-slate-900">
      
      {/* Page transition veil overlay */}
      <div 
        id="route-transition-overlay"
        className="fixed inset-0 bg-[#050507] z-[9999] opacity-0 pointer-events-none transition-opacity duration-500 ease-in-out flex flex-col items-center justify-center text-white"
      >
        <div className="flex flex-col items-center space-y-4">
          <GraduationCap className="w-16 h-16 text-[#E2B86C] animate-pulse" />
          <span className="text-xl font-bold font-heading tracking-wide">Syncing Student Registry Credentials...</span>
          <div className="w-48 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/10">
            <div className="h-full bg-gradient-to-r from-[#E2B86C] to-indigo-500 w-1/3 animate-infinite-loading" />
          </div>
        </div>
      </div>

      {/* Embedded CSS Keyframes */}
      <style>{`
        @keyframes infinite-loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
        .animate-infinite-loading {
          animation: infinite-loading 1.8s ease-in-out infinite;
        }
      `}</style>

      {/* Background spotlights & Floating blobs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{
            x: [0, 40, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[2%] right-[5%] w-[45vw] h-[45vw] rounded-full bg-[radial-gradient(circle,rgba(139,150,114,0.12),transparent_65%)] blur-[80px]" 
        />
        <motion.div 
          animate={{
            x: [0, -30, 0],
            y: [0, 30, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle,rgba(226,184,108,0.15),transparent_60%)] blur-[90px]" 
        />
        <div className="absolute bottom-[15%] right-[-10%] w-[55vw] h-[55vw] rounded-full bg-[radial-gradient(circle,rgba(240,230,200,0.25),transparent_65%)] blur-[100px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(139,150,114,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(139,150,114,0.035)_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      {/* Sticky Header */}
      <header className="relative z-50 border-b border-[#E2B86C]/10 bg-[#FDFBF7]/85 backdrop-blur-md sticky top-0 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-slate-900 text-[#E2B86C] shadow-md border border-[#E2B86C]/10">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="text-base font-extrabold tracking-tight text-slate-900 font-heading">
              Student Readiness <span className="text-[#E2B86C] font-normal">Engine</span>
            </span>
          </div>

          {/* Links */}
          <nav className="hidden lg:flex items-center gap-8 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            <a href="#features" className="hover:text-slate-900 transition-colors duration-200">Features</a>
            <a href="#comparative-flows" className="hover:text-slate-900 transition-colors duration-200">User Portals</a>
            <a href="#curriculum-tracks" className="hover:text-slate-900 transition-colors duration-200">Syllabus</a>
            <a href="#engine-architecture" className="hover:text-slate-900 transition-colors duration-200">AI Core</a>
            <a href="#readiness-matrix" className="hover:text-slate-900 transition-colors duration-200">Matrix</a>
            <a href="#faq" className="hover:text-slate-900 transition-colors duration-200">FAQ</a>
          </nav>

          {/* Nav Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleEnterDashboard('instructor')}
              className="hidden sm:inline-block text-xs font-bold uppercase tracking-wider text-slate-550 hover:text-slate-900 transition-colors duration-200 cursor-pointer"
            >
              Instructor view
            </button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleEnterDashboard('student')}
              className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 text-white hover:bg-slate-800 hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              Enter Dashboard
            </motion.button>
          </div>

        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 lg:pt-24 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Left Hero */}
        <div className="lg:col-span-6 space-y-8 text-left">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#E2B86C]/20 bg-[#E2B86C]/5 text-xs text-slate-700 font-bold shadow-sm font-heading backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C7A86D] animate-pulse" />
            PLACEMENT EVALUATION HUB
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 font-heading"
          >
            Know Your Career <br />
            Readiness <span className="text-[#C7A86D] underline decoration-[#E2B86C]/40 decoration-wavy decoration-2">Before</span> <br />
            Recruiters Do.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-lg text-slate-600 font-light leading-relaxed max-w-xl"
          >
            SRE scans technical capabilities, exposes curriculum gaps, and compiles placeability scores using real-time mock indices, enabling universities to prepare candidates efficiently.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap gap-4 pt-2"
          >
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleEnterDashboard('student')}
              className="px-8 py-4 bg-slate-900 text-white hover:bg-slate-800 font-extrabold rounded-2xl transition-all duration-200 text-sm tracking-wide shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              Start Assessment
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleEnterDashboard('student')}
              className="px-8 py-4 bg-white text-slate-800 hover:bg-slate-50 font-extrabold rounded-2xl transition-all duration-200 text-sm tracking-wide flex items-center justify-center gap-2 cursor-pointer border border-[#E2B86C]/20 shadow-sm"
            >
              Enter Dashboard →
            </motion.button>
          </motion.div>
        </div>

        {/* Right Hero (Floating Profile Preview with 3D Tilt) */}
        <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
          <div className="absolute w-72 h-72 rounded-full bg-[#E2B86C]/5 blur-[80px] -z-10" />
          
          <TiltCard 
            delay={0.2}
            className="w-full max-w-md bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-[0_25px_60px_rgba(128,128,0,0.06)] border border-[#E2B86C]/15 z-10 space-y-6 cursor-default"
          >
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#C7A86D] block">Candidate Scorecard</span>
                <span className="text-lg font-bold text-slate-900 block mt-0.5 font-heading">Devon Vance</span>
              </div>
              <span className="text-xs px-3 py-1 rounded-lg font-bold bg-[#E2B86C]/10 text-[#E2B86C] border border-[#E2B86C]/20 shadow-inner">
                88.2% READY
              </span>
            </div>

            <div className="grid grid-cols-2 gap-6 items-center">
              <div className="flex flex-col items-center py-4 bg-white/50 rounded-2xl border border-slate-100 relative shadow-inner">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle cx="48" cy="48" r="40" stroke="#F1F5F9" strokeWidth="6" fill="transparent" />
                  <motion.circle cx="48" cy="48" r="40" stroke="#C7A86D" strokeWidth="6" fill="transparent"
                    initial={{ strokeDashoffset: 251.2 }}
                    animate={{ strokeDashoffset: 251.2 - (251.2 * 88.2) / 100 }}
                    transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                    strokeDasharray="251.2"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute top-12 flex flex-col items-center">
                  <span className="text-lg font-black font-heading text-slate-900">88.2%</span>
                </div>
                <span className="text-[9px] font-bold text-slate-400 uppercase mt-3">Readiness Index</span>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-slate-900 rounded-xl text-white border border-[#E2B86C]/10 shadow-md">
                  <span className="text-[9px] uppercase tracking-wider font-bold text-[#E2B86C] block">Placement Probability</span>
                  <span className="text-lg font-extrabold block mt-0.5 font-heading text-[#E2B86C]">91% High</span>
                </div>
                <div className="p-4 bg-[#FDFBF7] rounded-xl border border-slate-100">
                  <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block">Eligible placement roles</span>
                  <span className="text-xs font-bold text-slate-800 block mt-0.5 font-heading truncate">Frontend Engineer, DevOps</span>
                </div>
              </div>
            </div>

            {/* Tech metrics */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-500 font-sans">Core Skill Match Accuracy</span>
                <span className="font-semibold text-slate-800">14 of 16 Mastered</span>
              </div>
              <div className="space-y-2">
                {[
                  { name: 'TypeScript Advanced Type Systems', score: 94 },
                  { name: 'System Performance Optimization', score: 86 },
                ].map((skill, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#FDFBF7] border border-slate-100 flex justify-between items-center hover:bg-slate-50 transition-colors duration-200">
                    <span className="text-xs text-slate-700 truncate max-w-[240px] font-medium">{skill.name}</span>
                    <span className="text-xs font-mono font-semibold text-[#C7A86D]">{skill.score}%</span>
                  </div>
                ))}
              </div>
            </div>

          </TiltCard>
        </div>
      </section>

      {/* Recruiter Logos / Trusted Partners Strip */}
      <section className="relative z-10 py-10 border-t border-slate-200/50 bg-[#FAF8F5]/30">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-6 font-sans">Trusted by Recruiting Teams at</p>
          <div className="flex flex-wrap items-center justify-center gap-12 sm:gap-20 opacity-40 grayscale hover:opacity-75 transition-opacity duration-300">
            <span className="text-sm font-extrabold font-heading tracking-wider">STRIPE</span>
            <span className="text-sm font-extrabold font-heading tracking-wider">GOOGLE</span>
            <span className="text-sm font-extrabold font-heading tracking-wider">META</span>
            <span className="text-sm font-extrabold font-heading tracking-wider">AMAZON</span>
            <span className="text-sm font-extrabold font-heading tracking-wider">VERCEL</span>
            <span className="text-sm font-extrabold font-heading tracking-wider">AIRBNB</span>
          </div>
        </div>
      </section>

      {/* Trusted Statistics Section */}
      <section ref={statsRef} className="relative z-10 border-y border-[#E2B86C]/15 bg-[#F5F2EA]/40 py-16 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          {[
            { value: statsInView ? countStudents.toLocaleString() : '0', label: 'Students Assessed', highlight: false },
            { value: statsInView ? countSkills : '0', label: 'Skills Evaluated', highlight: true },
            { value: (statsInView ? countAccuracy : '0') + '%', label: 'Prediction Accuracy', highlight: false },
            { value: statsInView ? countPaths : '0', label: 'Career Paths', highlight: true }
          ].map((stat, idx) => (
            <div key={idx} className="space-y-2">
              <div className={`text-4xl sm:text-5xl font-black font-heading tracking-tight ${stat.highlight ? 'text-[#C7A86D]' : 'text-slate-900'}`}>
                {stat.value}+
              </div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block font-sans">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Live Verification Activity Stream Section */}
      <section className="relative z-10 py-20 bg-[#FAF8F5]/50 border-b border-[#E2B86C]/10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Context & Stats */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#E2B86C]/20 bg-[#E2B86C]/5 text-xs text-slate-700 font-bold font-heading backdrop-blur-md">
              LIVE ENGINE TELEMETRY
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 font-heading tracking-tight leading-tight">
              Real-Time Verification & Audit Stream
            </h2>
            <p className="text-slate-655 font-light text-sm leading-relaxed">
              SRE continuously monitors student achievements, code commits, and proctored quizzes. The stream on the right displays live assessment telemetry processed across partner campuses.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Parsing Latency</span>
                <span className="text-lg font-black text-slate-900 font-heading block mt-0.5">&lt; 850ms</span>
              </div>
              <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Block Generation</span>
                <span className="text-lg font-black text-[#C7A86D] font-heading block mt-0.5">1.2s avg</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
              <span>Streaming active webhooks from 12+ university nodes</span>
            </div>
          </div>

          {/* Right Column: Interactive Stream Logs */}
          <div className="lg:col-span-7">
            <div className="p-6 rounded-3xl border border-[#E2B86C]/15 bg-white shadow-lg space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 font-sans">Verification Logs</span>
                <span className="text-[10px] text-[#C7A86D] font-mono font-semibold flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 animate-spin" /> Live Updates
                </span>
              </div>

              <div className="space-y-3 max-h-[350px] overflow-hidden relative">
                <AnimatePresence initial={false}>
                  {activities.map((act) => (
                    <motion.div
                      key={act.id}
                      initial={{ opacity: 0, y: -20, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, x: 50 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="p-3.5 rounded-xl border border-slate-100 bg-[#FCFAF6] hover:bg-slate-50 transition-colors duration-200 flex justify-between items-start text-left overflow-hidden"
                    >
                      <div className="flex gap-3 items-start">
                        <div className="p-2.5 rounded-lg bg-slate-900 text-[#E2B86C] shrink-0">
                          {act.action.includes('Quiz') ? (
                            <Activity className="w-4 h-4" />
                          ) : act.action.includes('Resume') || act.action.includes('CV') ? (
                            <FileText className="w-4 h-4" />
                          ) : act.action.includes('GitHub') || act.action.includes('Portfolio') ? (
                            <Cpu className="w-4 h-4" />
                          ) : (
                            <Award className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-slate-800">{act.student}</span>
                            <span className="text-[9px] px-2 py-0.5 bg-slate-200/60 rounded text-slate-500 font-medium">{act.university}</span>
                          </div>
                          <span className="text-xs text-[#C7A86D] font-semibold block mt-0.5">{act.action}</span>
                          <span className="text-[11px] text-slate-400 block font-light leading-relaxed mt-0.5">{act.detail}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0 flex flex-col items-end space-y-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          act.delta === 'Verified' || act.delta === 'Authenticated'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            : 'bg-[#E2B86C]/10 text-[#C7A86D] border border-[#E2B86C]/20'
                        }`}>
                          {act.delta}
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono">{act.timestamp}</span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portal Flow Comparison */}
      <section id="comparative-flows" className="relative z-10 py-28 bg-[#FDFBF7] border-b border-[#E2B86C]/10">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#E2B86C]/20 bg-[#E2B86C]/5 text-xs text-slate-700 font-bold font-heading backdrop-blur-md">
              INTERACTION ECOSYSTEM
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 font-heading tracking-tight">
              Two Tailored Environments, One Unified Index
            </h2>
            <p className="text-slate-600 font-light text-base leading-relaxed">
              Explore how the platform bifurcates tools between candidate self-improvement and instructor management tracking.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Student Portal Card */}
            <TiltCard className="p-8 rounded-3xl border border-[#E2B86C]/15 bg-white/60 hover:shadow-[0_20px_50px_rgba(128,128,0,0.06)] transition-all duration-500 space-y-6 flex flex-col justify-between" delay={0.1}>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-slate-900 text-[#E2B86C]">
                      <Users className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold font-heading text-slate-900">Student Portal Flow</h3>
                  </div>
                  <span className="text-[10px] font-bold px-3 py-1 rounded-md uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">FOR CANDIDATES</span>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed font-light">
                  Candidates leverage automated tools to evaluate placement chances, practice technical domains, and authenticate qualifications.
                </p>
                <div className="space-y-4">
                  {[
                    { title: 'Resume Parsing & Score Boost', text: 'Upload portfolios to extract keywords and lift the base placement readiness index locally.' },
                    { title: 'Practice Quizzes Engine', text: 'Take short evaluations mapped to generics, caching, databases, and receive index adjustments.' },
                    { title: 'Competency Credentials Hub', text: 'Unlocks a downloadable secure blockchain certificate once rating reaches 85.0%.' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-3.5 items-start">
                      <CheckCircle2 className="w-4 h-4 text-[#C7A86D] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">{item.title}</span>
                        <span className="text-xs text-slate-500 block mt-0.5 leading-relaxed">{item.text}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleEnterDashboard('student')}
                className="w-full py-4 mt-6 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-200 cursor-pointer"
              >
                Access Student Portal
              </motion.button>
            </TiltCard>

            {/* Instructor Console Card */}
            <TiltCard className="p-8 rounded-3xl border border-[#E2B86C]/15 bg-white/60 hover:shadow-[0_20px_50px_rgba(128,128,0,0.06)] transition-all duration-500 space-y-6 flex flex-col justify-between" delay={0.2}>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-[#E2B86C]/20 to-[#E2B86C]/5 text-[#E2B86C] border border-[#E2B86C]/20">
                      <Laptop className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold font-heading text-slate-900">Instructor Console Flow</h3>
                  </div>
                  <span className="text-[10px] font-bold px-3 py-1 rounded-md uppercase tracking-wider bg-[#E2B86C]/10 text-[#C7A86D] border border-[#E2B86C]/20">FOR COORDINATORS</span>
                </div>
                <p className="text-sm text-slate-550 leading-relaxed font-light">
                  Coordinators obtain absolute metrics overview of student cohorts, setup examinations, and handle skill gap remediations.
                </p>
                <div className="space-y-4">
                  {[
                    { title: 'Cohort Readiness Statistics Roster', text: 'Audit recent profiles, review individual indexes, and filter flags requiring support.' },
                    { title: 'Custom Assessments Constructor', text: 'Create exams targeting Docker, TypeScript, React 19, and assign them directly.' },
                    { title: 'AI Configuration Control Sliders', text: 'Calibrate target indexes, auto-remediation triggers, and audit strictness.' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-3.5 items-start">
                      <CheckCircle2 className="w-4 h-4 text-[#C7A86D] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">{item.title}</span>
                        <span className="text-xs text-slate-500 block mt-0.5 leading-relaxed">{item.text}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleEnterDashboard('instructor')}
                className="w-full py-4 mt-6 bg-[#FDFBF7] hover:bg-slate-50 text-slate-900 border border-[#E2B86C]/20 font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-200 cursor-pointer"
              >
                Access Coordinator Console
              </motion.button>
            </TiltCard>

          </div>
        </div>
      </section>

      {/* NEW SECTION: Interactive Curriculum Tracks Syllabus */}
      <section id="curriculum-tracks" className="relative z-10 py-24 border-b border-slate-200/50 bg-[#FAF8F5]/30">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#E2B86C]/20 bg-[#E2B86C]/5 text-xs text-slate-700 font-bold font-heading backdrop-blur-md">
              CURRICULUM STACK
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading tracking-tight">
              Supported Placement Preparation Tracks
            </h2>
            <p className="text-slate-600 font-light text-base leading-relaxed">
              Verify your capability profiles across four specific placement streams generated by the SRE pipeline.
            </p>

            {/* Track Switcher Tabs */}
            <div className="flex flex-wrap justify-center gap-2 pt-6">
              {[
                { id: 'frontend', label: 'Frontend Engineering' },
                { id: 'backend', label: 'Backend Engineering' },
                { id: 'devops', label: 'DevOps & Infrastructure' },
                { id: 'ai', label: 'AI & Data Systems' }
              ].map((track) => (
                <button
                  key={track.id}
                  onClick={() => setActiveTrack(track.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all duration-200 cursor-pointer ${
                    activeTrack === track.id
                      ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                      : 'bg-white border-slate-200 text-slate-500 hover:text-slate-950'
                  }`}
                >
                  {track.label}
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* Tab content cards */}
          <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-3xl p-8 shadow-[0_20px_50px_rgba(128,128,0,0.03)]">
            <AnimatePresence mode="wait">
              {activeTrack === 'frontend' && (
                <motion.div
                  key="frontend"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left"
                >
                  <div className="space-y-4">
                    <span className="text-[10px] font-extrabold text-[#C7A86D] uppercase block">Frontend Syllabus</span>
                    <h3 className="text-xl font-bold text-slate-900 font-heading">User Interface & State Architecture</h3>
                    <p className="text-sm text-slate-500 leading-relaxed font-light">
                      Audit your web fundamentals, client-side routers, component lifecycle hook optimizations, and dynamic DOM rendering schemas.
                    </p>
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs">
                      <span className="font-bold block text-slate-700">Target Companies:</span>
                      Stripe, Vercel, Linear, Airbnb, Figma
                    </div>
                  </div>
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-slate-400 block uppercase">Key Competencies Evaluated</span>
                    {[
                      { name: 'TypeScript Advanced Type Safety', desc: 'Generic definitions, conditional interfaces, assertions' },
                      { name: 'React 19 State Optimizations', desc: 'Server Actions, useTransition hooks, asynchronous bindings' },
                      { name: 'TanStack Router Integration', desc: 'Type-safe path navigations, preloading, file routes' },
                      { name: 'TailwindCSS Layout Engineering', desc: 'Responsive grids, dynamic color themes, CSS variables' }
                    ].map((comp, idx) => (
                      <div key={idx} className="flex gap-2.5 items-start p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                        <CheckCircle2 className="w-4 h-4 text-[#C7A86D] shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs font-bold text-slate-800 block">{comp.name}</span>
                          <span className="text-[11px] text-slate-550 block mt-0.5">{comp.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTrack === 'backend' && (
                <motion.div
                  key="backend"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left"
                >
                  <div className="space-y-4">
                    <span className="text-[10px] font-extrabold text-[#C7A86D] uppercase block">Backend Syllabus</span>
                    <h3 className="text-xl font-bold text-slate-900 font-heading">Server Infrastructure & Persistence Layers</h3>
                    <p className="text-sm text-slate-500 leading-relaxed font-light">
                      Evaluate API pipeline structure, microservices routing protocols, database sharding, transaction locking, and ORM schema designs.
                    </p>
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs">
                      <span className="font-bold block text-slate-700">Target Companies:</span>
                      Amazon, Uber, PayPal, Coinbase, Slack
                    </div>
                  </div>
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-slate-400 block uppercase">Key Competencies Evaluated</span>
                    {[
                      { name: 'Express.js 5 API Controllers', desc: 'Asynchronous middleware routers, validation layers' },
                      { name: 'Prisma Schema Relational Design', desc: 'Complex joins, migration rollouts, dynamic indexes' },
                      { name: 'PostgreSQL Database Engineering', desc: 'Connection pooling, query indexes, transaction locks' },
                      { name: 'REST & GraphQL System Designs', desc: 'Payload sanitization, query batching, rate limiting' }
                    ].map((comp, idx) => (
                      <div key={idx} className="flex gap-2.5 items-start p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                        <CheckCircle2 className="w-4 h-4 text-[#C7A86D] shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs font-bold text-slate-800 block">{comp.name}</span>
                          <span className="text-[11px] text-slate-555 block mt-0.5">{comp.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTrack === 'devops' && (
                <motion.div
                  key="devops"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left"
                >
                  <div className="space-y-4">
                    <span className="text-[10px] font-extrabold text-[#C7A86D] uppercase block">DevOps Syllabus</span>
                    <h3 className="text-xl font-bold text-slate-900 font-heading">CI/CD Automation & Cluster Deployment</h3>
                    <p className="text-sm text-slate-500 leading-relaxed font-light">
                      Analyze deployment workflow pipelines, cluster orchestrations, virtualization steps, and containerized networks.
                    </p>
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs">
                      <span className="font-bold block text-slate-700">Target Companies:</span>
                      Netflix, Google Cloud, HashiCorp, Cloudflare
                    </div>
                  </div>
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-slate-400 block uppercase">Key Competencies Evaluated</span>
                    {[
                      { name: 'Docker Virtual Containerization', desc: 'Optimized multi-stage builds, networking, volumes' },
                      { name: 'Kubernetes Orchestration Controls', desc: 'Deployments, ingress, service routing, load balancing' },
                      { name: 'GitHub Actions Automation workflows', desc: 'Job runners, test automation, registry deployments' },
                      { name: 'Linux Shell System Scripting', desc: 'Process execution monitoring, port binding controls' }
                    ].map((comp, idx) => (
                      <div key={idx} className="flex gap-2.5 items-start p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                        <CheckCircle2 className="w-4 h-4 text-[#C7A86D] shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs font-bold text-slate-800 block">{comp.name}</span>
                          <span className="text-[11px] text-slate-555 block mt-0.5">{comp.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTrack === 'ai' && (
                <motion.div
                  key="ai"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left"
                >
                  <div className="space-y-4">
                    <span className="text-[10px] font-extrabold text-[#C7A86D] uppercase block">AI & Data Systems Syllabus</span>
                    <h3 className="text-xl font-bold text-slate-900 font-heading">Retrieval Architectures & Vector Searches</h3>
                    <p className="text-sm text-slate-500 leading-relaxed font-light">
                      Examine prompt engineering schemas, semantic similarity math, embedding lookups, and proctored agent pipelines.
                    </p>
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs">
                      <span className="font-bold block text-slate-700">Target Companies:</span>
                      OpenAI, Anthropic, Scale AI, Hugging Face
                    </div>
                  </div>
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-slate-400 block uppercase">Key Competencies Evaluated</span>
                    {[
                      { name: 'LLM Prompt Engineering Pipelines', desc: 'Few-shot patterns, JSON schema responses proctoring' },
                      { name: 'Vector DB Semantic Embeddings', desc: 'Pinecone, pgvector similarity (Cosine / L2)' },
                      { name: 'RAG Retrieval Systems', desc: 'Document parsing nodes, TF-IDF vector indices context' },
                      { name: 'Agentic Workflow Integrations', desc: 'Tool calling loops, validation hooks, state machine logic' }
                    ].map((comp, idx) => (
                      <div key={idx} className="flex gap-2.5 items-start p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                        <CheckCircle2 className="w-4 h-4 text-[#C7A86D] shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs font-bold text-slate-800 block">{comp.name}</span>
                          <span className="text-[11px] text-slate-555 block mt-0.5">{comp.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-28">
        <ScrollReveal className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#E2B86C]/20 bg-[#E2B86C]/5 text-xs text-slate-700 font-bold font-heading backdrop-blur-md">
            CORE PLATFORM ENGINE
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 font-heading tracking-tight">
            Comprehensive Placement Intelligence
          </h2>
          <p className="text-slate-655 font-light text-base leading-relaxed">
            Constructed with industry-leading analytical parsing pipelines to audit candidate skill levels and predict readiness metrics.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: 'Resume Analysis',
              desc: 'Parse technical portfolios, projects, and work histories in real time to match candidate depth with standardized placement roles.',
              icon: FileText
            },
            {
              title: 'Skill Gap Detection',
              desc: 'Scan requirements across system architecture, DevOps, frontend design, and AI models to identify curriculum gaps instantly.',
              icon: ShieldAlert
            },
            {
              title: 'AI Learning Roadmap',
              desc: 'Deliver targeted study links and progress bars for curriculum segments that need immediate consolidation.',
              icon: BookOpen
            },
            {
              title: 'Placement Prediction',
              desc: 'Calculate probability index stats matching company thresholds. Instantly flags candidates ready to enter interviews.',
              icon: TrendingUp
            },
            {
              title: 'Career Recommendations',
              desc: 'Suggest eligible roles and alternative tech domains aligned with performance indices and current talent acquisition markets.',
              icon: Compass
            },
            {
              title: 'Continuous Progress',
              desc: 'Track metrics dynamically. Real-time updates automatically feed into instructor and student dashboards on each test completion.',
              icon: BarChart3
            }
          ].map((item, idx) => {
            const Icon = item.icon
            return (
              <ScrollReveal 
                key={idx} 
                className="group p-8 rounded-2xl border border-slate-100 bg-white/50 hover:bg-white transition-all duration-300 hover:shadow-[0_20px_45px_rgba(128,128,0,0.06)] hover:border-[#E2B86C]/30 relative overflow-hidden"
                delay={idx * 0.05}
              >
                <div className="p-3.5 w-12 h-12 rounded-xl bg-[#FDFBF7] text-[#C7A86D] group-hover:bg-slate-900 group-hover:text-[#E2B86C] mb-6 transition-all duration-300 flex items-center justify-center border border-slate-100">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold mb-3 text-slate-900 font-heading group-hover:text-[#C7A86D] transition-colors duration-200">
                  {item.title}
                </h3>
                <p className="text-slate-550 text-sm leading-relaxed font-light">
                  {item.desc}
                </p>
              </ScrollReveal>
            )
          })}
        </div>
      </section>

      {/* AI Scoring Engine Architecture Pipeline */}
      <section id="engine-architecture" className="relative z-10 border-t border-[#E2B86C]/10 bg-[#F5F2EA]/30 py-28">
        <div className="max-w-7xl mx-auto px-6">
          
          <ScrollReveal className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#E2B86C]/20 bg-[#E2B86C]/5 text-xs text-slate-700 font-bold font-heading backdrop-blur-md">
              SRE TECHNICAL OVERVIEW
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 font-heading tracking-tight">
              Architected for Placeability Auditing
            </h2>
            <p className="text-slate-600 font-light text-base leading-relaxed">
              How the SRE underlying parser, skills validation layer, and placement probability models operate under the hood.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Semantic NLP Parser',
                tech: 'SpaCy, TF-IDF Mapping',
                desc: 'Scrapes structural text from candidate resumes, categorizing projects, past tech stacks, and academic majors into structured nodes.',
                icon: FileText
              },
              {
                title: 'Skill Matrix Matcher',
                tech: 'Vector Similarity (COS)',
                desc: 'Computes matching similarity scores between candidates credentials vectors and target software roles in real-time.',
                icon: Database
              },
              {
                title: 'Auto-Syllabus Generator',
                tech: 'Heuristic Remediation Trees',
                desc: 'Cross-checks skill gap deficits and resolves issues automatically by indexing recommendations within the student route.',
                icon: Network
              },
              {
                title: 'ML Prediction Simulator',
                tech: 'Logistic Regression Model',
                desc: 'Weights academic ratings, quiz performance logs, and stack counts to predict placement probability ratios for recruiters.',
                icon: Cpu
              }
            ].map((arch, idx) => {
              const Icon = arch.icon
              return (
                <ScrollReveal 
                  key={idx} 
                  className="p-6 rounded-2xl bg-white/70 border border-slate-100 space-y-4 hover:border-[#E2B86C]/30 hover:shadow-md transition-all duration-350"
                  delay={idx * 0.08}
                >
                  <div className="p-3 w-10 h-10 rounded-lg bg-[#FCFAF6] text-[#C7A86D] flex items-center justify-center border border-slate-100">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#C7A86D] block font-bold tracking-wider">{arch.tech}</span>
                    <h4 className="text-base font-bold text-slate-900 font-heading mt-1">{arch.title}</h4>
                  </div>
                  <p className="text-xs text-slate-555 leading-relaxed font-light">
                    {arch.desc}
                  </p>
                </ScrollReveal>
              )
            })}
          </div>

          {/* NEW ROW: Exact Scoring Weightage Formula Grid */}
          <div className="mt-16 border-t border-slate-200/65 pt-12 text-left">
            <ScrollReveal className="mb-8">
              <span className="text-[10px] font-extrabold text-[#C7A86D] uppercase block">METRICS CRITERIA</span>
              <h3 className="text-xl font-bold text-slate-900 font-heading mt-1">SRE Readiness Index Formula</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xl">
                The scoring engine weights three independent technical verification layers to output the Placeability score dynamically.
              </p>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  weight: '30%',
                  title: 'Resume Semantic Parsing',
                  desc: 'NLP keywords match matching tech stacks, parsed structural engineering accomplishments, projects complexity, and academic majors.',
                  icon: FileText
                },
                {
                  weight: '40%',
                  title: 'Proctored Domain Quizzes',
                  desc: 'Dynamic technical assessments compiled on-the-fly. Evaluates core logic limits, systems optimization, and TypeScript systems.',
                  icon: Activity
                },
                {
                  weight: '30%',
                  title: 'Verified Project Artifacts',
                  desc: 'Self-reported portfolios validated using repository scans or verified certifications. Instantly maps repository stats.',
                  icon: Award
                }
              ].map((formula, idx) => (
                <ScrollReveal 
                  key={idx} 
                  className="p-5 rounded-2xl bg-white border border-slate-100 flex gap-4 items-start shadow-sm"
                  delay={idx * 0.1}
                >
                  <div className="p-3 bg-[#FAF8F5] border border-slate-150 rounded-xl text-lg font-black text-slate-800 font-mono shrink-0">
                    {formula.weight}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 font-heading">{formula.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{formula.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* SRE Direct Sync Ecosystem Integration Section */}
      <section className="relative z-10 py-24 border-t border-[#E2B86C]/10 bg-[#F5F2EA]/20">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#E2B86C]/20 bg-[#E2B86C]/5 text-xs text-slate-700 font-bold font-heading backdrop-blur-md">
              DATA HARVESTING GRID
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading tracking-tight">
              Direct Third-Party API Connectors
            </h2>
            <p className="text-slate-600 font-light text-base leading-relaxed">
              The scoring engine does not rely on static inputs. It binds directly to your developer platforms, learning portals, and DSA registries to update scores in real-time.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Developer Platform Sync',
                provider: 'GitHub & GitLab API',
                status: 'Active Webhook',
                statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-100',
                throughput: '3.4M Commits Parsed',
                desc: 'Audits repository commit counts, branch merges, pull request code reviews, code freshness, and advanced modularity in TypeScript.',
                features: ['Lines of TS Scanned: 24M+', 'Static Code Modularity Audits', 'Branch Merge History Logs'],
                icon: Cpu
              },
              {
                title: 'Academic LMS Integration',
                provider: 'Canvas & Moodle LTI',
                status: 'Secure OIDC',
                statusColor: 'bg-indigo-50 text-indigo-700 border-indigo-100',
                throughput: '12,500 Quizzes Logged',
                desc: 'Pulls dynamic course grading, exam logs, syllabus milestones, and final student projects metadata securely using LTI compliance standards.',
                features: ['Canvas LTI 1.3 Certified', 'Automated Gradebook Syncing', 'Proctored Exam Verification'],
                icon: Database
              },
              {
                title: 'DSA Registry Scraper',
                provider: 'LeetCode & HackerRank',
                status: 'API Connected',
                statusColor: 'bg-amber-50 text-amber-700 border-amber-100',
                throughput: '412k Submissions Scored',
                desc: 'Indexes candidate problem-solving histories, data structures verification, recursion limits, and complexity indices matching hiring needs.',
                features: ['LeetCode Profile Sync', 'Time-complexity (Big O) Ratios', 'Language Proficiencies Scraped'],
                icon: Activity
              }
            ].map((conn, idx) => {
              const Icon = conn.icon
              return (
                <ScrollReveal
                  key={idx}
                  className="bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-[0_20px_45px_rgba(128,128,0,0.04)] hover:border-[#E2B86C]/25 transition-all duration-300 flex flex-col justify-between text-left relative overflow-hidden group"
                  delay={idx * 0.08}
                >
                  <div className="space-y-5">
                    <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-lg bg-[#FAF8F5] border border-slate-100 text-[#C7A86D] shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block font-sans">{conn.provider}</span>
                          <h3 className="text-base font-bold text-slate-900 font-heading mt-0.5">{conn.title}</h3>
                        </div>
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${conn.statusColor}`}>
                        {conn.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-550 leading-relaxed font-light">
                      {conn.desc}
                    </p>

                    <div className="space-y-2 pt-2">
                      <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block">Scanned Data Fields</span>
                      <div className="space-y-1.5">
                        {conn.features.map((feat, fidx) => (
                          <div key={fidx} className="flex gap-2 items-center text-[11px] text-slate-700 font-medium">
                            <span className="w-1 h-1 bg-[#C7A86D] rounded-full shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center text-[10px] font-mono text-slate-400 font-semibold uppercase">
                    <span>Active Telemetry</span>
                    <span className="text-[#C7A86D]">{conn.throughput}</span>
                  </div>
                </ScrollReveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative z-10 border-t border-[#E2B86C]/10 bg-white py-28">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-20">
          <ScrollReveal className="space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#E2B86C]/20 bg-[#E2B86C]/5 text-xs text-slate-700 font-bold font-heading backdrop-blur-md">
              SYSTEM ANALYSIS PIPELINE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 font-heading tracking-tight">
              How the Scoring Engine Functions
            </h2>
            <p className="text-slate-500 font-light text-base leading-relaxed max-w-xl mx-auto">
              Follow our horizontal verification pipeline from raw PDF portfolio parsing to dashboard analytics delivery.
            </p>
          </ScrollReveal>

          <ScrollReveal className="relative">
            {/* Connector Line */}
            <div className="absolute top-[28px] left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-[#E2B86C]/10 via-[#E2B86C]/40 to-[#E2B86C]/10 hidden lg:block" />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8">
              {[
                { title: 'Upload Resume', icon: Upload },
                { title: 'AI Resume Parsing', icon: FileText },
                { title: 'Skill Extraction', icon: Zap },
                { title: 'Readiness Analysis', icon: BarChart3 },
                { title: 'Personalized Roadmap', icon: BookOpen },
                { title: 'Dashboard Insights', icon: Laptop }
              ].map((step, idx) => {
                const Icon = step.icon
                return (
                  <motion.div 
                    key={idx} 
                    className="relative group flex flex-col items-center space-y-4"
                    whileHover={{ y: -4 }}
                  >
                    <div className="w-14 h-14 rounded-full bg-white border-2 border-slate-100 group-hover:border-[#E2B86C] text-[#C7A86D] group-hover:bg-slate-900 group-hover:text-[#E2B86C] transition-all duration-300 flex items-center justify-center shadow-md relative z-10">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-center">
                      <span className="text-[10px] font-extrabold text-[#C7A86D] block mb-1">STEP 0{idx + 1}</span>
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-heading">{step.title}</h4>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Dashboard Preview Section (Laptop Mockup) */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-28 border-t border-[#E2B86C]/10">
        <ScrollReveal className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#E2B86C]/20 bg-[#E2B86C]/5 text-xs text-slate-700 font-bold font-heading backdrop-blur-md">
            DASHBOARD PREVIEW
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 font-heading tracking-tight">
            Auditable Console Dashboards
          </h2>
          <p className="text-slate-600 font-light text-base leading-relaxed">
            Click tabs below to preview the live interactive screens before entering the secure dashboard portal.
          </p>

          <div className="flex justify-center gap-3 pt-6">
            <button
              onClick={() => setPreviewTab('student')}
              className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all duration-300 cursor-pointer ${
                previewTab === 'student'
                  ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                  : 'bg-white border-slate-100 text-slate-500 hover:text-slate-900'
              }`}
            >
              Student Portal View
            </button>
            <button
              onClick={() => setPreviewTab('instructor')}
              className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all duration-300 cursor-pointer ${
                previewTab === 'instructor'
                  ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                  : 'bg-white border-slate-100 text-slate-500 hover:text-slate-900'
              }`}
            >
              Instructor Console View
            </button>
          </div>
        </ScrollReveal>

        {/* Laptop frame with Framer Motion Tilt */}
        <TiltCard className="w-full max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(128,128,0,0.06)] bg-white border border-slate-200 p-3">
          <div className="rounded-2xl overflow-hidden border border-slate-100 bg-[#FCFAF6] relative aspect-[16/10] flex flex-col">
            
            {/* Browser chrome header */}
            <div className="bg-[#FAF8F5] text-slate-400 h-8 flex items-center px-4 justify-between select-none border-b border-slate-100">
              <div className="flex gap-2">
                <span className="w-3 h-3 rounded-full bg-red-400/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-400/80" />
                <span className="w-3 h-3 rounded-full bg-green-400/80" />
              </div>
              <div className="text-[10px] font-mono bg-white border border-slate-100 rounded px-6 py-0.5 text-slate-550">localhost:5173</div>
              <div className="w-10" />
            </div>

            {/* Simulated app screen viewport */}
            <div className="flex-1 bg-white p-6 sm:p-8 overflow-y-auto space-y-6 relative">
              <AnimatePresence mode="wait">
                {previewTab === 'student' ? (
                  <motion.div 
                    key="student-tab"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6 text-left"
                  >
                    <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                      <div>
                        <h4 className="text-base font-bold text-slate-900 font-heading">My Readiness Tracker</h4>
                        <span className="text-[10px] text-slate-500">Simulated student environment</span>
                      </div>
                      <span className="text-xs px-3 py-1 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-100">82.5% BASE INDEX</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-4 bg-[#FCFAF6] rounded-xl border border-slate-100">
                        <span className="text-[9px] uppercase font-bold tracking-wider text-slate-550 block">Readiness Rating</span>
                        <span className="text-xl font-black text-slate-900 font-heading block mt-1">82.5%</span>
                      </div>
                      <div className="p-4 bg-[#FCFAF6] rounded-xl border border-slate-100">
                        <span className="text-[9px] uppercase font-bold tracking-wider text-slate-555 block">Verified Tech Skills</span>
                        <span className="text-xl font-black text-[#C7A86D] font-heading block mt-1">14 modules</span>
                      </div>
                      <div className="p-4 bg-[#FCFAF6] rounded-xl border border-slate-100">
                        <span className="text-[9px] uppercase font-bold tracking-wider text-slate-555 block">Active Gaps Flagged</span>
                        <span className="text-xl font-black text-rose-650 font-heading block mt-1">2 Gaps</span>
                      </div>
                    </div>

                    <div className="p-5 bg-white border border-slate-150 rounded-xl space-y-3 shadow-sm">
                      <span className="text-xs font-bold text-slate-900 font-heading block">Active Roadmap Syllabus</span>
                      <div className="space-y-2">
                        {[
                          { title: 'Web Fundamentals', badge: 'Completed', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
                          { title: 'Advanced JavaScript & TS', badge: 'Completed', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
                          { title: 'System Design & Scalability', badge: 'In Progress', color: 'bg-indigo-50 text-indigo-700 border-indigo-100' }
                        ].map((item, idx) => (
                          <div key={idx} className="p-3 rounded-lg bg-[#FCFAF6] border border-slate-100 flex justify-between items-center text-xs">
                            <span className="font-medium text-slate-700">{item.title}</span>
                            <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${item.color}`}>{item.badge}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="instructor-tab"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6 text-left"
                  >
                    <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                      <div>
                        <h4 className="text-base font-bold text-slate-900 font-heading">System Readiness Dashboard</h4>
                        <span className="text-[10px] text-slate-500">Simulated coordinator console</span>
                      </div>
                      <span className="text-xs px-3 py-1 rounded bg-[#E2B86C]/10 text-[#C7A86D] font-bold border border-[#E2B86C]/20">85% READINESS TARGET</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="p-4 bg-[#FCFAF6] rounded-xl border border-slate-100">
                        <span className="text-[9px] uppercase font-bold text-slate-550 block">Readiness Score</span>
                        <span className="text-lg font-black text-slate-900 font-heading block mt-1">85% Target</span>
                      </div>
                      <div className="p-4 bg-[#FCFAF6] rounded-xl border border-slate-100">
                        <span className="text-[9px] uppercase font-bold text-slate-550 block">Evaluated Students</span>
                        <span className="text-lg font-black text-[#C7A86D] font-heading block mt-1">412 Profiles</span>
                      </div>
                      <div className="p-4 bg-[#FCFAF6] rounded-xl border border-slate-100">
                        <span className="text-[9px] uppercase font-bold text-slate-555 block">Open Skill Gaps</span>
                        <span className="text-lg font-black text-rose-655 font-heading block mt-1">4 Critical</span>
                      </div>
                      <div className="p-4 bg-[#FCFAF6] rounded-xl border border-slate-100">
                        <span className="text-[9px] uppercase font-bold text-slate-555 block">Integrity profile</span>
                        <span className="text-lg font-black text-emerald-600 font-heading block mt-1">99.8% Safe</span>
                      </div>
                    </div>

                    <div className="bg-white border border-slate-150 rounded-xl overflow-hidden text-left shadow-sm">
                      <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-450 uppercase tracking-wide">
                        Active Student Roster
                      </div>
                      <div className="p-4 space-y-3.5 text-xs text-slate-700">
                        <div className="flex justify-between font-semibold border-b border-slate-100 pb-2 text-slate-800">
                          <span>Name</span>
                          <span>Readiness Index</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Aria Sterling</span>
                          <span className="font-mono text-emerald-600 font-bold">94.0%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Devon Vance</span>
                          <span className="font-mono text-emerald-600 font-bold">88.2%</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </TiltCard>

        <div className="mt-12 flex flex-wrap gap-4 items-center justify-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleEnterDashboard('student')}
            className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
          >
            View Dashboard
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleEnterDashboard('student')}
            className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
          >
            Take Assessment
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleEnterDashboard(previewTab === 'student' ? 'student' : 'instructor')}
            className="px-8 py-3 bg-[#E2B86C] hover:bg-[#bfa267] text-slate-950 text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md"
          >
            Enter Dashboard
          </motion.button>
        </div>
      </section>

      {/* NEW SECTION: Placement Readiness Level Matrix Table */}
      <section id="readiness-matrix" className="relative z-10 py-24 border-t border-slate-200/50 bg-[#FAF8F5]/30 text-left">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#E2B86C]/20 bg-[#E2B86C]/5 text-xs text-slate-700 font-bold font-heading backdrop-blur-md">
              EVALUATION SCALE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading tracking-tight">
              Placement Placeability Levels
            </h2>
            <p className="text-slate-600 font-light text-base leading-relaxed">
              How candidate readiness indexes map to recruitment eligibility groups and industry hiring criteria.
            </p>
          </ScrollReveal>

          <ScrollReveal className="w-full max-w-4xl mx-auto bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-150 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-5 font-heading">Level</th>
                    <th className="p-5 font-heading">Readiness Range</th>
                    <th className="p-5 font-heading">Hiring Eligibility</th>
                    <th className="p-5 font-heading">Roadmap Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {[
                    {
                      level: 'Platinum Plus',
                      range: '90.0% – 100%',
                      elig: 'Guaranteed placement shortlist. FAANG/Top tier AI roles.',
                      action: 'Unlocks Blockchain Master Credential automatically.'
                    },
                    {
                      level: 'Gold Verified',
                      range: '80.0% – 89.9%',
                      elig: 'High placement probability. Startup and mid-level corporate SWE.',
                      action: 'Unlocks Standard Credentials certificate. Resume analysis priority.'
                    },
                    {
                      level: 'Silver Qualified',
                      range: '70.0% – 79.9%',
                      elig: 'Junior engineering roles, tech consulting, and internships.',
                      action: 'Assigns micro-assessments to resolve active stack gaps.'
                    },
                    {
                      level: 'Bronze (Alert)',
                      range: 'Below 70.0%',
                      elig: 'High skill deficit. Curricula benchmarks not met.',
                      action: 'Flags profile. Generates mandatory remediation learning syllabus.'
                    }
                  ].map((row, index) => (
                    <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-5 font-bold font-heading text-slate-900">{row.level}</td>
                      <td className="p-5 font-mono font-semibold text-[#C7A86D]">{row.range}</td>
                      <td className="p-5 font-light leading-relaxed">{row.elig}</td>
                      <td className="p-5 text-slate-550">{row.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Interactive Readiness & Placement ROI Calculator */}
      <section className="relative z-10 py-24 border-t border-[#E2B86C]/10 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#E2B86C]/20 bg-[#E2B86C]/5 text-xs text-slate-700 font-bold font-heading backdrop-blur-md">
              INTERACTIVE CALCULATOR
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading tracking-tight">
              Estimate Your Placeability ROI
            </h2>
            <p className="text-slate-600 font-light text-base leading-relaxed">
              Input your current academic and technical achievements below to compute your estimated SRE Readiness Index and target placement level instantly.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-5xl mx-auto">
            {/* Left Controls Column */}
            <div className="lg:col-span-7 bg-[#FCFAF6] border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 text-left">
              <h3 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#C7A86D]" /> Calibrate Profile Attributes
              </h3>

              {/* Slider: Projects Count */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700">Verified Technical Projects ({calcProjects})</span>
                  <span className="font-mono text-slate-400">Weight: 30%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={calcProjects}
                  onChange={(e) => setCalcProjects(parseInt(e.target.value))}
                  className="w-full accent-slate-900 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 block font-light">Self-reported portfolios linked to GitHub repository scans.</span>
              </div>

              {/* Slider: Coding Quiz Score */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700">DSA & Domain Quiz Score ({calcQuizScore}%)</span>
                  <span className="font-mono text-slate-400">Weight: 40%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={calcQuizScore}
                  onChange={(e) => setCalcQuizScore(parseInt(e.target.value))}
                  className="w-full accent-slate-900 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 block font-light">Proctored assessments evaluating systems limits and logic performance.</span>
              </div>

              {/* Slider: Resume Keyword Match */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700">Resume Keywords Semantic Match ({calcResumeMatch}%)</span>
                  <span className="font-mono text-slate-400">Weight: 30%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={calcResumeMatch}
                  onChange={(e) => setCalcResumeMatch(parseInt(e.target.value))}
                  className="w-full accent-slate-900 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 block font-light">Natural Language Processing match against standardized recruiter roles.</span>
              </div>

              {/* Selector: Target Career Stream */}
              <div className="space-y-2 pt-2 border-t border-slate-200/50">
                <label className="text-xs font-bold text-slate-700 block">Target Placement Stream</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'frontend', label: 'Frontend' },
                    { id: 'backend', label: 'Backend' },
                    { id: 'devops', label: 'DevOps' },
                    { id: 'ai', label: 'AI/Data' }
                  ].map((stream) => (
                    <button
                      key={stream.id}
                      onClick={() => setCalcTargetRole(stream.id as any)}
                      className={`py-2 px-3 rounded-xl text-[10px] font-bold uppercase tracking-wider border text-center transition-all cursor-pointer ${
                        calcTargetRole === stream.id
                          ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                          : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {stream.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Output Column */}
            <div className="lg:col-span-5 flex flex-col justify-between p-8 rounded-3xl border border-[#E2B86C]/15 bg-[#FAF8F5]/30 relative overflow-hidden">
              <div className="absolute top-[-10%] right-[-10%] w-48 h-48 bg-[#E2B86C]/5 rounded-full blur-3xl pointer-events-none" />

              <div className="space-y-6 z-10 text-left">
                <div className="flex justify-between items-center pb-4 border-b border-slate-200/60">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 font-sans">Index Projection</span>
                  <span className={`text-[10px] font-extrabold px-3 py-1 rounded-lg border uppercase tracking-wider ${readinessInfo.color}`}>
                    {readinessInfo.name}
                  </span>
                </div>

                <div className="flex flex-col items-center py-6 bg-white border border-slate-100 rounded-3xl shadow-sm text-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block font-sans">Simulated SRE Score</span>
                  <span className="text-5xl font-black font-heading text-slate-900 mt-2">{estimatedReadiness}%</span>
                  <span className="text-xs font-semibold text-slate-500 mt-2 block px-4 leading-relaxed">
                    Formula: (Resume × 0.3) + (Quiz × 0.4) + (Projects × 0.3)
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block">Est. Market Salary Potential</span>
                    <span className="text-xl font-extrabold font-heading text-slate-900 mt-0.5 block">{readinessInfo.sal}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block">Hiring Eligibility Pool</span>
                    <span className="text-xs text-slate-700 block mt-0.5 leading-relaxed font-light">{readinessInfo.eligibility}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200/60 z-10 text-left">
                <span className="text-[9px] uppercase tracking-wider font-bold text-[#C7A86D] block">Remediation Roadmap Advice</span>
                <p className="text-xs text-slate-550 block mt-1 leading-relaxed font-light">
                  {estimatedReadiness >= 90 ? (
                    "Excellent! Your attributes match top recruiter criteria. Enter the student portal to secure and download your certificate."
                  ) : estimatedReadiness >= 80 ? (
                    "You're very close! Improving your resume matching tags or completing one more proctored quiz will push you into the 90%+ Platinum bracket."
                  ) : estimatedReadiness >= 70 ? (
                    "Solid base. SRE recommends taking the System Architecture quiz and linking 2 more repositories to boost your score to the 80%+ Gold target."
                  ) : (
                    "A critical gap exists. SRE recommends launching the mandatory learning syllabus to resolve basic database & CSS layout deficits."
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="choose-us" className="relative z-10 border-t border-slate-100 bg-[#FCFAF6]/60 py-28">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left illustration with Tilt */}
          <TiltCard className="p-8 bg-white/80 border border-[#E2B86C]/15 rounded-3xl aspect-[4/3] flex flex-col justify-between shadow-sm relative overflow-hidden">
            <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-[#E2B86C]/5 rounded-full blur-3xl" />
            
            <div className="flex justify-between items-center relative z-10">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#C7A86D]">ANALYSIS ENGINE OVERVIEW</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            </div>

            <div className="flex-1 flex items-end gap-3 px-4 py-8 relative z-10">
              {[60, 45, 80, 55, 92, 70, 85].map((height, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center space-y-2">
                  <motion.div 
                    initial={{ height: 0 }}
                    whileInView={{ height: `${height * 1.3}px` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: idx * 0.1, ease: "easeOut" }}
                    className="w-full bg-[#E2B86C] hover:brightness-105 rounded-t-lg" 
                  />
                  <span className="text-[10px] font-mono text-slate-400 font-bold">C{idx+1}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-4 flex gap-6 text-xs font-bold text-slate-555 relative z-10">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Predictive Index</span>
                <span>Placement Threshold Met</span>
              </div>
              <div className="w-[1px] h-8 bg-slate-200" />
              <div>
                <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Integrity Audit</span>
                <span>Fully Authenticated</span>
              </div>
            </div>
          </TiltCard>

          {/* Right bullets */}
          <ScrollReveal className="space-y-8 text-left" delay={0.15}>
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#E2B86C]/20 bg-[#E2B86C]/5 text-xs text-slate-700 font-bold font-heading backdrop-blur-md">
                WHY CHOOSE THE SCORING ENGINE?
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading tracking-tight leading-tight">
                Placement preparation driven by precise metrics
              </h2>
              <p className="text-slate-550 font-light text-base leading-relaxed">
                SkillSync replaces subjective resume reviews with structured, machine-verified readiness indexes that map skills to curriculum benchmarks.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                'AI-powered readiness analysis',
                'Skill gap detection',
                'Personalized learning roadmap',
                'Placement probability prediction',
                'Industry-aligned recommendations',
                'Continuous progress tracking'
              ].map((bullet, idx) => (
                <motion.div 
                  key={idx} 
                  className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-100 bg-white shadow-sm"
                  whileHover={{ x: 4, scale: 1.01 }}
                >
                  <CheckCircle2 className="w-4 h-4 text-[#C7A86D] shrink-0" />
                  <span className="text-xs font-bold text-slate-700">{bullet}</span>
                </motion.div>
              ))}
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* University Cohort Pilot Benchmarks Data Section */}
      <section className="relative z-10 py-24 border-t border-slate-150 bg-[#FCFAF6]/60">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#E2B86C]/20 bg-[#E2B86C]/5 text-xs text-slate-700 font-bold font-heading backdrop-blur-md">
              PILOT RESULTS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading tracking-tight">
              University Cohort Performance Analytics
            </h2>
            <p className="text-slate-600 font-light text-base leading-relaxed">
              Real metrics collected from three university deployments showcasing placement rates, index gains, and velocity improvements.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left: General Stats Card */}
            <ScrollReveal
              className="lg:col-span-4 p-8 bg-slate-900 text-white rounded-3xl border border-slate-800 flex flex-col justify-between text-left shadow-lg relative overflow-hidden"
              delay={0.1}
            >
              <div className="absolute top-[-10%] right-[-10%] w-36 h-36 bg-[#E2B86C]/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="space-y-4">
                <span className="text-[10px] font-extrabold text-[#E2B86C] uppercase tracking-wider block">Aggregate Metrics</span>
                <h3 className="text-2xl font-black text-white font-heading leading-tight">Average Cohort Improvements</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-light">
                  Aggregated telemetry across 6 universities over the 2025/2026 academic calendar.
                </p>
              </div>

              <div className="space-y-6 py-6 border-y border-slate-800 my-6">
                {[
                  { label: 'Avg placement rate increase', val: '+24.5%' },
                  { label: 'Time saved by coordinators', val: '42 hrs/mo' },
                  { label: 'Student score improvement', val: '28.1% avg' }
                ].map((stat, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">{stat.label}</span>
                    <span className="font-mono font-black text-[#E2B86C] text-sm">{stat.val}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0" />
                <span>Audited by SRE Registry 2026</span>
              </div>
            </ScrollReveal>

            {/* Right: University Cohorts Table Card */}
            <ScrollReveal
              className="lg:col-span-8 p-6 sm:p-8 bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col justify-between text-left"
              delay={0.2}
            >
              <div className="space-y-4 mb-6">
                <span className="text-[10px] font-extrabold text-[#C7A86D] uppercase tracking-wider block font-sans">Cohort Roster Cases</span>
                <h3 className="text-xl font-bold text-slate-900 font-heading">University Pilot Cohorts</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[9px] pb-2">
                      <th className="py-3 font-heading">University Cohort</th>
                      <th className="py-3 font-heading text-center">Class Size</th>
                      <th className="py-3 font-heading text-center">Pre-SRE Place%</th>
                      <th className="py-3 font-heading text-center">Post-SRE Place%</th>
                      <th className="py-3 font-heading text-right">Placement Speed</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {[
                      {
                        name: 'Austin Tech SWE Cohort',
                        size: '120 candidates',
                        pre: '62.0%',
                        post: '91.5%',
                        speed: '18 days avg'
                      },
                      {
                        name: 'Vanderbilt CSE Fellowship',
                        size: '85 candidates',
                        pre: '71.5%',
                        post: '94.0%',
                        speed: '14 days avg'
                      },
                      {
                        name: 'CalTech AI Advanced Stream',
                        size: '45 candidates',
                        pre: '80.0%',
                        post: '98.2%',
                        speed: '9 days avg'
                      }
                    ].map((row, index) => (
                      <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 font-bold text-slate-800">{row.name}</td>
                        <td className="py-4 text-center font-medium text-slate-500">{row.size}</td>
                        <td className="py-4 text-center font-mono font-semibold text-slate-400">{row.pre}</td>
                        <td className="py-4 text-center font-mono font-bold text-emerald-600">{row.post}</td>
                        <td className="py-4 text-right font-mono font-semibold text-[#C7A86D]">{row.speed}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 text-[10px] text-slate-400 font-medium leading-relaxed">
                * Placement speed indicates average elapsed time between student crossing the 85.0% readiness certification index and receiving verified SWE employment offers.
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="relative z-10 max-w-7xl mx-auto px-6 py-28">
        <ScrollReveal className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#E2B86C]/20 bg-[#E2B86C]/5 text-xs text-slate-700 font-bold font-heading backdrop-blur-md">
            CANDIDATE SUCCESS LOGS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 font-heading tracking-tight">
            Endorsed by Top-Tier Candidates
          </h2>
          <p className="text-slate-600 font-light text-base leading-relaxed">
            See how student coordinators and candidates utilize the scoring metrics to target placement paths.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: 'Aria Sterling',
              univ: 'CS & AI Graduate',
              init: 'AS',
              text: 'The resume parsing was extremely accurate! The personalized learning roadmap pointed me exactly to my System Design gaps, helping me boost my indices before recruiters scheduled interviews.'
            },
            {
              name: 'Devon Vance',
              univ: 'Software Engineering',
              init: 'DV',
              text: 'Restructuring my project portfolio raised my placement probability score. Once my verified index crossed the 85.0% target, I instantly unlocked my credentials certificate.'
            },
            {
              name: 'Liam Sterling',
              univ: 'Cybersecurity Student',
              init: 'LS',
              text: 'Having a transparent readiness audit key in the blockchain allows me to share my skills verification hash with recruiters directly. Absolute game changer!'
            }
          ].map((card, idx) => (
            <ScrollReveal 
              key={idx} 
              className="p-8 rounded-2xl border border-slate-150 bg-white/60 flex flex-col justify-between space-y-6 hover:border-[#E2B86C]/30 hover:shadow-md transition-all duration-300 cursor-default"
              delay={idx * 0.08}
            >
              <div className="space-y-4 text-left">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#E2B86C] text-[#E2B86C]" />
                  ))}
                </div>
                <p className="text-sm text-slate-650 leading-relaxed italic font-light">
                  "{card.text}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-inner">
                  {card.init}
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold text-white block font-heading">{card.name}</span>
                  <span className="text-[10px] text-slate-400 block font-light">{card.univ}</span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section id="faq" className="relative z-10 border-t border-[#E2B86C]/10 bg-[#F5F2EA]/20 py-28">
        <div className="max-w-4xl mx-auto px-6">
          
          <ScrollReveal className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#E2B86C]/20 bg-[#E2B86C]/5 text-xs text-slate-700 font-bold font-heading backdrop-blur-md">
              SUPPORT ACCORDION
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 font-heading tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 font-light text-base leading-relaxed">
              Clear up questions regarding placeability criteria, grading policies, and AI recommendations.
            </p>
          </ScrollReveal>

          <div className="space-y-4">
            {[
              {
                q: 'How is the Readiness Index calculated?',
                a: 'The scoring engine dynamically weights three components: resume parsing completion rates (technologies, projects, majors parsed), quiz performance marks completed in the Quizzes tab, and verified tech skills validated on-chain.'
              },
              {
                q: 'Can instructors customize placing thresholds?',
                a: 'Yes, via the Coordinator Console settings tab. Instructors can slide placement readiness parameters between 70% and 95%. Students scoring below this index are flagged in the cohort roster.'
              },
              {
                q: 'What determines placement probability?',
                a: 'The predictive simulator tests the candidates verified skills profile against placement benchmarks for technical roles (e.g. system design, DevOps containerization) to output an active ratio.'
              },
              {
                q: 'How does the credentials blockchain certificate lock work?',
                a: 'The certification hub enforces an 85.0% readiness threshold benchmark. Once the score matches or exceeds 85.0% (either via quiz score boost or resume analyses), the certificate unlocks instantly for download.'
              }
            ].map((faq, idx) => (
              <ScrollReveal 
                key={idx} 
                className="bg-white/70 border border-[#E2B86C]/10 rounded-2xl overflow-hidden transition-all duration-300 hover:border-[#E2B86C]/25 shadow-sm"
                delay={idx * 0.05}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-5 flex justify-between items-center text-left text-slate-800 hover:text-slate-950 font-bold font-heading text-sm sm:text-base focus:outline-none"
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle className="w-4 h-4 text-[#C7A86D] shrink-0" />
                    {faq.q}
                  </span>
                  <ChevronDown 
                    className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${
                      openFaqIdx === idx ? 'transform rotate-180 text-slate-850' : ''
                    }`} 
                  />
                </button>

                <AnimatePresence initial={false}>
                  {openFaqIdx === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden border-t border-slate-100"
                    >
                      <p className="p-6 text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </ScrollReveal>
            ))}
          </div>

        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative z-10 border-t border-[#E2B86C]/10 bg-white py-28 overflow-hidden">
        <div className="absolute top-[20%] left-[-15%] w-96 h-96 bg-[#E2B86C]/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8 relative z-10">
          <ScrollReveal className="space-y-4">
            <h2 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 font-heading tracking-tight leading-[1.15]">
              Ready to Unlock Your <br />
              Career Potential?
            </h2>
            <p className="text-slate-550 font-light text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              Use AI-powered insights to understand your strengths, close your curriculum skill gaps, and confidently prepare for placements.
            </p>
          </ScrollReveal>

          <ScrollReveal className="flex flex-wrap gap-4 justify-center items-center pt-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleEnterDashboard('student')}
              className="px-8 py-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
            >
              Get Started
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleEnterDashboard('student')}
              className="px-8 py-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
            >
              Learn More
            </motion.button>
          </ScrollReveal>

          <ScrollReveal className="pt-8 flex justify-center">
            <motion.button
              ref={finalCtaRef}
              onMouseMove={handleMagneticMove}
              onMouseLeave={handleMagneticLeave}
              style={magneticStyle}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleEnterDashboard('student')}
              className="px-12 py-6 bg-slate-900 text-white hover:bg-[#E2B86C] hover:text-slate-950 text-sm font-black tracking-widest uppercase rounded-2xl shadow-[0_15px_30px_rgba(0,0,0,0.15)] transition-all duration-200 cursor-pointer border border-slate-950"
            >
              Enter Dashboard →
            </motion.button>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200/60 bg-[#F4F2EC] py-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-12">
          
          <div className="col-span-2 space-y-4 text-left">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded bg-slate-900 text-[#E2B86C]">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-slate-900 tracking-tight font-heading">
                Student Readiness Engine
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs font-light">
              An AI-powered academic analytics scoring model designed to map candidate competencies, detect skill deficits, and suggest custom curriculum recommendations.
            </p>
          </div>

          <div className="space-y-3.5 text-xs text-left">
            <span className="font-extrabold uppercase text-slate-500 tracking-wider font-sans block">Product</span>
            <div className="flex flex-col gap-2.5 font-semibold text-slate-550">
              <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
              <button 
                onClick={() => handleEnterDashboard('student')}
                className="hover:text-[#C7A86D] text-left transition-colors font-semibold uppercase text-xs cursor-pointer"
              >
                Dashboard
              </button>
            </div>
          </div>

          <div className="space-y-3.5 text-xs text-left">
            <span className="font-extrabold uppercase text-slate-500 tracking-wider font-sans block">Legal & Social</span>
            <div className="flex flex-col gap-2.5 font-semibold text-slate-550">
              <a href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-slate-900 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-slate-900 transition-colors">GitHub</a>
              <a href="#" className="hover:text-slate-900 transition-colors">LinkedIn</a>
            </div>
          </div>

          <div className="space-y-3.5 text-xs text-left">
            <span className="font-extrabold uppercase text-slate-500 tracking-wider font-sans block">Support</span>
            <div className="flex flex-col gap-2.5 font-semibold text-slate-550">
              <a href="#" className="hover:text-slate-900 transition-colors">Contact</a>
              <a href="#" className="hover:text-slate-900 transition-colors">Support Portal</a>
              <button
                onClick={() => handleEnterDashboard('student')}
                className="text-[#C7A86D] font-bold text-left hover:underline cursor-pointer uppercase text-xs"
              >
                Enter Dashboard QuickLink
              </button>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-slate-200/60 text-center text-[10px] text-slate-400 font-semibold uppercase tracking-widest">
          © 2026 SkillSync Analytics Inc. All rights reserved.
        </div>
      </footer>

    </div>
  )
}