import { useState } from 'react'
import { login } from '@/services/api'
import { useNavigate, Link } from 'react-router-dom'
import useUserStore from '@/store/authStore'

function Login() {
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      navigate("/resume-upload");

    } catch (error: any) {
      setError(error?.response?.data?.error || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-[var(--text)]">RoundOne</h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">Sign in to continue your prep</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-[var(--text-muted)]">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Enter your email"
              className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--accent)] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-[var(--text-muted)]">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Enter your password"
              className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--accent)] transition-colors"
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
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
          Don't have an account?{" "}
          <Link to="/register" className="text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login