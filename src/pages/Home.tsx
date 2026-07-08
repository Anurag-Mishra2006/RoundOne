import { Link, Navigate } from "react-router-dom";
import useUserStore from "@/store/authStore";

function Home() {
    const { isAuthenticate } = useUserStore();

    if (isAuthenticate) {
        return <Navigate to="/dashboard" />;
    }

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] font-sans flex flex-col">

            {/* Navbar */}
            <nav className="flex justify-between items-center px-6 py-4 md:px-12 border-b border-[var(--border)] bg-[var(--bg)] sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent)] to-purple-800 flex items-center justify-center text-white font-bold text-lg">
                        R
                    </div>
                    <div className="text-xl font-extrabold tracking-tight text-white">
                        RoundOne
                    </div>
                </div>
                <div className="flex gap-4 items-center">
                    <Link to="/login" className="text-sm font-medium text-[var(--text-muted)] hover:text-white transition-colors">
                        Log in
                    </Link>
                    <Link to="/register" className="px-5 py-2.5 bg-[var(--accent)] text-white rounded-md text-sm font-bold hover:bg-[var(--accent-hover)] transition-all shadow-[0_0_15px_rgba(100,50,255,0.3)] hover:shadow-[0_0_25px_rgba(100,50,255,0.5)]">
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="flex-grow">
                <div className="max-w-5xl mx-auto px-6 py-24 md:py-32 text-center flex flex-col items-center">
                    <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-[var(--accent)] text-xs font-bold uppercase tracking-widest animate-fade-in-up">
                        v1.0 is now live
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8 leading-[1.1]">
                        Crack your next FAANG <br className="hidden md:block" /> interview with AI.
                    </h1>
                    <p className="text-lg md:text-xl text-[var(--text-muted)] mb-12 max-w-2xl leading-relaxed">
                        Upload your resume, write real code, and get brutally honest feedback. Featuring voice-enabled AI recruiters, a real compiler, and enterprise ATS scoring.
                    </p>
                    <Link to="/register" className="px-8 py-4 bg-white text-black rounded-lg text-lg font-bold hover:bg-gray-200 transition-transform hover:-translate-y-1 shadow-xl">
                        Start Your First Mock Interview →
                    </Link>
                </div>

                {/* Features Grid */}
                <section className="max-w-6xl mx-auto px-6 py-16 mb-20 border-t border-[var(--border)]">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-white mb-4">Everything you need to get hired.</h2>
                        <p className="text-[var(--text-muted)]">An all-in-one platform built for software engineers, by a software engineer.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Feature 1 */}
                        <div className="p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)]/50 transition-colors">
                            <div className="w-12 h-12 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center mb-6 text-[var(--accent)] text-2xl">
                                🧠
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Multi-Modal AI Interviews</h3>
                            <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                                Face 3 dynamic rounds (HR, Technical, DSA). Every question is generated in real-time based strictly on your uploaded resume and target company.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)]/50 transition-colors">
                            <div className="w-12 h-12 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center mb-6 text-[var(--accent)] text-2xl">
                                🎙️
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Native Voice Layer</h3>
                            <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                                Stop typing. The AI reads questions out loud using Microsoft Neural TTS, and you answer using your microphone with real-time Groq/Whisper transcription.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)]/50 transition-colors">
                            <div className="w-12 h-12 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center mb-6 text-[var(--accent)] text-2xl">
                                💻
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Docker Execution Engine</h3>
                            <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                                Write code in an integrated Monaco Editor and compile it against hidden test cases using our custom, secure Docker execution architecture.
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)]/50 transition-colors">
                            <div className="w-12 h-12 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center mb-6 text-[var(--accent)] text-2xl">
                                📄
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">FAANG ATS Checker</h3>
                            <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                                Upload any resume and get a ruthless score out of 100. Get missing keywords, role predictions, and line-by-line AI rewrites.
                            </p>
                        </div>

                        {/* Feature 5 */}
                        <div className="p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)]/50 transition-colors">
                            <div className="w-12 h-12 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center mb-6 text-[var(--accent)] text-2xl">
                                📚
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">The Learning Hub</h3>
                            <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                                Ditch tutorial hell. Follow structured roadmaps like Striver's A2Z and Blind 75. Check off problems as you solve them to track progress.
                            </p>
                        </div>

                        {/* Feature 6 */}
                        <div className="p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)]/50 transition-colors">
                            <div className="w-12 h-12 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center mb-6 text-[var(--accent)] text-2xl">
                                📈
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Analytics Dashboard</h3>
                            <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                                Save your interview history forever. Track your consistency with a GitHub-style heatmap and share public report cards on LinkedIn.
                            </p>
                        </div>

                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-[var(--border)] bg-[var(--surface)] pt-12 pb-8">
                <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    
                    <div className="text-center md:text-left">
                        <div className="text-xl font-bold text-white mb-2">RoundOne</div>
                        <p className="text-sm text-[var(--text-muted)]">Designed and engineered by Anurag Mishra.</p>
                    </div>

                    <div className="flex gap-6">
                        <a href="https://github.com/Anurag-Mishra2006" target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] hover:text-white transition-colors">
                            GitHub
                        </a>
                        <a href="https://www.linkedin.com/in/anurag-mishra-256101318/" target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] hover:text-white transition-colors">
                            LinkedIn
                        </a>
                    </div>

                    <div>
                        {/* Buy Me A Chai Button */}
                       <a 
                            href="https://buymeachai.ezee.li/supreme_1"
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-lg hover:from-orange-600 hover:to-red-600 transition-all shadow-lg hover:shadow-orange-500/30"
                        >
                            <span className="text-xl">☕</span>
                            <span>Buy me a Chai</span>
                        </a>
                    </div>

                </div>
            </footer>
        </div>
    );
}

export default Home;
