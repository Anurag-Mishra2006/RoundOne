import useResumeBuilderStore from "@/store/resumeBuilderStore";

export default function PersonalInfoForm() {
  const { personalInfo, targetRole, targetCompany, updatePersonalInfo, updateGlobalField } = useResumeBuilderStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updatePersonalInfo(e.target.name, e.target.value);
  };

  return (
    <div className="space-y-8">
      
      {/* NEW: Target Info for the AI */}
      <div className="p-5 bg-blue-500/10 border border-blue-500/30 rounded-xl">
        <h2 className="text-lg font-bold text-blue-400 mb-1 flex items-center gap-2"><span>🎯</span> Interview Target</h2>
        <p className="text-xs text-[var(--text-muted)] mb-4">We use this to optimize your keywords and AI bullet generation.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase text-[var(--text-muted)]">Target Role</label>
            <input value={targetRole || ""} onChange={(e) => updateGlobalField("targetRole", e.target.value)} placeholder="e.g. SDE-1, Product Manager" className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-blue-500" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase text-[var(--text-muted)]">Target Company</label>
            <input value={targetCompany || ""} onChange={(e) => updateGlobalField("targetCompany", e.target.value)} placeholder="e.g. Google, Amazon, Startup" className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-blue-500" />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Personal Details</h2>
        <p className="text-sm text-[var(--text-muted)] mb-6">This is the header of your resume. Keep it professional.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Full Name</label>
          <input name="fullName" value={personalInfo.fullName} onChange={handleChange} placeholder="e.g. John Doe" className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)] transition-all" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Location (City, Country)</label>
          <input name="location" value={personalInfo.location} onChange={handleChange} placeholder="Gorakhpur, India" className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)] transition-all" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Phone Number</label>
          <input name="phone" value={personalInfo.phone} onChange={handleChange} placeholder="+91 9876543210" className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)] transition-all" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Email</label>
          <input name="email" value={personalInfo.email} onChange={handleChange} placeholder="name@example.com" className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)] transition-all" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">LinkedIn URL</label>
          <input name="linkedin" value={personalInfo.linkedin} onChange={handleChange} placeholder="linkedin.com/in/johndoe" className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)] transition-all" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">GitHub URL</label>
          <input name="github" value={personalInfo.github} onChange={handleChange} placeholder="github.com/johndoe" className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)] transition-all" />
        </div>
      </div>
    </div>
  );
}
