import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { motion } from 'framer-motion';
import { getDSARoundReview } from "@/services/api";
import Navbar from "@/components/Navbar";

export default function DsaMockReview() {
    const { sessionId } = useParams();
    const [sessionData, setSessionData] = useState<any>(null);
    const [activeQIndex, setActiveQIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReview = async () => {
            try {
                if (!sessionId) return;
                const res = await getDSARoundReview(sessionId);
                setSessionData(res.data.session);
            } catch (error) {
                console.error("Failed to load review:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchReview();
    }, [sessionId]);

    if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-[var(--text-muted)] font-mono"><div className="w-6 h-6 border-2 border-[var(--text-muted)] border-t-transparent rounded-full animate-spin mr-3"></div> Loading Report Card...</div>;
    if (!sessionData) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">Report not found.</div>;

    const currentQ = sessionData.questions[activeQIndex];
    const currentSubmission = sessionData.submissions.find((s: any) => s.questionId === currentQ.id);

    return (
        <div className="min-h-screen bg-[#050505] font-sans flex flex-col text-white selection:bg-purple-500/30 relative overflow-hidden">
            
            {/* Ambient Spotlight Background */}
            <div className="absolute inset-0 pointer-events-none z-0" style={{ backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)', backgroundSize: '24px 24px', maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)' }} />
            <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[150px] pointer-events-none z-0"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[150px] pointer-events-none z-0"></div>

            <div className="relative z-20">
                <Navbar />
            </div>

            <main className="flex-grow max-w-7xl mx-auto w-full p-6 flex flex-col gap-6 relative z-10">
                
                {/* --- HEADER: SCORECARD --- */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_0_40px_rgba(168,85,247,0.05)] relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-1 h-full ${sessionData.score === 3 ? 'bg-green-500' : sessionData.score > 0 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                    
                    <div>
                        <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-xs font-semibold uppercase tracking-widest">
                            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                            Evaluation Complete
                        </div>
                        <h1 className="text-3xl font-extrabold mb-2 text-white">Post-Match Report</h1>
                        <div className="text-[var(--text-muted)] flex items-center gap-2 text-sm font-medium">
                            <span className="bg-white/5 px-2 py-1 rounded border border-white/10 flex items-center gap-1.5">
                                {/* Building/Company SVG */}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                                </svg>
                                {sessionData.company} Mock OA
                            </span>
                            <span>•</span>
                            <span>{new Date(sessionData.completedAt || sessionData.startedAt).toLocaleDateString()}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="text-center">
                            <p className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-widest mb-1">Final Score</p>
                            <div className="text-5xl font-black font-mono tracking-tighter">
                                <span className={sessionData.score === 3 ? "text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.4)]" : sessionData.score > 0 ? "text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.4)]" : "text-red-400 drop-shadow-[0_0_15px_rgba(248,113,113,0.4)]"}>
                                    {sessionData.score}
                                </span>
                                <span className="text-gray-600 text-3xl">/3</span>
                            </div>
                        </div>
                        <Link to="/dashboard" className="px-6 py-3 bg-white/10 border border-white/20 text-white font-bold rounded-xl hover:bg-white hover:text-black transition-all shadow-lg flex items-center gap-2 group">
                            Back to Dashboard
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:translate-x-1 transition-transform">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        </Link>
                    </div>
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-6 h-[700px]">
                    
                    {/* --- LEFT PANEL: QUESTION SELECTION & AI FEEDBACK --- */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="w-full lg:w-1/3 flex flex-col gap-4">
                        <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex flex-col gap-2 shrink-0">
                            {sessionData.questions.map((q: any, idx: number) => {
                                const sub = sessionData.submissions.find((s: any) => s.questionId === q.id);
                                const isAC = sub?.verdict === "AC";
                                
                                return (
                                    <button
                                        key={q.id}
                                        onClick={() => setActiveQIndex(idx)}
                                        className={`p-4 rounded-xl text-left border transition-all flex items-center justify-between group ${
                                            activeQIndex === idx 
                                            ? 'bg-white/10 border-white/20 shadow-inner' 
                                            : 'bg-transparent border-transparent hover:bg-white/5'
                                        }`}
                                    >
                                        <div>
                                            <div className="text-sm font-bold text-white mb-1 group-hover:text-purple-300 transition-colors">Q{idx + 1}. {q.title}</div>
                                            <div className={`text-[10px] uppercase tracking-wider font-bold ${q.difficulty === 'EASY' ? 'text-green-400' : q.difficulty === 'MEDIUM' ? 'text-yellow-400' : 'text-red-400'}`}>{q.difficulty}</div>
                                        </div>
                                        <div className={`text-xs font-black px-2 py-1 rounded ${isAC ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                            {isAC ? 'PASSED' : 'FAILED'}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* AI FEEDBACK BOX */}
                        <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-2xl flex-grow overflow-y-auto custom-scrollbar p-6 flex flex-col relative">
                            <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-white/10 pb-4 shrink-0">
                                {/* Sparkles SVG */}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
                                </svg>
                                AI Code Review
                            </h3>
                            
                            {currentSubmission ? (
                                <div className="space-y-6 flex-grow">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-gray-400 font-medium">Verdict:</span>
                                        <div className={`px-3 py-1 rounded font-mono text-sm font-bold ${currentSubmission.verdict === 'AC' ? 'bg-green-500/10 text-green-400 border border-green-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'}`}>
                                            {currentSubmission.verdict}
                                        </div>
                                    </div>
                                    
                                    <div className="text-sm text-gray-300 leading-relaxed bg-blue-500/5 border border-blue-500/10 p-5 rounded-xl shadow-inner relative">
                                        <span className="absolute top-2 left-3 text-blue-500/30 text-4xl leading-none font-serif">"</span>
                                        <div className="relative z-10 pt-2 italic">
                                            {currentSubmission.aiFeedback || "AI feedback is still generating..."}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-sm text-gray-500 flex items-center justify-center flex-grow italic">No submission found for this question.</div>
                            )}
                        </div>
                    </motion.div>

                    {/* --- RIGHT PANEL: READ-ONLY EDITOR --- */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="w-full lg:w-2/3 bg-[#0d0d0d] border border-white/10 rounded-2xl overflow-hidden flex flex-col relative shadow-2xl">
                        <div className="bg-white/5 border-b border-white/10 p-4 flex justify-between items-center shrink-0 backdrop-blur-md">
                            <div className="font-bold text-sm text-white flex items-center gap-2.5">
                                {/* Document/Code SVG */}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                </svg>
                                {currentQ.title}
                            </div>
                            <div className="text-xs font-mono bg-black/50 px-3 py-1 border border-white/10 rounded-md text-[var(--text-muted)] uppercase tracking-wider">
                                {currentSubmission?.language || 'N/A'}
                            </div>
                        </div>

                        <div className="flex-grow relative">
                            {/* Overlay to visually imply read-only state */}
                            <div className="absolute inset-0 z-10 pointer-events-none shadow-[inset_0_0_50px_rgba(0,0,0,0.5)]"></div>
                            
                            <Editor
                                height="100%"
                                language={currentSubmission?.language === "cpp" ? "cpp" : currentSubmission?.language || "javascript"}
                                theme="vs-dark"
                                value={currentSubmission?.code || "// No code was submitted during the exam."}
                                options={{ 
                                    readOnly: true, 
                                    minimap: { enabled: false }, 
                                    fontSize: 14, 
                                    padding: { top: 16 },
                                    scrollBeyondLastLine: false,
                                    fontFamily: "'Fira Code', 'JetBrains Mono', monospace"
                                }}
                            />
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
