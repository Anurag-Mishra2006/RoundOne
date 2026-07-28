import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { getPracticeQuestions } from '@/services/api'; 

export default function PracticeDashboard() {
    const [questions, setQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [status, setStatus] = useState("");
    const [search, setSearch] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [company, setCompany] = useState("");

    useEffect(() => {
        const fetchQuestions = async () => {
            setLoading(true);
            try {
                const params: any = { page, limit: 15 };
                if (search) params.search = search;
                if (difficulty) params.difficulty = difficulty;
                if (company) params.company = company;
                if (status) params.status = status;

                const res = await getPracticeQuestions(params);
                setQuestions(res.data.data);
                setTotalPages(res.data.pagination.totalPages || 1);
            } catch (error) {
                console.error("Failed to fetch questions", error);
            } finally {
                setLoading(false);
            }
        };

       const delayDebounceFn = setTimeout(() => { fetchQuestions(); }, 400);
       return () => clearTimeout(delayDebounceFn);
    }, [page, search, difficulty, company, status]);

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
    };

    return (
        <div className="min-h-screen bg-[#050505] font-sans flex flex-col relative overflow-hidden selection:bg-purple-500/30">
            
            {/* Ambient Spotlight Background */}
            <div className="absolute inset-0 pointer-events-none z-0" style={{ backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)', backgroundSize: '24px 24px', maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)' }} />
            <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[150px] pointer-events-none z-0"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[150px] pointer-events-none z-0"></div>

            <div className="relative z-20">
                <Navbar />
            </div>

            <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-12 relative z-10">

                {/* --- HEADER SECTION --- */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-semibold uppercase tracking-widest backdrop-blur-md">
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                            The Practice Arena
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                            "Practice makes a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">man perfect."</span>
                        </h1>
                        <p className="mt-3 text-[var(--text-muted)] text-lg max-w-2xl">
                            Practice here to land your dream job. Write real code, execute it securely, and receive instant AI feedback along with precise Time & Space complexities.
                        </p>
                    </div>

                    {/* --- THE NEW MOCK OA BUTTON --- */}
                    <div className="shrink-0 flex justify-center md:justify-end">
                        <Link 
                            to="/dsa-mock/setup"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-2xl font-bold hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-300 transition-all hover:scale-105 shadow-[0_0_30px_rgba(239,68,68,0.15)] hover:shadow-[0_0_40px_rgba(239,68,68,0.3)] group backdrop-blur-md"
                        >
                            <span className="w-3 h-3 rounded-full bg-red-500 animate-[pulse_1.5s_infinite] shadow-[0_0_10px_rgba(239,68,68,1)]"></span>
                            Take Mock OA (90 Min) ➔
                        </Link>
                    </div>
                </motion.div>

                {/* Filters Section */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6 mb-8 flex flex-col md:flex-row gap-4 shadow-lg">
                    <div className="flex-grow relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
                        <input
                            type="text"
                            placeholder="Search questions (e.g., Two Sum)..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-sm text-white outline-none focus:border-purple-500/50 transition-all placeholder-gray-500"
                        />
                    </div>

                    <select value={difficulty} onChange={(e) => { setDifficulty(e.target.value); setPage(1); }} className="w-full md:w-48 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-300 outline-none focus:border-purple-500/50 transition-all cursor-pointer appearance-none">
                        <option value="" className="bg-[#0a0a0a]">All Difficulties</option>
                        <option value="EASY" className="bg-[#0a0a0a]">Easy</option>
                        <option value="MEDIUM" className="bg-[#0a0a0a]">Medium</option>
                        <option value="HARD" className="bg-[#0a0a0a]">Hard</option>
                    </select>

                    <select value={company} onChange={(e) => { setCompany(e.target.value); setPage(1); }} className="w-full md:w-48 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-300 outline-none focus:border-purple-500/50 transition-all cursor-pointer appearance-none">
                        <option value="" className="bg-[#0a0a0a]">All Companies</option>
                        <option value="Google" className="bg-[#0a0a0a]">Google</option>
                        <option value="Amazon" className="bg-[#0a0a0a]">Amazon</option>
                        <option value="Meta" className="bg-[#0a0a0a]">Meta</option>
                        <option value="Apple" className="bg-[#0a0a0a]">Apple</option>
                        <option value="Microsoft" className="bg-[#0a0a0a]">Microsoft</option>
                    </select>
                    
                    <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="w-full md:w-48 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-300 outline-none focus:border-purple-500/50 transition-all cursor-pointer appearance-none">
                        <option value="" className="bg-[#0a0a0a]">All Statuses</option>
                        <option value="SOLVED" className="bg-[#0a0a0a]">Solved</option>
                        <option value="ATTEMPTED" className="bg-[#0a0a0a]">Attempted</option>
                        <option value="UNSOLVED" className="bg-[#0a0a0a]">Unsolved</option>
                    </select>
                </motion.div>

                {/* The Question Table */}
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/10">
                                    <th className="p-5 text-xs font-bold uppercase tracking-wider text-gray-400">Status</th>
                                    <th className="p-5 text-xs font-bold uppercase tracking-wider text-gray-400">Title</th>
                                    <th className="p-5 text-xs font-bold uppercase tracking-wider text-gray-400">Difficulty</th>
                                    <th className="p-5 text-xs font-bold uppercase tracking-wider text-gray-400 hidden md:table-cell">Companies</th>
                                    <th className="p-5 text-xs font-bold uppercase tracking-wider text-gray-400 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="p-12 text-center text-gray-500">
                                            <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-3"></div>
                                            Loading questions...
                                        </td>
                                    </tr>
                                ) : questions.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-12 text-center text-gray-500">No questions found matching your criteria.</td>
                                    </tr>
                                ) : (
                                    questions.map((q) => (
                                        <motion.tr variants={itemVariants} key={q.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">

                                            <td className="p-5">
                                                {(() => {
                                                    const subs = q.submission || [];
                                                    const isSolved = subs.some((s: any) => s.verdict === 'AC');
                                                    const isAttempted = subs.length > 0 && !isSolved;

                                                    if (isSolved) {
                                                        return (
                                                            <div className="w-7 h-7 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center shadow-[0_0_10px_rgba(34,197,94,0.2)]">
                                                                <span className="text-green-400 text-sm font-bold">✓</span>
                                                            </div>
                                                        );
                                                    } else if (isAttempted) {
                                                        return (
                                                            <div className="w-7 h-7 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center">
                                                                <span className="text-yellow-400 text-xl font-bold leading-none mb-1">-</span>
                                                            </div>
                                                        );
                                                    } else {
                                                        return (
                                                            <div className="w-7 h-7 rounded-full border border-white/10 bg-black/50 flex items-center justify-center opacity-50">
                                                            </div>
                                                        );
                                                    }
                                                })()}
                                            </td>

                                            <td className="p-5">
                                                <Link to={`/practice/${q.slug}`} className="text-gray-200 font-bold text-base group-hover:text-purple-400 transition-colors line-clamp-1">
                                                    {q.title}
                                                </Link>
                                                <div className="flex gap-2 mt-2">
                                                    {q.topics?.slice(0, 2).map((t: string) => (
                                                        <span key={t} className="text-[10px] uppercase tracking-wider text-gray-500 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">
                                                            {t}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>

                                            <td className="p-5">
                                                <span className={`text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-lg border ${q.difficulty === 'EASY' ? 'text-green-400 bg-green-400/10 border-green-400/20' : q.difficulty === 'MEDIUM' ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' : 'text-red-400 bg-red-400/10 border-red-400/20'}`}>
                                                    {q.difficulty}
                                                </span>
                                            </td>

                                            <td className="p-5 hidden md:table-cell">
                                                <div className="flex gap-2">
                                                    {q.companies?.slice(0, 3).map((c: string) => (
                                                        <span key={c} className="text-[10px] uppercase tracking-wider text-gray-400 bg-white/5 px-2 py-1 rounded-md border border-white/10">
                                                            {c}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>

                                            <td className="p-5 text-right">
                                                <Link
                                                    to={`/practice/${q.slug}`}
                                                    className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-purple-500/10 text-purple-400 text-sm font-bold border border-purple-500/30 hover:bg-purple-500 hover:text-white transition-all hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                                                >
                                                    Solve ➔
                                                </Link>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Bar */}
                    <div className="p-4 border-t border-white/10 bg-white/5 flex justify-between items-center backdrop-blur-md">
                        <span className="text-sm text-gray-400">
                            Page <span className="font-bold text-white">{page}</span> of <span className="font-bold text-white">{totalPages}</span>
                        </span>
                        <div className="flex gap-2">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(p => p - 1)}
                                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm font-bold text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                            >
                                ← Prev
                            </button>
                            <button
                                disabled={page === totalPages || questions.length === 0}
                                onClick={() => setPage(p => p + 1)}
                                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm font-bold text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                            >
                                Next →
                            </button>
                        </div>
                    </div>
                </motion.div>

            </main>
        </div>
    );
}
