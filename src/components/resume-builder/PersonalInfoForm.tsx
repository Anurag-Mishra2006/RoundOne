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
        <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2.5">
          {/* Target/Crosshair SVG */}
          <div className="text-[var(--accent)]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          Target Role
        </h2>
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
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 bg-[var(--accent)]/10 border border-[var(--accent)]/20 rounded-lg text-[var(--accent)]">
            {/* ID Card / User Profile SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white">Personal Details</h2>
        </div>
        <p className="text-sm text-[var(--text-muted)] mb-6 mt-2">This is the header of your resume. Ensure your links are professional.</p>

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
