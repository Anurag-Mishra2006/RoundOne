  import useResumeBuilderStore from "@/store/resumeBuilderStore";

  export default function ExperienceForm() {
    const { experience, addExperience, updateExperience, removeExperience } = useResumeBuilderStore();

    return (
      <div className="space-y-8 pb-10">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Work Experience</h2>
          <p className="text-sm text-[var(--text-muted)]">Include Internships and Full-Time roles.</p>
        </div>

        {experience.map((exp, index) => (
          <div key={exp.id} className="p-6 bg-[var(--surface)] border border-[var(--border)] rounded-xl relative group transition-all hover:border-[var(--accent)]/50">
            <button onClick={() => removeExperience(exp.id)} className="absolute top-4 right-4 text-[var(--danger)] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[var(--danger)]/10 p-2 rounded-md">🗑️</button>
            
            <h3 className="text-lg font-bold text-white mb-4 border-b border-[var(--border)] pb-2">Experience {index + 1}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase text-[var(--text-muted)]">Company Name</label>
                <input value={exp.company} onChange={(e) => updateExperience(exp.id, "company", e.target.value)} placeholder="e.g. Google" className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]" />
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase text-[var(--text-muted)]">Role / Title</label>
                <input value={exp.role} onChange={(e) => updateExperience(exp.id, "role", e.target.value)} placeholder="e.g. Software Engineering Intern" className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase text-[var(--text-muted)]">Start Date</label>
                <input value={exp.startDate} onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)} placeholder="e.g. May 2023" className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]" />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase text-[var(--text-muted)]">End Date</label>
                  <label className="flex items-center gap-1.5 text-xs text-white cursor-pointer">
                      <input type="checkbox" checked={exp.isCurrent} onChange={(e) => updateExperience(exp.id, "isCurrent", e.target.checked)} className="accent-[var(--accent)]" />
                      I currently work here
                  </label>
                </div>
                <input value={exp.isCurrent ? "Present" : exp.endDate} disabled={exp.isCurrent} onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)} placeholder="e.g. Aug 2023" className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)] disabled:opacity-50" />
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2 mt-2 border-t border-[var(--border)] pt-4">
                <label className="text-xs font-bold uppercase text-[var(--text-muted)]">Responsibilities & Impact (1 per line)</label>
                <textarea 
                  value={exp.bullets.join("\n")} 
                  onChange={(e) => updateExperience(exp.id, "bullets", e.target.value.split("\n"))} 
                  rows={5}
                  placeholder={"- Developed REST APIs in Node.js\n- Reduced load time by 20%"} 
                  className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)] resize-none font-mono" 
                />
              </div>
            </div>
          </div>
        ))}

        <button onClick={addExperience} className="w-full py-4 border-2 border-dashed border-[var(--border)] rounded-xl text-[var(--text-muted)] font-bold hover:text-white hover:border-[var(--accent)] transition-colors flex items-center justify-center gap-2">
          <span>+</span> Add Experience
        </button>
      </div>
    );
  }
