import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const principles = [
    {
        icon: "🚫",
        title: "We don't sell your data. Period.",
        text: "Most AI interview tools harvest your resumes and answers to sell to third-party recruiters, data brokers, or use them to train public LLMs. RoundOne does not, and will never do this. Your mock interviews are for your eyes only.",
    },
    {
        icon: "🎙️",
        title: "Ephemeral audio processing",
        text: "When you use our Native Voice feature, your audio is sent directly to Groq/Whisper for transcription. The audio files are deleted instantly after the transcription is complete. We do not store your voice.",
    },
    {
        icon: "📄",
        title: "Resume storage, on your terms",
        text: "Your resume text is securely stored in your private database profile. It is accessed exclusively by our AI to personalize your interview questions and generate your ATS score. You can delete your resume from our servers at any time with a single click in your dashboard.",
    },
];

function Privacy() {
    return (
        <div className="min-h-screen bg-[#050505] text-gray-200 font-sans flex flex-col overflow-x-hidden relative selection:bg-purple-500/30">

            {/* --- PREMIUM ANIMATED BACKGROUND (shared with landing) --- */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <motion.div animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, 30, 0] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-900/30 rounded-full blur-[150px]" />
                <motion.div animate={{ scale: [1, 1.1, 1], x: [0, -60, 0], y: [0, 50, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }} className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[150px]" />
                <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px', maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)' }} />
            </div>

            {/* Navbar */}
            <nav className="flex justify-between items-center px-6 py-4 md:px-12 border-b border-white/5 bg-[#050505]/40 backdrop-blur-xl sticky top-0 z-50">
                <Link to="/" className="flex items-center gap-3 group">
                    <img src="/logo.svg?v=2" alt="RoundOne" className="w-8 h-8 rounded-lg" />
                    <div className="text-xl font-extrabold tracking-tight text-white">RoundOne</div>
                </Link>
                <Link to="/" className="text-sm font-medium text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                    <span aria-hidden>←</span> Back to Home
                </Link>
            </nav>

            <main className="flex-grow z-10 relative max-w-3xl mx-auto px-6 py-24 md:py-32 w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-semibold uppercase tracking-widest backdrop-blur-md shadow-[0_0_20px_rgba(168,85,247,0.15)]">
                        <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
                        Privacy Policy
                    </div>

                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter mb-6 leading-[1.05]">
                        <span className="text-white">Your data is</span> <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-500 drop-shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                            100% yours.
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-400 mb-16 max-w-2xl leading-relaxed font-medium">
                        A transparent manifesto on how RoundOne handles your personal information, resumes, and interview recordings.
                    </p>

                    <div className="space-y-6">
                        {principles.map((p, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                className="relative p-[1px] rounded-3xl overflow-hidden bg-white/5 hover:bg-gradient-to-br hover:from-purple-500/50 hover:to-blue-500/50 transition-colors duration-500"
                            >
                                <div className="h-full w-full bg-[#0a0a0a] rounded-[23px] p-8 relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <div className="flex items-start gap-5 relative z-10">
                                        <div className="w-14 h-14 shrink-0 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl shadow-inner shadow-white/5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">{p.icon}</div>
                                        <div>
                                            <h2 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">{index + 1}. {p.title}</h2>
                                            <p className="text-gray-400 leading-relaxed">{p.text}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="mt-12 p-8 rounded-3xl border border-purple-500/30 bg-purple-500/10 relative overflow-hidden shadow-[0_0_30px_rgba(168,85,247,0.15)]"
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent pointer-events-none"></div>
                        <div className="relative z-10">
                            <h3 className="text-xl font-bold text-white mb-2">Have concerns?</h3>
                            <p className="text-sm text-purple-200/80 mb-6 max-w-xl">
                                RoundOne is built by an engineer, for engineers. If you have any questions about how your data is handled, you can reach out to me directly.
                            </p>
                            <a
                                href="https://www.linkedin.com/in/anurag-mishra-256101318/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block px-6 py-3 bg-white text-black font-bold rounded-xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                            >
                                Message me on LinkedIn
                            </a>
                        </div>
                    </motion.section>
                </motion.div>
            </main>

            {/* Footer (mirrors landing page) */}
            <footer className="bg-[#050505] pt-16 pb-8 z-10 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-center md:text-left">
                        <div className="text-2xl font-extrabold text-white mb-2 tracking-tight">RoundOne</div>
                        <p className="text-sm text-gray-500">Engineered by Anurag Mishra.</p>
                    </div>
                    <div className="flex gap-8 text-sm font-medium">
                        <Link to="/privacy" className="text-gray-500 hover:text-white transition-colors">Privacy Policy</Link>
                        <a href="https://github.com/Anurag-Mishra2006" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">GitHub</a>
                        <a href="https://www.linkedin.com/in/anurag-mishra-256101318/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">LinkedIn</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Privacy;
