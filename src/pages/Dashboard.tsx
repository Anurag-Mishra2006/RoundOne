import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import useUserStore from "@/store/authStore";
import { getDsaSubmissions, getInterviewHistory, getDSARoundHistory } from "@/services/api";
import ActivityHeatmap from "@/components/ActivityHeatmap";
import { motion, type Variants } from "framer-motion";

// Helper: is this a usable date?
function isValidDate(value: unknown): value is string | Date {
    if (!value) return false;
    const d = new Date(value as string | Date);
    return !isNaN(d.getTime()) && d.getTime() !== 0;
}

export default function Dashboard() {
    const { user } = useUserStore();
    const navigate = useNavigate();
    
    const [unifiedHistory, setUnifiedHistory] = useState<any[]>([]);
    const [dsaSubmissions, setDsaSubmissions] = useState<any[]>([]);
    const [stats, setStats] = useState({ voiceScore: 0, totalVoice: 0, dsaSolved: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [copiedId, setCopiedId] = useState<string | null>(null);
    
    // NEW: State to toggle "View All History"
    const [showAllHistory, setShowAllHistory] = useState(false);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // 1. Fetch Voice Interviews
                let voiceSessions = [];
                try {
                    const voiceRes = await getInterviewHistory();
                    voiceSessions = voiceRes.data.sessions || voiceRes.data.history || voiceRes.data.data || voiceRes.data || [];
                    if (!Array.isArray(voiceSessions)) voiceSessions = [];
                } catch (e) {
                    console.error("Voice History API failed:", e);
                }

                // 2. Fetch DSA Mock OAs
                let dsaSessions = [];
                try {
                    const dsaMockRes = await getDSARoundHistory();
                    dsaSessions = dsaMockRes.data.history || dsaMockRes.data.sessions || dsaMockRes.data.data || [];
                } catch (e) { 
                    console.error("DSA History API failed:", e); 
                }

                // 3. Fetch Practice Submissions
                let practiceSubs = [];
                try {
                    const dsaRes = await getDsaSubmissions();
                    practiceSubs = dsaRes.data.data || [];
                } catch (e) { 
                    console.error("Practice Subs API failed:", e); 
                }

                // --- PROCESS DATA ---
                const totalVoice = voiceSessions.length;
                const voiceScore = totalVoice > 0 ? Math.round(voiceSessions.reduce((acc: number, curr: any) => acc + (curr.totalScore || 0), 0) / totalVoice) : 0;
                const dsaSolved = practiceSubs.filter((sub: any) => sub.verdict === "AC").length || 0;
                setStats({ voiceScore, totalVoice, dsaSolved });
                setDsaSubmissions(practiceSubs);

                const combined = [
                    ...voiceSessions.map((s: any) => ({
                        ...s, type: 'voice', date: s.createdAt, displayScore: s.totalScore || 0, maxScore: 110,
                        title: s.company || "Mock Interview", subtitle: s.role || "General"
                    })),
                    ...dsaSessions.map((s: any) => ({
                        ...s, type: 'dsa', date: s.completedAt || s.startedAt, displayScore: s.score || 0, maxScore: 3,
                        title: s.company || "Company", subtitle: "90-Min Mock OA"
                    }))
                ].filter(item => isValidDate(item.date));

                combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                setUnifiedHistory(combined);

            } catch (err) {
                console.error("Critical Dashboard Error:", err);
                setError("Failed to load dashboard data.");
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };

    const handleShare = (sessionId: string) => {
        const shareUrl = `${window.location.origin}/report/${sessionId}`;
        navigator.clipboard.writeText(shareUrl);
        setCopiedId(sessionId);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const containerVariants: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
    const itemVariants: Variants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } } };

    const heatmapData = [
        ...unifiedHistory.map(item => ({ createdAt: item.date, type: "interview" as const })),
        ...dsaSubmissions.filter(sub => sub.verdict === "AC" && isValidDate(sub.createdAt)).map(sub => ({ createdAt: sub.createdAt, type: "dsa" as const })),
    ];

    const displayedHistory = showAllHistory ? unifiedHistory : unifiedHistory.slice(0, 4);

    return (
        <div className="min-h-screen bg-[#050505] font-sans relative overflow-hidden flex flex-col selection:bg-purple-500/30">
            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="relative z-20">
                <Navbar />
            </div>

            <main className="flex-grow px-4 py-10 relative z-10 max-w-7xl mx-auto w-full">
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">

                    {/* Welcome Header */}
                    <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
                                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">{user?.name?.split(' ')[0]}</span>
                                {/* Waving Hand SVG */}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-yellow-500 animate-[wave_2.5s_ease-in-out_infinite] origin-bottom-right">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
                                </svg>
                            </h1>
                            <p className="text-gray-400 mt-2 text-lg">Your technical profile and interview progress.</p>
                        </div>
                    </motion.div>

                    {/* BENTO BOX GRID LAYOUT */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* LEFT COLUMN: Stats & Actions */}
                        <div className="lg:col-span-1 space-y-6">

                            {/* Stats Card */}
                            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
                                <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 p-5 rounded-2xl flex flex-col justify-center shadow-lg">
                                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-3">
                                        {/* Microphone SVG */}
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" /></svg>
                                    </div>
                                    <p className="text-2xl font-extrabold text-white">{stats.totalVoice}</p>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">Voice Mock</p>
                                </div>
                                <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 p-5 rounded-2xl flex flex-col justify-center shadow-lg">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-3">
                                        {/* Code Bracket SVG */}
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>
                                    </div>
                                    <p className="text-2xl font-extrabold text-white">{stats.dsaSolved}</p>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">DSA Solved</p>
                                </div>
                                <div className="col-span-2 bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl flex items-center justify-between shadow-lg relative overflow-hidden">
                                    <div className="absolute right-[-10%] top-[-50%] w-32 h-32 bg-purple-500/10 blur-[30px] rounded-full"></div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Avg Voice Score</p>
                                        <div className="flex items-end gap-2">
                                            <p className={`text-4xl font-extrabold ${stats.voiceScore >= 80 ? 'text-green-400' : stats.voiceScore >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                                                {stats.voiceScore}
                                            </p>
                                            <span className="text-gray-500 mb-1">/ 110</span>
                                        </div>
                                    </div>
                                    <div className="w-16 h-16">
                                        <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#a855f7" strokeWidth="3" strokeDasharray={`${(stats.voiceScore / 110) * 100}, 100`} />
                                        </svg>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Quick Actions */}
                            <motion.div variants={itemVariants} className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-lg">
                                <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Quick Actions</h2>
                                <div className="space-y-3">
                                    <button onClick={() => navigate("/practice")} className="w-full bg-purple-600 text-white rounded-xl py-3.5 font-bold hover:bg-purple-500 transition-all shadow-[0_0_15px_rgba(168,85,247,0.2)] flex items-center justify-center gap-2 group">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>
                                        Practice DSA
                                    </button>
                                    <button onClick={() => navigate("/dsa-mock/setup")} className="w-full bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl py-3.5 font-bold hover:bg-red-500/20 transition-all flex items-center justify-center gap-2 group">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover:rotate-12 transition-transform"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        Take Mock OA
                                    </button>
                                    <button onClick={() => navigate("/resume-upload")} className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-3.5 font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2 group">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover:scale-110 transition-transform"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" /></svg>
                                        Voice Interview
                                    </button>
                                </div>
                            </motion.div>

                        </div>

                        {/* RIGHT COLUMN: Heatmap & Recent Activity */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Heatmap */}
                            <motion.div variants={itemVariants} className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-lg">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-lg font-bold text-white">Consistency Heatmap</h2>
                                    <div className="flex gap-3 text-xs text-gray-400">
                                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-purple-500"></div> Interviews</span>
                                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-blue-500"></div> Code AC</span>
                                    </div>
                                </div>
                                <ActivityHeatmap activities={heatmapData} />
                            </motion.div>

                            {/* Unified Recent Interviews List */}
                            <motion.div variants={itemVariants} className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg overflow-hidden flex flex-col max-h-[600px]">
                                <div className="p-6 border-b border-white/10 bg-white/5 shrink-0">
                                    <h2 className="text-lg font-bold text-white">Recent Assessments</h2>
                                </div>

                                <div className="p-6 overflow-y-auto custom-scrollbar flex-grow">
                                    {loading ? (
                                        <div className="space-y-4">
                                            {[1, 2].map(i => <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse"></div>)}
                                        </div>
                                    ) : error ? (
                                        <p className="text-red-400 text-sm">{error}</p>
                                    ) : unifiedHistory.length === 0 ? (
                                        <div className="text-center py-8">
                                            <p className="text-gray-500 text-sm">No assessments completed yet.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {displayedHistory.map((session) => (
                                                <div key={session.id} className="bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between hover:bg-white/10 transition-all group">

                                                    <div className="flex items-center gap-4">
                                                        {/* Icon Badge */}
                                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center border shrink-0 ${session.type === 'voice' ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                                                            {session.type === 'voice' ? (
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" /></svg>
                                                            ) : (
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                                                                {session.title} <span className="text-gray-500 font-normal text-sm ml-1">• {session.subtitle}</span>
                                                            </h3>
                                                            <p className="text-xs text-gray-500 mt-1">{formatDate(session.date)}</p>
                                                        </div>
                                                    </div>

                                                    <div className="mt-4 sm:mt-0 flex items-center gap-4 shrink-0">
                                                        <div className="text-right">
                                                            <p className={`font-bold text-xl font-mono ${session.type === 'voice' ? (session.displayScore >= 80 ? 'text-green-400' : session.displayScore >= 50 ? 'text-yellow-400' : 'text-red-400') : (session.displayScore === 3 ? 'text-green-400' : session.displayScore > 0 ? 'text-yellow-400' : 'text-red-400')}`}>
                                                                {session.displayScore} <span className="text-xs font-sans text-gray-500">/ {session.maxScore}</span>
                                                            </p>
                                                        </div>

                                                        {session.type === 'voice' && (
                                                            <button onClick={() => handleShare(session.id)} className="px-3 py-2 bg-black/50 border border-white/10 text-xs font-bold text-gray-400 rounded-lg hover:border-white/30 hover:text-white transition-all w-[85px] flex items-center justify-center gap-1.5">
                                                                {copiedId === session.id ? (
                                                                    <>✓ Copied</>
                                                                ) : (
                                                                    <><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg> Share</>
                                                                )}
                                                            </button>
                                                        )}

                                                        <button 
                                                            onClick={() => navigate(session.type === 'voice' ? `/review/${session.id}` : `/dsa-mock/review/${session.id}`, { state: { session } })} 
                                                            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all border ${session.type === 'voice' ? 'bg-purple-500/10 text-purple-400 border-purple-500/30 hover:bg-purple-500 hover:text-white' : 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500 hover:text-white'}`}
                                                        >
                                                            Review
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                            
                                            {unifiedHistory.length > 4 && (
                                                <button 
                                                    onClick={() => setShowAllHistory(!showAllHistory)}
                                                    className="w-full py-3 text-sm text-gray-400 font-bold hover:text-white transition-colors bg-white/5 rounded-xl border border-white/10 border-dashed hover:border-solid hover:border-white/30 flex items-center justify-center gap-2"
                                                >
                                                    {showAllHistory ? (
                                                        <>Show Less <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" /></svg></>
                                                    ) : (
                                                        <>View All History <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg></>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </motion.div>

                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
