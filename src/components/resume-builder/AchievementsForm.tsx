import useResumeBuilderStore from "@/store/resumeBuilderStore";

export default function AchievementsForm() {
  const { achievements, addAchievement, updateAchievement, removeAchievement } = useResumeBuilderStore();

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Achievements & Leadership</h2>
        <p className="text-sm text-[var(--text-muted)]">List your Hackathon wins, ICPC ranks, Codeforces ratings, or club leadership.</p>
      </div>

      {achievements.map((ach, index) => (
        <div key={ach.id} className="p-6 bg-[var(--surface)] border border-[var(--border)] rounded-xl relative group transition-all hover:border-[var(--accent)]/50">
          <button onClick={() => removeAchievement(ach.id)} className="absolute top-4 right-4 text-[var(--danger)] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[var(--danger)]/10 p-2 rounded-md">🗑️</button>
          
          <h3 className="text-lg font-bold text-white mb-4 border-b border-[var(--border)] pb-2">Achievement {index + 1}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-xs font-bold uppercase text-[var(--text-muted)]">Title (Bolded)</label>
              <input value={ach.title} onChange={(e) => updateAchievement(ach.id, "title", e.target.value)} placeholder="e.g. Codeforces OR Team Lead, ICPC 2025" className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]" />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase text-[var(--text-muted)]">Subtitle (Normal Text)</label>
              <input value={ach.subtitle} onChange={(e) => updateAchievement(ach.id, "subtitle", e.target.value)} placeholder="e.g. Pupil | Max-Rating 1368" className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase text-[var(--text-muted)]">Link (Optional)</label>
              <input value={ach.link} onChange={(e) => updateAchievement(ach.id, "link", e.target.value)} placeholder="e.g. codeforces.com/profile/..." className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]" />
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2 mt-2 border-t border-[var(--border)] pt-4">
              <label className="text-xs font-bold uppercase text-[var(--text-muted)]">Description Bullets (1 per line)</label>
              <textarea 
                value={ach.bullets.join("\n")} 
                onChange={(e) => updateAchievement(ach.id, "bullets", e.target.value.split("\n"))} 
                rows={3}
                placeholder={"- Solved over 300+ questions\n- Achieved global rank 1465 / 32,000"} 
                className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)] resize-none font-mono" 
              />
            </div>
          </div>
        </div>
      ))}

      <button onClick={addAchievement} className="w-full py-4 border-2 border-dashed border-[var(--border)] rounded-xl text-[var(--text-muted)] font-bold hover:text-white hover:border-[var(--accent)] transition-colors flex items-center justify-center gap-2">
        <span>+</span> Add Achievement
      </button>
    </div>
  );
}
