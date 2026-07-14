import useResumeBuilderStore from "@/store/resumeBuilderStore";
import { useState } from "react";
import { enhanceBullets } from "@/services/api";

export default function ProjectsForm() {
  const { projects, addProject, updateProject, updateProjectBulk, removeProject } = useResumeBuilderStore();

  const [loadingProjectId, setLoadingProjectId] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

  const handleGenerateBullets = async (projectId: string, techStack: string, brainDump: string, userFeedback?: string) => {
    setError("");
    if (!techStack || !brainDump) {
      setError("Please provide both Tech Stack and a Project Description first.");
      return;
    }

    try {
      setLoadingProjectId(projectId);

      const response = await enhanceBullets({ techStack, brainDump, userFeedback });
      const { status, followUpQuestion, bullets } = response.data;

      if (status === "needs_info") {
        // AI needs more info! Show the chat bubble.
        updateProject(projectId, "followUpQuestion", followUpQuestion);
        updateProject(projectId, "bullets", []); // Clear bullets just in case
      } else if (status === "success") {
        updateProjectBulk(projectId, {
          bullets: bullets,
          followUpQuestion: "",
          userFeedback: ""
        });
      } else {
        setError("Failed to generate bullets.");
      }

    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.error || "AI Service Unavailable.");
    } finally {
      setLoadingProjectId(null);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Projects</h2>
        <p className="text-sm text-[var(--text-muted)]">Showcase your best work. Use our AI to turn a rough brain-dump into FAANG-level bullets.</p>
      </div>

      {error && (
        <div className="p-3 rounded-md bg-[var(--danger)]/10 border border-[var(--danger)]/20 text-center">
          <p className="text-sm font-medium text-[var(--danger)]">{error}</p>
        </div>
      )}

      {projects.map((project, index) => (
        <div key={project.id} className="p-6 bg-[var(--surface)] border border-[var(--border)] rounded-2xl relative group transition-all hover:border-[var(--accent)]/50 shadow-lg">

          <button
            onClick={() => removeProject(project.id)}
            className="absolute top-4 right-4 text-[var(--danger)] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[var(--danger)]/10 p-2 rounded-md"
            title="Remove Project"
          >
            🗑️
          </button>

          <h3 className="text-lg font-bold text-white mb-5 border-b border-[var(--border)] pb-3">Project {index + 1}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Project Title</label>
              <input value={project.title} onChange={(e) => updateProject(project.id, "title", e.target.value)} placeholder="e.g. Full-Stack E-Commerce" className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-2.5 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Tech Stack</label>
              <input value={project.techStack} onChange={(e) => updateProject(project.id, "techStack", e.target.value)} placeholder="e.g. React, Node.js, PostgreSQL" className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-2.5 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Start Date</label>
              <input value={project.startDate} onChange={(e) => updateProject(project.id, "startDate", e.target.value)} placeholder="e.g. Jan 2023" className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-2.5 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">End Date</label>
              <input value={project.endDate} onChange={(e) => updateProject(project.id, "endDate", e.target.value)} placeholder="e.g. Present" className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-2.5 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">GitHub URL</label>
              <input value={project.githubUrl} onChange={(e) => updateProject(project.id, "githubUrl", e.target.value)} placeholder="github.com/..." className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-2.5 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Live URL (Optional)</label>
              <input value={project.liveUrl} onChange={(e) => updateProject(project.id, "liveUrl", e.target.value)} placeholder="yourproject.com" className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-2.5 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]" />
            </div>
          </div>

          {/* The Brain Dump Section */}
          <div className="flex flex-col gap-2 mt-6 border-t border-[var(--border)] pt-5">
            <label className="text-sm font-bold uppercase tracking-wider text-[var(--accent)] flex items-center gap-2">
              <span>🧠</span> The Brain Dump
            </label>
            <p className="text-xs text-[var(--text-muted)] mb-2">Explain what you built, any challenges you faced, and the business impact. Don't worry about formatting.</p>
            <textarea
              value={project.brainDump}
              onChange={(e) => updateProject(project.id, "brainDump", e.target.value)}
              rows={3}
              placeholder="I built a blog app where users can login. It was hard to figure out JWTs but I got it working. It loads pretty fast."
              className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)] resize-none"
            />

            {/* ONLY SHOW THIS BUTTON IF AI HASN'T ASKED A FOLLOW UP YET */}
            {!project.followUpQuestion && (
              <button
                onClick={() => handleGenerateBullets(project.id, project.techStack, project.brainDump)}
                disabled={loadingProjectId === project.id}
                className="mt-3 w-full py-3 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] font-bold border border-[var(--accent)]/30 hover:bg-[var(--accent)] hover:text-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loadingProjectId === project.id ? "✨ Analyzing Project..." : "✨ Generate Professional Bullets"}
              </button>
            )}
          </div>

          {/* THE AI INTERROGATION UI */}
          {project.followUpQuestion && (
            <div className="mt-5 p-5 bg-blue-500/10 border border-blue-500/30 rounded-xl space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🤖</span>
                <div>
                  <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">AI Architect needs more info</p>
                  <p className="text-sm text-blue-100 leading-relaxed">{project.followUpQuestion}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 mt-2">
                <input
                  value={project.userFeedback || ""}
                  onChange={(e) => updateProject(project.id, "userFeedback", e.target.value)}
                  placeholder="Type your reply here..."
                  className="flex-grow rounded-xl border border-blue-500/30 bg-[var(--bg)] px-4 py-2.5 text-sm text-[var(--text)] outline-none focus:border-blue-500"
                />
                <button
                  onClick={() => handleGenerateBullets(project.id, project.techStack, project.brainDump, project.userFeedback)}
                  disabled={loadingProjectId === project.id || !project.userFeedback}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 whitespace-nowrap"
                >
                  {loadingProjectId === project.id ? "..." : "Reply & Generate"}
                </button>
              </div>
            </div>
          )}

          {/* The Editable AI Result Section */}
          {project.bullets && project.bullets.length > 0 && (
            <div className="mt-6 p-5 bg-[var(--success)]/10 border border-[var(--success)]/30 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold uppercase tracking-wider text-[var(--success)] flex items-center gap-2">
                  <span>✅</span> Final Resume Bullets
                </label>
              </div>
              <p className="text-xs text-[var(--text-muted)] mb-4">
                Review and edit your bullets below. <b className="text-[var(--warning)]">Replace any [Bracketed Placeholders] with real numbers</b> before downloading!
              </p>

              <textarea
                value={project.bullets.join("\n")}
                onChange={(e) => updateProject(project.id, "bullets", e.target.value.split("\n"))}
                rows={5}
                className="w-full rounded-xl border border-[var(--success)]/50 bg-[var(--bg)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--success)] resize-y font-mono leading-relaxed"
              />
            </div>
          )}

        </div>
      ))}

      <button
        onClick={addProject}
        className="w-full py-4 border-2 border-dashed border-[var(--border)] rounded-xl text-[var(--text-muted)] font-bold hover:text-white hover:border-[var(--accent)] transition-colors flex items-center justify-center gap-2"
      >
        <span>+</span> Add Another Project
      </button>

    </div>
  );
}
