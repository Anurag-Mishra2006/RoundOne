import { Link } from "react-router-dom";
import useUserStore from "@/store/authStore";
import { motion, type Variants } from "framer-motion";

function Home() {
    const { isAuthenticate } = useUserStore();

    // Animation Variants
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
    };

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] font-sans flex flex-col overflow-x-hidden relative">

            {/* Vercel-style ambient background glow */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-900/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute top-[20%] right-[-5%] w-72 h-72 bg-blue-900/20 rounded-full blur-[100px] pointer-events-none"></div>

            {/* Navbar */}
            <nav className="flex justify-between items-center px-6 py-4 md:px-12 border-b border-white/5 bg-[var(--bg)]/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent)] to-purple-800 flex items-center justify-center text-white font-bold text-lg shadow-[0_0_10px_rgba(170,59,255,0.5)]">
                        R
                    </div>
                    <div className="text-xl font-extrabold tracking-tight text-white">
                        RoundOne
                    </div>
                </div>
                <div className="flex gap-4 items-center">
                    {isAuthenticate ? (
                        <Link to="/dashboard" className="px-5 py-2.5 bg-white/5 border border-white/10 text-white rounded-md text-sm font-bold hover:bg-white/10 transition-all">
                            Go to Dashboard →
                        </Link>
                    ) : (
                        <>
                            <Link to="/login" className="text-sm font-medium text-[var(--text-muted)] hover:text-white transition-colors">
                                Log in
                            </Link>
                            <Link to="/register" className="px-5 py-2.5 bg-[var(--accent)] text-white rounded-md text-sm font-bold hover:bg-[var(--accent-hover)] transition-all shadow-[0_0_15px_rgba(100,50,255,0.3)] hover:shadow-[0_0_25px_rgba(100,50,255,0.5)] transform hover:-translate-y-0.5">
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            <main className="flex-grow z-10">
                {/* Hero Section */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="max-w-5xl mx-auto px-6 py-24 md:py-32 text-center flex flex-col items-center"
                >
                    <motion.div variants={itemVariants} className="inline-block mb-6 px-4 py-1.5 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/30 text-[var(--accent)] text-xs font-bold uppercase tracking-widest shadow-[0_0_10px_rgba(170,59,255,0.1)]">
                        RoundOne v1.0 is Live
                    </motion.div>

                    <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8 leading-[1.1]">
                        Crack your next FAANG <br className="hidden md:block" /> interview with AI.
                    </motion.h1>

                    <motion.p variants={itemVariants} className="text-lg md:text-xl text-[var(--text-muted)] mb-12 max-w-2xl leading-relaxed">
                        Upload your resume, write real code, and get brutally honest feedback. Featuring voice-enabled AI recruiters, a real compiler, and enterprise ATS scoring.
                    </motion.p>

                    <motion.div variants={itemVariants}>
                        <Link to={isAuthenticate ? "/dashboard" : "/register"} className="inline-block px-8 py-4 bg-white text-black rounded-lg text-lg font-bold hover:bg-gray-200 transition-all hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.15)]">
                            {isAuthenticate ? "Return to Dashboard" : "Start Your First Mock Interview →"}
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Features Grid */}
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={containerVariants}
                    className="max-w-6xl mx-auto px-6 py-16"
                >
                    <motion.div variants={itemVariants} className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-white mb-4">Everything you need to get hired.</h2>
                        <p className="text-[var(--text-muted)]">An all-in-one platform built for software engineers, by a software engineer.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Define feature data cleanly */}
                        {[
                            { icon: "🧠", title: "Multi-Modal AI Interviews", desc: "Face 3 dynamic rounds (HR, Tech, DSA). Questions are generated in real-time based strictly on your resume." },
                            { icon: "🎙️", title: "Native Voice Layer", desc: "Stop typing. The AI reads questions out loud, and you answer using your microphone with Groq/Whisper transcription." },
                            {
                                icon: "🔗",
                                title: "Shareable Report Cards",
                                desc: "Flex your skills. Generate a public link for your interview results to share with friends, challenge peers, or post on LinkedIn for recruiters."
                            },
                            { icon: "📄", title: "FAANG ATS Checker", desc: "Upload any resume and get a ruthless score out of 100. Get missing keywords, role predictions, and AI rewrites." },
                            { icon: "📚", title: "The Learning Hub", desc: "Ditch tutorial hell. Follow structured roadmaps like Striver's A2Z and Blind 75. Check off problems as you solve them." },
                            { icon: "📈", title: "Analytics Dashboard", desc: "Save your interview history forever. Track your consistency with a GitHub-style heatmap and share public report cards." },
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                whileHover={{ y: -5, borderColor: "var(--accent)" }}
                                className="p-8 rounded-2xl bg-[var(--surface)] border border-white/5 shadow-xl shadow-black/50 transition-colors group"
                            >
                                <div className="w-12 h-12 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center mb-6 text-[var(--accent)] text-2xl group-hover:scale-110 transition-transform">{feature.icon}</div>
                                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                                <p className="text-[var(--text-muted)] text-sm leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Privacy & Trust Section */}
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={itemVariants}
                    className="bg-[var(--surface)] border-y border-white/5 py-20 mt-10 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-1/4 w-64 h-64 bg-green-900/10 rounded-full blur-[100px] pointer-events-none"></div>

                    <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                        <div className="w-16 h-16 mx-auto bg-green-500/10 text-green-500 rounded-full flex items-center justify-center text-3xl mb-6 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                            🔒
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-6">Your Data is 100% Yours.</h2>
                        <p className="text-[var(--text-muted)] text-lg leading-relaxed mb-8">
                            Most AI tools harvest your resumes and interview answers to sell to recruiters or train public models. <b className="text-white">RoundOne doesn't.</b>
                            <br /><br />
                            We delete your temporary audio and execution files instantly. Your resume text is securely stored in your private database exclusively to personalize your mock interviews. No trackers, no data brokers, no nonsense.
                        </p>
                    </div>
                </motion.section>
            </main>

            {/* Footer stays the same... */}
            <footer className="bg-[var(--bg)] pt-12 pb-8 z-10">
                <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-center md:text-left">
                        <div className="text-xl font-bold text-white mb-2">RoundOne</div>
                        <p className="text-sm text-[var(--text-muted)]">Designed and engineered by Anurag Mishra.</p>
                    </div>

                    <div className="flex gap-6">
                        <a href="https://github.com/Anurag-Mishra2006" target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] hover:text-white transition-colors">GitHub</a>
                        <a href="https://www.linkedin.com/in/anurag-mishra-256101318/" target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] hover:text-white transition-colors">LinkedIn</a>
                    </div>

                    <div>
                        <a href="https://buymeachai.ezee.li/supreme_1" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-lg hover:from-orange-600 hover:to-red-600 transition-all shadow-lg hover:shadow-orange-500/30 transform hover:-translate-y-0.5">
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
