import { useNavigate } from "react-router-dom"
import useUserStore from "@/store/authStore"
import { logout } from "@/services/api"

function Navbar() {
  const navigate = useNavigate()
  const { user, clearUser } = useUserStore()

  const handleLogout = async () => {
    try {
      await logout()
      clearUser()
      navigate("/login")
    } catch {
      clearUser()
      navigate("/login")
    }
  }

  return (
    <div className="w-full border-b border-[var(--border)] bg-[var(--surface)] px-6 py-3 flex items-center justify-between">
      <span
        className="text-sm font-semibold text-[var(--accent)] cursor-pointer"
        onClick={() => navigate("/onboarding")}
      >
        RoundOne
      </span>

      <div className="flex items-center gap-4">
        {user && (
          <span className="text-sm text-[var(--text-muted)]">
            {user.name}
          </span>
        )}
        <button
          onClick={handleLogout}
          className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default Navbar