import { useState } from 'react'
import { forgotPassword } from '@/services/api'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await forgotPassword({ email });
      navigate("/verify-reset-otp", { state: { email } });
    } catch (err: any) {
      setError(err?.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] flex font-sans">

      {/* LEFT SIDE: Brand / Description (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-[var(--surface)] border-r border-[var(--border)] relative flex-col justify-between p-12 overflow-hidden">

        {/* Ambient background glows for the left panel */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-900/30 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-900/20 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Top: Logo & Back Link */}
        <div className="relative z-10">
            <Link to="/login" className="text-sm font-medium text-[var(--text-muted)] hover:text-white transition-colors flex items-center gap-2 mb-8 w-fit">
                ← Back to Login
            </Link>
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent)] to-purple-800 flex items-center justify-center text-white font-bold text-xl shadow-[0_0_20px_rgba(170,59,255,0.4)]">
                    R
                </div>
                <span className="text-2xl font-extrabold text-white tracking-tight">RoundOne</span>
            </div>
        </div>

        {/* Middle: Feature Highlight / Quote */}
        <div className="relative z-10 max-w-md">
            <h2 className="text-4xl font-bold text-white leading-tight mb-6">
                Locked out?<br/> <span className="text-[var(--accent)]">Let's get you back in.</span>
            </h2>
            <div className="space-y-4 text-[var(--text-muted)] text-lg leading-relaxed">
                <p>
                    We'll send a one-time code to your email so you can securely reset your password and pick up right where you left off.
                </p>
                <div className="flex items-center gap-4 mt-8 pt-8 border-t border-[var(--border)]">
                    <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-[var(--surface)]"></div>
                        <div className="w-8 h-8 rounded-full bg-green-500 border-2 border-[var(--surface)]"></div>
                        <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-[var(--surface)]"></div>
                    </div>
                    <p className="text-sm font-medium text-[var(--text)]">Your account, secured in seconds.</p>
                </div>
            </div>
        </div>

        {/* Bottom: Footer link */}
        <div className="relative z-10 text-sm text-[var(--text-muted)]">
            © {new Date().getFullYear()} RoundOne Platform.
        </div>
      </div>

      {/* RIGHT SIDE: The Forgot Password Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">

        {/* Mobile-only back button */}
        <Link to="/login" className="lg:hidden absolute top-8 left-8 text-sm font-medium text-[var(--text-muted)] hover:text-white transition-colors flex items-center gap-2">
            ← Login
        </Link>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-sm"
        >
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl font-bold text-white tracking-tight">Forgot password</h1>
            <p className="mt-2 text-[var(--text-muted)]">Enter your email to receive a reset OTP.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                placeholder="name@example.com"
                className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] placeholder:text-[#4b5563] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all"
              />
            </div>

            {error && (
              <div className="p-3 rounded-md bg-[var(--danger)]/10 border border-[var(--danger)]/20 text-center">
                  <p className="text-sm font-medium text-[var(--danger)]">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full rounded-lg bg-[var(--accent)] py-3.5 text-sm font-bold text-white transition-all hover:bg-[var(--accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(170,59,255,0.2)] hover:shadow-[0_0_25px_rgba(170,59,255,0.4)]"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>

          <p className="mt-8 text-center lg:text-left text-sm text-[var(--text-muted)]">
            Remembered your password?{" "}
            <Link to="/login" className="text-[var(--accent)] hover:text-white font-bold transition-colors">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>

    </div>
  )
}

export default ForgotPassword
