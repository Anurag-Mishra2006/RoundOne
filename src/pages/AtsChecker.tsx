import { useState, useEffect } from 'react'
import { checkAtsResume } from "@/services/api";
import Navbar from '@/components/Navbar.js';
import { motion, type Variants } from 'framer-motion';
import { useLocation } from "react-router-dom";

interface AtsResult {
    overallScore: number,
    scoreCategory: string,
    criticalIssues: string[],
    matchedRoles?: { role: string; matchPercentage: number }[],
    sectionScores: Record<string, { score: number; feedback: string }>,
    lineByLineFixes: { originalText: string; suggestedRewrite: string; reason: string }[]
    missingKeywords: string[]
}

const LOADING_MESSAGES = [
    "Extracting resume text...",
    "Analyzing FAANG keyword density...",
    "Scoring impact metrics...",
    "Evaluating action verbs...",
    "Generating line-by-line rewrites..."
];

function AtsChecker() {
    const [file, setFile] = useState<File | null>(null);
    const [targetRole, setTargetRole] = useState<string>("Software Engineer");
    const [level, setLevel] = useState<string>("Fresher");
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingTextIdx, setLoadingTextIdx] = useState(0);
    const [error, setError] = useState("");
    const [result, setResult] = useState<AtsResult | null>(null);

    // Smart Loader Effect
    useEffect(() => {
        let interval: any;
        if (loading) {
            interval = setInterval(() => {
                setLoadingTextIdx((prev) => (prev + 1) % LOADING_MESSAGES.length);
            }, 2500); // Change text every 2.5 seconds
        } else {
            setLoadingTextIdx(0);
        }
        return () => clearInterval(interval);
    }, [loading]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            setError("Upload File");
            return;
        };
        if (file.type !== "application/pdf") {
            setError("Only pdf is acceptable");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError("File must be under 5MB")
            return
        }
        setFile(file);
        setError("")
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!file) {
            setError("Please upload file")
            return;
        };

        try {
            setLoading(true);
            const response = await checkAtsResume(file, targetRole, level)

            if (response.status !== 200) {
                setError("Failed to upload file");
                return;
            };
            setResult(response.data.atsResult);

        } catch (error: any) {
            setError(error?.response?.data?.error || "Something went wrong");
        } finally {
            setLoading(false)
        }
    }

    // Animation variants
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
    };
    const location = useLocation();
    useEffect(() => {
        // If the user came from the Resume Builder, grab the generated file!
        if (location.state?.autoUploadFile) {
            setFile(location.state.autoUploadFile);
            
            // Clean up the location state so it doesn't auto-trigger if they refresh the page
            window.history.replaceState({}, document.title);
        }
    }, [location])

    return (
        <div className="min-h-screen bg-[var(--bg)] font-sans flex flex-col">
            <Navbar />

            {!result ? (
                // --- THE PREMIUM UPLOAD FORM (SPLIT SCREEN) ---
                <div className="flex-grow flex items-center justify-center px-6 py-12 relative overflow-hidden">
                    <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none"></div>

                    <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center z-10">

                        {/* LEFT SIDE: Marketing & Features */}
                        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="hidden lg:flex flex-col space-y-10 pr-8">
                            <div>
                                <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">
                                    Beat the <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-[var(--accent)]">ATS algorithm.</span>
                                </motion.h2>
                                <motion.p variants={itemVariants} className="text-[var(--text-muted)] text-lg leading-relaxed max-w-md">
                                    Don't guess what recruiters want. Upload your resume to see exactly how FAANG systems score your profile.
                                </motion.p>
                            </div>

                            <div className="space-y-6">
                                <motion.div variants={itemVariants} className="flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(170,59,255,0.2)]">🎯</div>
                                    <div>
                                        <h3 className="text-white font-bold text-lg">AI Role Matcher</h3>
                                        <p className="text-[var(--text-muted)] text-sm">Discover exactly which roles fit your experience best.</p>
                                    </div>
                                </motion.div>

                                <motion.div variants={itemVariants} className="flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(59,130,246,0.2)]">✍️</div>
                                    <div>
                                        <h3 className="text-white font-bold text-lg">Line-by-Line Rewrites</h3>
                                        <p className="text-[var(--text-muted)] text-sm">We fix your weak action verbs and add missing metrics.</p>
                                    </div>
                                </motion.div>

                                <motion.div variants={itemVariants} className="flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(34,197,94,0.2)]">📊</div>
                                    <div>
                                        <h3 className="text-white font-bold text-lg">Keyword Optimization</h3>
                                        <p className="text-[var(--text-muted)] text-sm">Find out which crucial industry keywords you are missing.</p>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* RIGHT SIDE: The Upload Card */}
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="w-full max-w-lg mx-auto">
                            <form onSubmit={handleSubmit} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 sm:p-10 shadow-2xl shadow-black/50 relative group">
                                <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 rounded-full blur-[80px] group-hover:bg-blue-600/20 transition-colors duration-500"></div>

                                <div className="mb-10 text-center relative z-10">
                                    <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-blue-600 to-[var(--accent)] flex items-center justify-center text-white font-bold text-2xl shadow-[0_0_20px_rgba(59,130,246,0.4)] transform group-hover:scale-105 transition-transform duration-300">📄</div>
                                    <h1 className="text-3xl font-bold text-white tracking-tight">ATS Scanner</h1>
                                    <p className="mt-2 text-sm text-[var(--text-muted)]">Get brutal, FAANG-level feedback.</p>
                                </div>

                                <div className="space-y-6 relative z-10">
                                    <div className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${file ? 'border-[var(--success)] bg-[var(--success)]/5' : 'border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--accent)]/5'}`}>
                                        <input type="file" accept="application/pdf" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" disabled={loading} />
                                        {!file ? (
                                            <div className="flex flex-col items-center pointer-events-none">
                                                <span className="text-4xl mb-4 opacity-80">📁</span>
                                                <p className="text-base font-bold text-white mb-1">Click to browse</p>
                                                <p className="text-xs text-[var(--text-muted)]">or drag and drop your file here</p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center pointer-events-none">
                                                <span className="text-4xl mb-4 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]">✅</span>
                                                <p className="text-base font-bold text-[var(--success)] mb-1">Ready to scan</p>
                                                <p className="text-xs text-[var(--text-muted)] break-all px-4">{file.name}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Target Role</label>
                                            <input type="text" value={targetRole} placeholder="e.g. Software Engineer" onChange={(e) => setTargetRole(e.target.value)} disabled={loading} className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all disabled:opacity-50" />
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Experience Level</label>
                                            <select value={level} onChange={(e) => setLevel(e.target.value)} disabled={loading} className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                                                <option value="Fresher">Fresher</option>
                                                <option value="Junior">Junior</option>
                                                <option value="Mid-Level">Mid-Level</option>
                                                <option value="Senior">Senior</option>
                                            </select>
                                        </div>
                                    </div>

                                    {error && (
                                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 rounded-md bg-[var(--danger)]/10 border border-[var(--danger)]/20 text-center">
                                            <p className="text-sm font-medium text-[var(--danger)]">{error}</p>
                                        </motion.div>
                                    )}

                                    <button type="submit" disabled={loading || !file} className="w-full rounded-xl bg-[var(--accent)] py-4 text-sm font-bold text-white transition-all hover:bg-[var(--accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(170,59,255,0.2)] hover:shadow-[0_0_25px_rgba(170,59,255,0.4)] flex justify-center items-center gap-2 hover:-translate-y-0.5 active:translate-y-0 overflow-hidden relative">
                                        {loading ? (
                                            <motion.div
                                                key={loadingTextIdx} // Key change forces re-animation
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="flex items-center gap-2"
                                            >
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                <span>{LOADING_MESSAGES[loadingTextIdx]}</span>
                                            </motion.div>
                                        ) : "Scan Resume ➔"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </div>
            ) : (
                // --- THE RESULTS DASHBOARD (BENTO BOX LAYOUT) ---
                <div className="flex-grow px-4 py-12">
                    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-5xl mx-auto">

                        {/* Top Area: Bento Box Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

                            {/* Left Column: Score & Roles */}
                            <div className="lg:col-span-1 space-y-6">
                                {/* Score Card */}
                                <motion.div variants={itemVariants} className="flex flex-col items-center justify-center p-8 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-lg text-center relative overflow-hidden">
                                    <div className={`absolute top-0 w-full h-1 ${result.overallScore >= 80 ? 'bg-[var(--success)]' : result.overallScore >= 50 ? 'bg-[var(--warning)]' : 'bg-[var(--danger)]'}`}></div>
                                    <h2 className="text-xl font-bold text-[var(--text)] mb-6">ATS Match Score</h2>
                                    <div className="relative">
                                        {/* Animated SVG Ring */}
                                        <svg className="w-32 h-32 transform -rotate-90">
                                            <circle cx="64" cy="64" r="60" stroke="var(--border)" strokeWidth="8" fill="none" />
                                            <motion.circle
                                                cx="64" cy="64" r="60"
                                                stroke={result.overallScore >= 80 ? 'var(--success)' : result.overallScore >= 50 ? 'var(--warning)' : 'var(--danger)'}
                                                strokeWidth="8" fill="none"
                                                strokeDasharray="377"
                                                initial={{ strokeDashoffset: 377 }}
                                                animate={{ strokeDashoffset: 377 - (377 * result.overallScore) / 100 }}
                                                transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                                                className="drop-shadow-lg"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className={`text-4xl font-extrabold ${result.overallScore >= 80 ? 'text-[var(--success)]' : result.overallScore >= 50 ? 'text-[var(--warning)]' : 'text-[var(--danger)]'}`}>{result.overallScore}</span>
                                        </div>
                                    </div>
                                    <p className="text-xs uppercase tracking-widest font-bold mt-6 text-[var(--text-muted)] bg-[var(--bg)] px-4 py-1.5 rounded-full border border-[var(--border)]">
                                        {result.scoreCategory}
                                    </p>
                                </motion.div>

                                {/* Role Matcher */}
                                {result.matchedRoles && result.matchedRoles.length > 0 && (
                                    <motion.div variants={itemVariants} className="p-6 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-lg">
                                        <h3 className="text-sm font-bold text-[var(--text)] mb-5 uppercase tracking-wider flex items-center gap-2"><span>🎯</span> Role Matches</h3>
                                        <div className="space-y-5">
                                            {result.matchedRoles.map((match: any, i: number) => (
                                                <div key={i}>
                                                    <div className="flex justify-between text-sm mb-2">
                                                        <span className="text-[var(--text)] font-medium truncate pr-2">{match.role}</span>
                                                        <span className={`font-bold ${match.matchPercentage >= 80 ? 'text-[var(--success)]' : match.matchPercentage >= 50 ? 'text-[var(--warning)]' : 'text-[var(--danger)]'}`}>
                                                            {match.matchPercentage}%
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-[var(--bg)] rounded-full h-2 border border-[var(--border)] overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${match.matchPercentage}%` }}
                                                            transition={{ duration: 1, delay: 0.5 + (i * 0.2) }}
                                                            className={`h-2 rounded-full ${match.matchPercentage >= 80 ? 'bg-[var(--success)]' : match.matchPercentage >= 50 ? 'bg-[var(--warning)]' : 'bg-[var(--danger)]'}`}
                                                        ></motion.div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            {/* Right Column: Breakdown & Issues */}
                            <div className="lg:col-span-2 space-y-6">

                                {/* Critical Issues */}
                                {result.criticalIssues && result.criticalIssues.length > 0 && (
                                    <motion.div variants={itemVariants} className="p-6 bg-[var(--danger)]/5 border border-[var(--danger)]/30 rounded-2xl">
                                        <h3 className="text-sm font-bold text-[var(--danger)] uppercase tracking-wider mb-4 flex items-center gap-2"><span>⚠️</span> Critical Issues Detected</h3>
                                        <ul className="space-y-3">
                                            {result.criticalIssues.map((issue: string, i: number) => (
                                                <li key={i} className="text-sm text-[var(--text)] flex items-start gap-3 bg-[var(--bg)]/50 p-3 rounded-lg border border-[var(--danger)]/10">
                                                    <span className="text-[var(--danger)] mt-0.5">🚨</span>
                                                    <span className="leading-relaxed">{issue}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                )}

                                {/* Section Scores Grid */}
                                <motion.div variants={itemVariants}>
                                    <h3 className="text-sm font-bold text-[var(--text)] uppercase tracking-wider mb-4 pl-1">Category Breakdown</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {Object.entries(result.sectionScores).map(([key, data]: [string, any]) => {
                                            const score = typeof data === 'number' ? data : data?.score || 0;
                                            const feedback = typeof data === 'number' ? "Score assigned based on overall ATS parsability." : data?.feedback;

                                            return (
                                                <div key={key} className="p-5 bg-[var(--surface)] border border-[var(--border)] rounded-xl flex justify-between items-start hover:border-[var(--accent)]/30 transition-colors">
                                                    <div className="pr-4">
                                                        <p className="font-bold text-[var(--text)] capitalize mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                                                        {feedback && <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-2" title={feedback}>{feedback}</p>}
                                                    </div>
                                                    <div className={`text-xl font-bold ${score >= 8 ? 'text-[var(--success)]' : score >= 5 ? 'text-[var(--warning)]' : 'text-[var(--danger)]'}`}>
                                                        {score}<span className="text-xs text-[var(--text-muted)] font-normal">/10</span>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </motion.div>

                            </div>
                        </div>

                        {/* Bottom Area: Line-by-Line & Keywords */}
                        <motion.div variants={itemVariants} className="space-y-6">

                            {/* Missing Keywords */}
                            {result.missingKeywords && result.missingKeywords.length > 0 && (
                                <div className="p-6 bg-[var(--surface)] border border-[var(--border)] rounded-2xl">
                                    <h3 className="text-sm font-bold text-[var(--text)] mb-4 uppercase tracking-wider flex items-center gap-2"><span>🔑</span> Missing Keywords to Add</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {result.missingKeywords.map((kw: string, i: number) => (
                                            <span key={i} className="px-3 py-1.5 bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text-muted)] rounded-md font-mono hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors cursor-default">
                                                + {kw}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Line-by-Line Fixes */}
                            {result.lineByLineFixes && result.lineByLineFixes.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-bold text-[var(--text)] mb-4 uppercase tracking-wider pl-1">Line-by-Line Fixes</h3>
                                    <div className="space-y-4">
                                        {result.lineByLineFixes.map((fix: any, i: number) => (
                                            <div key={i} className="p-6 bg-[var(--surface)] border border-[var(--border)] rounded-2xl">
                                                <div className="flex items-start gap-2 mb-4">
                                                    <span className="text-xl">💡</span>
                                                    <p className="text-sm text-[var(--text-muted)] italic leading-relaxed">"{fix.reason}"</p>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="p-4 bg-[var(--danger)]/5 border-l-4 border-[var(--danger)] rounded-r-lg">
                                                        <p className="text-[10px] text-[var(--danger)] font-bold uppercase tracking-wider mb-2">Remove Original</p>
                                                        <p className="text-sm text-[var(--text)] line-through opacity-70">{fix.originalText}</p>
                                                    </div>
                                                    <div className="p-4 bg-[var(--success)]/5 border-l-4 border-[var(--success)] rounded-r-lg relative overflow-hidden">
                                                        <div className="absolute top-0 right-0 p-2 opacity-10 text-4xl">✨</div>
                                                        <p className="text-[10px] text-[var(--success)] font-bold uppercase tracking-wider mb-2">Suggested Rewrite</p>
                                                        <p className="text-sm text-[var(--text)] font-medium relative z-10">{fix.suggestedRewrite}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </motion.div>

                        {/* Reset Button */}
                        <motion.div variants={itemVariants} className="pt-8">
                            <button
                                onClick={() => { setResult(null); setFile(null); window.scrollTo(0, 0); }}
                                className="w-full max-w-md mx-auto block rounded-xl bg-[var(--accent)] px-4 py-4 text-sm font-bold text-white hover:bg-[var(--accent-hover)] transition-all shadow-[0_0_15px_rgba(170,59,255,0.2)] hover:shadow-[0_0_25px_rgba(170,59,255,0.4)] hover:-translate-y-1"
                            >
                                Scan Another Resume ➔
                            </button>
                        </motion.div>

                    </motion.div>
                </div>
            )}
        </div>
    )
}

export default AtsChecker;
