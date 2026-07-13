import useResumeBuilderStore from "@/store/resumeBuilderStore";
import { useState } from "react";
import { enhanceBullets } from "@/services/api";

export default function ProjectsForm() {
  const { projects, addProject, updateProject, removeProject } = useResumeBuilderStore();
  
  // Track which project is currently loading AI bullets
  const [loadingProjectId, setLoadingProjectId] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

  const handleGenerateBullets = async (projectId: string, techStack: string, brainDump: string) => {
    setError("");
    if (!techStack || !brainDump) {
      setError("Please provide both Tech Stack and a Project Description first.");
      return;
    }

    try {
      setLoadingProjectId(projectId);
      
      // Call the backend route we just wrote!
      const response = await enhanceBullets({ techStack, brainDump });
      
      if (response.status === 200 && response.data.success) {
        // Update the Zustand store with the new, perfect AI bullets
        updateProject(projectId, "bullets", response.data.bullets);
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
        <p className="text-sm text-[var(--text-muted)]">Showcase your best work. Use the AI button to turn your rough description into FAANG-level bullets.</p>
      </div>

      {error && (
        <div className="p-3 rounded-md bg-[var(--danger)]/10 border border-[var(--danger)]/20">
            <p className="text-sm font-medium text-[var(--danger)]">{error}</p>
        </div>
      )}

      {projects.map((project, index) => (
        <div key={project.id} className="p-6 bg-[var(--surface)] border border-[var(--border)] rounded-xl relative group transition-all hover:border-[var(--accent)]/50">
          
          {/* Delete Button */}
          <button 
            onClick={() => removeProject(project.id)}
            className="absolute top-4 right-4 text-[var(--danger)] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[var(--danger)]/10 p-2 rounded-md"
            title="Remove Project"
          >
            🗑️
          </button>

          <h3 className="text-lg font-bold text-white mb-4 border-b border-[var(--border)] pb-2">Project {index + 1}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase text-[var(--text-muted)]">Project Title</label>
              <input value={project.title} onChange={(e) => updateProject(project.id, "title", e.target.value)} placeholder="e.g. Full-Stack E-Commerce" className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase text-[var(--text-muted)]">Tech Stack</label>
              <input value={project.techStack} onChange={(e) => updateProject(project.id, "techStack", e.target.value)} placeholder="e.g. React, Node.js, PostgreSQL" className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase text-[var(--text-muted)]">Start Date</label>
              <input value={project.startDate} onChange={(e) => updateProject(project.id, "startDate", e.target.value)} placeholder="e.g. Jan 2023" className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase text-[var(--text-muted)]">End Date</label>
              <input value={project.endDate} onChange={(e) => updateProject(project.id, "endDate", e.target.value)} placeholder="e.g. Present" className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase text-[var(--text-muted)]">GitHub URL</label>
              <input value={project.githubUrl} onChange={(e) => updateProject(project.id, "githubUrl", e.target.value)} placeholder="github.com/..." className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase text-[var(--text-muted)]">Live URL (Optional)</label>
              <input value={project.liveUrl} onChange={(e) => updateProject(project.id, "liveUrl", e.target.value)} placeholder="yourproject.com" className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]" />
            </div>
          </div>

          {/* The Brain Dump Section */}
          <div className="flex flex-col gap-1.5 mt-6 border-t border-[var(--border)] pt-4">
            <label className="text-xs font-bold uppercase text-[var(--accent)] flex items-center gap-2">
              <span>🧠</span> The Brain Dump
            </label>
            <p className="text-xs text-[var(--text-muted)] mb-2">Explain what you built, any challenges you faced, and business impact. We will turn this into professional bullets.</p>
            <textarea 
              value={project.brainDump} 
              onChange={(e) => updateProject(project.id, "brainDump", e.target.value)} 
              rows={4} 
              placeholder="I built a blog app where users can login. It was hard to figure out JWTs but I got it working. It loads pretty fast."
              className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)] resize-none" 
            />
            
            <button 
              onClick={() => handleGenerateBullets(project.id, project.techStack, project.brainDump)}
              disabled={loadingProjectId === project.id}
              className="mt-2 w-full py-2.5 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] font-bold border border-[var(--accent)]/30 hover:bg-[var(--accent)] hover:text-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loadingProjectId === project.id ? "✨ Analyzing Project..." : "✨ Generate Professional Bullets"}
            </button>
          </div>

           {/* The AI Result Section (NOW EDITABLE!) */}
          {project.bullets.length > 0 && (
            <div className="mt-6 p-4 bg-[var(--success)]/10 border border-[var(--success)]/30 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold uppercase text-[var(--success)] flex items-center gap-2">
                  <span>✅</span> Final Resume Bullets (Edit below)
                </label>
              </div>
              <p className="text-xs text-[var(--text-muted)] mb-3">
                The AI has enhanced your brain-dump. <b className="text-[var(--warning)]">You MUST manually edit the text below</b> to replace any [Bracketed Placeholders] with your real numbers!
              </p>
              
              <textarea 
                value={project.bullets.join("\n")} 
                onChange={(e) => updateProject(project.id, "bullets", e.target.value.split("\n"))} 
                rows={5}
                className="w-full rounded-lg border border-[var(--success)]/50 bg-[var(--bg)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--success)] resize-y font-mono leading-relaxed" 
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
