import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import useUserStore from "@/store/authStore";
import { getInterviewHistory } from "@/services/api";
import ActivityHeatmap from "@/components/ActivityHeatmap";
import { motion, type Variants } from "framer-motion"; // <-- Added Framer Motion

interface Session {
    id: string;
    company: string;
    role: string;
    level: string;
    totalScore: number;
    createdAt: string;
    evaluations: any[];
}

function Dashboard() {
    const { user } = useUserStore();
    const navigate = useNavigate();
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [copiedId, setCopiedId] = useState<string | null>(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await getInterviewHistory();
                setSessions(response.data.sessions);
            } catch (err) {
                console.error(err);
                setError("Failed to load interview history.");
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

    return (
        <div className="min-h-screen bg-[var(--bg)] font-sans">
            <Navbar />
            
            <div className="px-4 py-10 relative overflow-hidden">
                {/* Subtle background glows */}
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[var(--accent)]/10 rounded-full blur-[120px] pointer-events-none"></div>

                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-5xl mx-auto space-y-8 relative z-10"
                >
                    {/* Welcome Header */}
                    <motion.div variants={itemVariants}>
                        <h1 className="text-3xl font-bold text-[var(--text)]">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
                        <p className="text-[var(--text-muted)] mt-1">Here is a summary of your interview progress.</p>
                    </motion.div>

                    {/* Top Stats & Quick Actions */}
                    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Total Interviews */}
                        <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-xl flex flex-col justify-center hover:border-[var(--accent)]/30 transition-colors shadow-lg shadow-black/20">
                            <p className="text-sm text-[var(--text-muted)] font-medium uppercase tracking-wider">Total Mock Interviews</p>
                            <p className="text-4xl font-extrabold text-[var(--text)] mt-2">{totalInterviews}</p>
                        </div>

                        {/* Average Score */}
                        <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-xl flex flex-col justify-center hover:border-[var(--accent)]/30 transition-colors shadow-lg shadow-black/20">
                            <p className="text-sm text-[var(--text-muted)] font-medium uppercase tracking-wider">Average Score</p>
                            <div className="flex items-end gap-2 mt-2">
                                <p className={`text-4xl font-extrabold ${averageScore >= 80 ? 'text-[var(--success)]' : averageScore >= 50 ? 'text-[var(--warning)]' : 'text-[var(--danger)]'}`}>
                                    {averageScore}
                                </p>
                                <span className="text-[var(--text-muted)] mb-1">/ 110</span>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => navigate("/resume-upload")}
                                className="flex-1 bg-[var(--accent)] text-white rounded-xl font-bold hover:bg-[var(--accent-hover)] transition-all transform hover:-translate-y-1 shadow-[0_0_15px_rgba(170,59,255,0.2)] flex items-center justify-center gap-2"
                            >
                                <span>🎙️</span> Start New Interview
                            </button>
                            <button
                                onClick={() => navigate("/ats-check")}
                                className="flex-1 bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] rounded-xl font-bold hover:bg-[var(--bg)] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-black/20"
                            >
                                <span>📄</span> Check ATS Score
                            </button>
                        </div>
                    </motion.div>

                    {/* Activity Heat Map */}
                    <motion.div variants={itemVariants}>
                        <ActivityHeatmap sessions={sessions} />
                    </motion.div>

                    {/* Interview History List */}
                    <motion.div variants={itemVariants}>
                        <h2 className="text-xl font-bold text-[var(--text)] mb-4">Recent Interviews</h2>

                        {loading ? (
                            <div className="space-y-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-24 bg-[var(--surface)] border border-[var(--border)] rounded-lg animate-pulse"></div>
                                ))}
                            </div>
                        ) : error ? (
                            <p className="text-[var(--danger)] bg-[var(--danger)]/10 p-4 rounded-md border border-[var(--danger)]/20">{error}</p>
                        ) : sessions.length === 0 ? (
                            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-10 text-center shadow-lg shadow-black/20">
                                <div className="text-4xl mb-4">📭</div>
                                <p className="text-[var(--text-muted)] mb-6 text-lg">You haven't completed any mock interviews yet.</p>
                                <button onClick={() => navigate("/resume-upload")} className="px-6 py-3 bg-[var(--accent)] text-white rounded-lg font-bold shadow-[0_0_15px_rgba(170,59,255,0.2)] hover:bg-[var(--accent-hover)] transition-all hover:-translate-y-1">
                                    Start your first interview →
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {sessions.map((session) => (
                                    <div key={session.id} className="bg-[var(--surface)] border border-[var(--border)] p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between hover:border-[var(--accent)]/50 transition-all shadow-lg shadow-black/20 group">
                                        
                                        {/* Left Side: Info */}
                                        <div>
                                            <h3 className="text-lg font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                                                {session.company} <span className="text-[var(--text-muted)] text-sm font-normal ml-2">• {session.role}</span>
                                            </h3>
                                            <p className="text-sm text-[var(--text-muted)] mt-1">
                                                {session.level.charAt(0).toUpperCase() + session.level.slice(1)} Level • {formatDate(session.createdAt)}
                                            </p>
                                        </div>

                                        {/* Right Side: Score & Buttons */}
                                        <div className="mt-4 md:mt-0 flex flex-col md:flex-row items-center gap-5">
                                            <div className="text-center md:text-right bg-[var(--bg)] px-4 py-2 rounded-lg border border-[var(--border)]">
                                                <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest mb-1">Score</p>
                                                <p className={`font-bold text-lg ${session.totalScore >= 80 ? 'text-[var(--success)]' : session.totalScore >= 50 ? 'text-[var(--warning)]' : 'text-[var(--danger)]'}`}>
                                                    {session.totalScore} <span className="text-sm font-normal text-[var(--text-muted)]">/ 110</span>
                                                </p>
                                            </div>
                                            <div className="flex gap-2 w-full md:w-auto">
                                                <button
                                                    onClick={() => handleShare(session.id)}
                                                    className="flex-1 md:flex-none px-4 py-2.5 bg-[var(--surface)] border border-[var(--border)] text-sm font-medium text-[var(--text)] rounded-lg hover:bg-[var(--bg)] hover:text-white transition-all flex items-center justify-center gap-2"
                                                >
                                                    {copiedId === session.id ? "✓ Copied" : "🔗 Share"}
                                                </button>

                                                <button
                                                    onClick={() => navigate(`/review/${session.id}`, { state: { session } })}
                                                    className="flex-1 md:flex-none px-6 py-2.5 bg-[var(--accent)] text-white text-sm font-bold rounded-lg hover:bg-[var(--accent-hover)] transition-all shadow-[0_0_10px_rgba(170,59,255,0.2)]"
                                                >
                                                    Review
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}

export default Dashboard;
