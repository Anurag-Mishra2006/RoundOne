import useResumeBuilderStore from "@/store/resumeBuilderStore";

export default function ExperienceForm() {
  const { experience, addExperience, updateExperience, removeExperience } = useResumeBuilderStore();

  return (
    <div className="space-y-8 pb-10">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 bg-[var(--accent)]/10 border border-[var(--accent)]/20 rounded-lg text-[var(--accent)]">
            {/* Briefcase SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white">Work Experience</h2>
        </div>
        <p className="text-sm text-[var(--text-muted)] mt-2">Include Internships and Full-Time roles.</p>
      </div>

      {experience.map((exp, index) => (
        <div key={exp.id} className="p-6 bg-[var(--surface)] border border-[var(--border)] rounded-xl relative group transition-all hover:border-[var(--accent)]/50 shadow-lg">
          
          <button 
            onClick={() => removeExperience(exp.id)} 
            className="absolute top-4 right-4 text-[var(--danger)] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[var(--danger)]/10 p-2 rounded-md"
            title="Remove Experience"
          >
            {/* Clean Trash SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </button>
          
          <h3 className="text-lg font-bold text-white mb-4 border-b border-[var(--border)] pb-2">Experience {index + 1}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Company Name</label>
              <input value={exp.company} onChange={(e) => updateExperience(exp.id, "company", e.target.value)} placeholder="e.g. Google" className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]" />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Role / Title</label>
              <input value={exp.role} onChange={(e) => updateExperience(exp.id, "role", e.target.value)} placeholder="e.g. Software Engineering Intern" className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Start Date</label>
              <input value={exp.startDate} onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)} placeholder="e.g. May 2023" className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]" />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">End Date</label>
                <label className="flex items-center gap-1.5 text-xs text-white cursor-pointer hover:text-[var(--accent)] transition-colors">
                    <input type="checkbox" checked={exp.isCurrent} onChange={(e) => updateExperience(exp.id, "isCurrent", e.target.checked)} className="accent-[var(--accent)] w-3.5 h-3.5" />
                    I currently work here
                </label>
              </div>
              <input value={exp.isCurrent ? "Present" : exp.endDate} disabled={exp.isCurrent} onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)} placeholder="e.g. Aug 2023" className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)] disabled:opacity-50 disabled:cursor-not-allowed" />
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2 mt-2 border-t border-[var(--border)] pt-4">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Responsibilities & Impact (1 per line)</label>
              <textarea 
                value={exp.bullets.join("\n")} 
                onChange={(e) => updateExperience(exp.id, "bullets", e.target.value.split("\n"))} 
                rows={5}
                placeholder={"- Developed REST APIs in Node.js\n- Reduced load time by 20%"} 
                className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)] resize-none font-mono leading-relaxed" 
              />
            </div>
          </div>
        </div>
      ))}

      <button 
        onClick={addExperience} 
        className="w-full py-4 border-2 border-dashed border-[var(--border)] rounded-xl text-[var(--text-muted)] font-bold hover:text-white hover:border-[var(--accent)] hover:bg-[var(--accent)]/5 transition-all duration-200 flex items-center justify-center gap-2 group"
      >
        {/* Bold Plus SVG */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 group-hover:scale-110 transition-transform">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Add Experience
      </button>
    </div>
  );
}
