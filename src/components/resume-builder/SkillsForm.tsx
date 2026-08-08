import useResumeBuilderStore from "@/store/resumeBuilderStore";

export default function SkillsForm() {
  const { skills, addSkillCategory, updateSkillCategory, removeSkillCategory } = useResumeBuilderStore();

  return (
    <div className="space-y-6 pb-24 lg:pb-10">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 bg-[var(--accent)]/10 border border-[var(--accent)]/20 rounded-lg text-[var(--accent)]">
            {/* Terminal / Code Brackets SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white">Technical Skills</h2>
        </div>
        <p className="text-sm text-[var(--text-muted)] mt-2 mb-6">Group your skills into categories.</p>
      </div>

      <div className="space-y-4">
        {skills.map((skill) => (
           <div key={skill.id} className="flex flex-col md:flex-row gap-3 items-start md:items-center bg-[var(--surface)] md:bg-transparent p-4 md:p-0 rounded-xl border border-[var(--border)] md:border-none shadow-sm md:shadow-none">
             
             <div className="w-full md:w-1/3">
                <input 
                    value={skill.category} 
                    onChange={(e) => updateSkillCategory(skill.id, "category", e.target.value)} 
                    placeholder="Category (e.g. AI/ML)" 
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] md:bg-[var(--surface)] px-4 py-3 text-sm font-bold text-[var(--text)] outline-none focus:border-[var(--accent)] transition-all" 
                />
             </div>
             
             <div className="w-full md:w-full flex gap-2 group">
                <input 
                    value={skill.items} 
                    onChange={(e) => updateSkillCategory(skill.id, "items", e.target.value)} 
                    placeholder="Comma separated (e.g. React, Vue)" 
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] md:bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)] transition-all" 
                />
                
                {/* Touch friendly delete button with SVG */}
                <button 
                  onClick={() => removeSkillCategory(skill.id)} 
                  title="Remove Category"
                  className="px-4 bg-[var(--danger)]/10 text-[var(--danger)] rounded-lg hover:bg-[var(--danger)] hover:text-white transition-all flex items-center justify-center min-w-[50px]"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                </button>
             </div>
           </div>
        ))}
      </div>

      <button 
        onClick={addSkillCategory} 
        className="w-full py-4 border-2 border-dashed border-[var(--border)] rounded-xl text-[var(--text-muted)] font-bold hover:text-white hover:border-[var(--accent)] hover:bg-[var(--accent)]/5 transition-all duration-200 flex items-center justify-center gap-2 mt-4 group"
      >
        {/* Bold Plus SVG */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 group-hover:scale-110 transition-transform">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Add Custom Category
      </button>
    </div>
  );
}
