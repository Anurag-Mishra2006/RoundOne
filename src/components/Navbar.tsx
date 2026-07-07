import { Link, useLocation, useNavigate } from "react-router-dom";
import useUserStore from "@/store/authStore";
import { logout } from "@/services/api";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, clearUser } = useUserStore();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Backend logout failed:", error);
    } finally {
      clearUser();
      navigate("/login");
    }
  };

  // Returns true if the current route matches the given path
  const isActive = (path: string) => location.pathname === path;

  // Routes that belong to the Mock Interview flow
  const interviewRoutes = [
    "/resume-upload",
    "/onboarding",
    "/interview",
  ];

  const isInterviewPage = interviewRoutes.includes(location.pathname);

  const navLinkClasses = (active: boolean) =>
    `transition-colors ${
      active
        ? "text-[var(--accent)]"
        : "text-[var(--text-muted)] hover:text-[var(--text)]"
    }`;

  return (
    <nav className="w-full border-b border-[var(--border)] bg-[var(--surface)] px-6 py-3 flex items-center justify-between">
      {/* Left */}
      <div className="flex items-center gap-8">
        <Link
          to="/dashboard"
          className="text-lg font-bold text-[var(--accent)]"
        >
          RoundOne
        </Link>

        {user && (
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              to="/dashboard"
              className={navLinkClasses(isActive("/dashboard"))}
            >
              Dashboard
            </Link>

            <Link
              to="/resume-upload"
              className={navLinkClasses(isInterviewPage)}
            >
              Mock Interview
            </Link>

            <Link
              to="/ats-check"
              className={navLinkClasses(isActive("/ats-check"))}
            >
              ATS Checker
            </Link>
             <Link to="/learning" className={`transition-colors ${isActive('/learning') ? 'text-[var(--accent)]' : 'text-[var(--text-muted)] hover:text-[var(--text)]'}`}>
              Learning Hub
            </Link>
          </div>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {user && (
          <>
            <span className="rounded-full border border-[var(--border)] bg-[var(--bg)] px-3 py-1 text-sm font-medium text-[var(--text)]">
              {user.name?.trim().split(" ")[0] ?? "User"}
            </span>

            <button
              onClick={handleLogout}
              className="text-sm font-medium text-[var(--danger)] transition-colors hover:text-[var(--danger)]/80"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
