import { evaluateInterview } from "@/services/api"
import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import useSessionStore from "@/store/sessionStore"
import type { EvaluateResult } from "@/types/index"
import CodeEditor from "@/components/CodeEditor"


const BOILERPLATE_CODE: Record<string, string> = {
  cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n\t// your code goes here\n\treturn 0;\n}`,

  c: `#include <stdio.h>\n\nint main() {\n\t// your code goes here\n\treturn 0;\n}`,

  javascript: `function main() {\n\t// your code goes here\n}\n\nmain();`,

  python: `def main():\n\t# your code goes here\n\tpass\n\nif __name__ == "__main__":\n\tmain()`,

  html: `<!DOCTYPE html>\n<html>\n<head>\n\t<meta charset="UTF-8">\n\t<title>Document</title>\n</head>\n<body>\n\t<!-- your code goes here -->\n</body>\n</html>`,

  json: `{\n\t"message": "your code goes here"\n}`,
  java: `import java.util.*;\n\npublic class Main {\n\tpublic static void main(String[] args) {\n\t\t// your code goes here\n\t}\n}`,
};

const getMonacoLanguage = (lang: string) => {
  if (!lang) return "plaintext";

  const map: Record<string, string> = {
    "C++": "cpp",
    "Python": "python",
    "JavaScript": "javascript",
    "Java": "java"
  }
  return map[lang]
}

function Interview() {
  const navigate = useNavigate()
  const { hr, technical, dsa, company, addEvaluation } = useSessionStore()

  const [currentRound, setCurrentRound] = useState<"hr" | "technical" | "dsa">("hr")
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answer, setAnswer] = useState("")
  const [evaluation, setEvaluation] = useState<EvaluateResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  // const [language, setLanguage] = useState<string>('cpp');
  const language = dsa?.language;
  const [code, setCode] = useState<string>("");


  useEffect(() => {
    if (currentRound === "dsa" && language) {
      setCode(BOILERPLATE_CODE[getMonacoLanguage(language)] || "")
    }
  }, [language, currentRound])
  // create a ref to hold the editor instanse
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    editor.focus();
  }
  const formatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction("editor.action.formatDocument").run()
    }
  };

  // redirect if no session
  useEffect(() => {
    if (!hr || !technical || !dsa) {
      navigate("/onboarding")
    }
  }, [hr, technical, dsa, navigate])

  const getCurrentQuestion = (): string => {
    if (currentRound === "hr") return hr?.questions[currentQuestionIndex]?.question ?? ""
    if (currentRound === "technical") return technical?.questions[currentQuestionIndex]?.question ?? ""
    if (currentRound === "dsa") return dsa?.problem.description ?? ""
    return ""
  }

  const getRoundLabel = (): string => {
    if (currentRound === "hr") return `HR Round — Question ${currentQuestionIndex + 1}/5`
    if (currentRound === "technical") return `Technical Round — Question ${currentQuestionIndex + 1}/5`
    if (currentRound === "dsa") return "DSA Round — Problem 1/1"
    return ""
  }

  const handleSubmit = async () => {
    setError("")

    const currentSession = currentRound === "dsa" ? code : answer
    if (!currentSession.trim()) {
      setError("Please write an answer before submitting")
      return
    }
    setLoading(true)
    try {
      const response = await evaluateInterview({
        round: currentRound,
        question: getCurrentQuestion(),
        answer: currentSession,
        company
      })
      if (response.status !== 200) {
        setError("Evaluation failed")
        return
      }
      const result: EvaluateResult = response.data.evaluateResult
      setEvaluation(result)
      addEvaluation(result)
    } catch (error: any) {
      setError(error?.response?.data?.error || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const handleNext = () => {
    setEvaluation(null)
    setAnswer("")
    setError("")

    if (currentRound === "hr") {
      if (currentQuestionIndex < 4) {
        setCurrentQuestionIndex(prev => prev + 1)
      } else {
        setCurrentRound("technical")
        setCurrentQuestionIndex(0)
      }
    } else if (currentRound === "technical") {
      if (currentQuestionIndex < 4) {
        setCurrentQuestionIndex(prev => prev + 1)
      } else {
        setCurrentRound("dsa")
        setCurrentQuestionIndex(0)
      }
    } else if (currentRound === "dsa") {
      navigate("/feedback")
    }
  }

  const getScoreColor = (score: number): string => {
    if (score >= 8) return "var(--success)"
    if (score >= 5) return "var(--warning)"
    return "var(--danger)"
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] px-4 py-10">
      <div className="max-w-2xl mx-auto">

        {/* Round label */}
        <div className="mb-6">
          <span className="text-xs font-medium uppercase tracking-widest text-[var(--accent)]">
            {getRoundLabel()}
          </span>
          <div className="mt-2 h-1 w-full rounded-full bg-[var(--surface)]">
            <div
              className="h-1 rounded-full bg-[var(--accent)] transition-all"
              style={{
                width: currentRound === "hr"
                  ? `${((currentQuestionIndex + 1) / 5) * 33}%`
                  : currentRound === "technical"
                    ? `${33 + ((currentQuestionIndex + 1) / 5) * 33}%`
                    : "100%"
              }}
            />
          </div>
        </div>

        {/* Question card */}
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 mb-6">
          {currentRound === "dsa" && dsa && (
            <p className="text-xs font-medium text-[var(--accent)] mb-2 uppercase tracking-wide">
              {dsa.problem.title}
            </p>
          )}
          <p className="text-[var(--text)] text-base leading-relaxed">
            {getCurrentQuestion()}
          </p>

          {/* DSA examples */}
          {currentRound === "dsa" && dsa?.problem.examples && (
            <div className="mt-4 space-y-2">
              {dsa.problem.examples.map((ex, i) => (
                <div key={i} className="rounded-md bg-[var(--bg)] border border-[var(--border)] p-3 text-xs font-mono text-[var(--text-muted)]">
                  <p><span className="text-[var(--accent)]">Input:</span> {ex.input}</p>
                  <p><span className="text-[var(--accent)]">Output:</span> {ex.output}</p>
                  <p><span className="text-[var(--accent)]">Explanation:</span> {ex.explanation}</p>
                </div>
              ))}
            </div>
          )}

          {/* DSA constraints */}
          {currentRound === "dsa" && dsa?.problem.constraints && (
            <div className="mt-3">
              <p className="text-xs text-[var(--text-muted)] font-medium mb-1">Constraints:</p>
              <ul className="list-disc list-inside space-y-1">
                {dsa.problem.constraints.map((c, i) => (
                  <li key={i} className="text-xs font-mono text-[var(--text-muted)]">{c}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Answer input — only show if no evaluation yet */}
        {!evaluation && (
          <div className="space-y-3">
            {/* change this textarea with monaco-editor */}
            {currentRound === "dsa" ? <CodeEditor value={code} language={getMonacoLanguage(language || "") || ""} onChange={(newValue) => setCode(newValue || "")} onMount={handleEditorDidMount} /> :
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder={
                  // currentRound === "dsa"
                  //   ? "Explain your approach, algorithm, and time/space complexity..." : 
                  "Type your answer here..."
                }
                rows={6}
                className="w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-none"
              />}

            {error && (
              <p className="text-sm text-[var(--danger)]">{error}</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--accent-hover)] disabled:opacity-50 transition-colors"
            >
              {loading ? "Evaluating your answer..." : "Submit Answer"}
            </button>
          </div>
        )}

        {/* Evaluation result */}
        {evaluation && (
          <div className="space-y-4">

            {/* Score */}
            <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-[var(--text-muted)]">Your Score</span>
                <span
                  className="text-3xl font-bold"
                  style={{ color: getScoreColor(evaluation.score) }}
                >
                  {evaluation.score}<span className="text-base text-[var(--text-muted)] font-normal">/{evaluation.maxScore}</span>
                </span>
              </div>

              {/* Feedback */}
              <p className="text-sm text-[var(--text)] leading-relaxed mb-4">
                {evaluation.feedback}
              </p>

              {/* Strong points */}
              <div className="mb-3">
                <p className="text-xs font-medium text-[var(--success)] uppercase tracking-wide mb-2">
                  Strong Points
                </p>
                <ul className="space-y-1">
                  {evaluation.strongPoints.map((point, i) => (
                    <li key={i} className="text-sm text-[var(--text)] flex gap-2">
                      <span className="text-[var(--success)] mt-0.5">✓</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Improvements */}
              <div className="mb-3">
                <p className="text-xs font-medium text-[var(--warning)] uppercase tracking-wide mb-2">
                  Areas to Improve
                </p>
                <ul className="space-y-1">
                  {evaluation.improvements.map((item, i) => (
                    <li key={i} className="text-sm text-[var(--text)] flex gap-2">
                      <span className="text-[var(--warning)] mt-0.5">→</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Suggestion */}
              <div className="rounded-md bg-[var(--bg)] border border-[var(--border)] p-3">
                <p className="text-xs font-medium text-[var(--accent)] uppercase tracking-wide mb-1">
                  Suggestion
                </p>
                <p className="text-sm text-[var(--text-muted)]">{evaluation.suggestion}</p>
              </div>
            </div>

            {/* Next button */}
            <button
              onClick={handleNext}
              className="w-full rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--accent-hover)] transition-colors"
            >
              {currentRound === "dsa" ? "See Final Feedback →" : "Next Question →"}
            </button>

          </div>
        )}

      </div>
    </div>
  )
}

export default Interview
