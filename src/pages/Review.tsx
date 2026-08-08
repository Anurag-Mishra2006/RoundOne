import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { motion, type Variants } from "framer-motion";

function Review() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Grab the session data we passed from the Dashboard
  const session = location.state?.session;

  // If someone refreshes the page, the state drops. Send them back to dashboard.
  if (!session) {
    navigate("/dashboard");
    return null;
  }

  // Calculate stats
  const totalScore = session.totalScore;
  const maxScore = session.evaluations.reduce((sum: number, e: any) => sum + e.maxScore, 0);
  const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

  const getScoreColor = (score: number, max: number): string => {
    const pct = (score / max) * 100;
    if (pct >= 75) return "var(--success)";
    if (pct >= 50) return "var(--warning)";
    return "var(--danger)";
  };

  const getRoundLabel = (round: string): string => {
    if (round === "hr") return "HR Round";
    if (round === "technical") return "Technical Round";
    if (round === "dsa") return "DSA Round";
    return round;
  };

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  return (
    <div className="min-h-screen bg-[#050505] font-sans flex flex-col relative overflow-hidden selection:bg-purple-500/30">
      
      {/* Ambient Spotlight Background */}
      <div className="absolute inset-0 pointer-events-none z-0" style={{ backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)', backgroundSize: '24px 24px', maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)' }} />
      <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[150px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[150px] pointer-events-none z-0"></div>

      <div className="relative z-20">
        <Navbar />
      </div>

      <main className="flex-grow px-4 py-12 relative z-10 max-w-4xl mx-auto w-full">

        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          
          {/* Header */}
          <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 border-b border-white/10 pb-6">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">Interview Review</h1>
              <div className="inline-flex items-center gap-2 text-[var(--text-muted)] text-sm font-medium px-3 py-1 rounded-md bg-white/5 border border-white/10">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                  </svg>
                  {session.company} • {session.role} • {new Date(session.createdAt).toLocaleDateString()}
              </div>
            </div>
            <button 
              onClick={() => navigate("/dashboard")}
              className="px-5 py-2.5 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-colors flex items-center gap-2 group text-sm"
            >
              {/* Arrow Left SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:-translate-x-1 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
              </svg>
              Back to Dashboard
            </button>
          </motion.div>

          {/* Overall Score */}
          <motion.div variants={itemVariants} className="rounded-3xl border border-[var(--border)] bg-[#0a0a0a]/80 backdrop-blur-xl p-10 mb-10 text-center shadow-2xl relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-full h-1 ${percentage >= 75 ? 'bg-[var(--success)]' : percentage >= 50 ? 'bg-[var(--warning)]' : 'bg-[var(--danger)]'}`}></div>
            
            <p className="text-xs uppercase tracking-widest font-bold text-[var(--text-muted)] mb-4">Total Score</p>
            <div className="flex items-end justify-center gap-2 mb-6">
                <span className="text-7xl font-extrabold font-mono tracking-tighter" style={{ color: getScoreColor(totalScore, maxScore) }}>
                    {totalScore} 
                </span>
                <span className="text-2xl text-[var(--text-muted)] mb-2 font-mono">/ {maxScore}</span>
            </div>
            
            <div className="h-3 w-full max-w-md mx-auto rounded-full bg-white/5 border border-white/10 overflow-hidden relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                  className="h-full rounded-full transition-all relative"
                  style={{ backgroundColor: getScoreColor(totalScore, maxScore) }}
                >
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                </motion.div>
            </div>
          </motion.div>

          {/* Q&A Breakdown */}
          <div className="space-y-6">
            <motion.h2 variants={itemVariants} className="text-xl font-bold text-white mb-4">Question Breakdown</motion.h2>
            
            {session.evaluations.map((evaluation: any, index: number) => (
              <motion.div variants={itemVariants} key={evaluation.id} className="rounded-2xl border border-[var(--border)] bg-[#0a0a0a]/80 backdrop-blur-xl overflow-hidden shadow-lg hover:border-[var(--border)]/80 transition-colors">
                
                {/* Header bar */}
                <div className="bg-white/5 px-6 py-4 border-b border-[var(--border)] flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent)]">
                    {getRoundLabel(evaluation.round)} — Q{index + 1}
                  </span>
                  <span className="font-bold text-lg font-mono" style={{ color: getScoreColor(evaluation.score, evaluation.maxScore) }}>
                    {evaluation.score} <span className="text-xs text-[var(--text-muted)]">/ {evaluation.maxScore}</span>
                  </span>
                </div>

                <div className="p-6 md:p-8 space-y-6">
                  {/* Question & Answer */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">Question</p>
                    <p className="text-base font-medium text-white mb-6">{evaluation.question}</p>
                    
                    <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">Your Answer</p>
                    <div className="p-4 bg-[var(--bg)] border border-[var(--border)] rounded-xl shadow-inner">
                      <p className="text-[var(--text-muted)] font-mono text-sm whitespace-pre-wrap leading-relaxed">
                        {evaluation.candidateAnswer || "No answer provided"}
                      </p>
                    </div>
                  </div>

                  {/* Feedback */}
                  <div className="bg-blue-500/5 border-l-4 border-blue-500 p-5 rounded-r-xl">
                    <p className="text-xs font-bold uppercase tracking-wider text-blue-500 mb-2 flex items-center gap-2">
                        {/* Sparkles SVG */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
                        </svg>
                        AI Feedback
                    </p>
                    <p className="text-sm text-gray-300 leading-relaxed italic">"{evaluation.feedback}"</p>
                  </div>

                  {/* Grid for Strengths & Improvements */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 bg-[var(--success)]/5 border border-[var(--success)]/20 rounded-xl">
                      <p className="text-xs font-bold text-[var(--success)] uppercase tracking-wider mb-3 flex items-center gap-2">
                        {/* Check SVG */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        Strong Points
                      </p>
                      <ul className="space-y-2">
                        {evaluation.strongPoints.map((pt: string, i: number) => (
                          <li key={i} className="text-sm text-[var(--text)] flex gap-2">
                            <span className="text-[var(--success)] mt-0.5">•</span> 
                            <span className="leading-relaxed">{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="p-5 bg-[var(--warning)]/5 border border-[var(--warning)]/20 rounded-xl">
                      <p className="text-xs font-bold text-[var(--warning)] uppercase tracking-wider mb-3 flex items-center gap-2">
                        {/* Trending Up SVG */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                        </svg>
                        To Improve
                      </p>
                      <ul className="space-y-2">
                        {evaluation.improvements.map((pt: string, i: number) => (
                          <li key={i} className="text-sm text-[var(--text)] flex gap-2">
                            <span className="text-[var(--warning)] mt-0.5">•</span> 
                            <span className="leading-relaxed">{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                </div>
              </motion.div>
            ))}
          </div>

        </motion.div>
      </main>
    </div>
  );
}

export default Review;
