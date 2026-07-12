import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import useUserStore from "@/store/authStore";
import { getDsaSubmissions, getInterviewHistory } from "@/services/api";
import ActivityHeatmap from "@/components/ActivityHeatmap";
import { motion, type Variants } from "framer-motion";

interface Session {
    id: string;
    company: string;
    role: string;
    level: string;
    totalScore: number;
    createdAt: string;
    evaluations: any[];
}

// Helper: is this a usable date (not null/undefined/epoch/invalid)?
function isValidDate(value: unknown): value is string | Date {
    if (!value) return false; // catches null, undefined, "", 0
    const d = new Date(value as string | Date);
    return !isNaN(d.getTime()) && d.getTime() !== 0;
}

function Dashboard() {
    const { user } = useUserStore();
    const navigate = useNavigate();
    const [sessions, setSessions] = useState<Session[]>([]);

    const [dsaSubmissions, setDsaSubmissions] = useState<any[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [copiedId, setCopiedId] = useState<string | null>(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                // Fetch Interview Sessions
                const response = await getInterviewHistory();
                setSessions(response.data.sessions || []);

                try {
                    // Fetch DSA Submissions safely
                    const dsaResponse = await getDsaSubmissions();
                    const subs = dsaResponse.data.data || [];

                    // Debug aid: flag submissions with a missing/bad createdAt
                    // so you can see the real field name in devtools and fix
                    // it at the source (e.g. it might be `submittedAt`).
                    const badOnes = subs.filter((s: any) => !isValidDate(s.createdAt));
                    if (badOnes.length > 0) {
                        console.warn(
                            `[Dashboard] ${badOnes.length} DSA submission(s) missing a valid 'createdAt'. Sample:`,
                            badOnes[0]
                        );
                    }

                    setDsaSubmissions(subs);
                } catch (dsaErr) {
                    console.error("No DSA submissions found or route missing", dsaErr);
                    setDsaSubmissions([]);
                }

            } catch (err) {
                console.error(err);
                setError("Failed to load dashboard data.");
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const totalInterviews = sessions.length;
    const averageScore = totalInterviews > 0
        ? Math.round(sessions.reduce((acc, curr) => acc + curr.totalScore, 0) / totalInterviews)
        : 0;

    const problemsSolved = dsaSubmissions.filter(sub => sub.verdict === "AC").length || 0;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short", day: "numeric", year: "numeric"
        });
    };

    const handleShare = (sessionId: string) => {
        const shareUrl = `${window.location.origin}/report/${sessionId}`;
        navigator.clipboard.writeText(shareUrl);
        setCopiedId(sessionId);
        setTimeout(() => setCopiedId(null), 2000);
    };

    // --- Animation Variants ---
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };
    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
    };

    // Combine Data for Heatmap
    // Only DSA submissions with verdict === "AC" count as activity, alongside all interviews.
    // Filter out anything without a valid createdAt so bad/missing dates never
    // reach the heatmap as fake "Jan 1 1970" entries.
    const acSubmissions = dsaSubmissions.filter(
        sub => sub.verdict === "AC" && isValidDate(sub.createdAt)
    );
    const validSessions = sessions.filter(session => isValidDate(session.createdAt));

    const heatmapData = [
        ...validSessions.map(session => ({
            createdAt: session.createdAt,
            type: "interview" as const,
        })),
        ...acSubmissions.map(sub => ({
            createdAt: sub.createdAt,
            type: "dsa" as const,
        })),
    ];
    return (
        <div className="min-h-screen bg-[var(--bg)] font-sans relative overflow-hidden flex flex-col">
            <Navbar />

            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>

            <main className="flex-grow px-4 py-10 relative z-10 max-w-7xl mx-auto w-full">
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">

                    {/* Welcome Header */}
                    <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--border)] pb-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-blue-400">{user?.name?.split(' ')[0]}</span> 👋
                            </h1>
                            <p className="text-[var(--text-muted)] mt-2 text-lg">Your technical profile and interview progress.</p>
                        </div>
                    </motion.div>

                    {/* BENTO BOX GRID LAYOUT */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* LEFT COLUMN: Stats & Actions */}
                        <div className="lg:col-span-1 space-y-6">

                            {/* Stats Card */}
                            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
                                <div className="bg-[var(--surface)] border border-[var(--border)] p-5 rounded-2xl flex flex-col justify-center shadow-lg">
                                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-xl mb-3">🎙️</div>
                                    <p className="text-2xl font-extrabold text-white">{totalInterviews}</p>
                                    <p className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider mt-1">Interviews</p>
                                </div>
                                <div className="bg-[var(--surface)] border border-[var(--border)] p-5 rounded-2xl flex flex-col justify-center shadow-lg">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-xl mb-3">💻</div>
                                    <p className="text-2xl font-extrabold text-white">{problemsSolved}</p>
                                    <p className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider mt-1">DSA Solved</p>
                                </div>
                                <div className="col-span-2 bg-[var(--surface)] border border-[var(--border)] p-6 rounded-2xl flex items-center justify-between shadow-lg relative overflow-hidden">
                                    <div className="absolute right-[-10%] top-[-50%] w-32 h-32 bg-[var(--accent)]/10 blur-[30px] rounded-full"></div>
                                    <div>
                                        <p className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-wider mb-1">Avg Interview Score</p>
                                        <div className="flex items-end gap-2">
                                            <p className={`text-4xl font-extrabold ${averageScore >= 80 ? 'text-[var(--success)]' : averageScore >= 50 ? 'text-[var(--warning)]' : 'text-[var(--danger)]'}`}>
                                                {averageScore}
                                            </p>
                                            <span className="text-[var(--text-muted)] mb-1">/ 110</span>
                                        </div>
                                    </div>
                                    <div className="w-16 h-16">
                                        {/* Circular Progress Bar Fake Graphic */}
                                        <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--border)" strokeWidth="3" />
                                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--accent)" strokeWidth="3" strokeDasharray={`${(averageScore / 110) * 100}, 100`} />
                                        </svg>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Quick Actions */}
                            <motion.div variants={itemVariants} className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-2xl shadow-lg">
                                <h2 className="text-sm font-bold text-[var(--text)] uppercase tracking-wider mb-4">Quick Actions</h2>
                                <div className="space-y-3">
                                    <button onClick={() => navigate("/practice")} className="w-full bg-[var(--accent)] text-white rounded-xl py-3.5 font-bold hover:bg-[var(--accent-hover)] transition-all shadow-[0_0_15px_rgba(170,59,255,0.2)] flex items-center justify-center gap-3">
                                        <span className="text-lg">💻</span> Practice DSA
                                    </button>
                                    <button onClick={() => navigate("/resume-upload")} className="w-full bg-[var(--bg)] border border-[var(--border)] text-white rounded-xl py-3.5 font-bold hover:border-[var(--accent)]/50 transition-all flex items-center justify-center gap-3">
                                        <span className="text-lg">🎙️</span> Mock Interview
                                    </button>
                                    <button onClick={() => navigate("/ats-check")} className="w-full bg-[var(--bg)] border border-[var(--border)] text-white rounded-xl py-3.5 font-bold hover:border-blue-500/50 transition-all flex items-center justify-center gap-3">
                                        <span className="text-lg">📄</span> ATS Checker
                                    </button>
                                </div>
                            </motion.div>

                        </div>

                        {/* RIGHT COLUMN: Heatmap & Recent Activity */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Universal Activity Heat Map */}
                            <motion.div variants={itemVariants} className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-2xl shadow-lg">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-lg font-bold text-[var(--text)]">Consistency Heatmap</h2>
                                    <div className="flex gap-3 text-xs text-[var(--text-muted)]">
                                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-purple-500"></div> Interviews</span>
                                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-green-500"></div> Code AC</span>
                                    </div>
                                </div>
                                {/* NOTE: Pass the combined heatmapData array here! */}
                                <ActivityHeatmap activities={heatmapData} />
                            </motion.div>

                            {/* Recent Interviews List */}
                            <motion.div variants={itemVariants} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-lg overflow-hidden">
                                <div className="p-6 border-b border-[var(--border)] bg-[var(--bg)]/50">
                                    <h2 className="text-lg font-bold text-[var(--text)]">Recent Mock Interviews</h2>
                                </div>

                                <div className="p-6">
                                    {loading ? (
                                        <div className="space-y-4">
                                            {[1, 2].map(i => <div key={i} className="h-20 bg-[var(--bg)] rounded-xl animate-pulse"></div>)}
                                        </div>
                                    ) : error ? (
                                        <p className="text-[var(--danger)] text-sm">{error}</p>
                                    ) : sessions.length === 0 ? (
                                        <div className="text-center py-8">
                                            <p className="text-[var(--text-muted)] text-sm">No interviews completed yet.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {sessions.slice(0, 3).map((session) => (
                                                <div key={session.id} className="bg-[var(--bg)] border border-[var(--border)] p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between hover:border-[var(--accent)]/50 transition-all group">

                                                    <div>
                                                        <h3 className="text-base font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                                                            {session.company} <span className="text-[var(--text-muted)] font-normal text-sm ml-1">• {session.role}</span>
                                                        </h3>
                                                        <p className="text-xs text-[var(--text-muted)] mt-1">{formatDate(session.createdAt)}</p>
                                                    </div>

                                                    <div className="mt-4 sm:mt-0 flex items-center gap-3">
                                                        <div className="text-right">
                                                            <p className={`font-bold text-lg ${session.totalScore >= 80 ? 'text-[var(--success)]' : session.totalScore >= 50 ? 'text-[var(--warning)]' : 'text-[var(--danger)]'}`}>
                                                                {session.totalScore} <span className="text-xs font-normal text-[var(--text-muted)]">/ 110</span>
                                                            </p>
                                                        </div>

                                                        <button
                                                            onClick={() => handleShare(session.id)}
                                                            className="px-3 py-2 bg-[var(--surface)] border border-[var(--border)] text-xs font-bold text-[var(--text-muted)] rounded-lg hover:border-[var(--accent)]/50 hover:text-white transition-all flex items-center justify-center gap-1.5"
                                                        >
                                                            {copiedId === session.id ? "✓ Copied" : "🔗 Share"}
                                                        </button>

                                                        <button onClick={() => navigate(`/review/${session.id}`, { state: { session } })} className="px-4 py-2 bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/30 text-xs font-bold rounded-lg hover:bg-[var(--accent)] hover:text-white transition-all">
                                                            Review
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                            {sessions.length > 3 && (
                                                <button className="w-full py-3 text-sm text-[var(--text-muted)] font-medium hover:text-white transition-colors">
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

export default Dashboard;
