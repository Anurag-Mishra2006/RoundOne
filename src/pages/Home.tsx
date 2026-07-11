import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import useUserStore from "@/store/authStore";
import { motion, useMotionValue, useSpring, useScroll, useTransform } from "framer-motion";

// --- DATA ---
const features = [
    { icon: "🧠", title: "Multi-Modal AI Interviews", desc: "Face 3 dynamic rounds (HR, Tech, DSA). Questions are generated in real-time based strictly on your resume." },
    { icon: "🎙️", title: "Native Voice Layer", desc: "Stop typing. The AI reads questions out loud, and you answer using your microphone with Groq/Whisper transcription." },
    { icon: "🔗", title: "Shareable Report Cards", desc: "Flex your skills. Generate a public link for your interview results to share with friends, challenge peers, or post on LinkedIn for recruiters." },
    { icon: "📄", title: "FAANG ATS Checker", desc: "Upload any resume and get a ruthless score out of 100. Get missing keywords, role predictions, and AI rewrites." },
    { icon: "📚", title: "The Learning Hub", desc: "Structured roadmaps (Striver A2Z, CP, Sys-Design). Your progress is saved persistently so you never lose track of what to learn next." },
    { icon: "📈", title: "Analytics Dashboard", desc: "Save your interview history forever. Track your consistency with a GitHub-style heatmap and share public report cards." },
];

const testimonials = [
    { name: "Sarah J.", role: "SDE II at Amazon", text: "The AI interviewer was brutally honest. It caught the exact flaw in my sliding window approach that a real Amazon interviewer did a year ago." },
    { name: "David C.", role: "Frontend Engineer at Vercel", text: "The native voice layer is insane. It genuinely felt like I was talking to an engineer. I stopped looking at the screen and just coded." },
    { name: "Priya R.", role: "New Grad", text: "Striver's A2Z integrated directly into my dashboard? Plus the ATS checker? This got me my first 3 interview calls." }
];

// Focus ticker on the Mock Interview tech stack
const liveActivity = [
    "🎙️ Groq Whisper Voice Engine Active",
    "📄 Edge-TTS Text Engine Active",
    "🧠 Dynamic AI Question Generation Live",
    "🎯 FAANG ATS Scoring Updated",
    "📈 Track Your Learning Sheet Progress",
    // "⚡ Docker Sandbox Execution Active"
];

function Home() {
    const { isAuthenticate } = useUserStore();
    const [isHoveringTestimonial, setIsHoveringTestimonial] = useState(false);

    // Smooth Cursor Tracking
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);
    const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };
        window.addEventListener("mousemove", moveCursor);
        return () => window.removeEventListener("mousemove", moveCursor);
    }, [cursorX, cursorY]);

    // 3D Scroll Effect for App Preview
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: targetRef, offset: ["start end", "end start"] });
    const rotateX = useTransform(scrollYProgress, [0, 0.5], [40, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);
    const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

    return (
        <div className="min-h-screen bg-[#050505] text-gray-200 font-sans flex flex-col overflow-x-hidden relative selection:bg-purple-500/30">

            {/* --- SPINNING TESTIMONIAL CURSOR --- */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[100] flex items-center justify-center mix-blend-difference"
                style={{ x: cursorXSpring, y: cursorYSpring, translateX: "-50%", translateY: "-50%" }}
                animate={{ scale: isHoveringTestimonial ? 1 : 0, opacity: isHoveringTestimonial ? 1 : 0 }}
                transition={{ duration: 0.3 }}
            >
                <motion.svg animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 8, ease: "linear" }} width="120" height="120" viewBox="0 0 100 100" className="overflow-visible">
                    <path id="circlePath" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="none" />
                    <text fill="white" fontSize="10.5" fontWeight="bold" letterSpacing="2.5">
                        <textPath href="#circlePath" startOffset="0%">READ REVIEW • READ REVIEW • READ REVIEW • </textPath>
                    </text>
                </motion.svg>
                <div className="absolute w-2 h-2 bg-white rounded-full"></div>
            </motion.div>

            {/* --- PREMIUM ANIMATED BACKGROUND --- */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <motion.div animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, 30, 0] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-900/30 rounded-full blur-[150px]" />
                <motion.div animate={{ scale: [1, 1.1, 1], x: [0, -60, 0], y: [0, 50, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }} className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[150px]" />
                <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px', maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)' }} />
            </div>

            {/* Navbar */}
            <nav className="flex justify-between items-center px-6 py-4 md:px-12 border-b border-white/5 bg-[#050505]/40 backdrop-blur-xl sticky top-0 z-50">
                <div className="flex items-center gap-3 cursor-pointer group">
                    <img src="/logo.svg?v=2" alt="RoundOne" className="w-8 h-8 rounded-lg" />
                    <div className="text-xl font-extrabold tracking-tight text-white">RoundOne</div>
                </div>
                <div className="flex gap-6 items-center">
                    <Link to="/privacy" className="hidden md:block text-sm font-medium text-gray-400 hover:text-white transition-colors">Privacy</Link>
                    <Link to="/contact" className="hidden md:block text-sm font-medium text-gray-400 hover:text-white transition-colors">Contact Us</Link>
                    <Link to="/about" className="hidden md:block text-sm font-medium text-gray-400 hover:text-white transition-colors">About Us</Link>

                    {isAuthenticate ? (
                        <Link to="/dashboard" className="px-5 py-2 bg-white/5 border border-white/10 text-white rounded-lg text-sm font-bold hover:bg-white/10 transition-all">Dashboard →</Link>
                    ) : (
                        <>
                            <Link to="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Log in</Link>
                            <Link to="/register" className="px-5 py-2.5 bg-white text-black rounded-lg text-sm font-bold hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)]">Get Started</Link>
                        </>
                    )}
                </div>
            </nav>

            <main className="flex-grow z-10 relative">

                {/* Hero Section */}
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-6xl mx-auto px-6 pt-32 pb-16 text-center flex flex-col items-center">

                    {/* Fixed Text as requested */}
                    <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-semibold uppercase tracking-widest backdrop-blur-md shadow-[0_0_20px_rgba(168,85,247,0.15)]">
                        <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
                        RoundOne is Live
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter mb-8 leading-[1.05]">
                        <span className="text-white">Crack your next</span> <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-500 drop-shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                            FAANG interview.
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl leading-relaxed font-medium">
                        Your personal prep arena. Upload your resume, write real code, and face voice-enabled AI recruiters tailored exactly to your background.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                        <Link to={isAuthenticate ? "/dashboard" : "/register"} className="px-8 py-4 bg-white text-black rounded-xl text-lg font-bold hover:bg-gray-200 transition-all hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                            Start Your First Mock Interview →
                        </Link>
                    </div>
                </motion.div>

                {/* THE 3-STEP MOCK INTERVIEW FLOW PREVIEW (3D TILT ON SCROLL) */}
                <div ref={targetRef} className="max-w-5xl mx-auto px-6 pb-32" style={{ perspective: "1000px" }}>
                    <motion.div
                        style={{ rotateX, scale, opacity }}
                        className="w-full h-auto md:h-[400px] rounded-2xl border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl shadow-[0_0_80px_rgba(168,85,247,0.2)] overflow-hidden flex flex-col relative"
                    >
                        {/* Fake Browser Header */}
                        <div className="h-12 border-b border-white/10 bg-white/5 flex items-center px-4 gap-2 shrink-0">
                            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                            <div className="mx-auto px-4 py-1 rounded-md bg-white/5 text-gray-500 text-xs font-mono">roundone.app/interview-flow</div>
                        </div>

                        {/* Visual representation of your 3 steps */}
                        <div className="flex-grow p-8 flex flex-col md:flex-row items-center justify-center gap-6 relative">
                            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/10 to-transparent pointer-events-none"></div>

                            {/* Step 1: Upload */}
                            <div className="flex-1 w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-center relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-full h-1 bg-purple-500/50"></div>
                                <div className="w-14 h-14 mx-auto bg-purple-500/20 rounded-xl flex items-center justify-center text-2xl mb-4 border border-purple-500/30">📄</div>
                                <div className="font-bold text-white mb-2 text-lg">1. Upload Resume</div>
                                <div className="text-sm text-gray-400">PDF parsed & skills extracted securely.</div>
                            </div>

                            {/* Arrow */}
                            <div className="hidden md:block text-2xl text-gray-600 font-light">→</div>

                            {/* Step 2: Configure */}
                            <div className="flex-1 w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-center relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-full h-1 bg-blue-500/50"></div>
                                <div className="w-14 h-14 mx-auto bg-blue-500/20 rounded-xl flex items-center justify-center text-2xl mb-4 border border-blue-500/30">⚙️</div>
                                <div className="font-bold text-white mb-2 text-lg">2. Configure Target</div>
                                <div className="text-sm text-gray-400">Select company, role, & difficulty level.</div>
                            </div>

                            {/* Arrow */}
                            <div className="hidden md:block text-2xl text-gray-600 font-light">→</div>

                            {/* Step 3: Interview */}
                            <div className="flex-1 w-full bg-purple-500/10 border border-purple-500/30 rounded-2xl p-6 text-center relative overflow-hidden shadow-[0_0_30px_rgba(168,85,247,0.15)]">
                                <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent"></div>
                                <div className="w-14 h-14 mx-auto bg-purple-500/30 rounded-xl flex items-center justify-center text-2xl mb-4 border border-purple-400/50 relative z-10 animate-pulse">🎙️</div>
                                <div className="font-bold text-white mb-2 text-lg relative z-10">3. Face the AI</div>
                                <div className="text-sm text-purple-200/80 relative z-10">Speak your answers and write real code.</div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* HONEST LIVE SYSTEM UPDATES TICKER */}
                <section className="py-8 border-y border-white/5 bg-[#0a0a0a]/50 overflow-hidden relative">
                    <div className="flex gap-12 w-max animate-[marquee_20s_linear_infinite] hover:[animation-play-state:paused]">
                        {[...liveActivity, ...liveActivity, ...liveActivity].map((activity, i) => (
                            <div key={i} className="text-gray-400 text-sm font-medium tracking-wide flex items-center gap-2">
                                {activity}
                            </div>
                        ))}
                    </div>
                </section>

                {/* PREMIUM 3x2 FEATURE GRID */}
                <section id="features" className="max-w-7xl mx-auto px-6 py-32">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Everything you need to get hired.</h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">Stop reading tutorials. Start practicing. An all-in-one platform built for software engineers, by a software engineer.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 group/grid">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ delay: index * 0.1, duration: 0.5 }}
                                className="relative p-[1px] rounded-3xl overflow-hidden bg-white/5 hover:bg-gradient-to-br hover:from-purple-500/50 hover:to-blue-500/50 transition-colors duration-500"
                            >
                                <div className="h-full w-full bg-[#0a0a0a] rounded-[23px] p-8 relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-2xl shadow-inner shadow-white/5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 relative z-10">{feature.icon}</div>
                                    <h3 className="text-xl font-bold text-white mb-3 relative z-10 group-hover:text-purple-300 transition-colors">{feature.title}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed relative z-10">{feature.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* INTERACTIVE TESTIMONIAL SECTION */}
                <section
                    onMouseEnter={() => setIsHoveringTestimonial(true)}
                    onMouseLeave={() => setIsHoveringTestimonial(false)}
                    className="py-32 border-y border-white/5 bg-black/40 relative overflow-hidden cursor-none backdrop-blur-sm"
                >
                    <div className="max-w-6xl mx-auto px-6 relative z-10">
                        <div className="text-center mb-20">
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Built for engineers.</h2>
                            <p className="text-gray-400 text-xl">Early feedback from our private beta testers.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {testimonials.map((t, i) => (
                                <motion.div key={i} whileHover={{ y: -10 }} className="p-8 rounded-3xl border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,255,255,0.05)] hover:border-white/20">
                                    <div className="flex gap-1 text-purple-400 mb-6 text-lg">★★★★★</div>
                                    <p className="text-gray-200 text-lg leading-relaxed mb-8">"{t.text}"</p>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-white/10 flex items-center justify-center font-bold text-white shadow-inner">{t.name.charAt(0)}</div>
                                        <div>
                                            <div className="text-white font-bold">{t.name}</div>
                                            <div className="text-purple-400 text-sm font-medium">{t.role}</div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* IMPROVED PRE-FOOTER CTA */}
                <section className="py-32 relative overflow-hidden">
                    {/* Glowing background behind CTA */}
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 via-transparent to-transparent pointer-events-none"></div>

                    <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                        <h2 className="text-5xl md:text-6xl font-extrabold tracking-tighter mb-6 leading-[1.1]">
                            <span className="text-white">Stop failing interviews.</span> <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-500 drop-shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                                Start practicing today.
                            </span>
                        </h2>
                        <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                            Upload your resume, track your learning sheets persistently, and ace your next technical screen.
                        </p>

                        <Link
                            to={isAuthenticate ? "/dashboard" : "/register"}
                            className="inline-block px-10 py-5 bg-purple-600 text-white rounded-2xl text-xl font-bold hover:bg-purple-500 transition-all hover:-translate-y-1 shadow-[0_0_40px_rgba(168,85,247,0.5)] hover:shadow-[0_0_60px_rgba(168,85,247,0.7)]"
                        >
                            Create Free Account
                        </Link>

                        <div className="mt-8 text-sm text-gray-500 font-medium">
                            Early access is free. Delete your data anytime.
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
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
                    <div>
                        <a href="https://buymeachai.ezee.li/supreme_1" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all group">
                            <span className="text-xl group-hover:rotate-12 transition-transform origin-bottom-left">☕</span>
                            <span>Buy me a Chai</span>
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Home;
