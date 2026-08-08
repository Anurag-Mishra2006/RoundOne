import useResumeBuilderStore from "@/store/resumeBuilderStore";

export default function AchievementsForm() {
  const { achievements, addAchievement, updateAchievement, removeAchievement } = useResumeBuilderStore();

  return (
    <div className="space-y-8 pb-10">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 bg-[var(--accent)]/10 border border-[var(--accent)]/20 rounded-lg text-[var(--accent)]">
            {/* Premium Trophy SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white">Achievements & Leadership</h2>
        </div>
        <p className="text-sm text-[var(--text-muted)] mt-2">
          Highlight awards, certifications, competitions, leadership roles, scholarships, or other notable accomplishments.
        </p>
      </div>

      {achievements.map((ach, index) => (
        <div key={ach.id} className="p-6 bg-[var(--surface)] border border-[var(--border)] rounded-2xl relative group transition-all hover:border-[var(--accent)]/50 shadow-lg">

          <button
            onClick={() => removeAchievement(ach.id)}
            className="absolute top-4 right-4 text-[var(--danger)] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[var(--danger)]/10 p-2 rounded-md"
            title="Remove Achievement"
          >
            {/* Clean Trash SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
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
              placeholder={`- Recognized for outstanding performance among 500+ participants\n- Led a team of 6 members to successfully deliver the project`}
              className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)] resize-none font-mono"
            />
          </div>

        </div>
      ))}

      <button
        onClick={addAchievement}
        className="w-full py-4 border-2 border-dashed border-[var(--border)] rounded-xl text-[var(--text-muted)] font-bold hover:text-white hover:border-[var(--accent)] hover:bg-[var(--accent)]/5 transition-all duration-200 flex items-center justify-center gap-2 group"
      >
        {/* Bold Plus SVG */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 group-hover:scale-110 transition-transform">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Add Achievement
      </button>
    </div>
  );
}
