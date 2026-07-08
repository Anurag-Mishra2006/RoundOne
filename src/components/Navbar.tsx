import { useNavigate, Link, useLocation } from "react-router-dom"
import useUserStore from "@/store/authStore"
import { logout } from "@/services/api"

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, clearUser } = useUserStore()

  const handleLogout = async () => {
    try {
      await logout()
    } catch {
      console.error("Backend logout failed")
    } finally {
      clearUser()
      navigate("/login")
    }
  }

  const isActive = (path: string) => location.pathname === path ? "text-[var(--accent)]" : "text-[var(--text-muted)] hover:text-[var(--text)]";

  return (
    <div className="w-full border-b border-[var(--border)] bg-[var(--surface)] px-6 py-3 flex items-center justify-between z-50 relative">

      {/* Left: Logo */}
      <div className="flex items-center gap-8">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          <div className="w-6 h-6 rounded bg-gradient-to-br from-[var(--accent)] to-purple-800 flex items-center justify-center text-white font-bold text-xs">
            R
          </div>
          <span className="text-lg font-bold text-[var(--accent)] hidden sm:block">
            RoundOne
          </span>
        </div>

        {/* Center: Navigation Links (Only show if logged in) */}
        {user && (
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link to="/dashboard" className={`transition-colors ${isActive('/dashboard') ? 'text-[var(--accent)]' : 'text-[var(--text-muted)] hover:text-[var(--text)]'}`}>
              Dashboard
            </Link>

            <Link to="/resume-upload" className={`transition-colors ${isActive('/resume-upload') || isActive('/onboarding') || isActive('/interview') ? 'text-[var(--accent)]' : 'text-[var(--text-muted)] hover:text-[var(--text)]'}`}>
              Mock Interview
            </Link>
            <Link to="/ats-check" className={`transition-colors ${isActive('/ats-check')}`}>
              ATS Checker
            </Link>
            <Link to="/learning" className={`transition-colors ${isActive('/learning') ? 'text-[var(--accent)]' : 'text-[var(--text-muted)] hover:text-[var(--text)]'}`}>
              Learning Hub
            </Link>
          </div>
        )}
      </div>

      {/* Right: User Info, Donate & Logout */}
      <div className="flex items-center gap-4">
        {user && (
          <>
            {/* The Buy Me A Coffee Icon */}
            <a
              href="https://buymeachai.ezee.li/supreme_1"
              target="_blank"
              rel="noopener noreferrer"
              title="Support this project"
              className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-[var(--bg)] border border-[var(--border)] text-lg hover:border-orange-500 hover:bg-orange-500/10 transition-colors"
            >
              ☕
            </a>

            <span className="text-sm font-medium text-[var(--text)] bg-[var(--bg)] px-3 py-1 rounded-full border border-[var(--border)]">
              {user.name.split(' ')[0]}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-[var(--danger)] hover:text-[var(--danger)]/80 transition-colors"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default Navbar
