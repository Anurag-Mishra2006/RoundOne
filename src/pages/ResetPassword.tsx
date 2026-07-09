import { useState } from 'react'
import { resetPassword } from '@/services/api'
import { useNavigate, useLocation, Navigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const resetToken = (location.state as { resetToken?: string })?.resetToken;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!resetToken) {
    return <Navigate to="/forgot-password" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await resetPassword({ resetToken, password, confirmPassword });
      navigate("/login", { state: { message: "Password updated. Please sign in." } });
    } catch (err: any) {
      setError(err?.response?.data?.error || "Could not reset password. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] flex font-sans">

      {/* LEFT SIDE: Brand / Description (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-[var(--surface)] border-r border-[var(--border)] relative flex-col justify-between p-12 overflow-hidden">

        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-900/30 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-900/20 rounded-full blur-[120px] pointer-events-none"></div>

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

        <div className="relative z-10 max-w-md">
            <h2 className="text-4xl font-bold text-white leading-tight mb-6">
                Almost there.<br/> <span className="text-[var(--accent)]">Set a new password.</span>
            </h2>
            <div className="space-y-4 text-[var(--text-muted)] text-lg leading-relaxed">
                <p>
                    Choose something strong and memorable. You'll use this to sign back in right after.
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

        <div className="relative z-10 text-sm text-[var(--text-muted)]">
            © {new Date().getFullYear()} RoundOne Platform.
        </div>
      </div>

      {/* RIGHT SIDE: The Reset Password Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">

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
            <h1 className="text-3xl font-bold text-white tracking-tight">Reset password</h1>
            <p className="mt-2 text-[var(--text-muted)]">Choose a new password for your account.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">New Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
                placeholder="••••••••"
                className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] placeholder:text-[#4b5563] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Confirm Password</label>
              <input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type="password"
                required
                placeholder="••••••••"
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
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </motion.div>
      </div>

    </div>
  )
}

export default ResetPassword
