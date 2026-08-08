import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPublicReport } from "@/services/api";
import { motion, type Variants } from "framer-motion";

function PublicReport() {
  const { id } = useParams<{ id: string }>();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        if (!id) return;
        const response = await getPublicReport(id);
        setSession(response.data.session);
      } catch (err) {
        setError("This interview report does not exist or has been deleted.");
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center text-[var(--text-muted)] font-mono">
        <div className="w-6 h-6 border-2 border-[var(--text-muted)] border-t-transparent rounded-full animate-spin mr-3"></div> 
        Loading public report...
    </div>
  );

  if (error || !session) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="bg-[var(--danger)]/10 border border-[var(--danger)]/30 p-6 rounded-2xl flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-[var(--danger)]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-[var(--danger)] font-bold">{error}</p>
        </div>
    </div>
  );

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

      <main className="flex-grow px-4 py-12 relative z-10 w-full max-w-4xl mx-auto">
      
        {/* Viral Header CTA */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 p-6 bg-[#0a0a0a]/80 backdrop-blur-xl border border-[var(--accent)]/50 rounded-2xl flex flex-col md:flex-row items-center justify-between shadow-[0_0_30px_rgba(168,85,247,0.15)] group relative overflow-hidden">
          {/* Subtle CTA Glow */}
          <div className="absolute -right-20 -top-20 w-40 h-40 bg-[var(--accent)]/10 blur-[50px] rounded-full group-hover:bg-[var(--accent)]/20 transition-colors duration-500 pointer-events-none"></div>
          
          <div className="flex items-center gap-4 mb-4 md:mb-0 relative z-10">
              <img src="/logo.svg?v=2" alt="RoundOne" className="w-10 h-10 rounded-xl border border-white/10" />
              <div>
                  <h2 className="text-white font-extrabold text-lg">RoundOne AI Mock Interview</h2>
                  <p className="text-[var(--text-muted)] text-sm font-medium">Can you beat {session.user.name.split(' ')[0]}'s score?</p>
              </div>
          </div>
          <Link to="/register" className="w-full md:w-auto px-8 py-3.5 bg-[var(--accent)] text-white font-bold rounded-xl hover:bg-[var(--accent-hover)] transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 shadow-lg relative z-10 group/btn">
            Try it for Free 
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
            </svg>
          </Link>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" animate="visible">
            {/* Header */}
            <motion.div variants={itemVariants} className="mb-10 text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3">
                {session.user.name}'s Report Card
            </h1>
            <div className="inline-flex items-center gap-2 text-[var(--text-muted)] text-sm font-medium px-4 py-1.5 rounded-full border border-white/10 bg-white/5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                </svg>
                {session.company} • {session.role} • {new Date(session.createdAt).toLocaleDateString()}
            </div>
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
                        {/* Shimmer effect on progress bar */}
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Q&A Breakdown */}
            <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">Interview Breakdown</h3>
            {session.evaluations.map((evaluation: any, index: number) => (
                <motion.div variants={itemVariants} key={evaluation.id} className="rounded-2xl border border-[var(--border)] bg-[#0a0a0a]/80 backdrop-blur-xl overflow-hidden shadow-lg hover:border-[var(--border)]/80 transition-colors">
                <div className="bg-white/5 px-6 py-4 border-b border-[var(--border)] flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
                    {getRoundLabel(evaluation.round)} — Q{index + 1}
                    </span>
                    <span className="font-bold text-lg font-mono" style={{ color: getScoreColor(evaluation.score, evaluation.maxScore) }}>
                    {evaluation.score} <span className="text-xs text-[var(--text-muted)]">/ {evaluation.maxScore}</span>
                    </span>
                </div>
                <div className="p-6 md:p-8 space-y-6">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">Question</p>
                        <p className="text-base font-medium text-white">{evaluation.question}</p>
                    </div>
                    <div className="bg-blue-500/5 border-l-4 border-blue-500 p-5 rounded-r-xl">
                        <p className="text-xs font-bold uppercase tracking-wider text-blue-500 mb-2 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
                            </svg>
                            AI Feedback
                        </p>
                        <p className="text-sm text-gray-300 leading-relaxed italic">"{evaluation.feedback}"</p>
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

export default PublicReport;
