import useResumeBuilderStore from "@/store/resumeBuilderStore";

export default function EducationForm() {
  const { education, coursework, addEducation, updateEducation, removeEducation, updateCoursework } = useResumeBuilderStore();

  return (
    <div className="space-y-8 pb-10">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 bg-[var(--accent)]/10 border border-[var(--accent)]/20 rounded-lg text-[var(--accent)]">
            {/* Academic Cap SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white">Education</h2>
        </div>
        <p className="text-sm text-[var(--text-muted)] mt-2">Add your academic background. Start with your highest degree.</p>
      </div>

      {education.map((edu, index) => (
        <div key={edu.id} className="p-6 bg-[var(--surface)] border border-[var(--border)] rounded-xl relative group transition-all hover:border-[var(--accent)]/50 shadow-lg">
          
          <button 
            onClick={() => removeEducation(edu.id)} 
            className="absolute top-4 right-4 text-[var(--danger)] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[var(--danger)]/10 p-2 rounded-md"
            title="Remove Education"
          >
            {/* Clean Trash SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </button>
          
          <h3 className="text-lg font-bold text-white mb-4 border-b border-[var(--border)] pb-2">Institution {index + 1}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Institution Name</label>
              <input value={edu.institution} onChange={(e) => updateEducation(edu.id, "institution", e.target.value)} placeholder="e.g. Madan Mohan Malaviya University of Technology" className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]" />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Type</label>
              <select value={edu.type} onChange={(e) => updateEducation(edu.id, "type", e.target.value as any)} className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]">
                <option value="University">University / College</option>
                <option value="School">School (10th/12th)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Degree / Board</label>
              <input value={edu.degree} onChange={(e) => updateEducation(edu.id, "degree", e.target.value)} placeholder={edu.type === "University" ? "e.g. B.Tech in IT" : "e.g. XII (CBSE)"} className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]" />
            </div>

            {/* If it's a university, show Start Date. If School, hide it. */}
            {edu.type === "University" && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Start Date</label>
                  <input value={edu.startDate || ""} onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)} placeholder="e.g. Aug 2024" className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]" />
                </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">{edu.type === "University" ? "End Date (or Expected)" : "Year of Passing"}</label>
              <input value={edu.endDate} onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)} placeholder={edu.type === "University" ? "e.g. May 2028" : "e.g. 2024"} className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]" />
            </div>

            <div className="flex gap-2 w-full md:col-span-2">
                <div className="flex flex-col gap-1.5 w-1/3">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Score Type</label>
                <select value={edu.scoreType} onChange={(e) => updateEducation(edu.id, "scoreType", e.target.value)} className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]">
                    <option value="CGPA">CGPA</option>
                    <option value="Percentage">Percentage</option>
                </select>
                </div>
                <div className="flex flex-col gap-1.5 w-1/3">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Score</label>
                <input value={edu.score} onChange={(e) => updateEducation(edu.id, "score", e.target.value)} placeholder={edu.scoreType === "CGPA" ? "e.g. 9.38" : "e.g. 92"} className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]" />
                </div>
                <div className="flex flex-col gap-1.5 w-1/3">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Max Score</label>
                <input value={edu.maxScore} onChange={(e) => updateEducation(edu.id, "maxScore", e.target.value)} placeholder={edu.scoreType === "CGPA" ? "e.g. 10.00" : "e.g. 100"} className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]" />
                </div>
            </div>

          </div>
        </div>
      ))}

      <button 
        onClick={addEducation} 
        className="w-full py-4 border-2 border-dashed border-[var(--border)] rounded-xl text-[var(--text-muted)] font-bold hover:text-white hover:border-[var(--accent)] hover:bg-[var(--accent)]/5 transition-all duration-200 flex items-center justify-center gap-2 group"
      >
        {/* Bold Plus SVG */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 group-hover:scale-110 transition-transform">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Add Education
      </button>

      {/* Global Coursework Section */}
      <div className="mt-8 pt-8 border-t border-[var(--border)]">
         <div className="flex items-center gap-2 mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[var(--text-muted)]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            <h2 className="text-xl font-bold text-white">Relevant Coursework</h2>
         </div>
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
