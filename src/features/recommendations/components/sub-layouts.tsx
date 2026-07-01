import * as React from 'react'

export function TutorView(): React.ReactElement {
  const [messages, setMessages] = React.useState([
    { id: '1', role: 'assistant', text: "Hello! I am your SRE AI Study Coach. Let's build your SQL Normalization skills today. Would you like to review 3NF or walk through a query optimization problem?" }
  ])
  const [input, setInput] = React.useState('')

  const suggestions = [
    { label: 'Review Third Normal Form (3NF)', prompt: 'Can you review Third Normal Form (3NF) normalization with an example?' },
    { label: 'Query Optimization steps', prompt: 'What are the main steps for SQL query optimization?' },
    { label: 'Explain TypeScript Generics', prompt: 'How do TypeScript Generics work in interfaces?' }
  ]

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setMessages((prev) => {
      const nextId = `user-msg-${prev.length}`
      const userMessage = { id: nextId, role: 'user', text: input }
      
      setTimeout(() => {
        setMessages((current) => [
          ...current,
          {
            id: `assistant-msg-${current.length}`,
            role: 'assistant',
            text: `Great choice! Let's explore that topic. Based on your profile score, this is a prime opportunity to reinforce your understanding. Let's look at the foundational rules...`
          }
        ])
      }, 1000)

      return [...prev, userMessage]
    })
    setInput('')
  }

  const handleSuggestionClick = (prompt: string) => {
    setMessages((prev) => {
      const nextId = `user-msg-${prev.length}`
      const userMessage = { id: nextId, role: 'user', text: prompt }

      setTimeout(() => {
        let replyText = `I'd love to help! Let's dive in.`
        if (prompt.includes('3NF')) {
          replyText = `Third Normal Form (3NF) requires a relation to be in 2NF, and no non-prime attribute should be transitively dependent on any candidate key. In simple terms: "All attributes must depend on the key, the whole key, and nothing but the key!"`
        } else if (prompt.includes('optimization')) {
          replyText = `SQL Optimization steps include: 1. Choose indexed columns in WHERE/JOIN predicates. 2. Avoid SELECT *; request only needed columns. 3. Analyze query execution plans. 4. Deconstruct nested queries into JOINs where appropriate.`
        } else if (prompt.includes('Generics')) {
          replyText = `TypeScript Generics act as a placeholder for types, allowing components and interfaces to be reusable. Example: "interface Container<T> { value: T; }" This lets you declare Containers for numbers, strings, or custom shapes!`
        }
        setMessages((current) => [
          ...current,
          { id: `assistant-msg-${current.length}`, role: 'assistant', text: replyText }
        ])
      }, 800)

      return [...prev, userMessage]
    })
  }

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[600px] transition-all duration-300">
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-600 font-bold text-sm">
            AI
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">SRE Chatbot Tutor</h3>
            <p className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Online & Ready
            </p>
          </div>
        </div>
        <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full font-medium">Session #4</span>
      </div>

      <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/20">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow-sm transition-all duration-200 ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-white border border-slate-100 text-slate-700 rounded-bl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 py-2 bg-slate-50/50 border-t border-slate-100 flex flex-wrap gap-2">
        {suggestions.map((s) => (
          <button
            key={s.label}
            type="button"
            onClick={() => handleSuggestionClick(s.prompt)}
            className="text-[10px] font-semibold text-blue-600 hover:text-blue-700 bg-blue-50/60 hover:bg-blue-50 border border-blue-100 rounded-full px-3 py-1 transition-colors duration-150"
          >
            {s.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSend} className="p-4 border-t border-slate-100 bg-white flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about database, frontend, or pipelines..."
          className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all hover:shadow-md"
        >
          Send
        </button>
      </form>
    </div>
  )
}

export function PracticeView(): React.ReactElement {
  const [activeChallengeId, setActiveChallengeId] = React.useState<number | null>(null)
  const [completedCount, setCompletedCount] = React.useState<number>(1)
  const [selectedOption, setSelectedOption] = React.useState<number | null>(null)
  const [solvedStatus, setSolvedStatus] = React.useState<'idle' | 'success' | 'fail'>('idle')

  const challenges = [
    { id: 1, title: 'SQL Jointures & Relational Calculus', difficulty: 'Intermediate', time: '20 mins', score: '+15 Pts', category: 'Databases' },
    { id: 2, title: 'TypeScript Conditional Types Sandbox', difficulty: 'Advanced', time: '30 mins', score: '+25 Pts', category: 'Frontend' },
    { id: 3, title: 'CSS Grid Alignment Masterclass', difficulty: 'Beginner', time: '15 mins', score: '+10 Pts', category: 'UI/UX' },
    { id: 4, title: 'CI/CD Pipeline Troubleshooting Lab', difficulty: 'Intermediate', time: '25 mins', score: '+20 Pts', category: 'DevOps' }
  ]

  const currentChallenge = challenges.find((c) => c.id === activeChallengeId)

  const handleStart = (id: number) => {
    setActiveChallengeId(id)
    setSelectedOption(null)
    setSolvedStatus('idle')
  }

  const handleSubmit = () => {
    if (selectedOption === 1) {
      setSolvedStatus('success')
      setCompletedCount(2)
    } else {
      setSolvedStatus('fail')
    }
  }

  if (activeChallengeId && currentChallenge) {
    return (
      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider bg-slate-50 px-2 py-0.5 rounded">
              {currentChallenge.category}
            </span>
            <h3 className="text-base font-bold text-slate-800 mt-1">{currentChallenge.title}</h3>
          </div>
          <button
            type="button"
            onClick={() => setActiveChallengeId(null)}
            className="text-xs text-slate-500 hover:text-slate-800 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 font-medium"
          >
            ← Back to List
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-slate-600 font-medium leading-relaxed">
            Question: Which of the following SQL joins returns all rows from the left table, and the matched rows from the right table, filling with NULL values on the right side if there is no match?
          </p>

          <div className="space-y-2.5">
            {[
              { id: 0, text: 'A) INNER JOIN' },
              { id: 1, text: 'B) LEFT OUTER JOIN' },
              { id: 2, text: 'C) RIGHT OUTER JOIN' },
              { id: 3, text: 'D) FULL OUTER JOIN' }
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => { setSolvedStatus('idle'); setSelectedOption(opt.id); }}
                className={`w-full p-3.5 text-left text-xs font-semibold rounded-lg border transition-all duration-150 ${
                  selectedOption === opt.id
                    ? 'border-blue-600 bg-blue-50/30 text-blue-700'
                    : 'border-slate-100 bg-white hover:border-slate-200 text-slate-600'
                }`}
              >
                {opt.text}
              </button>
            ))}
          </div>

          <div className="pt-2">
            {solvedStatus === 'success' && (
              <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold">
                ✓ Correct! {currentChallenge.score} has been credited to your Readiness Profile.
              </div>
            )}
            {solvedStatus === 'fail' && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-700 rounded-lg text-xs font-semibold">
                ✗ Incorrect answer. Let's try again! (Hint: Look for the join that privileges the left table).
              </div>
            )}
          </div>

          <button
            type="button"
            disabled={selectedOption === null || solvedStatus === 'success'}
            onClick={handleSubmit}
            className={`w-full py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
              selectedOption === null || solvedStatus === 'success'
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md'
            }`}
          >
            Submit Answer
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Daily Coding Practice Challenges</h3>
          <p className="text-xs text-slate-500 mt-0.5">Solve interactive challenges to level up your SRE metrics</p>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400 font-medium">Daily Target</span>
          <div className="text-sm font-bold text-blue-600">{completedCount} / 2 Completed</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {challenges.map((ch) => (
          <div
            key={ch.id}
            className="bg-white p-5 rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider bg-slate-50 px-2 py-0.5 rounded">
                  {ch.category}
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  ch.difficulty === 'Beginner' ? 'bg-emerald-50 text-emerald-600' :
                  ch.difficulty === 'Intermediate' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                }`}>
                  {ch.difficulty}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-800 leading-snug">{ch.title}</h4>
              <div className="flex items-center gap-4 mt-4 text-xs text-slate-400">
                <span>⏱️ {ch.time}</span>
                <span>🔥 {ch.score}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleStart(ch.id)}
              className="mt-5 w-full py-2 bg-slate-50 hover:bg-blue-600 hover:text-white text-slate-600 rounded-lg text-xs font-semibold transition-all duration-200"
            >
              Start Challenge
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export function GoalsView(): React.ReactElement {
  const [goals, setGoals] = React.useState([
    { id: 1, text: 'Increase SQL Mastery Score to 90%', target: 'Databases', completed: false, deadline: 'June 20' },
    { id: 2, text: 'Complete CI/CD Github Actions project', target: 'DevOps', completed: true, deadline: 'June 18' },
    { id: 3, text: 'Fix responsiveness bugs in main dashboard template', target: 'Frontend', completed: false, deadline: 'June 22' },
    { id: 4, text: 'Maintain a 7-day practice streak', target: 'Consistency', completed: true, deadline: 'June 21' }
  ])

  const [isAdding, setIsAdding] = React.useState(false)
  const [newText, setNewText] = React.useState('')
  const [newCategory, setNewCategory] = React.useState('Databases')
  const [newDeadline, setNewDeadline] = React.useState('June 25')
  const [searchQuery, setSearchQuery] = React.useState('')

  const filteredGoals = React.useMemo(() => {
    return goals.filter((g) =>
      g.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.target.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [goals, searchQuery])

  const toggleGoal = (id: number) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g))
    )
  }

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newText.trim()) return

    setGoals((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        text: newText,
        target: newCategory,
        completed: false,
        deadline: newDeadline
      }
    ])
    setNewText('')
    setIsAdding(false)
  }

  const completionRate = Math.round((goals.filter((g) => g.completed).length / goals.length) * 100)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm md:col-span-1 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Goal Completion Rate</h3>
            <p className="text-xs text-slate-400 mt-1">Weekly milestones status</p>
          </div>
          <div className="my-6">
            <div className="text-4xl font-extrabold text-blue-600">{completionRate}%</div>
            <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Updated just now</span>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm md:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-800">Target Milestones</h3>
            {!isAdding && (
              <button
                type="button"
                onClick={() => setIsAdding(true)}
                className="text-[10px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-2.5 py-1 rounded transition-colors duration-150"
              >
                + Add Goal
              </button>
            )}
          </div>

          <input
            type="text"
            placeholder="Search milestones or categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border border-slate-100 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50/50"
          />

          {isAdding && (
            <form onSubmit={handleAddGoal} className="p-4 bg-slate-50 rounded-lg border border-slate-100 space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Goal Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Score > 90% in CI/CD pipeline challenge"
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded text-xs bg-white focus:outline-none"
                  >
                    <option value="Databases">Databases</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Consistency">Consistency</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Deadline</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. June 25"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold"
                >
                  Save Goal
                </button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {filteredGoals.map((g) => (
              <div
                key={g.id}
                onClick={() => toggleGoal(g.id)}
                className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-all duration-150 ${
                  g.completed
                    ? 'bg-slate-50/50 border-slate-100 line-through text-slate-400'
                    : 'bg-white border-slate-100 hover:border-slate-200 text-slate-700 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`h-4 w-4 rounded border flex items-center justify-center ${
                    g.completed ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
                  }`}>
                    {g.completed && <span className="text-[10px]">✓</span>}
                  </div>
                  <span className="text-xs font-medium">{g.text}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded uppercase">
                    {g.target}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">Due {g.deadline}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function PeersView(): React.ReactElement {
  const [groups, setGroups] = React.useState([
    { id: 1, name: 'Fullstack React Study Hub', members: 14, joined: false },
    { id: 2, name: 'SQL Schema Optimization', members: 8, joined: false }
  ])
  const [isAddingGroup, setIsAddingGroup] = React.useState(false)
  const [newGroupName, setNewGroupName] = React.useState('')
  const [groupSearchQuery, setGroupSearchQuery] = React.useState('')

  const filteredGroups = React.useMemo(() => {
    return groups.filter((g) =>
      g.name.toLowerCase().includes(groupSearchQuery.toLowerCase())
    )
  }, [groups, groupSearchQuery])

  const leaderboard = [
    { rank: 1, name: 'Emma Watson', score: 94, streak: '12 Days', avatar: 'EW' },
    { rank: 2, name: 'James Carter', score: 88, streak: '8 Days', avatar: 'JC' },
    { rank: 3, name: 'Alex Johnson (You)', score: 82, streak: '7 Days', avatar: 'AJ', isSelf: true },
    { rank: 4, name: 'Sophia Lin', score: 79, streak: '3 Days', avatar: 'SL' },
    { rank: 5, name: 'Michael Brown', score: 75, streak: '0 Days', avatar: 'MB' }
  ]

  const handleJoinGroup = (id: number) => {
    setGroups((prev) =>
      prev.map((g) => (g.id === id ? { ...g, joined: !g.joined, members: g.joined ? g.members - 1 : g.members + 1 } : g))
    )
  }

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newGroupName.trim()) return

    setGroups((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        name: newGroupName,
        members: 1,
        joined: true
      }
    ])
    setNewGroupName('')
    setIsAddingGroup(false)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm lg:col-span-2 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800">SRE Student Leaderboard</h3>
          <p className="text-xs text-slate-500 mt-0.5">Compare your standing with top learners in your cohort</p>
        </div>

        <div className="space-y-2 mt-4">
          {leaderboard.map((student) => (
            <div
              key={student.rank}
              className={`p-3 rounded-lg flex items-center justify-between border transition-all duration-150 ${
                student.isSelf
                  ? 'bg-blue-50/50 border-blue-200 font-semibold'
                  : 'bg-white border-slate-100 hover:border-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-400 w-4">{student.rank}</span>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  student.isSelf ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {student.avatar}
                </div>
                <span className="text-xs text-slate-700">{student.name}</span>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium">
                <span className="text-slate-400">🔥 {student.streak}</span>
                <span className="text-slate-800 font-bold">{student.score}% SRE</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm lg:col-span-1 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Active Study Groups</h3>
          <p className="text-xs text-slate-500 mt-0.5">Join a group to study together</p>
        </div>

        <div className="mt-3">
          <input
            type="text"
            placeholder="Search study groups..."
            value={groupSearchQuery}
            onChange={(e) => setGroupSearchQuery(e.target.value)}
            className="w-full px-2.5 py-1.5 border border-slate-100 rounded-lg text-[11px] focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50/50"
          />
        </div>

        <div className="space-y-3 my-4">
          {filteredGroups.map((group) => (
            <div key={group.id} className="p-3 border border-slate-100 rounded-lg hover:border-slate-200 transition-colors bg-white">
              <h4 className="text-xs font-bold text-slate-700">{group.name}</h4>
              <div className="flex justify-between items-center mt-2 text-[10px] text-slate-400 font-medium">
                <span>👥 {group.members} Active</span>
                <button
                  type="button"
                  onClick={() => handleJoinGroup(group.id)}
                  className={`font-bold hover:underline ${
                    group.joined ? 'text-emerald-600' : 'text-blue-600'
                  }`}
                >
                  {group.joined ? 'Joined ✓' : 'Join Group'}
                </button>
              </div>
            </div>
          ))}

          {isAddingGroup && (
            <form onSubmit={handleCreateGroup} className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-2">
              <input
                type="text"
                required
                placeholder="Study group name..."
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="w-full px-2 py-1.5 border border-slate-200 rounded text-[11px] focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <div className="flex justify-end gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsAddingGroup(false)}
                  className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded text-[10px] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[10px] font-semibold"
                >
                  Create
                </button>
              </div>
            </form>
          )}
        </div>

        {!isAddingGroup && (
          <button
            type="button"
            onClick={() => setIsAddingGroup(true)}
            className="w-full py-2 border border-dashed border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-700 text-xs font-semibold rounded-lg transition-colors"
          >
            + Create Study Group
          </button>
        )}
      </div>
    </div>
  )
}
