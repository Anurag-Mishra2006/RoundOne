import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { getPracticeQuestions } from '@/services/api'; // IMPORT THE API

export default function PracticeDashboard() {
    const [questions, setQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [status, setStatus] = useState("");
    // Filters
    const [search, setSearch] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [company, setCompany] = useState("");

    // Fetch data from real backend!
    useEffect(() => {
        const fetchQuestions = async () => {
            setLoading(true);
            try {
                // Construct query parameters cleanly
                const params: any = { page, limit: 15 };
                if (search) params.search = search;
                if (difficulty) params.difficulty = difficulty;
                if (company) params.company = company;
                if (status) params.status = status;

                // Call the API
                const res = await getPracticeQuestions(params);

                // Update state with actual DB data
                setQuestions(res.data.data);
                setTotalPages(res.data.pagination.totalPages || 1);
            } catch (error) {
                console.error("Failed to fetch questions", error);
            } finally {
                setLoading(false);
            }
        };

        // Simple debounce for search so we don't spam the backend on every keystroke
       const delayDebounceFn = setTimeout(() => {
            fetchQuestions();
        }, 400);

        return () => clearTimeout(delayDebounceFn);
    }, [page, search, difficulty, company, status]);

    // Animation variants matching your ATS checker
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
    };

    return (
        <div className="min-h-screen bg-[var(--bg)] font-sans flex flex-col relative overflow-hidden">
            <Navbar />

            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none"></div>

            <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-12 relative z-10">

                {/* Header Section */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-semibold uppercase tracking-widest backdrop-blur-md">
                            <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse"></span>
                            The Practice Arena
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                            "Practice makes a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-[var(--accent)]">man perfect."</span>
                        </h1>
                        <p className="mt-3 text-[var(--text-muted)] text-lg max-w-2xl">
                            Practice here to land your dream job. Write real code, execute it securely, and receive instant AI feedback along with precise Time & Space complexities.
                        </p>
                    </div>
                </motion.div>

                {/* Filters Section */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 md:p-6 mb-8 flex flex-col md:flex-row gap-4 shadow-lg">

                    {/* Search Bar */}
                    <div className="flex-grow relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                        <input
                            type="text"
                            placeholder="Search questions (e.g., Two Sum)..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] pl-12 pr-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all"
                        />
                    </div>

                    {/* Difficulty Dropdown */}
                    <select
                        value={difficulty}
                        onChange={(e) => { setDifficulty(e.target.value); setPage(1); }}
                        className="w-full md:w-48 rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all cursor-pointer appearance-none"
                    >
                        <option value="">All Difficulties</option>
                        <option value="EASY">Easy</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HARD">Hard</option>
                    </select>

                    {/* Company Dropdown */}
                    <select
                        value={company}
                        onChange={(e) => { setCompany(e.target.value); setPage(1); }}
                        className="w-full md:w-48 rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all cursor-pointer appearance-none"
                    >
                        <option value="">All Companies</option>
                        <option value="Google">Google</option>
                        <option value="Amazon">Amazon</option>
                        <option value="Meta">Meta</option>
                        <option value="Apple">Apple</option>
                        <option value="Microsoft">Microsoft</option>
                        <option value="Netflix">Netflix</option>
                    </select>
                    {/* Status Dropdown */}
                    <select
                        value={status}
                        onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                        className="w-full md:w-48 rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all cursor-pointer appearance-none"
                    >
                        <option value="">All Statuses</option>
                        <option value="SOLVED">Solved</option>
                        <option value="ATTEMPTED">Attempted</option>
                        <option value="UNSOLVED">Unsolved</option>
                    </select>
                </motion.div>

                {/* The Question Table */}
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[var(--bg)]/50 border-b border-[var(--border)]">
                                    <th className="p-5 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Status</th>
                                    <th className="p-5 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Title</th>
                                    <th className="p-5 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Difficulty</th>
                                    <th className="p-5 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] hidden md:table-cell">Companies</th>
                                    <th className="p-5 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="p-12 text-center text-[var(--text-muted)]">
                                            <div className="w-6 h-6 border-2 border-[var(--accent)]/30 border-t-[var(--accent)] rounded-full animate-spin mx-auto mb-3"></div>
                                            Loading questions...
                                        </td>
                                    </tr>
                                ) : questions.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-12 text-center text-[var(--text-muted)]">No questions found matching your criteria.</td>
                                    </tr>
                                ) : (
                                    questions.map((q) => (
                                        <motion.tr variants={itemVariants} key={q.id} className="border-b border-[var(--border)] hover:bg-[var(--bg)]/50 transition-colors group">

                                            <td className="p-5">
                                                {(() => {
                                                    // Check if submissions exist (from our new backend logic)
                                                    const subs = q.submission || [];
                                                    const isSolved = subs.some((s: any) => s.verdict === 'AC');
                                                    const isAttempted = subs.length > 0 && !isSolved;

                                                    if (isSolved) {
                                                        return (
                                                            <div className="w-7 h-7 rounded-full bg-[var(--success)]/20 border border-[var(--success)]/50 flex items-center justify-center shadow-[0_0_10px_rgba(34,197,94,0.3)]">
                                                                <span className="text-[var(--success)] text-sm font-bold">✓</span>
                                                            </div>
                                                        );
                                                    } else if (isAttempted) {
                                                        return (
                                                            <div className="w-7 h-7 rounded-full bg-[var(--warning)]/20 border border-[var(--warning)]/50 flex items-center justify-center">
                                                                <span className="text-[var(--warning)] text-xl font-bold leading-none mb-1">-</span>
                                                            </div>
                                                        );
                                                    } else {
                                                        // Unsolved
                                                        return (
                                                            <div className="w-7 h-7 rounded-full border border-[var(--border)] bg-[var(--bg)] flex items-center justify-center opacity-30">
                                                            </div>
                                                        );
                                                    }
                                                })()}
                                            </td>

                                            <td className="p-5">
                                                <Link to={`/practice/${q.slug}`} className="text-[var(--text)] font-bold text-base hover:text-[var(--accent)] transition-colors line-clamp-1">
                                                    {q.title}
                                                </Link>
                                                <div className="flex gap-2 mt-1">
                                                    {/* Added ?. just in case topics is empty in DB */}
                                                    {q.topics?.slice(0, 2).map((t: string) => (
                                                        <span key={t} className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] bg-[var(--bg)] border border-[var(--border)] px-2 py-0.5 rounded-md">
                                                            {t}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>

                                            <td className="p-5">
                                                <span className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${q.difficulty === 'EASY' ? 'text-green-400 bg-green-400/10 border-green-400/20' :
                                                    q.difficulty === 'MEDIUM' ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' :
                                                        'text-red-400 bg-red-400/10 border-red-400/20'
                                                    }`}>
                                                    {q.difficulty}
                                                </span>
                                            </td>

                                            <td className="p-5 hidden md:table-cell">
                                                <div className="flex gap-2">
                                                    {/* Added ?. just in case companies is empty in DB */}
                                                    {q.companies?.slice(0, 3).map((c: string) => (
                                                        <span key={c} className="text-xs text-[var(--text-muted)] bg-[var(--bg)] px-2 py-1 rounded-md border border-[var(--border)]">
                                                            {c}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>

                                            <td className="p-5 text-right">
                                                <Link
                                                    to={`/practice/${q.slug}`}
                                                    className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] text-sm font-bold border border-[var(--accent)]/30 hover:bg-[var(--accent)] hover:text-white transition-all hover:shadow-[0_0_15px_rgba(170,59,255,0.4)]"
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
                    <div className="p-4 border-t border-[var(--border)] bg-[var(--bg)]/50 flex justify-between items-center">
                        <span className="text-sm text-[var(--text-muted)]">
                            Page <span className="font-bold text-white">{page}</span> of <span className="font-bold text-white">{totalPages}</span>
                        </span>
                        <div className="flex gap-2">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(p => p - 1)}
                                className="px-4 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-sm font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-[var(--accent)]/50 transition-colors"
                            >
                                ← Prev
                            </button>
                            <button
                                disabled={page === totalPages || questions.length === 0}
                                onClick={() => setPage(p => p + 1)}
                                className="px-4 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-sm font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-[var(--accent)]/50 transition-colors"
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
