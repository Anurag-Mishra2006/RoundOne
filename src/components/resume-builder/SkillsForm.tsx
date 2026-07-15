import useResumeBuilderStore from "@/store/resumeBuilderStore";

export default function SkillsForm() {
  const { skills, addSkillCategory, updateSkillCategory, removeSkillCategory } = useResumeBuilderStore();

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Technical Skills</h2>
        <p className="text-sm text-[var(--text-muted)] mb-6">Group your skills into categories. You can add or remove categories as needed.</p>
      </div>

      <div className="space-y-4">
        {skills.map((skill) => (
           <div key={skill.id} className="flex flex-col md:flex-row gap-3 items-start md:items-center">
             
             <div className="w-full md:w-1/3">
                <input 
                    value={skill.category} 
                    onChange={(e) => updateSkillCategory(skill.id, "category", e.target.value)} 
                    placeholder="Category (e.g. AI/ML)" 
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm font-bold text-[var(--text)] outline-none focus:border-[var(--accent)] transition-all" 
                />
             </div>
             
             <div className="w-full md:w-full flex gap-2">
                <input 
                    value={skill.items} 
                    onChange={(e) => updateSkillCategory(skill.id, "items", e.target.value)} 
                    placeholder="Comma separated items (e.g. TensorFlow, PyTorch)" 
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)] transition-all" 
                />
                {/* Trash can to delete a category if they don't want it! */}
                <button onClick={() => removeSkillCategory(skill.id)} className="px-4 bg-[var(--danger)]/10 text-[var(--danger)] rounded-lg hover:bg-[var(--danger)]/20 transition-colors">
                    🗑️
                </button>
             </div>
           </div>
        ))}
      </div>

      <button onClick={addSkillCategory} className="w-full py-4 border-2 border-dashed border-[var(--border)] rounded-xl text-[var(--text-muted)] font-bold hover:text-white hover:border-[var(--accent)] transition-colors flex items-center justify-center gap-2 mt-4">
        <span>+</span> Add Custom Category
      </button>
    </div>
  );
}
