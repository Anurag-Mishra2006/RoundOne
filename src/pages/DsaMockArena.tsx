import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
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
    const [runResult, setRunResult] = useState<any>(null);

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

    // --- FINAL SUBMIT LOGIC ---
    const handleFinalSubmit = async (isForced = false) => {
        if (hasSubmitted.current) return;
        
        // If it's NOT forced, ask for confirmation. If forced (timer or cheating), skip it.
        if (!isForced && timeLeft > 0) {
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
            navigate(`/dsa-mock/review/${sessionId}`);
        } catch (error) {
            console.error("Failed to submit:", error);
            alert("Error submitting assessment. Please try again.");
            hasSubmitted.current = false;
            setIsSubmitting(false);
        }
    };

    // --- TIMER LOGIC ---
    useEffect(() => {
        if (timeLeft <= 0 && !hasSubmitted.current) {
            handleFinalSubmit(true); // true = force submit!
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

    // --- ANTI-CHEAT: JUST COUNT THE WARNINGS ---
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && !hasSubmitted.current) {
                setWarnings((prev) => prev + 1); // Only count up, do not trigger alerts here
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, []);

    // --- ANTI-CHEAT: TRIGGER ACTIONS BASED ON COUNT ---
    useEffect(() => {
        // Kept emojis here because native browser alerts only support plain text/emojis, not SVGs!
        if (warnings === 1) {
            alert("⚠️ WARNING 1/3: You switched tabs. This is a strict Mock OA. Please stay on this screen.");
        } else if (warnings === 2) {
            alert("🚨 WARNING 2/3: If you leave this screen again, your assessment will be auto-submitted.");
        } else if (warnings >= 3 && !hasSubmitted.current) {
            alert("❌ Assessment Terminated due to suspicious activity.");
            handleFinalSubmit(true); // true = force submit!
        }
    }, [warnings]);

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
        setRunResult(null); 
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

    if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white font-mono"><div className="w-6 h-6 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin mr-3"></div>Loading Arena...</div>;
    if (questions.length === 0) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white font-mono">Session not found.</div>;

    const currentQ = questions[activeQIndex];

    return (
        <div className="min-h-screen bg-[#050505] font-sans flex flex-col h-screen overflow-hidden selection:bg-red-500/30 relative">
            
            {/* --- UPGRADED AMBIENT BACKGROUND --- */}
            <div className="absolute inset-0 pointer-events-none z-0" style={{ backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)', backgroundSize: '24px 24px', maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)' }} />
            <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-red-900/10 rounded-full blur-[150px] pointer-events-none z-0"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[150px] pointer-events-none z-0"></div>

            {/* --- TOP BAR --- */}
            <div className="h-14 bg-[#0a0a0a]/80 border-b border-white/10 flex justify-between items-center px-6 shrink-0 backdrop-blur-xl relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-500 animate-[pulse_1.5s_infinite] shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
                    <div className="text-red-400 font-bold text-sm tracking-widest uppercase">Live Assessment</div>
                </div>
                
                <div className="flex items-center gap-6">
                    {warnings > 0 && (
                        <div className="bg-red-500/10 text-red-400 border border-red-500/30 px-3 py-1 rounded-full text-xs font-bold animate-pulse flex items-center gap-1.5">
                            {/* Warning SVG */}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            Warnings: {warnings > 3 ? 3 : warnings}/3
                        </div>
                    )}
                    <div className={`text-2xl font-mono font-black tracking-wider ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                        {formatTime(timeLeft)}
                    </div>
                </div>

                <button 
                    onClick={() => handleFinalSubmit(false)} 
                    disabled={isSubmitting}
                    className="group bg-red-600/90 hover:bg-red-500 text-white border border-red-400/30 px-5 py-1.5 rounded-lg text-sm font-bold transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(239,68,68,0.3)] flex items-center gap-2"
                >
                    {isSubmitting ? <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></span> : null}
                    {isSubmitting ? "Evaluating..." : (
                        <>
                            Finish Exam
                            {/* Arrow SVG replacing ➔ */}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:translate-x-1 transition-transform">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                            </svg>
                        </>
                    )}
                </button>
            </div>

            <div className="flex-grow flex flex-col lg:flex-row w-full h-[calc(100vh-56px)] p-4 gap-4 relative z-10">
                
                {/* --- LEFT PANEL --- */}
                <div className="w-full lg:w-1/2 flex flex-col gap-4 h-full overflow-hidden">
                    <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col overflow-hidden h-full shadow-2xl">
                        
                        <div className="flex border-b border-white/10 bg-white/5 shrink-0">
                            {questions.map((q, idx) => (
                                <button
                                    key={q.id}
                                    onClick={() => {
                                        setActiveQIndex(idx);
                                        setRunResult(null); 
                                    }}
                                    className={`flex-1 py-4 text-sm font-bold border-b-2 transition-all ${
                                        activeQIndex === idx ? 'border-red-500 text-red-400 bg-red-500/5' : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    Q{idx + 1}. {q.difficulty === 'EASY' ? 'Easy' : q.difficulty === 'MEDIUM' ? 'Medium' : 'Hard'}
                                </button>
                            ))}
                        </div>

                        <div className="p-6 overflow-y-auto flex-grow flex flex-col relative custom-scrollbar">
                            <div className="flex items-center gap-3 mb-4">
                                <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border ${
                                    currentQ.difficulty === 'EASY' ? 'text-green-400 bg-green-400/10 border-green-400/20' :
                                    currentQ.difficulty === 'MEDIUM' ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' :
                                    'text-red-400 bg-red-400/10 border-red-400/20'
                                }`}>{currentQ.difficulty}</span>
                            </div>
                            <h1 className="text-3xl font-extrabold text-white mb-6 tracking-tight">{currentQ.title}</h1>
                            <div className="prose prose-invert max-w-none text-sm text-gray-300 prose-pre:bg-black prose-pre:border prose-pre:border-white/10">
                                <ReactMarkdown>{currentQ.description}</ReactMarkdown>
                            </div>
                            
                            <div className="mt-8 space-y-4">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Visible Examples</h3>
                                {currentQ.testCases.map((tc: any, idx: number) => (
                                    <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-4">
                                        <p className="text-xs font-bold text-gray-500 mb-3">Example {idx + 1}</p>
                                        <div className="space-y-2 font-mono text-sm">
                                            <div><span className="text-gray-500">Input: </span><span className="text-white whitespace-pre-wrap">{tc.input}</span></div>
                                            <div><span className="text-gray-500">Output: </span><span className="text-white whitespace-pre-wrap">{tc.expectedOutput}</span></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- RIGHT PANEL (Editor & Console) --- */}
                <div className="w-full lg:w-1/2 flex flex-col gap-4 h-full">
                     <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-t-2xl p-3 flex justify-between items-center shrink-0">
                         <select
                            value={language}
                            onChange={handleLanguageChange}
                            className="bg-white/5 border border-white/10 text-white text-sm rounded-lg px-3 py-1.5 outline-none cursor-pointer focus:border-red-500/50 transition-colors"
                        >
                            <option value="cpp" className="bg-[#0a0a0a]">C++</option>
                            <option value="python" className="bg-[#0a0a0a]">Python</option>
                            <option value="java" className="bg-[#0a0a0a]">Java</option>
                            <option value="javascript" className="bg-[#0a0a0a]">JavaScript</option>
                        </select>

                         <button 
                             onClick={handleRunCode}
                             disabled={isRunning || isSubmitting}
                             className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-5 py-1.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 group"
                         >
                             {isRunning ? (
                                <span className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></span>
                             ) : (
                                /* Play Button SVG replacing ▶ */
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white group-hover:scale-110 transition-transform">
                                  <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                                </svg>
                             )} 
                             {isRunning ? "Running..." : "Run Code"}
                         </button>
                     </div>

                     <div className="flex-grow border border-white/10 overflow-hidden shadow-2xl relative">
                        <Editor
                            height="100%"
                            language={language === "cpp" ? "cpp" : language}
                            theme="vs-dark"
                            value={codes[activeQIndex]} 
                            onChange={handleCodeChange}
                            options={{ minimap: { enabled: false }, fontSize: 14, padding: { top: 16 }, fontFamily: "'Fira Code', 'JetBrains Mono', monospace", contextmenu: false }}
                        />
                    </div>

                    {/* --- CONSOLE WINDOW --- */}
                    <div className="h-64 bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 rounded-b-2xl p-4 overflow-y-auto shrink-0 relative custom-scrollbar shadow-2xl">
                        {!runResult ? (
                            <div className="h-full flex items-center justify-center text-gray-500 text-sm italic">
                                Run your code to test against visible examples.
                            </div>
                        ) : (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                                <h3 className={`text-xl font-black tracking-tight flex items-center gap-2 ${runResult.verdict === 'Accepted' || runResult.verdict === 'AC' || runResult.verdict === 'Success' ? 'text-green-400' : 'text-red-400'}`}>
                                    {runResult.verdict === 'Accepted' || runResult.verdict === 'AC' || runResult.verdict === 'Success' ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" /></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" /></svg>
                                    )}
                                    {runResult.verdict}
                                </h3>

                                <div className="flex flex-col gap-3 mt-4">
                                    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                                        <div className="bg-black/30 px-4 py-2 border-b border-white/5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Input</div>
                                        <pre className="p-4 text-sm text-gray-200 font-mono whitespace-pre-wrap">{runResult.input}</pre>
                                    </div>
                                    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                                        <div className="bg-black/30 px-4 py-2 border-b border-white/5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Your Output</div>
                                        <pre className={`p-4 text-sm font-mono whitespace-pre-wrap ${runResult.verdict === 'Accepted' || runResult.verdict === 'Success' ? 'text-green-400' : 'text-red-400'}`}>
                                            {runResult.stdout || "No output generated."}
                                        </pre>
                                    </div>
                                    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                                        <div className="bg-black/30 px-4 py-2 border-b border-white/5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Expected Output</div>
                                        <pre className="p-4 text-sm text-gray-200 font-mono whitespace-pre-wrap">{runResult.expectedOutput}</pre>
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
