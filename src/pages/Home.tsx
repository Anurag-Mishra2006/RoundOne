import { Link, Navigate } from "react-router-dom";
import useUserStore from "@/store/authStore";

function Home() {
    const { isAuthenticate } = useUserStore();
    
    //  if already logged in to landing page pe q aaoge
    if (isAuthenticate) {
        return <Navigate to="/resume-upload" />;
    }

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] font-sans">
            
            {/* Navbar */}
            <nav className="flex justify-between items-center px-6 py-4 md:px-12 border-b border-[var(--border)] bg-[var(--bg)]">
                <div className="text-2xl font-extrabold tracking-tight text-[var(--accent)]">
                    RoundOne
                </div>
                <div className="flex gap-4 items-center">
                    <Link to="/login" className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
                        Log in
                    </Link>
                    <Link to="/register" className="px-4 py-2 bg-[var(--accent)] text-white rounded-md text-sm font-bold hover:bg-[var(--accent-hover)] transition-colors shadow-lg shadow-[var(--accent)]/20">
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="max-w-5xl mx-auto px-6 py-24 md:py-32 text-center flex flex-col items-center">
                <div className="inline-block mb-4 px-3 py-1 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-[var(--accent)] text-xs font-bold uppercase tracking-widest">
                    Your Personal AI Interviewer
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 leading-tight">
                    Crack your next FAANG <br className="hidden md:block" /> interview with AI.
                </h1>
                <p className="text-lg md:text-xl text-[var(--text-muted)] mb-10 max-w-2xl leading-relaxed">
                    Upload your resume, write real code, and get brutally honest feedback from our AI recruiters. Prepare for Amazon, Google, and Microsoft.
                </p>
                <Link to="/register" className="px-8 py-4 bg-[var(--accent)] text-white rounded-lg text-lg font-bold hover:bg-[var(--accent-hover)] transition-transform hover:-translate-y-1 shadow-xl shadow-[var(--accent)]/20">
                    Start Your First Mock Interview →
                </Link>
            </main>

            {/* Features Grid */}
            <section className="max-w-6xl mx-auto px-6 py-16 mb-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Feature 1 */}
                    <div className="p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)]/50 transition-colors">
                        <div className="w-12 h-12 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center mb-6 text-[var(--accent)] text-2xl">
                            🤖
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">AI Mock Interviews</h3>
                        <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                            Face 3 dynamic rounds (HR, Technical, DSA). Every question is generated in real-time based strictly on your uploaded resume and target company.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)]/50 transition-colors">
                        <div className="w-12 h-12 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center mb-6 text-[var(--accent)] text-2xl">
                            💻
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Real Code Execution</h3>
                        <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                            Don't just type in a text box. Write code in an integrated Monaco Editor and compile it against test cases in real-time using our execution engine.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)]/50 transition-colors">
                        <div className="w-12 h-12 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center mb-6 text-[var(--accent)] text-2xl">
                            📄
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">FAANG ATS Checker</h3>
                        <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                            Upload any resume and get a ruthless score out of 100. We highlight weak action verbs, missing metrics, and provide line-by-line AI rewrites.
                        </p>
                    </div>

                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-[var(--border)] py-8 text-center text-sm text-[var(--text-muted)]">
                <p>© {new Date().getFullYear()} RoundOne. Built for developers.</p>
            </footer>
        </div>
    );
}

export default Home;
