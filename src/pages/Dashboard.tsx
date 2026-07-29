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

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // 1. Fetch Voice Interviews
                const voiceRes = await getInterviewHistory();
                const voiceSessions = voiceRes.data.sessions || [];

                // 2. Fetch DSA Mock OAs
                let dsaSessions = [];
                try {
                    const dsaMockRes = await getDSARoundHistory();
                    dsaSessions = dsaMockRes.data.history || [];
                } catch (e) { console.error("DSA History failed", e); }

                // 3. Fetch Practice Submissions
                let practiceSubs = [];
                try {
                    const dsaRes = await getDsaSubmissions();
                    practiceSubs = dsaRes.data.data || [];
                } catch (e) { console.error("Practice Subs failed", e); }

                // --- PROCESS DATA ---
                
                // Calculate Stats
                const totalVoice = voiceSessions.length;
                const voiceScore = totalVoice > 0 ? Math.round(voiceSessions.reduce((acc: number, curr: any) => acc + curr.totalScore, 0) / totalVoice) : 0;
                const dsaSolved = practiceSubs.filter((sub: any) => sub.verdict === "AC").length || 0;
                setStats({ voiceScore, totalVoice, dsaSolved });
                setDsaSubmissions(practiceSubs);

                // Combine & Sort History for the List
                const combined = [
                    ...voiceSessions.map((s: any) => ({
                        ...s, type: 'voice', date: s.createdAt, displayScore: s.totalScore, maxScore: 110,
                        title: s.company, subtitle: s.role
                    })),
                    ...dsaSessions.map((s: any) => ({
                        ...s, type: 'dsa', date: s.completedAt || s.startedAt, displayScore: s.score, maxScore: 3,
                        title: s.company, subtitle: "90-Min Mock OA"
                    }))
                ].filter(item => isValidDate(item.date));

                // Sort newest first
                combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                setUnifiedHistory(combined);

            } catch (err) {
                console.error(err);
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

    // --- Animation Variants ---
    const containerVariants: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
    const itemVariants: Variants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } } };

    // Heatmap Data (Voice Interviews + DSA Practice + DSA Mock OAs)
    const heatmapData = [
    // 1. Unified History includes BOTH Voice Interviews AND DSA Mock OAs
    ...unifiedHistory.map(item => ({ 
        createdAt: item.date, 
        type: "interview" as const 
    })),
    
    // 2. Practice Submissions (Only the ones you got Accepted / AC)
    ...dsaSubmissions.filter(sub => sub.verdict === "AC" && isValidDate(sub.createdAt)).map(sub => ({ 
        createdAt: sub.createdAt, 
        type: "dsa" as const 
    })),
];

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
                            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">{user?.name?.split(' ')[0]}</span> 👋
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
                                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-xl mb-3">🎙️</div>
                                    <p className="text-2xl font-extrabold text-white">{stats.totalVoice}</p>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">Voice Mock</p>
                                </div>
                                <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 p-5 rounded-2xl flex flex-col justify-center shadow-lg">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-xl mb-3">💻</div>
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
                                    <button onClick={() => navigate("/practice")} className="w-full bg-purple-600 text-white rounded-xl py-3.5 font-bold hover:bg-purple-500 transition-all shadow-[0_0_15px_rgba(168,85,247,0.2)] flex items-center justify-center gap-3">
                                        <span className="text-lg">💻</span> Practice DSA
                                    </button>
                                    <button onClick={() => navigate("/dsa-mock/setup")} className="w-full bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl py-3.5 font-bold hover:bg-red-500/20 transition-all flex items-center justify-center gap-3">
                                        <span className="text-lg">⏱️</span> Take Mock OA
                                    </button>
                                    <button onClick={() => navigate("/resume-upload")} className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-3.5 font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                                        <span className="text-lg">🎙️</span> Voice Interview
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
                            <motion.div variants={itemVariants} className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg overflow-hidden">
                                <div className="p-6 border-b border-white/10 bg-white/5">
                                    <h2 className="text-lg font-bold text-white">Recent Assessments</h2>
                                </div>

                                <div className="p-6">
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
                                            {unifiedHistory.slice(0, 4).map((session) => (
                                                <div key={session.id} className="bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between hover:bg-white/10 transition-all group">

                                                    <div className="flex items-center gap-4">
                                                        {/* Icon Badge */}
                                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg border ${session.type === 'voice' ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                                                            {session.type === 'voice' ? '🎙️' : '💻'}
                                                        </div>
                                                        <div>
                                                            <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                                                                {session.title} <span className="text-gray-500 font-normal text-sm ml-1">• {session.subtitle}</span>
                                                            </h3>
                                                            <p className="text-xs text-gray-500 mt-1">{formatDate(session.date)}</p>
                                                        </div>
                                                    </div>

                                                    <div className="mt-4 sm:mt-0 flex items-center gap-4">
                                                        <div className="text-right">
                                                            <p className={`font-bold text-xl font-mono ${session.type === 'voice' ? (session.displayScore >= 80 ? 'text-green-400' : session.displayScore >= 50 ? 'text-yellow-400' : 'text-red-400') : (session.displayScore === 3 ? 'text-green-400' : session.displayScore > 0 ? 'text-yellow-400' : 'text-red-400')}`}>
                                                                {session.displayScore} <span className="text-xs font-sans text-gray-500">/ {session.maxScore}</span>
                                                            </p>
                                                        </div>

                                                        {session.type === 'voice' && (
                                                            <button onClick={() => handleShare(session.id)} className="px-3 py-2 bg-black/50 border border-white/10 text-xs font-bold text-gray-400 rounded-lg hover:border-white/30 hover:text-white transition-all w-[80px]">
                                                                {copiedId === session.id ? "✓ Copied" : "🔗 Share"}
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
                                                <button className="w-full py-3 text-sm text-gray-500 font-bold hover:text-white transition-colors bg-white/5 rounded-xl border border-white/10 border-dashed hover:border-solid hover:border-white/30">
                                                    View All History ➔
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
