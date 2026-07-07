import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import useUserStore from "@/store/authStore";
import { getInterviewHistory } from "@/services/api";
import ActivityHeatmap from "@/components/ActivityHeatmap";

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

    // Helper to format the date nicely
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short", day: "numeric", year: "numeric"
        });
    };

    const handleShare = (sessionId: string) => {
        // Generate the full URL (e.g., https://round-one-frontend.vercel.app/report/12345)
        const shareUrl = `${window.location.origin}/report/${sessionId}`;
        navigator.clipboard.writeText(shareUrl);

        setCopiedId(sessionId);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-[var(--bg)] px-4 py-10">
                <div className="max-w-5xl mx-auto space-y-8">

                    {/* Welcome Header */}
                    <div>
                        <h1 className="text-3xl font-bold text-[var(--text)]">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
                        <p className="text-[var(--text-muted)] mt-1">Here is a summary of your interview progress.</p>
                    </div>

                    {/* Top Stats & Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Stats Cards */}
                        <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-xl flex flex-col justify-center">
                            <p className="text-sm text-[var(--text-muted)] font-medium uppercase tracking-wider">Total Mock Interviews</p>
                            <p className="text-4xl font-extrabold text-[var(--text)] mt-2">{totalInterviews}</p>
                        </div>

                        <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-xl flex flex-col justify-center">
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
                                className="flex-1 bg-[var(--accent)] text-white rounded-xl font-bold hover:bg-[var(--accent-hover)] transition-colors flex items-center justify-center gap-2"
                            >
                                <span>🎙️</span> Start New Interview
                            </button>
                            <button
                                onClick={() => navigate("/ats-check")}
                                className="flex-1 bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] rounded-xl font-bold hover:bg-[var(--bg)] transition-colors flex items-center justify-center gap-2"
                            >
                                <span>📄</span> Check ATS Score
                            </button>
                        </div>
                    </div>

                    {/* Activity Heat Map */}
                    <ActivityHeatmap sessions={sessions} />

                    {/* Interview History List */}
                    <div>
                        <h2 className="text-xl font-bold text-[var(--text)] mb-4">Recent Interviews</h2>

                        {loading ? (
                            <p className="text-[var(--text-muted)] animate-pulse">Loading history...</p>
                        ) : error ? (
                            <p className="text-[var(--danger)]">{error}</p>
                        ) : sessions.length === 0 ? (
                            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-10 text-center">
                                <p className="text-[var(--text-muted)] mb-4">You haven't completed any mock interviews yet.</p>
                                <button onClick={() => navigate("/resume-upload")} className="px-6 py-2 bg-[var(--accent)] text-white rounded-md font-medium">
                                    Start your first interview
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {sessions.map((session) => (
                                    <div key={session.id} className="bg-[var(--surface)] border border-[var(--border)] p-5 rounded-lg flex flex-col md:flex-row md:items-center justify-between hover:border-[var(--accent)]/50 transition-colors">
                                        
                                        {/* Left Side: Info */}
                                        <div>
                                            <h3 className="text-lg font-bold text-[var(--text)]">{session.company} <span className="text-[var(--text-muted)] text-sm font-normal ml-2">• {session.role}</span></h3>
                                            <p className="text-sm text-[var(--text-muted)] mt-1">
                                                {session.level.charAt(0).toUpperCase() + session.level.slice(1)} Level • {formatDate(session.createdAt)}
                                            </p>
                                        </div>

                                        {/* Right Side: Score & Buttons */}
                                        <div className="mt-4 md:mt-0 flex flex-col md:flex-row items-center gap-4">
                                            <div className="text-center md:text-right">
                                                <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">Score</p>
                                                <p className={`font-bold text-lg ${session.totalScore >= 80 ? 'text-[var(--success)]' : session.totalScore >= 50 ? 'text-[var(--warning)]' : 'text-[var(--danger)]'}`}>
                                                    {session.totalScore} / 110
                                                </p>
                                            </div>
                                            <div className="flex gap-2 w-full md:w-auto">
                                                {/* Share Button */}
                                                <button
                                                    onClick={() => handleShare(session.id)}
                                                    className="flex-1 md:flex-none px-4 py-2 bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--text)] rounded-md hover:bg-[var(--bg)] transition-colors flex items-center justify-center gap-2"
                                                >
                                                    {copiedId === session.id ? "✓ Copied" : "🔗 Share"}
                                                </button>

                                                {/* Review Button */}
                                                <button
                                                    onClick={() => navigate(`/review/${session.id}`, { state: { session } })}
                                                    className="flex-1 md:flex-none px-4 py-2 bg-[var(--accent)] text-white text-sm rounded-md hover:bg-[var(--accent-hover)] transition-colors"
                                                >
                                                    Review
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </>
    );
}

export default Dashboard;
