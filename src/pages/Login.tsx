import { useState, useEffect } from 'react'
import { login } from '@/services/api'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import useUserStore from '@/store/authStore'
import { motion, AnimatePresence } from 'framer-motion'

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const setUser = useUserStore((state) => state.setUser);

  const [successMessage, setSuccessMessage] = useState<string | null>(
    (location.state as { message?: string })?.message ?? null
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Auto-dismiss after 4s, and scrub the message out of history state
  // so refresh/back-forward doesn't bring it back.
  useEffect(() => {
    if (!successMessage) return;

    navigate(location.pathname, { replace: true, state: {} });

    const timer = setTimeout(() => setSuccessMessage(null), 2000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await login({ email, password });

      if (response.status !== 200) {
        setError("Login failed");
        return;
      }

      setUser(response.data.user);
      navigate("/dashboard");

    } catch (error: any) {
      setError(error?.response?.data?.error || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] flex font-sans selection:bg-purple-500/30">
      
      {/* LEFT SIDE: Brand / Description (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-[var(--surface)] border-r border-[var(--border)] relative flex-col justify-between p-12 overflow-hidden">
        
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-900/30 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-900/20 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="relative z-10">
            <Link to="/" className="text-sm font-medium text-[var(--text-muted)] hover:text-white transition-all flex items-center gap-2 mb-8 w-fit group">
                {/* Arrow Left SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:-translate-x-1 transition-transform">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
                </svg>
                Back to Home
            </Link>
            <div className="flex items-center gap-3">
                <img src="/logo.svg?v=2" alt="RoundOne" className="w-8 h-8 rounded-lg" />
                <span className="text-2xl font-extrabold text-white tracking-tight">RoundOne</span>
            </div>
        </div>

        <div className="relative z-10 max-w-md">
            <h2 className="text-4xl font-bold text-white leading-tight mb-6">
                Your career prep,<br/> <span className="text-[var(--accent)]">supercharged by AI.</span>
            </h2>
            <div className="space-y-4 text-[var(--text-muted)] text-lg leading-relaxed">
                <p>
                    Stop grinding blindly. RoundOne offers an enterprise-grade execution engine, voice-enabled AI recruiters, and ruthless ATS scoring.
                </p>
                <div className="flex items-center gap-4 mt-8 pt-8 border-t border-[var(--border)]">
                    <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-[var(--surface)]"></div>
                        <div className="w-8 h-8 rounded-full bg-green-500 border-2 border-[var(--surface)]"></div>
                        <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-[var(--surface)]"></div>
                    </div>
                    <p className="text-sm font-medium text-[var(--text)]">Join developers landing FAANG offers.</p>
                </div>
            </div>
        </div>

        <div className="relative z-10 text-sm text-[var(--text-muted)]">
            © {new Date().getFullYear()} RoundOne Platform.
        </div>
      </div>

      {/* RIGHT SIDE: The Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        
        <Link to="/" className="lg:hidden absolute top-8 left-8 text-sm font-medium text-[var(--text-muted)] hover:text-white transition-all flex items-center gap-2 group">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:-translate-x-1 transition-transform">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
            </svg>
            Home
        </Link>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-sm"
        >
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl font-bold text-white tracking-tight">Welcome back</h1>
            <p className="mt-2 text-[var(--text-muted)]">Sign in to continue your interview prep.</p>
          </div>

          <AnimatePresence>
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -8, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto", marginBottom: 24 }}
                exit={{ opacity: 0, y: -8, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.3 }}
                className="p-3 rounded-xl bg-[var(--success)]/10 border border-[var(--success)]/20 text-center overflow-hidden flex items-center justify-center gap-2"
              >
                {/* Success Check SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-[var(--success)]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-medium text-[var(--success)]">{successMessage}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="name@example.com"
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3.5 text-sm text-[var(--text)] placeholder:text-[#4b5563] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all shadow-inner"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Password</label>
                  <Link to="/forgot-password" className="text-xs font-medium text-[var(--accent)] hover:text-white transition-colors">
                      Forgot password?
                  </Link>
              </div>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="••••••••"
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3.5 text-sm text-[var(--text)] placeholder:text-[#4b5563] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all shadow-inner"
              />
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="p-3 rounded-xl bg-[var(--danger)]/10 border border-[var(--danger)]/20 text-center flex items-center justify-center gap-2">
                  {/* Warning SVG */}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-[var(--danger)] shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p className="text-sm font-medium text-[var(--danger)]">{error}</p>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full rounded-xl bg-[var(--accent)] py-4 text-sm font-bold text-white transition-all hover:bg-[var(--accent-hover)] hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(170,59,255,0.2)] hover:shadow-[0_0_25px_rgba(170,59,255,0.4)] flex justify-center items-center gap-2 group"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign in to RoundOne</span>
                  {/* Arrow Right SVG */}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:translate-x-1 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center lg:text-left text-sm text-[var(--text-muted)]">
            Don't have an account?{" "}
            <Link to="/register" className="text-[var(--accent)] hover:text-white font-bold transition-colors">
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>

    </div>
  )
}

export default Login
