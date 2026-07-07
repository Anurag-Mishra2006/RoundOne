import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPublicReport } from "@/services/api";

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

  if (loading) return <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center text-[var(--text)]">Loading report...</div>;
  if (error || !session) return <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center text-[var(--danger)]">{error}</div>;

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

  return (
    <div className="min-h-screen bg-[var(--bg)] px-4 py-10">
      
      {/* Viral Header CTA */}
      <div className="max-w-3xl mx-auto mb-8 p-4 bg-[var(--surface)] border border-[var(--accent)] rounded-lg flex flex-col md:flex-row items-center justify-between shadow-[0_0_15px_rgba(100,50,255,0.1)]">
        <div>
          <h2 className="text-[var(--text)] font-bold">RoundOne AI Mock Interview</h2>
          <p className="text-[var(--text-muted)] text-sm">Can you beat {session.user.name}'s score?</p>
        </div>
        <Link to="/register" className="mt-4 md:mt-0 px-6 py-2 bg-[var(--accent)] text-white font-bold rounded-md hover:bg-[var(--accent-hover)] transition-colors">
          Try it for Free →
        </Link>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-[var(--text)]">{session.user.name}'s Interview Report</h1>
          <p className="text-[var(--text-muted)] mt-1">
            {session.company} • {session.role} • {new Date(session.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Overall Score */}
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 mb-8 text-center">
          <p className="text-sm text-[var(--text-muted)] mb-2">Total Score</p>
          <p className="text-5xl font-bold mb-2" style={{ color: getScoreColor(totalScore, maxScore) }}>
            {totalScore} <span className="text-xl text-[var(--text-muted)] font-normal">/ {maxScore}</span>
          </p>
          <div className="h-2 w-full rounded-full bg-[var(--bg)] mt-4">
            <div
              className="h-2 rounded-full transition-all"
              style={{ width: `${percentage}%`, backgroundColor: getScoreColor(totalScore, maxScore) }}
            />
          </div>
        </div>

        {/* Q&A Breakdown */}
        <div className="space-y-6">
          {session.evaluations.map((evaluation: any, index: number) => (
            <div key={evaluation.id} className="rounded-lg border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
              <div className="bg-[var(--bg)] px-5 py-3 border-b border-[var(--border)] flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
                  {getRoundLabel(evaluation.round)} — Q{index + 1}
                </span>
                <span className="font-bold" style={{ color: getScoreColor(evaluation.score, evaluation.maxScore) }}>
                  {evaluation.score}/{evaluation.maxScore}
                </span>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <p className="text-sm font-medium text-[var(--text-muted)] mb-1">Question:</p>
                  <p className="text-[var(--text)] mb-3">{evaluation.question}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--text-muted)] mb-1">AI Feedback:</p>
                  <p className="text-sm text-[var(--text)] leading-relaxed">{evaluation.feedback}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PublicReport;
