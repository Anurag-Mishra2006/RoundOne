import useResumeBuilderStore from "@/store/resumeBuilderStore";

export default function PersonalInfoForm() {
  const { personalInfo, targetRole, updatePersonalInfo, updateGlobalField } = useResumeBuilderStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updatePersonalInfo(e.target.name, e.target.value);
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* Target Role Config */}
      <div className="p-6 bg-[var(--surface)] border border-[var(--border)] rounded-2xl relative group transition-all hover:border-[var(--accent)]/50 shadow-lg">
        <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2"><span>🎯</span> Target Role</h2>
        <p className="text-xs text-[var(--text-muted)] mb-4">We use this to guide the AI when writing your project bullet points and ATS analysis.</p>
        
        <div className="flex flex-col gap-1.5">
          <input 
            value={targetRole || ""} 
            onChange={(e) => updateGlobalField("targetRole", e.target.value)} 
            placeholder="e.g. SDE-1, Frontend Developer, Product Manager" 
            className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)] transition-all" 
          />
        </div>
      </div>

      {/* Personal Details */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Personal Details</h2>
        <p className="text-sm text-[var(--text-muted)] mb-6">This is the header of your resume. Ensure your links are professional.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Full Name</label>
            <input 
              name="fullName" 
              value={personalInfo.fullName} 
              onChange={handleChange} 
              placeholder="e.g. John Doe" 
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)] transition-all shadow-sm" 
            />
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Location (City, Country)</label>
            <input 
              name="location" 
              value={personalInfo.location} 
              onChange={handleChange} 
              placeholder="e.g. Gorakhpur, India" 
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)] transition-all shadow-sm" 
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Phone Number</label>
            <input 
              name="phone" 
              value={personalInfo.phone} 
              onChange={handleChange} 
              placeholder="e.g. +91 9876543210" 
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)] transition-all shadow-sm" 
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Email Address</label>
            <input 
              name="email" 
              value={personalInfo.email} 
              onChange={handleChange} 
              placeholder="e.g. name@example.com" 
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)] transition-all shadow-sm" 
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">LinkedIn URL</label>
            <input 
              name="linkedin" 
              value={personalInfo.linkedin} 
              onChange={handleChange} 
              placeholder="e.g. linkedin.com/in/johndoe" 
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)] transition-all shadow-sm" 
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">GitHub URL</label>
            <input 
              name="github" 
              value={personalInfo.github} 
              onChange={handleChange} 
              placeholder="e.g. github.com/johndoe" 
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)] transition-all shadow-sm" 
            />
          </div>

          {/* NEW PORTFOLIO FIELD */}
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Portfolio Website (Optional)</label>
            <input 
              name="portfolio" 
              value={personalInfo.portfolio || ""} 
              onChange={handleChange} 
              placeholder="e.g. johnDoe.profile.dev" 
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)] transition-all shadow-sm" 
            />
          </div>

        </div>
      </div>
      
    </div>
  );
}
