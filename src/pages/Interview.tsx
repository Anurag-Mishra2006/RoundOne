import { evaluateInterview, runCode } from "@/services/api"
import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import useSessionStore from "@/store/sessionStore"
import type { EvaluateResult } from "@/types/index"
import CodeEditor from "@/components/CodeEditor"
import Navbar from "@/components/Navbar"
import useTTS from "@/hooks/useTTS"

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

  const language = dsa?.language || "";
  const [code, setCode] = useState<string>("");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<any[]>([]);

  const { isSpeaking, isLoading, speak, stop } = useTTS()

  useEffect(() => {
    if (currentRound === "dsa" && language) {
      setCode(BOILERPLATE_CODE[getMonacoLanguage(language)] || "")
    }
  }, [language, currentRound])

  // create a ref to hold the editor instance
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    editor.focus();
  }

  // redirect if no session
  useEffect(() => {
    if (!hr || !technical || !dsa) {
      navigate("/onboarding")
    }
  }, [hr, technical, dsa, navigate]);



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
  useEffect(() => {
    const questionText = getCurrentQuestion();

    if (questionText && !evaluation) {

      speak(questionText);
    }

    // Cleanup function: If the user clicks "Next" or leaves the page, stop talking!
    return () => {
      stop();
    };
  }, [currentRound, currentQuestionIndex, hr, technical, dsa, evaluation]);

  const handleRunCode = async () => {
    setError("");
    setTestResult([]);

    if (!code) {
      setError("Write Code before running");
      return;
    }
    if (language === "") {
      setError("Select a language in onboarding");
      return;
    }

    try {
      setIsRunning(true);
      const testCases = dsa?.problem.examples || [];
      const response = await runCode({ language, code, testCases });

      if (response.status !== 200) {
        setError("Code Execution Failed");
        return;
      }

      // Save the results so the UI can display them!
      setTestResult(response.data.results);

    } catch (error: any) {
      console.error(error);
      setError(error?.response?.data?.error || "Something went wrong during execution")
    } finally {
      setIsRunning(false);
    }
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
    setTestResult([]) // Clear test results when moving to next

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
    <>
      <Navbar />
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

            {/* Voice Controls UI */}
            <div className="flex items-center gap-3 mb-3 h-8"> 
            {isLoading ? (
               <span className="text-xs text-[var(--text-muted)] animate-pulse flex items-center gap-2">
                 <div className="w-2 h-2 bg-[var(--accent)] rounded-full animate-bounce"></div>
                 Loading audio...
               </span>
            ) : isSpeaking ? (
               <button onClick={stop} className="text-xs flex items-center gap-1 px-3 py-1.5 bg-[var(--danger)]/10 text-[var(--danger)] rounded-md hover:bg-[var(--danger)]/20 transition-colors">
                 <span>⏹</span> Stop Audio
               </button>
            ) : (
               <button onClick={() => speak(getCurrentQuestion())} className="text-xs flex items-center gap-1 px-3 py-1.5 bg-[var(--accent)]/10 text-[var(--accent)] rounded-md hover:bg-[var(--accent)]/20 transition-colors">
                 <span>🔊</span> {evaluation ? "Listen Again" : "Replay Question"}
               </button>
            )}
          </div>

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

          {/* Answer input & Buttons — only show if no evaluation yet */}
          {!evaluation && (
            <div className="space-y-3">
              {currentRound === "dsa" ? (
                <CodeEditor
                  value={code}
                  language={getMonacoLanguage(language || "") || ""}
                  onChange={(newValue) => setCode(newValue || "")}
                  onMount={handleEditorDidMount}
                />
              ) : (
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  rows={6}
                  className="w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-none"
                />
              )}

              {error && (
                <p className="text-sm text-[var(--danger)]">{error}</p>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 mt-4">
                {currentRound === "dsa" && (
                  <button
                    onClick={handleRunCode}
                    disabled={isRunning || loading}
                    className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {isRunning ? "Running..." : "Run Code"}
                  </button>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={loading || isRunning}
                  className="w-full rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--accent-hover)] disabled:opacity-50 transition-colors"
                >
                  {loading ? "Evaluating..." : "Submit Answer"}
                </button>
              </div>

              {/* Test Results UI */}
              {testResult.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h3 className="text-sm font-medium text-[var(--text)]">Test Results:</h3>
                  {testResult.map((result: any, index: number) => (
                    <div
                      key={index}
                      className={`p-3 rounded-md border ${result.passed ? 'border-[var(--success)] bg-[var(--success)]/10' : 'border-[var(--danger)] bg-[var(--danger)]/10'}`}
                    >
                      <p className="text-sm font-bold text-[var(--text)]">
                        Test Case {result.testCase}: {result.passed ? "✅ Passed" : "❌ Failed"}
                      </p>

                      {!result.passed && (
                        <div className="mt-2 text-xs font-mono text-[var(--text-muted)] space-y-1">
                          <p><span className="text-[var(--text)]">Input:</span> {result.input}</p>
                          <p><span className="text-[var(--text)]">Expected:</span> {result.expectedOutput}</p>
                          <p><span className="text-[var(--danger)]">Actual:</span> {result.actualOutput}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
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
    </>
  )
}

export default Interview
