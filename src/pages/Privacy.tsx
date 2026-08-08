import { Link } from "react-router-dom";
import { motion, type Variants } from "framer-motion";

const principles = [
    {
        colorHex: "#a855f7", // Purple
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
        ),
        title: "We don't sell your data. Period.",
        text: "Most AI interview tools harvest your resumes and answers to sell to third-party recruiters, data brokers, or use them to train public LLMs. RoundOne does not, and will never do this. Your mock interviews are for your eyes only.",
    },
    {
        colorHex: "#3b82f6", // Blue
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
            </svg>
        ),
        title: "Ephemeral audio processing",
        text: "When you use our Native Voice feature, your audio is sent directly to Groq/Whisper for transcription. The audio files are deleted instantly after the transcription is complete. We do not store your voice.",
    },
    {
        colorHex: "#6366f1", // Indigo
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        title: "Resume storage, on your terms",
        text: "Your resume text is securely stored in your private database profile. It is accessed exclusively by our AI to personalize your interview questions and generate your ATS score. You can delete your resume from our servers at any time with a single click in your dashboard.",
    },
];

export default function Privacy() {
    // Framer Motion Animation Variants
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-gray-200 font-sans flex flex-col overflow-x-hidden relative selection:bg-purple-500/30">

            {/* --- UPGRADED AMBIENT BACKGROUND --- */}
            <div 
                className="absolute inset-0 pointer-events-none z-0" 
                style={{ 
                    backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px)', 
                    backgroundSize: '24px 24px',
                    maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
                    WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)'
                }} 
            />
            <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[150px] pointer-events-none z-0"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[150px] pointer-events-none z-0"></div>

            {/* Navbar */}
            <nav className="flex justify-between items-center px-6 py-4 md:px-12 border-b border-white/5 bg-[#050505]/60 backdrop-blur-xl sticky top-0 z-50">
                <Link to="/" className="flex items-center gap-3 group">
                    <img src="/logo.svg?v=2" alt="RoundOne" className="w-8 h-8 rounded-lg" />
                    <div className="text-xl font-extrabold tracking-tight text-white">RoundOne</div>
                </Link>
                <Link to="/" className="text-sm font-medium text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 group-hover:-translate-x-1 transition-transform">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
                    </svg>
                    Back to Home
                </Link>
            </nav>

            <main className="flex-grow z-10 relative max-w-6xl mx-auto px-6 py-20 w-full">
                
                {/* --- HERO SECTION --- */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-semibold uppercase tracking-widest backdrop-blur-md shadow-[0_0_20px_rgba(168,85,247,0.15)]">
                        <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
                        Privacy Policy
                    </div>

                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter mb-6 leading-[1.05]">
                        <span className="text-white">Your data is</span> <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-500 drop-shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                            100% yours.
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-medium">
                        A transparent manifesto on how RoundOne handles your personal information, resumes, and interview recordings.
                    </p>
                </motion.div>

                {/* --- 3-COLUMN BENTO GRID --- */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {principles.map((p, index) => (
                        <motion.div
                            variants={itemVariants}
                            key={index}
                            className="bg-[#0a0a0a]/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all duration-300 group relative overflow-hidden flex flex-col h-full shadow-lg hover:-translate-y-1 hover:shadow-2xl"
                        >
                            {/* Hover Spotlight Background */}
                            <div 
                                className="absolute -top-10 -right-10 w-40 h-40 blur-[50px] opacity-10 group-hover:opacity-30 transition-opacity duration-500 rounded-full" 
                                style={{ backgroundColor: p.colorHex }}
                            ></div>

                            {/* Icon Box */}
                            <div 
                                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border transition-colors duration-300 bg-white/5 relative z-10 shadow-inner"
                                style={{ color: p.colorHex, borderColor: `${p.colorHex}40` }}
                            >
                                {p.icon}
                            </div>
                            
                            <h2 className="text-xl font-bold text-white mb-4 relative z-10">{p.title}</h2>
                            <p className="text-sm text-gray-400 leading-relaxed flex-grow relative z-10">{p.text}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* --- CONTACT BANNER --- */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="mt-12 p-10 rounded-3xl border border-purple-500/30 bg-purple-500/10 relative overflow-hidden shadow-[0_0_30px_rgba(168,85,247,0.15)] flex flex-col md:flex-row items-center justify-between gap-8"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent pointer-events-none"></div>
                    
                    <div className="relative z-10 md:w-2/3 text-center md:text-left">
                        <h3 className="text-2xl font-bold text-white mb-2">Have concerns?</h3>
                        <p className="text-sm text-purple-200/80 leading-relaxed">
                            RoundOne is built by an engineer, for engineers. If you have any questions about how your data is handled, you can reach out to me directly.
                        </p>
                    </div>
                    
                    <div className="relative z-10 shrink-0">
                        <a
                            href="https://www.linkedin.com/in/anurag-mishra-256101318/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-xl hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.15)] group"
                        >
                            Message me
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 group-hover:translate-x-1 transition-transform">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                            </svg>
                        </a>
                    </div>
                </motion.section>
            </main>

            {/* Footer */}
            <footer className="bg-[#050505] pt-16 pb-8 z-10 border-t border-white/5 mt-auto">
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
