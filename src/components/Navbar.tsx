import { useNavigate, Link, useLocation } from "react-router-dom"
import useUserStore from "@/store/authStore"
import { logout } from "@/services/api"

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation() // To highlight the active tab
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

  // Helper to highlight the active tab
  const isActive = (path: string) => location.pathname === path ? "text-[var(--accent)]" : "text-[var(--text-muted)] hover:text-[var(--text)]";

  return (
    <div className="w-full border-b border-[var(--border)] bg-[var(--surface)] px-6 py-3 flex items-center justify-between">
      
      {/* Left: Logo */}
      <div className="flex items-center gap-8">
        <span
          className="text-lg font-bold text-[var(--accent)] cursor-pointer"
          onClick={() => navigate("/resume-upload")}
        >
          RoundOne
        </span>

        {/* Center: Navigation Links (Only show if logged in) */}
        {user && (
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link to="/resume-upload" className={`transition-colors ${isActive('/resume-upload') || isActive('/onboarding') || isActive('/interview') ? 'text-[var(--accent)]' : 'text-[var(--text-muted)] hover:text-[var(--text)]'}`}>
              Mock Interview
            </Link>
            <Link to="/ats-check" className={`transition-colors ${isActive('/ats-check')}`}>
              ATS Checker
            </Link>
          </div>
        )}
      </div>

      {/* Right: User Info & Logout */}
      <div className="flex items-center gap-4">
        {user && (
          <>
            <span className="text-sm font-medium text-[var(--text)] bg-[var(--bg)] px-3 py-1 rounded-full border border-[var(--border)]">
              {user.name.trim().split(" ")[0]}
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
