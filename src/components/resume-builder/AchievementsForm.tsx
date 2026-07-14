import useResumeBuilderStore from "@/store/resumeBuilderStore";

export default function AchievementsForm() {
  const { achievements, addAchievement, updateAchievement, removeAchievement } = useResumeBuilderStore();

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Achievements & Leadership</h2>
        <p className="text-sm text-[var(--text-muted)]">
          Highlight awards, certifications, competitions, leadership roles, scholarships, or other notable accomplishments.</p>
      </div>

      {achievements.map((ach, index) => (
        <div key={ach.id} className="p-6 bg-[var(--surface)] border border-[var(--border)] rounded-2xl relative group transition-all hover:border-[var(--accent)]/50 shadow-lg">

          <button
            onClick={() => removeAchievement(ach.id)}
            className="absolute top-4 right-4 text-[var(--danger)] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[var(--danger)]/10 p-2 rounded-md"
            title="Remove Achievement"
          >
            🗑️
          </button>

          <h3 className="text-lg font-bold text-white mb-5 border-b border-[var(--border)] pb-3">Achievement {index + 1}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Title (Bolded)</label>
              <input
                value={ach.title}
                onChange={(e) => updateAchievement(ach.id, "title", e.target.value)}
                placeholder="e.g. Dean's List, Best Intern Award, Team Lead, National Hackathon Finalist"

                className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-2.5 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Subtitle (Normal Text)</label>
              <input
                value={ach.subtitle}
                onChange={(e) => updateAchievement(ach.id, "subtitle", e.target.value)}
                placeholder="e.g. 2025 • Top 5% • Organization Name"
                className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-2.5 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Link (Optional)</label>
              <input
                value={ach.link}
                onChange={(e) => updateAchievement(ach.id, "link", e.target.value)}
                placeholder="e.g. https://example.com/certificate"
                className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-2.5 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 mt-6 border-t border-[var(--border)] pt-5">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Description Bullets (1 per line)</label>
            <textarea
              value={ach.bullets.join("\n")}
              onChange={(e) => updateAchievement(ach.id, "bullets", e.target.value.split("\n"))}
              rows={3}
              placeholder={`- Recognized for outstanding performance among 500+ participants
- Led a team of 6 members to successfully deliver the project`}
              className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)] resize-none font-mono"
            />
          </div>

        </div>
      ))}

      <button
        onClick={addAchievement}
        className="w-full py-4 border-2 border-dashed border-[var(--border)] rounded-xl text-[var(--text-muted)] font-bold hover:text-white hover:border-[var(--accent)] transition-colors flex items-center justify-center gap-2"
      >
        <span>+</span> Add Achievement
      </button>
    </div>
  );
}
