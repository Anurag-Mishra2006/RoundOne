import useResumeBuilderStore from "@/store/resumeBuilderStore";

export default function ReviewForm() {
  const { projects, sectionOrder, updateSectionOrder } = useResumeBuilderStore();

  const findPlaceholders = () => {
    const issues: { projectTitle: string, bullet: string }[] = [];
    projects.forEach(p => {
      p.bullets.forEach(b => {
        if (b.includes("[") && b.includes("]")) {
          issues.push({ projectTitle: p.title || "Untitled Project", bullet: b });
        }
      });
    });
    return issues;
  };

  const placeholderIssues = findPlaceholders();

  const moveSection = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === sectionOrder.length - 1) return;

    // Create a fresh copy of the array
    const newOrder = [...sectionOrder];
    
    // The element we want to move
    const element = newOrder[index];
    
    // Remove it from current position
    newOrder.splice(index, 1);
    
    // Insert it at new position
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    newOrder.splice(targetIndex, 0, element);
    
    updateSectionOrder(newOrder);
  };

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Final Review</h2>
        <p className="text-sm text-[var(--text-muted)]">Check for errors, reorder your sections, and download your ATS-friendly PDF.</p>
      </div>

      {placeholderIssues.length > 0 ? (
        <div className="p-5 bg-[var(--danger)]/10 border border-[var(--danger)]/30 rounded-xl">
          <h3 className="text-sm font-bold text-[var(--danger)] uppercase tracking-wider mb-3 flex items-center gap-2">
            <span>⚠️</span> Unfinished Placeholders Detected!
          </h3>
          <p className="text-xs text-[var(--text-muted)] mb-4">You have AI-generated placeholders left in your projects. Replace them with real numbers before downloading, or ATS parsers will flag them.</p>
          <ul className="space-y-3">
            {placeholderIssues.map((issue, i) => (
              <li key={i} className="text-sm text-[var(--text)] bg-[var(--bg)]/50 p-3 rounded-lg border border-[var(--danger)]/10">
                <span className="font-bold text-[var(--danger)] block mb-1">{issue.projectTitle}</span>
                <span className="font-mono text-xs opacity-80">{issue.bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="p-4 bg-[var(--success)]/10 border border-[var(--success)]/30 rounded-xl flex items-center gap-3">
            <span className="text-xl">✅</span>
            <p className="text-sm font-bold text-[var(--success)]">Your resume looks clean. No placeholders detected.</p>
        </div>
      )}

      <div>
        <h3 className="text-lg font-bold text-white mb-4">Reorder Sections</h3>
        <p className="text-xs text-[var(--text-muted)] mb-4">If you are an experienced developer, move Projects/Experience up. If you are a student, keep Education at the top.</p>
        
        <div className="space-y-2">
          {sectionOrder.map((section, index) => (
            // Notice we use the section string as the key to prevent render glitches
            <div key={`section-${section}`} className="flex items-center justify-between p-3 bg-[var(--surface)] border border-[var(--border)] rounded-lg">
              <span className="text-sm font-bold text-[var(--text)] capitalize px-2">{section}</span>
              <div className="flex gap-1">
                <button 
                  onClick={() => moveSection(index, 'up')}
                  disabled={index === 0}
                  className="p-1.5 bg-[var(--bg)] rounded hover:text-[var(--accent)] disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                  ▲
                </button>
                <button 
                  onClick={() => moveSection(index, 'down')}
                  disabled={index === sectionOrder.length - 1}
                  className="p-1.5 bg-[var(--bg)] rounded hover:text-[var(--accent)] disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                  ▼
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
