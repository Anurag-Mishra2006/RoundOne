import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Editor from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { getPracticeQuestionBySlug, submitCode, submitPracticeCode, getCodeResult, getQuestionSubmissions } from '@/services/api';

// IMPORT YOUR CUSTOM WHISPER STT HOOK HERE (Adjust path if needed)
import { useSTT } from '@/hooks/useSTT';

// --- BOILERPLATE CODE TEMPLATES ---
const BOILERPLATES: Record<string, string> = {
    python: "import sys\n\ndef solve():\n    # Read all standard input\n    input_data = sys.stdin.read().split()\n    if not input_data: return\n    \n    # Write your logic here\n    \n\nif __name__ == '__main__':\n    solve()",
    cpp: "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    // Read from standard input\n    \n    // Write your logic here\n    \n    return 0;\n}",
    java: "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        \n        // Write your logic here\n        \n    }\n}",
    javascript: "const fs = require('fs');\n\nfunction solve() {\n    const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split('\\n');\n    if (!input.length || input[0] === '') return;\n    \n    // Write your logic here\n    \n}\n\nsolve();"
};

export default function PracticeArena() {
    const { slug } = useParams();

    // Data State
    const [question, setQuestion] = useState<any>(null);
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // UI State
    const [activeTab, setActiveTab] = useState("description"); // "description" | "submissions"

    // Editor State
    const [language, setLanguage] = useState("python");
    const [code, setCode] = useState(BOILERPLATES["python"]);
    const [userApproach, setUserApproach] = useState("");

    // Custom STT Hook (Whisper/Groq)
    const { isRecording, isProcessing, startRecording, stopRecording } = useSTT();

    // Execution State
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [result, setResult] = useState<any>(null);

    // Helper to fetch submissions
    const fetchSubmissions = async (questionId: string) => {
        try {
            const subRes = await getQuestionSubmissions(questionId);
            setSubmissions(subRes.data.data || []);
        } catch (error) {
            console.error("Failed to fetch submissions:", error);
        }
    };

    // 1. Initial Data Fetch (Question + Submissions)
    useEffect(() => {
        const fetchQuestionData = async () => {
            try {
                const res = await getPracticeQuestionBySlug(slug as string);
                const qData = res.data.data;
                setQuestion(qData);

                // Fetch submissions right after getting the question ID
                await fetchSubmissions(qData.id);
            } catch (error) {
                console.error("Failed to fetch question:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuestionData();
    }, [slug]);

    // 2. Handle Language Change
    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLang = e.target.value;
        setLanguage(newLang);
        setCode(BOILERPLATES[newLang]);
    };

    // 3. Speech-to-Text Toggle using your Custom Hook
    const toggleListening = async () => {
        if (isRecording) {
            try {
                // stopRecording returns a promise with the transcribed text!
                const transcript = await stopRecording();

                // Append the text to the textarea, adding a space if there's already text there
                setUserApproach(prev => prev + (prev ? " " : "") + transcript);
            } catch (error) {
                console.error("Transcription failed", error);
                alert("Failed to transcribe audio.");
            }
        } else {
            startRecording();
        }
    };

    // 4. Polling Logic for Execution
    const pollResult = (jobId: string, isSubmitType: boolean) => {
        const interval = setInterval(async () => {
            try {
                const res = await getCodeResult(jobId);
                const jobData = res.data;

                if (jobData.status === "completed") {
                    clearInterval(interval);

                    if (isSubmitType) {
                        // THIS WAS A REAL SUBMISSION
                        setResult({
                            isRunOnly: false,
                            verdict: jobData.result.verdict,
                            aiFeedback: "AI is generating your code review in the background. Check your Submissions tab in a few seconds!",
                            timeComplexity: "O(N)",
                            spaceComplexity: "O(N)"
                        });

                        // Automatically fetch the latest submissions so it shows up in the tab!
                        if (question) fetchSubmissions(question.id);

                    } else {

                        const dockerResult = jobData.result.result || jobData.result;
                        const actualOutput = (dockerResult.stdout || dockerResult.stderr || "").trim();
                        const expectedOutput = question.testCases[0]?.expectedOutput.trim();

                        let verdict = "Runtime Error";
                        if (dockerResult.exitCode === 0) {
                            verdict = actualOutput === expectedOutput ? "Accepted" : "Wrong Answer";
                        }

                        setResult({
                            isRunOnly: true,
                            verdict: verdict,
                            stdout: actualOutput,
                            input: question.testCases[0]?.input,
                            expectedOutput: expectedOutput
                        });
                    }

                    setIsRunning(false);
                    setIsSubmitting(false);
                } else if (jobData.status === "failed") {
                    clearInterval(interval);
                    setResult({ isRunOnly: true, verdict: "System Error", stdout: "Execution failed." });
                    setIsRunning(false);
                    setIsSubmitting(false);
                }
            } catch (err) {
                clearInterval(interval);
                setIsRunning(false);
                setIsSubmitting(false);
            }
        }, 1000);
    };

    // 5. Handle Run Code
    const handleRunCode = async () => {
        if (!code.trim()) return;
        setIsRunning(true);
        setResult(null);

        try {
            const response = await submitCode({
                language,
                code,
                testCases: question.testCases // Pass only visible test cases
            });
            pollResult(response.data.submissionId, false);
        } catch (error) {
            console.error(error);
            setIsRunning(false);
        }
    };

    // 6. Handle Submit Code
    const handleSubmit = async () => {
        if (!code.trim()) return;
        setIsSubmitting(true);
        setResult(null);
        setActiveTab("description"); // Switch back to description on new submit to see live results

        try {
            const response = await submitPracticeCode({
                questionId: question.id,
                language,
                code,
                userApproach
            });
            pollResult(response.data.jobId, true);
        } catch (error) {
            console.error(error);
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center text-white">Loading Arena...</div>;
    if (!question) return <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center text-white">Question not found.</div>;

    return (
        <div className="min-h-screen bg-[var(--bg)] font-sans flex flex-col h-screen overflow-hidden">
            <Navbar />

            <div className="flex-grow flex flex-col lg:flex-row w-full h-[calc(100vh-70px)] p-4 gap-4">

                {/* --- LEFT PANEL: Tabs, Description, Submissions --- */}
                <div className="w-full lg:w-1/2 flex flex-col gap-4 h-full overflow-hidden">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl flex flex-col overflow-hidden h-full shadow-lg relative">

                        {/* Tabs Header */}
                        <div className="flex border-b border-[var(--border)] bg-[var(--bg)]/50 shrink-0">
                            <button
                                onClick={() => setActiveTab("description")}
                                className={`px-6 py-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${activeTab === 'description' ? 'border-[var(--accent)] text-[var(--accent)]' : 'border-transparent text-[var(--text-muted)] hover:text-white'}`}
                            >
                                📄 Description
                            </button>
                            <button
                                onClick={() => setActiveTab("submissions")}
                                className={`px-6 py-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${activeTab === 'submissions' ? 'border-[var(--accent)] text-[var(--accent)]' : 'border-transparent text-[var(--text-muted)] hover:text-white'}`}
                            >
                                🕒 Submissions <span className="bg-[var(--border)] text-[var(--text)] px-2 py-0.5 rounded-full text-[10px]">{submissions.length}</span>
                            </button>
                        </div>

                        {/* Tab Content Area */}
                        <div className="p-6 overflow-y-auto flex-grow flex flex-col relative">
                            {activeTab === "description" ? (
                                // TAB 1: DESCRIPTION
                                <>
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className={`text-xs font-bold px-3 py-1 rounded-md border ${question.difficulty === 'EASY' ? 'text-green-400 bg-green-400/10 border-green-400/20' :
                                                question.difficulty === 'MEDIUM' ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' :
                                                    'text-red-400 bg-red-400/10 border-red-400/20'
                                            }`}>
                                            {question.difficulty}
                                        </span>
                                        {question.companies.map((c: string) => (
                                            <span key={c} className="text-xs text-[var(--text-muted)] bg-[var(--bg)] px-2 py-1 rounded border border-[var(--border)]">{c}</span>
                                        ))}
                                    </div>

                                    <h1 className="text-3xl font-bold text-white mb-6">{question.title}</h1>

                                    <div className="prose prose-invert prose-p:text-[var(--text-muted)] prose-pre:bg-[var(--bg)] prose-pre:border prose-pre:border-[var(--border)] max-w-none mb-8 flex-grow">
                                        <ReactMarkdown>{question.description}</ReactMarkdown>
                                    </div>
                                    {/* Test Cases / Examples - LeetCode style */}
                                    {question.testCases && question.testCases.length > 0 && (
                                        <div className="mb-8 space-y-4">
                                            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3">
                                                Examples
                                            </h3>
                                            {question.testCases.map((tc: any, idx: number) => (
                                                <div key={idx} className="bg-[var(--bg)] border border-[var(--border)] rounded-xl p-4">
                                                    <p className="text-xs font-bold text-[var(--text-muted)] mb-3">Example {idx + 1}</p>
                                                    <div className="space-y-2 font-mono text-sm">
                                                        <div>
                                                            <span className="text-[var(--text-muted)]">Input: </span>
                                                            <span className="text-[var(--text)] whitespace-pre-wrap">{tc.input}</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-[var(--text-muted)]">Output: </span>
                                                            <span className="text-[var(--text)] whitespace-pre-wrap">{tc.expectedOutput}</span>
                                                        </div>
                                                        {tc.explanation && (
                                                            <div>
                                                                <span className="text-[var(--text-muted)]">Explanation: </span>
                                                                <span className="text-[var(--text)]">{tc.explanation}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {/* STT User Approach Box */}
                                    <div className="mt-auto border-t border-[var(--border)] pt-6 relative">
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] block">
                                                Explain your approach to the AI (Optional)
                                            </label>

                                            {/* UPDATED STT BUTTON */}
                                            <button
                                                onClick={toggleListening}
                                                disabled={isProcessing}
                                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${isRecording
                                                        ? 'bg-red-500/20 text-red-400 border-red-500/50 animate-pulse'
                                                        : isProcessing
                                                            ? 'bg-[var(--warning)]/20 text-[var(--warning)] border-[var(--warning)]/50'
                                                            : 'bg-[var(--bg)] text-[var(--text-muted)] border-[var(--border)] hover:text-white hover:border-[var(--accent)]/50'
                                                    } disabled:opacity-50`}
                                            >
                                                <span className="text-sm">
                                                    {isProcessing ? '⏳ Processing...' : isRecording ? '🛑 Stop' : '🎙️ Speak'}
                                                </span>
                                            </button>
                                        </div>

                                        <textarea
                                            value={userApproach}
                                            onChange={(e) => setUserApproach(e.target.value)}
                                            placeholder="I plan to use a hash map to keep track of..."
                                            className={`w-full h-24 bg-[var(--bg)] border rounded-xl p-3 text-sm text-[var(--text)] outline-none resize-none transition-all ${isRecording ? 'border-[var(--accent)] shadow-[0_0_15px_rgba(170,59,255,0.2)]' : 'border-[var(--border)] focus:border-[var(--accent)]'
                                                }`}
                                        />
                                    </div>
                                </>
                            ) : (
                                // TAB 2: SUBMISSIONS HISTORY
                                <div className="space-y-6">
                                    {submissions.length === 0 ? (
                                        <div className="text-center text-[var(--text-muted)] py-10">You have not submitted any code for this problem yet.</div>
                                    ) : (
                                        submissions.map((sub: any) => (
                                            <div key={sub.id} className="bg-[var(--bg)] border border-[var(--border)] rounded-xl overflow-hidden shadow-lg">

                                                {/* Submission Header */}
                                                <div className="p-4 border-b border-[var(--border)] flex justify-between items-center bg-[var(--surface)]/50">
                                                    <div className="flex items-center gap-3">
                                                        <span className={`text-lg font-black ${sub.verdict === 'AC' ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                                                            {sub.verdict === 'AC' ? 'Accepted' : sub.verdict === 'WA' ? 'Wrong Answer' : sub.verdict}
                                                        </span>
                                                        <span className="text-xs text-[var(--text-muted)] px-2 py-1 bg-[var(--border)] rounded-md uppercase font-bold">{sub.language}</span>
                                                    </div>
                                                    <div className="text-xs text-[var(--text-muted)]">
                                                        {new Date(sub.createdAt).toLocaleDateString()} at {new Date(sub.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>

                                                {/* AI Feedback Area */}
                                                {sub.aiFeedback && (
                                                    <div className="p-4 bg-[var(--accent)]/5 border-b border-[var(--accent)]/10">
                                                        <p className="text-xs text-[var(--accent)] font-bold uppercase tracking-wider mb-2 flex items-center gap-2"><span>🧠</span> AI Code Review</p>
                                                        <p className="text-sm text-[var(--text)] leading-relaxed italic">"{sub.aiFeedback}"</p>

                                                        {sub.verdict === 'AC' && (
                                                            <div className="flex gap-4 mt-3">
                                                                <span className="text-xs text-[var(--text-muted)] font-mono bg-[var(--bg)] px-2 py-1 rounded border border-[var(--border)]">Time: <span className="text-white font-bold">{sub.timeComplexity}</span></span>
                                                                <span className="text-xs text-[var(--text-muted)] font-mono bg-[var(--bg)] px-2 py-1 rounded border border-[var(--border)]">Space: <span className="text-white font-bold">{sub.spaceComplexity}</span></span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Code Viewer (Read Only) */}
                                                <div className="p-4 bg-[#0d0d0d]">
                                                    <pre className="text-xs text-gray-400 font-mono overflow-x-auto whitespace-pre-wrap">
                                                        {sub.code}
                                                    </pre>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* --- RIGHT PANEL: Editor & Console --- */}
                <div className="w-full lg:w-1/2 flex flex-col gap-4 h-full">

                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-t-2xl p-3 flex justify-between items-center shrink-0">
                        <select
                            value={language}
                            onChange={handleLanguageChange}
                            className="bg-[var(--bg)] border border-[var(--border)] text-white text-sm rounded-lg px-3 py-1.5 outline-none cursor-pointer"
                        >
                            <option value="python">Python</option>
                            <option value="cpp">C++</option>
                            <option value="java">Java</option>
                            <option value="javascript">JavaScript</option>
                        </select>

                        <div className="flex gap-3">
                            <button
                                onClick={handleRunCode}
                                disabled={isRunning || isSubmitting}
                                className="bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] px-5 py-1.5 rounded-lg text-sm font-bold hover:bg-[var(--surface)] hover:text-white transition-all disabled:opacity-50 flex items-center gap-2"
                            >
                                {isRunning ? "Running..." : "▶ Run Code"}
                            </button>

                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting || isRunning}
                                className="bg-[var(--accent)] text-white px-5 py-1.5 rounded-lg text-sm font-bold hover:bg-[var(--accent-hover)] transition-all disabled:opacity-50 flex items-center gap-2 shadow-[0_0_10px_rgba(170,59,255,0.3)]"
                            >
                                {isSubmitting ? (
                                    <><div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Submitting...</>
                                ) : "Submit ➔"}
                            </button>
                        </div>
                    </div>

                    <div className="flex-grow border-x border-[var(--border)] overflow-hidden">
                        <Editor
                            height="100%"
                            language={language === "cpp" ? "cpp" : language}
                            theme="vs-dark"
                            value={code}
                            onChange={(val) => setCode(val || "")}
                            options={{ minimap: { enabled: false }, fontSize: 14, padding: { top: 16 }, fontFamily: "'Fira Code', 'JetBrains Mono', monospace" }}
                        />
                    </div>

                    <div className="h-64 bg-[var(--surface)] border border-[var(--border)] rounded-b-2xl p-4 overflow-y-auto shrink-0 relative">
                        {!result ? (
                            <div className="h-full flex items-center justify-center text-[var(--text-muted)] text-sm">
                                Run or Submit your code to see results.
                            </div>
                        ) : (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                                <h3 className={`text-2xl font-extrabold ${result.verdict === 'Accepted' || result.verdict === 'AC' || result.verdict === 'Success' ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                                    {result.verdict === 'AC' ? 'Accepted' : result.verdict === 'WA' ? 'Wrong Answer' : result.verdict}
                                </h3>

                                {result.isRunOnly ? (
                                    <div className="flex flex-col gap-3 mt-4">
                                        <div className="bg-[var(--bg)] border border-[var(--border)] rounded-xl overflow-hidden">
                                            <div className="bg-white/5 px-4 py-2 border-b border-[var(--border)] text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Input</div>
                                            <pre className="p-4 text-sm text-[var(--text)] font-mono whitespace-pre-wrap">{result.input}</pre>
                                        </div>

                                        <div className="bg-[var(--bg)] border border-[var(--border)] rounded-xl overflow-hidden">
                                            <div className="bg-white/5 px-4 py-2 border-b border-[var(--border)] text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Your Output</div>
                                            <pre className={`p-4 text-sm font-mono whitespace-pre-wrap ${result.verdict === 'Accepted' || result.verdict === 'Success' ? 'text-green-400' : 'text-red-400'}`}>
                                                {result.stdout || "No output generated."}
                                            </pre>
                                        </div>

                                        <div className="bg-[var(--bg)] border border-[var(--border)] rounded-xl overflow-hidden">
                                            <div className="bg-white/5 px-4 py-2 border-b border-[var(--border)] text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Expected Output</div>
                                            <pre className="p-4 text-sm text-[var(--text)] font-mono whitespace-pre-wrap">{result.expectedOutput}</pre>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {result.verdict === 'AC' && (
                                            <div className="flex gap-4">
                                                <div className="bg-[var(--bg)] border border-[var(--border)] px-4 py-2 rounded-lg">
                                                    <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Time Complexity</p>
                                                    <p className="text-[var(--text)] font-mono font-bold mt-1">{result.timeComplexity}</p>
                                                </div>
                                                <div className="bg-[var(--bg)] border border-[var(--border)] px-4 py-2 rounded-lg">
                                                    <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Space Complexity</p>
                                                    <p className="text-[var(--text)] font-mono font-bold mt-1">{result.spaceComplexity}</p>
                                                </div>
                                            </div>
                                        )}
                                        <div className="bg-[var(--accent)]/10 border border-[var(--accent)]/20 p-4 rounded-xl mt-4">
                                            <p className="text-xs text-[var(--accent)] font-bold uppercase tracking-wider mb-2 flex items-center gap-2"><span>🧠</span> AI Feedback</p>
                                            <p className="text-sm text-[var(--text)] leading-relaxed italic">{result.aiFeedback}</p>
                                        </div>
                                    </>
                                )}
                            </motion.div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
