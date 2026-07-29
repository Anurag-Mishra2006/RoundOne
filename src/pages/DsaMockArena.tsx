import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
// ADDED: submitCode and getCodeResult for the "Run Code" feature
import { getDSARoundSession, submitDSARoundSession, submitCode, getCodeResult } from "@/services/api";

const BOILERPLATES: Record<string, string> = {
    python: "import sys\n\ndef solve():\n    # Read all standard input\n    input_data = sys.stdin.read().split()\n    if not input_data: return\n    \n    # Write your logic here\n    \n\nif __name__ == '__main__':\n    solve()",
    cpp: "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    // Read from standard input\n    \n    // Write your logic here\n    \n    return 0;\n}",
    java: "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        \n        // Write your logic here\n        \n    }\n}",
    javascript: "const fs = require('fs');\n\nfunction solve() {\n    const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split('\\n');\n    if (!input.length || input[0] === '') return;\n    \n    // Write your logic here\n    \n}\n\nsolve();"
};

export default function DsaMockArena() {
    const { sessionId } = useParams();
    const navigate = useNavigate();

    const [questions, setQuestions] = useState<any[]>([]);
    const [activeQIndex, setActiveQIndex] = useState(0); 
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    //  MULTI-QUESTION EDITOR STATE  
    const [language, setLanguage] = useState("cpp");
    const [codes, setCodes] = useState<string[]>([
        BOILERPLATES["cpp"], BOILERPLATES["cpp"], BOILERPLATES["cpp"]
    ]);

    // --- RUN CODE (CONSOLE) STATE ---
    const [isRunning, setIsRunning] = useState(false);
    const [runResult, setRunResult] = useState<any>(null); // Stores result of visible test cases

    // ---  TIMER & EXAM STATE ---
    const [timeLeft, setTimeLeft] = useState(90 * 60); 
    const [warnings, setWarnings] = useState(0);
    const hasSubmitted = useRef(false);

    // --- INITIAL DATA FETCH ---
    useEffect(() => {
        const fetchSession = async () => {
            try {
                if (!sessionId) return;
                const res = await getDSARoundSession(sessionId);
                setQuestions(res.data.questions);
            } catch (error) {
                console.error("Failed to load session:", error);
                alert("Failed to load Assessment. Returning to Dashboard.");
                navigate('/dashboard');
            } finally {
                setLoading(false);
            }
        };
        fetchSession();
    }, [sessionId, navigate]);

    // --- TIMER LOGIC ---
    useEffect(() => {
        if (timeLeft <= 0 && !hasSubmitted.current) {
            handleFinalSubmit(); 
            return;
        }
        const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    };

    // --- ANTI-CHEAT (TAB SWITCHING) ---
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && !hasSubmitted.current) {
                setWarnings((prev) => {
                    const newWarnings = prev + 1;
                    if (newWarnings === 1) {
                        alert("⚠️ WARNING 1/3: You switched tabs. This is a strict Mock OA. Please stay on this screen.");
                    } else if (newWarnings === 2) {
                        alert("🚨 WARNING 2/3: If you leave this screen again, your assessment will be auto-submitted.");
                    } else if (newWarnings >= 3) {
                        alert("❌ Assessment Terminated due to suspicious activity.");
                        handleFinalSubmit();
                    }
                    return newWarnings;
                });
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, []);

    // --- HANDLERS ---
    const handleCodeChange = (val: string | undefined) => {
        const newCodes = [...codes];
        newCodes[activeQIndex] = val || "";
        setCodes(newCodes);
    };

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLang = e.target.value;
        const currentCode = codes[activeQIndex];
        const isCustomCode = currentCode !== BOILERPLATES[language] && currentCode.trim() !== "";

        if (isCustomCode) {
            const confirmChange = window.confirm("Warning: Changing the language will reset your code for THIS question. Are you sure?");
            if (!confirmChange) return; 
        }

        setLanguage(newLang);
        const newCodes = [...codes];
        newCodes[activeQIndex] = BOILERPLATES[newLang]; 
        setCodes(newCodes);
        setRunResult(null); // Clear console when switching languages
    };

    // --- RUN CODE LOGIC (Contest Mode) ---
    const pollResult = (jobId: string) => {
        const interval = setInterval(async () => {
            try {
                const res = await getCodeResult(jobId);
                const jobData = res.data;

                if (jobData.status === "completed") {
                    clearInterval(interval);
                    const executionResult = jobData.result.result;
                    const dockerResult = Array.isArray(executionResult.results) ? executionResult.results[0] : executionResult;
                    
                    const actualOutput = (dockerResult.stdout || dockerResult.stderr || "").trim();
                    const expectedOutput = (dockerResult.expectedOutput || questions[activeQIndex].testCases[0]?.expectedOutput || "").trim();
                    const verdict = dockerResult.verdict === "AC" ? "Accepted" : dockerResult.verdict === "WA" ? "Wrong Answer" : dockerResult.verdict;

                    setRunResult({ verdict, stdout: actualOutput, input: questions[activeQIndex].testCases[0]?.input, expectedOutput });
                    setIsRunning(false);
                } else if (jobData.status === "failed") {
                    clearInterval(interval);
                    setRunResult({ verdict: "System Error", stdout: "Execution failed." });
                    setIsRunning(false);
                }
            } catch (err) {
                clearInterval(interval);
                setIsRunning(false);
            }
        }, 1000);
    };

    const handleRunCode = async () => {
        if (!codes[activeQIndex].trim()) return;
        setIsRunning(true);
        setRunResult(null);

        try {
            // We only send the visible test cases we fetched earlier
            const response = await submitCode({
                language,
                code: codes[activeQIndex],
                testCases: questions[activeQIndex].testCases 
            });
            pollResult(response.data.submissionId);
        } catch (error) {
            console.error(error);
            setRunResult({ verdict: "Error", stdout: "Failed to connect to execution server." });
            setIsRunning(false);
        }
    };

    // --- FINAL SUBMIT ---
    const handleFinalSubmit = async () => {
        if (hasSubmitted.current) return;
        if (timeLeft > 0) {
            const confirmSubmit = window.confirm("Are you sure you want to finish and submit the assessment?");
            if (!confirmSubmit) return;
        }

        hasSubmitted.current = true;
        setIsSubmitting(true);

        const payload = {
            sessionId: sessionId as string,
            submissions: questions.map((q, idx) => ({
                questionId: q.id,
                code: codes[idx],
                language: language
            }))
        };

        try {
            await submitDSARoundSession(payload);
            navigate('/dashboard');
        } catch (error) {
            console.error("Failed to submit:", error);
            alert("Error submitting assessment. Please try again.");
            hasSubmitted.current = false;
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white font-mono">Loading Arena...</div>;
    if (questions.length === 0) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white font-mono">Session not found.</div>;

    const currentQ = questions[activeQIndex];

    return (
        <div className="min-h-screen bg-[#050505] font-sans flex flex-col h-screen overflow-hidden selection:bg-red-500/30">
            
            {/* --- TOP BAR --- */}
            <div className="h-14 bg-red-900/10 border-b border-red-500/20 flex justify-between items-center px-6 shrink-0 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
                    <div className="text-red-400 font-bold text-sm tracking-widest uppercase">Live Assessment</div>
                </div>
                
                <div className="flex items-center gap-6">
                    {warnings > 0 && (
                        <div className="bg-red-500/20 text-red-500 border border-red-500/50 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                            ⚠️ Warnings: {warnings}/3
                        </div>
                    )}
                    <div className={`text-2xl font-mono font-black tracking-wider ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                        {formatTime(timeLeft)}
                    </div>
                </div>

                <button 
                    onClick={handleFinalSubmit} 
                    disabled={isSubmitting}
                    className="bg-red-600/80 hover:bg-red-500 text-white border border-red-400/50 px-5 py-1.5 rounded-lg text-sm font-bold transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(239,68,68,0.2)] flex items-center gap-2"
                >
                    {isSubmitting ? <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></span> : null}
                    {isSubmitting ? "Evaluating..." : "Finish Exam ➔"}
                </button>
            </div>

            <div className="flex-grow flex flex-col lg:flex-row w-full h-[calc(100vh-56px)] p-4 gap-4">
                
                {/* --- LEFT PANEL --- */}
                <div className="w-full lg:w-1/2 flex flex-col gap-4 h-full overflow-hidden">
                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl flex flex-col overflow-hidden h-full shadow-lg">
                        
                        <div className="flex border-b border-[var(--border)] bg-[var(--bg)]/50 shrink-0">
                            {questions.map((q, idx) => (
                                <button
                                    key={q.id}
                                    onClick={() => {
                                        setActiveQIndex(idx);
                                        setRunResult(null); // Clear console on tab switch
                                    }}
                                    className={`flex-1 py-4 text-sm font-bold border-b-2 transition-all ${
                                        activeQIndex === idx ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--accent)]/5' : 'border-transparent text-[var(--text-muted)] hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    Q{idx + 1}. {q.difficulty === 'EASY' ? 'Easy' : q.difficulty === 'MEDIUM' ? 'Medium' : 'Hard'}
                                </button>
                            ))}
                        </div>

                        <div className="p-6 overflow-y-auto flex-grow flex flex-col relative custom-scrollbar">
                            <div className="flex items-center gap-3 mb-4">
                                <span className={`text-xs font-bold px-3 py-1 rounded-md border ${
                                    currentQ.difficulty === 'EASY' ? 'text-green-400 bg-green-400/10 border-green-400/20' :
                                    currentQ.difficulty === 'MEDIUM' ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' :
                                    'text-red-400 bg-red-400/10 border-red-400/20'
                                }`}>{currentQ.difficulty}</span>
                            </div>
                            <h1 className="text-3xl font-bold text-white mb-6">{currentQ.title}</h1>
                            <div className="prose prose-invert max-w-none text-sm text-[var(--text-muted)]">
                                <ReactMarkdown>{currentQ.description}</ReactMarkdown>
                            </div>
                            
                            <div className="mt-8 space-y-4">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3">Visible Examples</h3>
                                {currentQ.testCases.map((tc: any, idx: number) => (
                                    <div key={idx} className="bg-[var(--bg)] border border-[var(--border)] rounded-xl p-4">
                                        <p className="text-xs font-bold text-[var(--text-muted)] mb-3">Example {idx + 1}</p>
                                        <div className="space-y-2 font-mono text-sm">
                                            <div><span className="text-[var(--text-muted)]">Input: </span><span className="text-white whitespace-pre-wrap">{tc.input}</span></div>
                                            <div><span className="text-[var(--text-muted)]">Output: </span><span className="text-white whitespace-pre-wrap">{tc.expectedOutput}</span></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- RIGHT PANEL (Editor & Console) --- */}
                <div className="w-full lg:w-1/2 flex flex-col gap-4 h-full">
                     <div className="bg-[var(--surface)] border border-[var(--border)] rounded-t-2xl p-3 flex justify-between items-center shrink-0">
                         <select
                            value={language}
                            onChange={handleLanguageChange}
                            className="bg-[var(--bg)] border border-[var(--border)] text-white text-sm rounded-lg px-3 py-1.5 outline-none cursor-pointer"
                        >
                            <option value="cpp">C++</option>
                            <option value="python">Python</option>
                            <option value="java">Java</option>
                            <option value="javascript">JavaScript</option>
                        </select>

                         <button 
                             onClick={handleRunCode}
                             disabled={isRunning || isSubmitting}
                             className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-1.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2"
                         >
                             {isRunning ? "Running..." : "▶ Run Code"}
                         </button>
                     </div>

                     <div className="flex-grow border-x border-[var(--border)] overflow-hidden">
                        <Editor
                            height="100%"
                            language={language === "cpp" ? "cpp" : language}
                            theme="vs-dark"
                            value={codes[activeQIndex]} 
                            onChange={handleCodeChange}
                            options={{ minimap: { enabled: false }, fontSize: 14, padding: { top: 16 }, contextmenu: false }}
                        />
                    </div>

                    {/* --- CONSOLE WINDOW --- */}
                    <div className="h-64 bg-[var(--surface)] border border-[var(--border)] rounded-b-2xl p-4 overflow-y-auto shrink-0 relative custom-scrollbar">
                        {!runResult ? (
                            <div className="h-full flex items-center justify-center text-[var(--text-muted)] text-sm">
                                Run your code to test against visible examples.
                            </div>
                        ) : (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                                <h3 className={`text-xl font-extrabold ${runResult.verdict === 'Accepted' || runResult.verdict === 'AC' ? 'text-green-400' : 'text-red-400'}`}>
                                    {runResult.verdict}
                                </h3>

                                <div className="flex flex-col gap-3 mt-4">
                                    <div className="bg-[var(--bg)] border border-[var(--border)] rounded-xl overflow-hidden">
                                        <div className="bg-white/5 px-4 py-2 border-b border-[var(--border)] text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Input</div>
                                        <pre className="p-4 text-sm text-white font-mono whitespace-pre-wrap">{runResult.input}</pre>
                                    </div>
                                    <div className="bg-[var(--bg)] border border-[var(--border)] rounded-xl overflow-hidden">
                                        <div className="bg-white/5 px-4 py-2 border-b border-[var(--border)] text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Your Output</div>
                                        <pre className={`p-4 text-sm font-mono whitespace-pre-wrap ${runResult.verdict === 'Accepted' ? 'text-green-400' : 'text-red-400'}`}>
                                            {runResult.stdout || "No output generated."}
                                        </pre>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
