import { useState, useRef } from 'react'
import { verifyResetOtp, forgotPassword } from '@/services/api'
import { useNavigate, useLocation, Navigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'

function VerifyResetOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string })?.email;

  // The new OTP state: An array of 6 strings
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  // Refs to control the focus of the 6 input boxes
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  if (!email) {
    return <Navigate to="/forgot-password" replace />;
  }

  // Handle typing in the boxes
  const handleChange = (element: HTMLInputElement, index: number) => {
    const value = element.value;
    if (isNaN(Number(value))) return; // Only allow numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input box if a number was typed
    if (value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace to jump to the previous box
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle Paste (If they copy a 6 digit code from their email)
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6).split("");
    if (pastedData.some(char => isNaN(Number(char)))) return; // Only paste numbers

    const newOtp = [...otp];
    pastedData.forEach((char, index) => {
      newOtp[index] = char;
      if (inputRefs.current[index]) {
        inputRefs.current[index]!.value = char;
      }
    });
    setOtp(newOtp);
    // Focus the last filled box
    inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);

    const otpString = otp.join("");

    try {
      const res = await verifyResetOtp({ email, otp: otpString });
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
      setInfo("A new OTP has been sent to your email.");
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

        {/* Ambient background glows */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-900/30 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-900/20 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="relative z-10">
            <Link to="/login" className="text-sm font-medium text-[var(--text-muted)] hover:text-white transition-colors flex items-center gap-2 mb-8 w-fit">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m12 19-7-7 7-7"/>
                  <path d="M19 12H5"/>
                </svg>
                Back to Login
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
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative overflow-y-auto">

        {/* Mobile-only back button */}
        <Link to="/login" className="lg:hidden absolute top-8 left-8 text-sm font-medium text-[var(--text-muted)] hover:text-white transition-colors flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 19-7-7 7-7"/>
              <path d="M19 12H5"/>
            </svg>
            Login
        </Link>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-sm my-auto"
        >
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl font-bold text-white tracking-tight">Enter OTP</h1>
            <p className="mt-2 text-[var(--text-muted)] leading-relaxed">
              We sent a 6-digit code to <br className="hidden lg:block"/>
              <span className="font-bold text-[var(--text)]">{email}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {/* The 6 Square Boxes UI */}
            <div className="flex justify-between items-center gap-2 sm:gap-3">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  name="otp"
                  maxLength={1}
                  value={data}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  className="w-12 h-14 text-center text-2xl font-bold rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all shadow-sm"
                />
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-md bg-[var(--danger)]/10 border border-[var(--danger)]/20 text-center">
                  <p className="text-sm font-medium text-[var(--danger)]">{error}</p>
              </div>
            )}
            
            {/* Success Message for Resend */}
            {info && !error && (
              <div className="p-3 rounded-md bg-[var(--success)]/10 border border-[var(--success)]/20 text-center">
                  <p className="text-sm font-medium text-[var(--success)]">{info}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || otp.join("").length < 6}
              className="w-full rounded-lg bg-[var(--accent)] py-3.5 text-sm font-bold text-white transition-all hover:bg-[var(--accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(170,59,255,0.2)] hover:shadow-[0_0_25px_rgba(170,59,255,0.4)]"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>

          <div className="mt-8 text-center lg:text-left text-sm text-[var(--text-muted)]">
            Didn't receive the code?{" "}
            <button
              onClick={handleResend}
              disabled={resending}
              className="text-[var(--accent)] hover:text-white font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resending ? "Sending..." : "Resend OTP"}
            </button>
          </div>
        </motion.div>
      </div>

    </div>
  )
}

export default VerifyResetOtp
