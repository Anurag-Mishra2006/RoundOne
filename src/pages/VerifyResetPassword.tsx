import { useState } from 'react'
import { verifyResetOtp, forgotPassword } from '@/services/api'
import { useNavigate, useLocation, Navigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'

function VerifyResetOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string })?.email;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  if (!email) {
    return <Navigate to="/forgot-password" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await verifyResetOtp({ email, otp });
      navigate("/reset-password", { state: { resetToken: res.data.resetToken } });
    } catch (err: any) {
      setError(err?.response?.data?.error || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setInfo("");
    setResending(true);
    try {
      await forgotPassword({ email });
      setInfo("A new OTP has been sent.");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Could not resend OTP");
    } finally {
      setResending(false);
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
                <img src="/logo.svg?v=2" alt="RoundOne" className="w-8 h-8 rounded-lg" />
         
                <span className="text-2xl font-extrabold text-white tracking-tight">RoundOne</span>
            </div>
        </div>

        <div className="relative z-10 max-w-md">
            <h2 className="text-4xl font-bold text-white leading-tight mb-6">
                Check your inbox.<br/> <span className="text-[var(--accent)]">We sent you a code.</span>
            </h2>
            <div className="space-y-4 text-[var(--text-muted)] text-lg leading-relaxed">
                <p>
                    Enter the 6-digit code we emailed you to verify it's really you before setting a new password.
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

      {/* RIGHT SIDE: The OTP Form */}
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
            <h1 className="text-3xl font-bold text-white tracking-tight">Enter OTP</h1>
            <p className="mt-2 text-[var(--text-muted)]">We sent a code to {email}.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">OTP</label>
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                type="text"
                inputMode="numeric"
                required
                placeholder="6-digit code"
                className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] placeholder:text-[#4b5563] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all"
              />
            </div>

            {error && (
              <div className="p-3 rounded-md bg-[var(--danger)]/10 border border-[var(--danger)]/20 text-center">
                  <p className="text-sm font-medium text-[var(--danger)]">{error}</p>
              </div>
            )}
            {info && (
              <div className="p-3 rounded-md bg-green-500/10 border border-green-500/20 text-center">
                  <p className="text-sm font-medium text-green-400">{info}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full rounded-lg bg-[var(--accent)] py-3.5 text-sm font-bold text-white transition-all hover:bg-[var(--accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(170,59,255,0.2)] hover:shadow-[0_0_25px_rgba(170,59,255,0.4)]"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>

          <button
            onClick={handleResend}
            disabled={resending}
            className="mt-8 text-center lg:text-left w-full text-sm text-[var(--accent)] hover:text-white font-bold transition-colors disabled:opacity-50"
          >
            {resending ? "Resending..." : "Resend OTP"}
          </button>
        </motion.div>
      </div>

    </div>
  )
}

export default VerifyResetOtp
