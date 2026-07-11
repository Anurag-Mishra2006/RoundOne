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

  const isActive = (paths: string[]) =>
    paths.some((path) => location.pathname.startsWith(path));

  const navClass = (paths: string[]) =>
    `transition-colors ${isActive(paths)
      ? "text-[var(--accent)]"
      : "text-[var(--text-muted)] hover:text-[var(--text)]"
    }`;

  return (
    <nav className="relative z-50 flex w-full items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-6 py-3">
      {/* Left */}
      <div className="flex items-center gap-8">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2"
        >
          <img src="/logo.svg?v=2" alt="RoundOne" className="w-8 h-8 rounded-lg" />

          <span className="hidden text-lg font-bold text-[var(--accent)] sm:block">
            RoundOne
          </span>
        </button>

        {user && (
          <div className="hidden items-center gap-6 text-sm font-medium md:flex">
            <Link to="/dashboard" className={navClass(["/dashboard"])}>
              Dashboard
            </Link>

            <Link
              to="/resume-upload"
              className={navClass([
                "/resume-upload",
                "/onboarding",
                "/interview",
              ])}
            >
              Mock Interview
            </Link>

            <Link to="/ats-check" className={navClass(["/ats-check"])}>
              ATS Checker
            </Link>

            <Link to="/learning" className={navClass(["/learning"])}>
              Learning Hub
            </Link>
            <Link to="/practice" className={navClass(["/practice"])}>
              Practice
            </Link>
            <Link to="/contact" className={navClass(["/contact"])}>Contact Us</Link>
            <Link to="/about" className={navClass(["/about"])}>About</Link> 
          </div>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {user && (
          <>
            <a
              href="https://buymeachai.ezee.li/supreme_1"
              target="_blank"
              rel="noopener noreferrer"
              title="Buy me a Chai ☕"
              className="hidden h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg)] text-lg transition-colors hover:border-orange-500 hover:bg-orange-500/10 sm:flex"
            >
              ☕
            </a>

            <span className="rounded-full border border-[var(--border)] bg-[var(--bg)] px-3 py-1 text-sm font-medium text-[var(--text)]">
              {user.name.split(" ")[0]}
            </span>

            <button
              type="button"
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
