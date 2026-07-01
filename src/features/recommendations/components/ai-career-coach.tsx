import * as React from 'react'
import { Send, Bot, User } from 'lucide-react'

interface AICareerCoachProps {
  setReadinessScore: (score: number) => void
  setVerifiedSkillsCount: (count: number) => void
  setActiveGapsCount: (count: number) => void
  setTopicScores?: React.Dispatch<React.SetStateAction<Record<string, number>>>
}

interface ChatMessage {
  role: 'bot' | 'user'
  text: string
}

export function AICareerCoach({ 
  setReadinessScore, 
  setVerifiedSkillsCount, 
  setActiveGapsCount,
  setTopicScores
}: AICareerCoachProps): React.ReactElement {
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      role: 'bot',
      text: "Hi Rahul! I'm your SkillSync AI Chatbot. I've analyzed your latest assessment and see a gap in CI/CD deployment pipelines. Ask me a doubt or request an explanation to clear this gap!"
    }
  ])
  const [inputValue, setInputValue] = React.useState('')
  const [isTyping, setIsTyping] = React.useState(false)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  React.useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    
    if (!inputValue.trim()) return

    const userMessage = inputValue.trim()
    setMessages(prev => [...prev, { role: 'user', text: userMessage }])
    setInputValue('')
    setIsTyping(true)

    // Simulate AI response logic
    setTimeout(() => {
      let botResponse = "I can certainly help with that. Let's practice some concepts!"
      
      const normalizedMsg = userMessage.toLowerCase()
      if (normalizedMsg.includes('sql') || normalizedMsg.includes('normalization')) {
        botResponse = "Great question! SQL Normalization is the process of structuring a relational database to reduce data redundancy and improve data integrity. By mastering this, you've leveled up your DB skills!"
        
        // Triggering the dynamic state updates as requested!
        setReadinessScore(84.1)
        setVerifiedSkillsCount(15)
        setActiveGapsCount(1)
        if (setTopicScores) {
          setTopicScores(prev => ({
            ...prev,
            'Databases': 85
          }))
        }
      } else if (normalizedMsg.includes('ci/cd') || normalizedMsg.includes('pipeline')) {
        botResponse = "CI/CD (Continuous Integration / Continuous Deployment) automates building, testing, and deploying code. I've updated your readiness matrix to reflect your new understanding of deployment pipelines!"
        
        setReadinessScore(84.1)
        setVerifiedSkillsCount(15)
        setActiveGapsCount(1)
      } else {
        botResponse = "I have noted your query. Feel free to ask specifically about SQL Normalization or CI/CD pipelines to see how I can dynamically update your Readiness Score!"
      }

      setIsTyping(false)
      setMessages(prev => [...prev, { role: 'bot', text: botResponse }])
    }, 1200)
  }

  return (
    <div className="bg-transparent h-full flex flex-col transition-all duration-300 overflow-hidden relative">
      {/* Header Profile Section */}
      <div className="p-5 border-b border-slate-200 dark:border-indigo-900/30 bg-slate-100 dark:bg-slate-800/60 flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 rounded-full bg-[#6366F1] flex items-center justify-center text-white font-bold text-lg shadow-[0_0_15px_rgba(99,102,241,0.4)]">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white font-heading">SkillSync AI Chatbot</h3>
          <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Online & Ready
          </p>
        </div>
      </div>

      {/* Chat Messages Viewport */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 scroll-smooth">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex items-end gap-2.5 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === 'user' ? 'bg-indigo-500' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
            }`}>
              {msg.role === 'user' ? <User className="w-3.5 h-3.5 text-white" /> : <Bot className="w-3.5 h-3.5 text-[#6366F1]" />}
            </div>
            
            <div className={`p-3.5 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-br-none shadow-[0_4px_14px_rgba(99,102,241,0.2)]'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/60 dark:border-slate-700/40 rounded-bl-none shadow-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-end gap-2.5 max-w-[85%]">
            <div className="w-6 h-6 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
              <Bot className="w-3.5 h-3.5 text-[#6366F1]" />
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/40 rounded-bl-none flex gap-1 items-center">
              <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Sticky Input Bar */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0F172A] shrink-0">
        <form 
          onSubmit={handleSendMessage}
          className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1.5 focus-within:border-[#6366F1]/50 focus-within:ring-1 focus-within:ring-[#6366F1]/50 transition-all"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask a doubt about your skill gaps or curriculum..."
            className="flex-1 bg-transparent border-none text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 px-3 py-2 focus:outline-none focus:ring-0"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="p-2 rounded-lg bg-[#6366F1] hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-white shadow-sm flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  )
}
