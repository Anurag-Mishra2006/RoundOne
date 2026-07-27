import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';
import { getDSARoundSession, submitDSARoundSession } from "@/services/api.js";

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
        BOILERPLATES["cpp"],
        BOILERPLATES["cpp"],
        BOILERPLATES["cpp"]
    ]);

    // ---  TIMER & EXAM STATE ---
    const [timeLeft, setTimeLeft] = useState(90 * 60);
    const [warnings, setWarnings] = useState(0);
    const hasSubmitted = useRef(false);

    // --- INITIAL DATA FETCH ---
    useEffect(() => {
        const fetchSession = async () => {
            try {
                if (!sessionId) return;

                // FIXED: Fetch the session details using the ID from the URL!
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
    };

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
            console.log("Submitting payload to backend:", payload);
            // FIXED: Actually calls your API!
            await submitDSARoundSession(payload);

            // Redirect to dashboard where they can review the Post-Match Report
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

            {/* --- TOP BAR (Strict Exam Header - No Navbar) --- */}
            <div className="h-14 bg-red-900/10 border-b border-red-500/20 flex justify-between items-center px-6 shrink-0 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
                    <div className="text-red-400 font-bold text-sm tracking-widest uppercase">
                        Live Assessment
                    </div>
                </div>

                {/* TIMER */}
                <div className={`text-2xl font-mono font-black tracking-wider ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                    {formatTime(timeLeft)}
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

                        {/* QUESTION TABS */}
                        <div className="flex border-b border-[var(--border)] bg-[var(--bg)]/50 shrink-0">
                            {questions.map((q, idx) => (
                                <button
                                    key={q.id}
                                    onClick={() => setActiveQIndex(idx)}
                                    className={`flex-1 py-4 text-sm font-bold border-b-2 transition-all ${activeQIndex === idx
                                            ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--accent)]/5'
                                            : 'border-transparent text-[var(--text-muted)] hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    Q{idx + 1}. {q.difficulty === 'EASY' ? 'Easy' : q.difficulty === 'MEDIUM' ? 'Medium' : 'Hard'}
                                </button>
                            ))}
                        </div>

                        {/* QUESTION DESCRIPTION */}
                        <div className="p-6 overflow-y-auto flex-grow flex flex-col relative custom-scrollbar">
                            <div className="flex items-center gap-3 mb-4">
                                <span className={`text-xs font-bold px-3 py-1 rounded-md border ${currentQ.difficulty === 'EASY' ? 'text-green-400 bg-green-400/10 border-green-400/20' :
                                        currentQ.difficulty === 'MEDIUM' ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' :
                                            'text-red-400 bg-red-400/10 border-red-400/20'
                                    }`}>
                                    {currentQ.difficulty}
                                </span>
                            </div>

                            <h1 className="text-3xl font-bold text-white mb-6">{currentQ.title}</h1>

                            <div className="prose prose-invert prose-p:text-[var(--text-muted)] prose-pre:bg-[var(--bg)] prose-pre:border prose-pre:border-[var(--border)] max-w-none">
                                <ReactMarkdown>{currentQ.description}</ReactMarkdown>
                            </div>

                            {/* Constraints & Notice */}
                            <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                                <p className="text-xs font-bold text-yellow-500 uppercase tracking-wider mb-1">⚠️ Assessment Notice</p>
                                <p className="text-sm text-yellow-500/80">You cannot run code against custom test cases in this mock environment. Your code will be evaluated against hidden test cases upon final submission.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- RIGHT PANEL (Editor) --- */}
                <div className="w-full lg:w-1/2 flex flex-col gap-4 h-full">
                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-t-2xl p-3 flex justify-between items-center shrink-0">

                        <select
                            value={language}
                            onChange={handleLanguageChange}
                            className="bg-[var(--bg)] border border-[var(--border)] text-white text-sm rounded-lg px-3 py-1.5 outline-none cursor-pointer focus:border-[var(--accent)] transition-colors"
                        >
                            <option value="cpp">C++</option>
                            <option value="python">Python</option>
                            <option value="java">Java</option>
                            <option value="javascript">JavaScript</option>
                        </select>

                        <span className="text-[var(--text-muted)] text-xs font-bold animate-pulse px-2">
                            Secure Environment Active
                        </span>
                    </div>

                    <div className="flex-grow border border-[var(--border)] overflow-hidden rounded-b-2xl shadow-lg relative">
                        <Editor
                            height="100%"
                            language={language === "cpp" ? "cpp" : language}
                            theme="vs-dark"
                            value={codes[activeQIndex]}
                            onChange={handleCodeChange}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                padding: { top: 16 },
                                fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
                                contextmenu: false,
                            }}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}
