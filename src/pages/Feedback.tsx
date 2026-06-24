import { useNavigate } from "react-router-dom"
import useSessionStore from "@/store/sessionStore"
import type { EvaluateResult } from "@/types/index"

function Feedback() {
  const navigate = useNavigate()
  const { evaluations, company, clearSession } = useSessionStore()

  const totalScore = evaluations.reduce((sum, e) => sum + e.score, 0)
  const maxScore = evaluations.reduce((sum, e) => sum + e.maxScore, 0)
  const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0

  const getScoreColor = (score: number, max: number): string => {
    const pct = (score / max) * 100
    if (pct >= 75) return "var(--success)"
    if (pct >= 50) return "var(--warning)"
    return "var(--danger)"
  }

  const getOverallMessage = (): string => {
    if (percentage >= 80) return "Excellent performance — you're interview ready!"
    if (percentage >= 60) return "Good effort — a bit more prep and you'll nail it."
    if (percentage >= 40) return "Decent start — focus on the improvement areas below."
    return "Keep practicing — every attempt makes you sharper."
  }

  const getRoundLabel = (round: string): string => {
    if (round === "hr") return "HR Round"
    if (round === "technical") return "Technical Round"
    if (round === "dsa") return "DSA Round"
    return round
  }

  const handleStartOver = () => {
    clearSession()
    navigate("/onboarding")
  }

  // redirect if no evaluations
  if (evaluations.length === 0) {
    navigate("/onboarding")
    return null
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] px-4 py-10">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs font-medium uppercase tracking-widest text-[var(--accent)] mb-2">
            Interview Complete
          </p>
          <h1 className="text-2xl font-semibold text-[var(--text)] mb-2">
            Your Results
          </h1>
          {company && (
            <p className="text-sm text-[var(--text-muted)]">
              Mock interview for <span className="text-[var(--text)]">{company}</span>
            </p>
          )}
        </div>

        {/* Overall score card */}
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 mb-6 text-center">
          <p className="text-sm text-[var(--text-muted)] mb-2">Overall Score</p>
          <p
            className="text-5xl font-bold mb-1"
            style={{ color: getScoreColor(totalScore, maxScore) }}
          >
            {totalScore}
            <span className="text-xl text-[var(--text-muted)] font-normal">
              /{maxScore}
            </span>
          </p>
          <p className="text-sm text-[var(--text-muted)] mb-4">
            {percentage}% overall
          </p>

          {/* Progress bar */}
          <div className="h-2 w-full rounded-full bg-[var(--bg)]">
            <div
              className="h-2 rounded-full transition-all"
              style={{
                width: `${percentage}%`,
                backgroundColor: getScoreColor(totalScore, maxScore)
              }}
            />
          </div>

          <p className="mt-4 text-sm text-[var(--text)]">
            {getOverallMessage()}
          </p>
        </div>

        {/* Per question breakdown */}
        <div className="space-y-4 mb-8">
          <h2 className="text-sm font-medium text-[var(--text-muted)] uppercase tracking-wide">
            Question Breakdown
          </h2>

          {evaluations.map((evaluation: EvaluateResult, index: number) => (
            <div
              key={index}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5"
            >
              {/* Round label + score */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium uppercase tracking-wide text-[var(--accent)]">
                  {getRoundLabel(evaluation.round)} — Q{index + 1}
                </span>
                <span
                  className="text-lg font-bold"
                  style={{ color: getScoreColor(evaluation.score, evaluation.maxScore) }}
                >
                  {evaluation.score}/{evaluation.maxScore}
                </span>
              </div>

              {/* Feedback */}
              <p className="text-sm text-[var(--text)] leading-relaxed mb-3">
                {evaluation.feedback}
              </p>

              {/* Strong points */}
              <div className="mb-2">
                <p className="text-xs font-medium text-[var(--success)] mb-1">
                  Strong Points
                </p>
                <ul className="space-y-1">
                  {evaluation.strongPoints.map((point, i) => (
                    <li key={i} className="text-xs text-[var(--text-muted)] flex gap-2">
                      <span className="text-[var(--success)]">✓</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Improvements */}
              <div className="mb-3">
                <p className="text-xs font-medium text-[var(--warning)] mb-1">
                  Improvements
                </p>
                <ul className="space-y-1">
                  {evaluation.improvements.map((item, i) => (
                    <li key={i} className="text-xs text-[var(--text-muted)] flex gap-2">
                      <span className="text-[var(--warning)]">→</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Suggestion */}
              <div className="rounded-md bg-[var(--bg)] border border-[var(--border)] p-3">
                <p className="text-xs font-medium text-[var(--accent)] mb-1">Suggestion</p>
                <p className="text-xs text-[var(--text-muted)]">{evaluation.suggestion}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleStartOver}
            className="flex-1 rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--accent-hover)] transition-colors"
          >
            Start New Interview
          </button>
          <button
            onClick={() => navigate("/resume-upload")}
            className="flex-1 rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--text)] hover:bg-[var(--bg)] transition-colors"
          >
            Update Resume
          </button>
        </div>

      </div>
    </div>
  )
}

export default Feedback