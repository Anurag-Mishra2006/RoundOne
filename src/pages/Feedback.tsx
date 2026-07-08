import { useNavigate } from "react-router-dom"
import useSessionStore from "@/store/sessionStore"
import type { EvaluateResult } from "@/types/index"
import Navbar from "@/components/Navbar"
import { motion, type Variants } from "framer-motion"

function Feedback() {
  const navigate = useNavigate()
  const { evaluations, company, clearSession } = useSessionStore()

  const totalScore = evaluations.reduce((sum, e) => sum + e.score, 0)
  const maxScore = evaluations.reduce((sum, e) => sum + e.maxScore, 0)
  const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0

  const getScoreColor = (score: number, max: number): string => {
    const pct = (score / max) * 100
    if (pct >= 75) return "var(--success)"
    if (pct >= 50) return "var(--warning)"
    return "var(--danger)"
  }

  const getOverallMessage = (): string => {
    if (percentage >= 80) return "Excellent performance — you're interview ready! 🚀"
    if (percentage >= 60) return "Good effort — a bit more prep and you'll nail it. 👍"
    if (percentage >= 40) return "Decent start — focus on the improvement areas below. 📚"
    return "Keep practicing — every attempt makes you sharper. 💪"
  }

  const getRoundLabel = (round: string): string => {
    if (round === "hr") return "HR"
    if (round === "technical") return "Tech"
    if (round === "dsa") return "DSA"
    return round
  }

  const handleStartOver = () => {
    clearSession()
    navigate("/onboarding")
  }

  // redirect if no evaluations
  if (evaluations.length === 0) {
    navigate("/onboarding")
    return null
  }

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };
  
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] font-sans flex flex-col">
      <Navbar />
      
      <div className="flex-grow px-4 py-12 relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-[20%] right-[-5%] w-72 h-72 bg-purple-900/10 rounded-full blur-[100px] pointer-events-none"></div>

        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-5xl mx-auto space-y-8 z-10 relative">

          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-10">
            <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/30 text-[var(--accent)] text-xs font-bold uppercase tracking-widest shadow-[0_0_10px_rgba(170,59,255,0.1)]">
              Interview Complete
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
              Your Results
            </h1>
            {company && (
              <p className="text-lg text-[var(--text-muted)]">
                Mock interview for <span className="text-white font-bold">{company}</span>
              </p>
            )}
          </motion.div>

          {/* Top Area: Bento Box Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              
              {/* Left Column: Massive Score Card */}
              <motion.div variants={itemVariants} className="lg:col-span-1 flex flex-col items-center justify-center p-8 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-xl shadow-black/30 relative overflow-hidden group hover:border-[var(--accent)]/50 transition-colors">
                  <div className={`absolute top-0 w-full h-1 ${percentage >= 75 ? 'bg-[var(--success)]' : percentage >= 50 ? 'bg-[var(--warning)]' : 'bg-[var(--danger)]'}`}></div>
                  <h2 className="text-lg font-bold text-[var(--text)] mb-6">Overall Score</h2>
                  
                  <div className="relative mb-6">
                      {/* Animated SVG Ring */}
                      <svg className="w-40 h-40 transform -rotate-90">
                          <circle cx="80" cy="80" r="72" stroke="var(--border)" strokeWidth="8" fill="none" />
                          <motion.circle 
                              cx="80" cy="80" r="72" 
                              stroke={percentage >= 75 ? 'var(--success)' : percentage >= 50 ? 'var(--warning)' : 'var(--danger)'} 
                              strokeWidth="8" fill="none" 
                              strokeDasharray="452" 
                              initial={{ strokeDashoffset: 452 }}
                              animate={{ strokeDashoffset: 452 - (452 * percentage) / 100 }}
                              transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                              className="drop-shadow-lg"
                              strokeLinecap="round"
                          />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className={`text-5xl font-extrabold ${percentage >= 75 ? 'text-[var(--success)]' : percentage >= 50 ? 'text-[var(--warning)]' : 'text-[var(--danger)]'}`}>
                            {totalScore}
                          </span>
                          <span className="text-sm font-medium text-[var(--text-muted)] mt-1">/ {maxScore}</span>
                      </div>
                  </div>
                  
                  <p className="text-sm font-medium text-center text-[var(--text)] px-4">
                    {getOverallMessage()}
                  </p>
              </motion.div>

              {/* Right Column: Actions & Quick Stats */}
              <motion.div variants={itemVariants} className="lg:col-span-2 flex flex-col gap-6">
                  
                  {/* Actions Box */}
                  <div className="p-8 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-xl shadow-black/30 flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Ready to try again?</h3>
                      <p className="text-sm text-[var(--text-muted)]">Your progress has been saved to your dashboard.</p>
                    </div>
                    <div className="flex flex-col w-full sm:w-auto gap-3">
                      <button
                        onClick={handleStartOver}
                        className="px-6 py-3 rounded-xl bg-[var(--accent)] text-sm font-bold text-white hover:bg-[var(--accent-hover)] transition-all shadow-[0_0_15px_rgba(170,59,255,0.2)] hover:shadow-[0_0_25px_rgba(170,59,255,0.4)] hover:-translate-y-1 text-center whitespace-nowrap"
                      >
                        Start New Interview ➔
                      </button>
                      <button
                        onClick={() => navigate("/dashboard")}
                        className="px-6 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-sm font-bold text-[var(--text)] hover:text-white hover:border-[var(--text-muted)] transition-all text-center whitespace-nowrap"
                      >
                        Go to Dashboard
                      </button>
                    </div>
                  </div>

                  {/* Quick Summary Grid */}
                  <div className="grid grid-cols-3 gap-4 h-full">
                    {['hr', 'technical', 'dsa'].map((round) => {
                       const roundEvals = evaluations.filter(e => e.round === round);
                       const rScore = roundEvals.reduce((s, e) => s + e.score, 0);
                       const rMax = roundEvals.reduce((s, e) => s + e.maxScore, 0);
                       
                       return (
                        <div key={round} className="p-5 bg-[var(--surface)] border border-[var(--border)] rounded-2xl flex flex-col justify-center items-center text-center">
                          <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">{getRoundLabel(round)}</p>
                          <p className={`text-2xl font-bold ${rMax > 0 && (rScore/rMax) >= 0.75 ? 'text-[var(--success)]' : rMax > 0 && (rScore/rMax) >= 0.5 ? 'text-[var(--warning)]' : 'text-[var(--danger)]'}`}>
                            {rScore} <span className="text-sm text-[var(--text-muted)] font-normal">/ {rMax || 0}</span>
                          </p>
                        </div>
                       )
                    })}
                  </div>
              </motion.div>
          </div>

          {/* Detailed Question Breakdown */}
          <motion.div variants={itemVariants} className="pt-8">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-2xl font-bold text-white">Detailed Feedback</h2>
              <div className="h-px flex-grow bg-gradient-to-r from-[var(--border)] to-transparent"></div>
            </div>

            <div className="space-y-6">
              {evaluations.map((evaluation: EvaluateResult, index: number) => (
                <div key={index} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-lg shadow-black/20 hover:border-[var(--accent)]/30 transition-colors">
                  
                  {/* Header Bar */}
                  <div className="bg-[var(--bg)]/50 px-6 py-4 border-b border-[var(--border)] flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] font-bold flex items-center justify-center text-sm">
                        Q{index + 1}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                        {getRoundLabel(evaluation.round)} Round
                      </span>
                    </div>
                    <span
                      className="text-xl font-bold"
                      style={{ color: getScoreColor(evaluation.score, evaluation.maxScore) }}
                    >
                      {evaluation.score}<span className="text-sm text-[var(--text-muted)] font-normal">/{evaluation.maxScore}</span>
                    </span>
                  </div>

                  <div className="p-6 md:p-8 space-y-6">
                    {/* Q & A Section */}
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">Question</p>
                        <p className="text-base text-[var(--text)] font-medium">{evaluation.question}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">Your Answer</p>
                        <div className="p-4 bg-[var(--bg)] border border-[var(--border)] rounded-lg">
                          <p className="text-sm text-[var(--text-muted)] whitespace-pre-wrap font-mono leading-relaxed">{evaluation.answer || "No answer provided"}</p>
                        </div>
                      </div>
                    </div>

                    {/* AI Feedback */}
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">AI Analysis</p>
                      <p className="text-sm text-[var(--text)] leading-relaxed bg-blue-500/5 border-l-4 border-blue-500 p-4 rounded-r-lg">
                        {evaluation.feedback}
                      </p>
                    </div>

                    {/* Strengths & Weaknesses Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-5 bg-[var(--success)]/5 border border-[var(--success)]/20 rounded-xl">
                        <p className="text-xs font-bold text-[var(--success)] uppercase tracking-wider mb-3 flex items-center gap-2"><span>✓</span> Strong Points</p>
                        <ul className="space-y-2">
                          {evaluation.strongPoints.map((point, i) => (
                            <li key={i} className="text-sm text-[var(--text)] flex items-start gap-2">
                              <span className="text-[var(--success)] mt-0.5">•</span>
                              <span className="leading-relaxed">{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-5 bg-[var(--warning)]/5 border border-[var(--warning)]/20 rounded-xl">
                        <p className="text-xs font-bold text-[var(--warning)] uppercase tracking-wider mb-3 flex items-center gap-2"><span>→</span> Areas to Improve</p>
                        <ul className="space-y-2">
                          {evaluation.improvements.map((item, i) => (
                            <li key={i} className="text-sm text-[var(--text)] flex items-start gap-2">
                              <span className="text-[var(--warning)] mt-0.5">•</span>
                              <span className="leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Specific Suggestion */}
                    {evaluation.suggestion && (
                      <div className="p-4 bg-[var(--accent)]/5 border border-[var(--accent)]/20 rounded-xl flex gap-3 items-start">
                        <span className="text-xl">💡</span>
                        <div>
                          <p className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider mb-1">Key Takeaway</p>
                          <p className="text-sm text-[var(--text-muted)] italic">{evaluation.suggestion}</p>
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </motion.div>
      </div>
    </div>
  )
}

export default Feedback
