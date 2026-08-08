import { interviewStart } from "@/services/api";
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom";
import useSessionStore from "@/store/sessionStore";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";

function Onboarding() {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [level, setLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner")
  const [language, setLanguage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const setSession = useSessionStore((state) => state.setSession);

  const handleSubmit = async () => {
    setError("")
    if (!company || !role || !language) {
      setError("Please fill all fields")
      return
    }
    try {
      setLoading(true)
      const response = await interviewStart({
        company,
        role,
        level,
        language,
      });

      if (response.status !== 200) {
        setError("Something went wrong");
        return;
      }

      const { hr, technical, dsa } = response.data;

      setSession({
        company,
        role,
        level,
        language,
        hr,
        technical,
        dsa,
      });
      navigate("/interview");
    } catch (error: any) {
      setError(error?.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-70px)] flex items-center justify-center bg-[var(--bg)] px-6 py-12 relative overflow-hidden font-sans selection:bg-purple-500/30">

        {/* Ambient Background Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center z-10">

          {/* LEFT SIDE: Animated Timeline (STEP 2 ACTIVE) */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="hidden lg:flex flex-col space-y-10 pr-8"
          >
            <div>
              <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">
                Personalize your <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-[var(--accent)]">interview journey.</span>
              </motion.h2>
              <motion.p variants={itemVariants} className="text-[var(--text-muted)] text-lg leading-relaxed max-w-md">
                Our AI doesn't ask generic questions. We analyze your unique background to conduct a highly realistic, tailored mock interview.
              </motion.p>
            </div>

            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-[1.1rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[var(--success)] before:via-[var(--accent)] before:to-[var(--surface)] before:opacity-50">

              {/* Step 1: COMPLETED */}
              <motion.div variants={itemVariants} className="relative flex items-start gap-6 opacity-70">
                <div className="w-10 h-10 rounded-full bg-[var(--success)]/20 border-2 border-[var(--success)] flex items-center justify-center text-[var(--success)] font-bold z-10 shrink-0">
                  {/* Check SVG */}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <div className="pt-1">
                  <h3 className="text-white font-bold text-xl mb-1">Upload Resume</h3>
                  <p className="text-[var(--text-muted)] text-sm">Resume successfully parsed and secured.</p>
                </div>
              </motion.div>

              {/* Step 2: ACTIVE NOW */}
              <motion.div variants={itemVariants} className="relative flex items-start gap-6">
                <div className="w-10 h-10 rounded-full bg-[var(--accent)] flex items-center justify-center text-white font-bold shadow-[0_0_20px_rgba(170,59,255,0.4)] z-10 shrink-0 border-4 border-[var(--bg)]">
                  2
                </div>
                <div className="pt-1">
                  <h3 className="text-white font-bold text-xl mb-1">Configure Target</h3>
                  <p className="text-[var(--text-muted)] text-sm">Select your dream company, role, and difficulty level.</p>
                </div>
              </motion.div>

              {/* Step 3: UPCOMING */}
              <motion.div variants={itemVariants} className="relative flex items-start gap-6 opacity-40">
                <div className="w-10 h-10 rounded-full bg-[var(--surface)] border-2 border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] font-bold z-10 shrink-0">
                  3
                </div>
                <div className="pt-1">
                  <h3 className="text-white font-bold text-xl mb-1">Face the AI</h3>
                  <p className="text-[var(--text-muted)] text-sm">Speak your answers and write real code in our Docker sandbox.</p>
                </div>
              </motion.div>

            </div>
          </motion.div>

          {/* RIGHT SIDE: The Setup Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-lg mx-auto"
          >

            {/* Mobile-only back button */}
            <Link to="/resume-upload" className="lg:hidden text-sm font-medium text-[var(--text-muted)] hover:text-white transition-colors flex items-center gap-2 mb-6 group">
              {/* Arrow Left SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:-translate-x-1 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
              </svg>
              Back to Upload
            </Link>

            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 sm:p-10 shadow-2xl shadow-black/50 relative overflow-hidden group/card">

              {/* Card internal subtle glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/10 rounded-full blur-[80px] group-hover/card:bg-purple-600/20 transition-colors duration-500"></div>

              <div className="mb-10 text-center relative z-10">
                <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-[var(--accent)] to-purple-800 flex items-center justify-center text-white font-bold text-2xl shadow-[0_0_20px_rgba(170,59,255,0.4)] transform group-hover/card:scale-105 transition-transform duration-300">
                  {/* Gear / Adjustments SVG */}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-white tracking-tight">
                  Interview Setup
                </h1>
                <p className="mt-2 text-sm text-[var(--text-muted)]">
                  Tell us where you're applying. We'll tailor every question to your profile.
                </p>
              </div>

              <div className="space-y-5 relative z-10">

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    Target Company
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Amazon, Google, Startup"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--text)] placeholder:text-[#4b5563] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    Target Role
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. SDE-1, Frontend Engineer"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--text)] placeholder:text-[#4b5563] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                      Difficulty Level
                    </label>
                    <select
                      value={level}
                      onChange={(e) => setLevel(e.target.value as "beginner" | "intermediate" | "advanced")}
                      className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all cursor-pointer"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                      Coding Language
                    </label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all cursor-pointer"
                    >
                      <option value="" disabled>Select language</option>
                      <option value="cpp">C++</option>
                      <option value="c">C</option>
                      <option value="python">Python</option>
                      <option value="java">Java</option>
                      <option value="javascript">JavaScript</option>
                    </select>
                  </div>
                </div>

                {error && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 mt-2 rounded-lg bg-[var(--danger)]/10 border border-[var(--danger)]/20 text-center flex items-center justify-center gap-2">
                    {/* Warning SVG */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-[var(--danger)] shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-sm font-medium text-[var(--danger)]">{error}</p>
                  </motion.div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="mt-6 w-full rounded-xl bg-[var(--accent)] py-4 text-sm font-bold text-white transition-all hover:bg-[var(--accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(170,59,255,0.2)] hover:shadow-[0_0_25px_rgba(170,59,255,0.4)] disabled:shadow-none hover:-translate-y-0.5 active:translate-y-0 flex justify-center items-center gap-2 group"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Generating Interview...</span>
                    </>
                  ) : (
                    <>
                      Start Interview
                      {/* Arrow Right SVG */}
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 group-hover:translate-x-1 transition-transform">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                      </svg>
                    </>
                  )}
                </button>

              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </>
  )
}

export default Onboarding
