import { verifyOtp, resendOtp } from '@/services/api';
import { useEffect, useState, useRef } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'

function VerifyOtp() {
  const location = useLocation();
  const email = location.state?.email;
  const navigate = useNavigate();

  // The new OTP state: An array of 6 strings
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Refs to control the focus of the 6 input boxes
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!email) {
      navigate("/register");
    }
  }, [email, navigate]);

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

  const handleOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const otpString = otp.join("");

    try {
      const response = await verifyOtp({ email, otp: otpString });

      if (response.status !== 201) {
        setError("Verification failed");
        return;
      }

      navigate("/login");

    } catch (error: any) {
      setError(error?.response?.data?.error || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  }

  const handleResendOtp = async () => {
    setError("");
    setMessage("");
    setResendLoading(true);

    try {
      await resendOtp({ email });
      setMessage("A new code has been sent to your email!");
    } catch (error: any) {
      setError(error?.response?.data?.error || "Could not resend OTP");
    } finally {
      setResendLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] flex font-sans">
      
      {/* LEFT SIDE: Brand / Description (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-[var(--surface)] border-r border-[var(--border)] relative flex-col justify-between p-12 overflow-hidden">
        
        {/* Ambient background glows */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-900/30 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-900/20 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Top: Logo & Back Link */}
        <div className="relative z-10">
            <Link to="/register" className="text-sm font-medium text-[var(--text-muted)] hover:text-white transition-colors flex items-center gap-2 mb-8 w-fit">
                ← Back to Registration
            </Link>
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent)] to-purple-800 flex items-center justify-center text-white font-bold text-xl shadow-[0_0_20px_rgba(170,59,255,0.4)]">
                    R
                </div>
                <span className="text-2xl font-extrabold text-white tracking-tight">RoundOne</span>
            </div>
        </div>

        {/* Middle: Feature Highlight */}
        <div className="relative z-10 max-w-md">
            <h2 className="text-4xl font-bold text-white leading-tight mb-6">
                Check your <span className="text-[var(--accent)]">inbox.</span>
            </h2>
            <div className="space-y-4 text-[var(--text-muted)] text-lg leading-relaxed">
                <p>
                    We've sent a secure 6-digit verification code to your email. Enter it to activate your account and start your mock interviews.
                </p>
                <div className="flex items-center gap-4 mt-8 pt-8 border-t border-[var(--border)]">
                    <div className="w-10 h-10 rounded-full bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)]">
                        🔒
                    </div>
                    <p className="text-sm font-medium text-[var(--text)]">Bank-grade JWT security to protect your resume and data.</p>
                </div>
            </div>
        </div>

        {/* Bottom: Footer link */}
        <div className="relative z-10 text-sm text-[var(--text-muted)]">
            © {new Date().getFullYear()} RoundOne Platform.
        </div>
      </div>

      {/* RIGHT SIDE: The OTP Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative overflow-y-auto">
        
        {/* Mobile-only back button */}
        <Link to="/register" className="lg:hidden absolute top-8 left-8 text-sm font-medium text-[var(--text-muted)] hover:text-white transition-colors flex items-center gap-2">
            ← Back
        </Link>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-sm my-auto"
        >
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl font-bold text-white tracking-tight">Verify your email</h1>
            <p className="mt-2 text-[var(--text-muted)] leading-relaxed">
              We've sent a 6-digit code to <br className="hidden lg:block"/>
              <span className="font-bold text-[var(--text)]">{email}</span>
            </p>
          </div>

          <form onSubmit={handleOTP} className="flex flex-col gap-6">
            
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
                  ref={(el) => (inputRefs.current[index] = el)}
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
            {message && !error && (
              <div className="p-3 rounded-md bg-[var(--success)]/10 border border-[var(--success)]/20 text-center">
                  <p className="text-sm font-medium text-[var(--success)]">{message}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || otp.join("").length < 6}
              className="w-full rounded-lg bg-[var(--accent)] py-3.5 text-sm font-bold text-white transition-all hover:bg-[var(--accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(170,59,255,0.2)] hover:shadow-[0_0_25px_rgba(170,59,255,0.4)]"
            >
              {loading ? "Verifying..." : "Verify & Continue"}
            </button>
          </form>

          <div className="mt-8 text-center lg:text-left text-sm text-[var(--text-muted)]">
            Didn't receive the code?{" "}
            <button
              onClick={handleResendOtp}
              disabled={resendLoading}
              className="text-[var(--accent)] hover:text-white font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resendLoading ? "Sending..." : "Resend code"}
            </button>
          </div>
        </motion.div>
      </div>

    </div>
  )
}

export default VerifyOtp
