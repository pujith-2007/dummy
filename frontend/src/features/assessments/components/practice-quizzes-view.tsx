import * as React from 'react'
import { Loader2, AlertCircle, Award, ArrowRight, ChevronRight, Play } from 'lucide-react'

interface Quiz {
  name: string
  questions: number
  duration: string
  reward: string
}

interface PracticeQuizzesViewProps {
  quizzes: Quiz[]
  selectedQuiz: string | null
  isLoadingQuiz: boolean
  quizError: string | null
  quizScore: number | null
  activeQuestions: any[]
  currentQuestionIdx: number
  quizAnswers: number[]
  handleStartQuiz: (quizName: string) => void
  setSelectedQuiz: (quiz: string | null) => void
  handleSelectQuizOption: (optIdx: number) => void
  handleNextQuizQuestion: () => void
  setActiveTab: (tab: string) => void
}

export function PracticeQuizzesView({
  quizzes,
  selectedQuiz,
  isLoadingQuiz,
  quizError,
  quizScore,
  activeQuestions,
  currentQuestionIdx,
  quizAnswers,
  handleStartQuiz,
  setSelectedQuiz,
  handleSelectQuizOption,
  handleNextQuizQuestion,
  setActiveTab
}: PracticeQuizzesViewProps) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-heading">Practice Assessments</h1>
        <p className="text-slate-400 mt-1">Complete modular assessments to resolve gaps and raise your overall competency score.</p>
      </div>

      {selectedQuiz ? (
        <div className="p-8 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-[#0B0F19]/80 shadow-sm max-w-2xl mx-auto space-y-6 animate-fade-in">
          {isLoadingQuiz ? (
            <div className="text-center py-12 space-y-4">
              <Loader2 className="w-12 h-12 text-[#6366F1] animate-spin mx-auto" />
              <div>
                <h3 className="text-lg font-bold text-slate-100 font-heading">AI Scoring Engine Active</h3>
                <p className="text-sm text-slate-400 mt-1">Generating technical MCQ modules & syncing proctor metrics...</p>
              </div>
            </div>
          ) : quizError ? (
            <div className="text-center py-8 space-y-4">
              <div className="p-3 w-14 h-14 bg-rose-950/50 border border-rose-900/50 rounded-full flex items-center justify-center mx-auto text-rose-500">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100 font-heading">Connection Error</h3>
                <p className="text-sm text-slate-400 mt-1">{quizError}</p>
              </div>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => handleStartQuiz(selectedQuiz)}
                  className="px-5 py-2.5 bg-[#6366F1] hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl cursor-pointer shadow-sm transition-all"
                >
                  Retry Connection
                </button>
                <button
                  onClick={() => setSelectedQuiz(null)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl cursor-pointer shadow-sm transition-all border border-slate-700"
                >
                  Back to Quizzes
                </button>
              </div>
            </div>
          ) : quizScore !== null ? (
            <div className="text-center py-6 space-y-6">
              <div className="p-3 w-14 h-14 bg-indigo-950/50 border border-[#6366F1]/30 rounded-full flex items-center justify-center mx-auto text-[#6366F1]">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#6366F1] uppercase tracking-wider block">Quiz Completed</span>
                <h2 className="text-2xl font-bold text-slate-100 mt-1 font-heading">{selectedQuiz}</h2>
              </div>
              <div className="py-4 border-y border-slate-800 max-w-xs mx-auto">
                <span className="text-slate-400 block text-xs">Your Score</span>
                <span className="text-4xl font-extrabold text-[#6366F1] font-heading">
                  {quizScore} / {activeQuestions.length}
                </span>
                <span className="text-xs text-slate-500 block mt-1">
                  ({Math.round((quizScore / activeQuestions.length) * 100)}% Accuracy)
                </span>
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setSelectedQuiz(null)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl cursor-pointer shadow-sm transition-all border border-slate-700"
                >
                  Practice More Quizzes
                </button>
                <button
                  onClick={() => setActiveTab('overview')}
                  className="px-5 py-2.5 bg-[#6366F1] hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl cursor-pointer shadow-sm transition-all flex items-center gap-1"
                >
                  Check My Readiness
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold text-[#6366F1] uppercase tracking-wider block">Active Exam</span>
                  <h2 className="text-xl font-bold text-slate-100 mt-1 font-heading">{selectedQuiz}</h2>
                </div>
                <button 
                  onClick={() => setSelectedQuiz(null)}
                  className="text-slate-400 hover:text-slate-200 text-xs font-bold px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg cursor-pointer"
                >
                  Exit Quiz
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-500">
                  <span>Question {currentQuestionIdx + 1} of {activeQuestions.length}</span>
                  <span className="text-[#6366F1]">Verified Proctoring Enabled</span>
                </div>
                <p className="text-slate-200 font-semibold text-base leading-relaxed font-heading">
                  {activeQuestions[currentQuestionIdx]?.question}
                </p>

                <div className="space-y-3 pt-2">
                  {activeQuestions[currentQuestionIdx]?.options.map((opt: string, oIdx: number) => (
                    <button
                      key={oIdx}
                      onClick={() => handleSelectQuizOption(oIdx)}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left cursor-pointer transition-all ${
                        quizAnswers[currentQuestionIdx] === oIdx
                          ? 'bg-indigo-950/30 border-[#6366F1]/50 text-indigo-300 font-semibold'
                          : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        quizAnswers[currentQuestionIdx] === oIdx
                          ? 'border-[#6366F1] bg-[#6366F1] text-white'
                          : 'border-slate-600 bg-transparent'
                      }`}>
                        {quizAnswers[currentQuestionIdx] === oIdx && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                      <span className="text-sm font-medium">{opt}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleNextQuizQuestion}
                disabled={quizAnswers[currentQuestionIdx] === undefined}
                className="w-full py-3 bg-[#6366F1] hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all shadow-sm cursor-pointer text-sm disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-1"
              >
                {currentQuestionIdx < activeQuestions.length - 1 ? 'Next Question' : 'Submit Exam'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {quizzes.map((quiz, idx) => (
            <div key={idx} className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0F19]/80 shadow-sm flex flex-col justify-between min-h-[220px] hover:border-[#6366F1]/50 transition-all duration-300">
              <div>
                <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-900/50 px-2 py-0.5 rounded">
                  {quiz.duration}
                </span>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mt-4 leading-snug font-heading">{quiz.name}</h3>
                <span className="text-xs text-slate-400 mt-2 block">{quiz.questions} multiple choice questions</span>
                <span className="text-xs text-emerald-600 dark:text-emerald-500 font-semibold mt-1 block">{quiz.reward} potential reward</span>
              </div>

              <button
                onClick={() => handleStartQuiz(quiz.name)}
                className="w-full py-2.5 bg-[#6366F1] hover:bg-indigo-500 text-white text-xs font-bold rounded-xl mt-6 transition-all flex justify-center items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-white text-white" />
                Start Test
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
