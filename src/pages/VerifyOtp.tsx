import { verifyOtp, resendOtp } from '@/services/api';
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function VerifyOtp() {
  const location = useLocation();
  const email = location.state?.email;
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!email) {
      navigate("/register");
    }
  }, [email, navigate]);

  const handleOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await verifyOtp({ email, otp });

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
    setResendLoading(true);

    try {
      await resendOtp({ email });
    } catch (error: any) {
      setError(error?.response?.data?.error || "Could not resend OTP");
    } finally {
      setResendLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-[var(--text)]">RoundOne</h1>
          <h3 className="mt-1 text-base font-medium text-[var(--text)]">Verify your email</h3>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            We've sent a 6-digit code to <span className="text-[var(--text)]">{email}</span>
          </p>
        </div>

        <form onSubmit={handleOTP} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-[var(--text-muted)]">Verification code</label>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="Enter 6-digit code"
              className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] tracking-widest placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--accent)] transition-colors"
            />
          </div>

          {error && (
            <p className="text-sm text-[var(--danger)]">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-lg bg-[var(--accent)] py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying..." : "Verify & Continue"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-[var(--text-muted)]">
          Didn't receive the code?{" "}
          <button
            onClick={handleResendOtp}
            disabled={resendLoading}
            className="text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resendLoading ? "Sending..." : "Resend code"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default VerifyOtp