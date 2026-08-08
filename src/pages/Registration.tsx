import { useState } from 'react'
import { signup } from '@/services/api';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function Registration() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // NEW: State for toggling password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await signup({ name, email, password });
      if (response.status !== 200) {
        setError("User creation failed");
        return;
      }
      navigate("/verify-otp", { state: { email } });
    } catch (error: any) {
      setError(error?.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] flex font-sans selection:bg-purple-500/30">
      
      {/* LEFT SIDE: Brand / Description (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-[var(--surface)] border-r border-[var(--border)] relative flex-col justify-between p-12 overflow-hidden">
        
        {/* Ambient background glows */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-900/30 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-900/20 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Top: Logo & Back Link */}
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

        {/* Middle: Feature Highlight */}
        <div className="relative z-10 max-w-md">
            <h2 className="text-4xl font-bold text-white leading-tight mb-6">
                Start your journey to <br/> <span className="text-[var(--accent)]">FAANG today.</span>
            </h2>
            <div className="space-y-4 text-[var(--text-muted)] text-lg leading-relaxed">
                <p>
                   Join RoundOne for free to unlock your personal AI Interviewer, curated Learning Roadmaps, and a FAANG-grade ATS Resume Checker.</p>
                <div className="flex items-center gap-4 mt-8 pt-8 border-t border-[var(--border)]">
                    <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full bg-orange-500 border-2 border-[var(--surface)]"></div>
                        <div className="w-8 h-8 rounded-full bg-teal-500 border-2 border-[var(--surface)]"></div>
                        <div className="w-8 h-8 rounded-full bg-rose-500 border-2 border-[var(--surface)]"></div>
                    </div>
                    <p className="text-sm font-medium text-[var(--text)]">Level up your technical skills.</p>
                </div>
            </div>
        </div>

        {/* Bottom: Footer link */}
        <div className="relative z-10 text-sm text-[var(--text-muted)]">
            © {new Date().getFullYear()} RoundOne Platform.
        </div>
      </div>

      {/* RIGHT SIDE: The Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative overflow-y-auto">
        
        {/* Mobile-only back button */}
        <Link to="/" className="lg:hidden absolute top-8 left-8 text-sm font-medium text-[var(--text-muted)] hover:text-white transition-all flex items-center gap-2 group">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:-translate-x-1 transition-transform">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
            </svg>
            Home
        </Link>

        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-sm my-auto py-12"
        >
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl font-bold text-white tracking-tight">Create an account</h1>
            <p className="mt-2 text-[var(--text-muted)]">Sign up to start practicing.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Full Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="John Doe"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3.5 text-sm text-[var(--text)] placeholder:text-[#4b5563] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all shadow-inner"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="name@example.com"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3.5 text-sm text-[var(--text)] placeholder:text-[#4b5563] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all shadow-inner"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Password</label>
              <div className="relative">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] pl-4 pr-12 py-3.5 text-sm text-[var(--text)] placeholder:text-[#4b5563] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors focus:outline-none"
                  tabIndex={-1} // Prevents tabbing to the eye icon
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Confirm Password</label>
              <div className="relative">
                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] pl-4 pr-12 py-3.5 text-sm text-[var(--text)] placeholder:text-[#4b5563] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors focus:outline-none"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
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
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  {/* Arrow Right SVG */}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:translate-x-1 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center lg:text-left text-sm text-[var(--text-muted)]">
            Already have an account?{" "}
            <Link to="/login" className="text-[var(--accent)] hover:text-white font-bold transition-colors">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>

    </div>
  )
}

export default Registration
