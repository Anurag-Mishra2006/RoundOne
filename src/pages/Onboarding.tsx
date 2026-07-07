import { interviewStart } from "@/services/api";
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import useSessionStore from "@/store/sessionStore";
import Navbar from "@/components/Navbar";

function Onboarding() {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [level, setLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner")
  const [language, setLanguage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const setSession = useSessionStore((state) => state.setSession);

  const handleSubmit = async () => {
    setError("")
    if (!company || !role || !language) {
      setError("Please fill all fields")
      return
    }
    try {
      setLoading(true)
      const response = await interviewStart({ company, role, level, language });
      if (response.status != 200) {
        setError("Something went wrong");
        return;
      }
      setSession({
        company,
        role,
        level,
        hr: response.data.hr,
        technical: response.data.technical,
        dsa: response.data.dsa
      })
      navigate("/interview");
    } catch (error: any) {
      setError(error?.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
    <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-4">
        <div className="w-full max-w-md">

          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold text-[var(--text)]">
              Set Up Your Interview
            </h1>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              Tell us where you're applying — we'll tailor every question to your profile.
            </p>
          </div>

          <div className="space-y-4">

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[var(--text)]">
                Target Company
              </label>
              <input
                type="text"
                placeholder="e.g. Amazon"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[var(--text)]">
                Target Role
              </label>
              <input
                type="text"
                placeholder="e.g. SDE-1"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[var(--text)]">
                Difficulty Level
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as "beginner" | "intermediate" | "advanced")}
                className="w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[var(--text)]">
                Coding Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              >
                <option value="">Select language</option>
                <option value="C++">C++</option>
                <option value="Python">Python</option>
                <option value="Java">Java</option>
                <option value="JavaScript">JavaScript</option>
              </select>
            </div>

            {error && (
              <p className="text-sm text-[var(--danger)]">{error}</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--accent-hover)] disabled:opacity-50 transition-colors"
            >
              {loading ? "Setting up your interview..." : "Start Interview"}
            </button>

          </div>
        </div>
      </div>
    </>
  )
}

export default Onboarding
