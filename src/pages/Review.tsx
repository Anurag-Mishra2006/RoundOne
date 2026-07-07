import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";

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

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[var(--bg)] px-4 py-10">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text)]">Interview Review</h1>
              <p className="text-[var(--text-muted)] mt-1">
                {session.company} • {session.role} • {new Date(session.createdAt).toLocaleDateString()}
              </p>
            </div>
            <button 
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] rounded-md hover:bg-[var(--bg)] transition-colors"
            >
              ← Back to Dashboard
            </button>
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
            <h2 className="text-lg font-bold text-[var(--text)]">Question Breakdown</h2>
            
            {session.evaluations.map((evaluation: any, index: number) => (
              <div key={evaluation.id} className="rounded-lg border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
                {/* Header bar */}
                <div className="bg-[var(--bg)] px-5 py-3 border-b border-[var(--border)] flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
                    {getRoundLabel(evaluation.round)} — Q{index + 1}
                  </span>
                  <span className="font-bold" style={{ color: getScoreColor(evaluation.score, evaluation.maxScore) }}>
                    {evaluation.score}/{evaluation.maxScore}
                  </span>
                </div>

                <div className="p-5 space-y-4">
                  {/* Question & Answer */}
                  <div>
                    <p className="text-sm font-medium text-[var(--text-muted)] mb-1">Question:</p>
                    <p className="text-[var(--text)] mb-3">{evaluation.question}</p>
                    
                    <p className="text-sm font-medium text-[var(--text-muted)] mb-1">Your Answer:</p>
                    <div className="p-3 bg-[var(--bg)] border border-[var(--border)] rounded-md">
                      <p className="text-[var(--text)] font-mono text-sm whitespace-pre-wrap">
                        {evaluation.candidateAnswer}
                      </p>
                    </div>
                  </div>

                  {/* Feedback */}
                  <div>
                    <p className="text-sm font-medium text-[var(--text-muted)] mb-1">AI Feedback:</p>
                    <p className="text-sm text-[var(--text)] leading-relaxed">{evaluation.feedback}</p>
                  </div>

                  {/* Grid for Strengths & Improvements */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="p-3 bg-[var(--success)]/5 border border-[var(--success)]/20 rounded-md">
                      <p className="text-xs font-bold text-[var(--success)] uppercase mb-2">Strong Points</p>
                      <ul className="space-y-1">
                        {evaluation.strongPoints.map((pt: string, i: number) => (
                          <li key={i} className="text-xs text-[var(--text)] flex gap-2"><span className="text-[var(--success)]">✓</span> {pt}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="p-3 bg-[var(--warning)]/5 border border-[var(--warning)]/20 rounded-md">
                      <p className="text-xs font-bold text-[var(--warning)] uppercase mb-2">To Improve</p>
                      <ul className="space-y-1">
                        {evaluation.improvements.map((pt: string, i: number) => (
                          <li key={i} className="text-xs text-[var(--text)] flex gap-2"><span className="text-[var(--warning)]">→</span> {pt}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}

export default Review;
