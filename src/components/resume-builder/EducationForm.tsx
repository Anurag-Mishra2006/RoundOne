import useResumeBuilderStore from "@/store/resumeBuilderStore";

export default function EducationForm() {
  const { education, coursework, addEducation, updateEducation, removeEducation, updateCoursework } = useResumeBuilderStore();

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Education</h2>
        <p className="text-sm text-[var(--text-muted)]">Add your academic background. Start with your highest degree.</p>
      </div>

      {education.map((edu, index) => (
        <div key={edu.id} className="p-6 bg-[var(--surface)] border border-[var(--border)] rounded-xl relative group transition-all hover:border-[var(--accent)]/50">
          <button onClick={() => removeEducation(edu.id)} className="absolute top-4 right-4 text-[var(--danger)] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[var(--danger)]/10 p-2 rounded-md">🗑️</button>
          
          <h3 className="text-lg font-bold text-white mb-4 border-b border-[var(--border)] pb-2">Institution {index + 1}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-xs font-bold uppercase text-[var(--text-muted)]">Institution Name</label>
              <input value={edu.institution} onChange={(e) => updateEducation(edu.id, "institution", e.target.value)} placeholder="e.g. Stanford University" className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]" />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase text-[var(--text-muted)]">Type</label>
              <select value={edu.type} onChange={(e) => updateEducation(edu.id, "type", e.target.value as any)} className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]">
                <option value="University">University / College</option>
                <option value="School">School (10th/12th)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase text-[var(--text-muted)]">Degree / Board</label>
              <input value={edu.degree} onChange={(e) => updateEducation(edu.id, "degree", e.target.value)} placeholder={edu.type === "University" ? "e.g. B.Tech in IT" : "e.g. XII (ISC)"} className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]" />
            </div>

            {/* If it's a university, show Start Date. If School, hide it. */}
            {edu.type === "University" && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase text-[var(--text-muted)]">Start Date</label>
                  <input value={edu.startDate || ""} onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)} placeholder="e.g. Aug 2024" className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]" />
                </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase text-[var(--text-muted)]">{edu.type === "University" ? "End Date (or Expected)" : "Year of Passing"}</label>
              <input value={edu.endDate} onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)} placeholder={edu.type === "University" ? "e.g. May 2028" : "e.g. 2024"} className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]" />
            </div>

            <div className="flex gap-2 w-full md:col-span-2">
                <div className="flex flex-col gap-1.5 w-1/3">
                <label className="text-xs font-bold uppercase text-[var(--text-muted)]">Score Type</label>
                <select value={edu.scoreType} onChange={(e) => updateEducation(edu.id, "scoreType", e.target.value)} className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]">
                    <option value="CGPA">CGPA</option>
                    <option value="Percentage">Percentage</option>
                </select>
                </div>
                <div className="flex flex-col gap-1.5 w-1/3">
                <label className="text-xs font-bold uppercase text-[var(--text-muted)]">Score</label>
                <input value={edu.score} onChange={(e) => updateEducation(edu.id, "score", e.target.value)} placeholder={edu.scoreType === "CGPA" ? "e.g. 9.5" : "e.g. 92"} className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]" />
                </div>
                <div className="flex flex-col gap-1.5 w-1/3">
                <label className="text-xs font-bold uppercase text-[var(--text-muted)]">Max Score</label>
                <input value={edu.maxScore} onChange={(e) => updateEducation(edu.id, "maxScore", e.target.value)} placeholder={edu.scoreType === "CGPA" ? "e.g. 10.0" : "e.g. 100"} className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]" />
                </div>
            </div>

          </div>
        </div>
      ))}

      <button onClick={addEducation} className="w-full py-4 border-2 border-dashed border-[var(--border)] rounded-xl text-[var(--text-muted)] font-bold hover:text-white hover:border-[var(--accent)] transition-colors flex items-center justify-center gap-2">
        <span>+</span> Add Education
      </button>

      {/* Global Coursework Section */}
      <div className="mt-8 pt-8 border-t border-[var(--border)]">
         <h2 className="text-xl font-bold text-white mb-1">Relevant Coursework</h2>
         <p className="text-sm text-[var(--text-muted)] mb-4">A comma-separated list of college courses relevant to the jobs you are applying for.</p>
         <textarea 
            value={coursework} 
            onChange={(e) => updateCoursework(e.target.value)} 
            rows={2} 
            placeholder="e.g. Data Structures, Algorithms Analysis, Operating Systems, DBMS"
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)] resize-none" 
          />
      </div>
    </div>
  );
}
