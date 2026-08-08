import { useNavigate } from "react-router-dom"
import { useEffect, useRef } from "react"
import useSessionStore from "@/store/sessionStore"
import type { EvaluateResult } from "@/types/index"
import Navbar from "@/components/Navbar"
import { motion, type Variants } from "framer-motion"
import { saveSessionToDb } from "@/services/api"

function Feedback() {
  const navigate = useNavigate()

  const {
    evaluations,
    company,
    role,
    level,
    language,
    clearSession,
  } = useSessionStore();
  const hasSaved = useRef(false)

  const totalScore = evaluations.reduce((sum, e) => sum + e.score, 0)
  const maxScore = evaluations.reduce((sum, e) => sum + e.maxScore, 0)
  const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0
  
  useEffect(() => {
    if (evaluations.length > 0 && !hasSaved.current) {
      hasSaved.current = true;

      saveSessionToDb({
        company,
        role: role || "Software Engineer",
        level: level || "Junior",
        language: language || "C++",
        evaluations,
      }).catch(err => {
        console.error("Failed to save interview session:", err);
        hasSaved.current = false;
      });
    }
  }, [evaluations, company, role, level, totalScore, language]);

  const getScoreColor = (score: number, max: number): string => {
    const pct = (score / max) * 100
    if (pct >= 75) return "var(--success)"
    if (pct >= 50) return "var(--warning)"
    return "var(--danger)"
  }

  // Helper to return text + matching SVG icon
  const getOverallMessage = (): { text: string, icon: any } => {
    if (percentage >= 80) return { 
        text: "Excellent performance — you're interview ready!", 
        icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-400 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.438 4.438 0 002.798 2.839m9.022-6.234a4.492 4.492 0 003.15 3.152 4.442 4.442 0 002.876-2.04" /></svg> 
    };
    if (percentage >= 60) return { 
        text: "Good effort — a bit more prep and you'll nail it.", 
        icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-yellow-400 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" /></svg> 
    };
    if (percentage >= 40) return { 
        text: "Decent start — focus on the improvement areas below.", 
        icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-orange-400 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg> 
    };
    return { 
        text: "Keep practicing — every attempt makes you sharper.", 
        icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-red-400 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" /></svg> 
    };
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

  if (evaluations.length === 0) {
    navigate("/onboarding")
    return null
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  const message = getOverallMessage();

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

              <div className="flex items-center justify-center gap-2 px-4">
                  {message.icon}
                  <p className="text-sm font-medium text-center text-[var(--text)]">
                    {message.text}
                  </p>
              </div>
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
                    className="px-6 py-3 rounded-xl bg-[var(--accent)] text-sm font-bold text-white hover:bg-[var(--accent-hover)] transition-all shadow-[0_0_15px_rgba(170,59,255,0.2)] hover:shadow-[0_0_25px_rgba(170,59,255,0.4)] hover:-translate-y-1 text-center whitespace-nowrap flex items-center justify-center gap-2 group"
                  >
                    Start New Interview
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 group-hover:translate-x-1 transition-transform">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                    </svg>
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
                      <p className={`text-2xl font-bold ${rMax > 0 && (rScore / rMax) >= 0.75 ? 'text-[var(--success)]' : rMax > 0 && (rScore / rMax) >= 0.5 ? 'text-[var(--warning)]' : 'text-[var(--danger)]'}`}>
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
                        <p className="text-xs font-bold text-[var(--success)] uppercase tracking-wider mb-3 flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Strong Points
                        </p>
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
                        <p className="text-xs font-bold text-[var(--warning)] uppercase tracking-wider mb-3 flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                          </svg>
                          Areas to Improve
                        </p>
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
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-[var(--accent)] shrink-0">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.2m-1.5.2a6.01 6.01 0 01-1.5-.2m1.5.2V8.25m0 0c0-1.657 1.343-3 3-3h1.5M12 8.25c0-1.657-1.343-3-3-3H7.5m10.5 3a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
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
