import { useState } from 'react'
import { checkAtsResume } from "../services/api.js";

interface AtsResult {
    overallScore: number,
    scoreCategory: string,
    criticalIssues: string[],
    sectionScores: Record<string, { score: number; feedback: string }>,
    lineByLineFixes: { originalText: string; suggestedRewrite: string; reason: string }[]
    missingKeywords: string[]

}

function AtsChecker() {
    const [file, setFile] = useState<File | null>(null);
    const [targetRole, setTargetRole] = useState<string>("Software Engineer");
    const [level, setLevel] = useState<string>("Fresher");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState("");
    const [result, setResult] = useState<AtsResult | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            setError("Upload File");
            return;
        };
        if (file.type !== "application/pdf") {
            setError("Only pdf is acceptable");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError("File must be under 5MB")
            return
        }
        setFile(file);
        setError("")
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!file) {
            setError("Please upload file")
            return;
        };

        try {
            setLoading(true);
            const response = await checkAtsResume(file, targetRole, level)

            if (response.status !== 200) {
                setError("Failed to upload file");
                return;
            };
            setResult(response.data.atsResult);


        } catch (error: any) {
            setError(error?.response?.data?.error || "Something went wrong");
        }
        finally {
            setLoading(false)
        }
    }
    return (
        <div>
            {!result && (
                <div className="min-h-screen flex items-center justify-center px-4">
                    <form method='POST' onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
                        <div className="mb-8 text-center">
                            <h1 className="text-2xl font-semibold text-[var(--text)]">ATS Resume Scanner</h1>
                            <p className="mt-1 text-sm text-[var(--text-muted)]">Get brutal, FAANG-level feedback on your resume.</p>
                        </div>

                        <div className="space-y-4 bg-[var(--surface)] p-6 rounded-lg border border-[var(--border)]">
                            <div>
                                <label className="text-sm font-medium text-[var(--text)] mb-1 block">Upload Resume (PDF)</label>
                                <input type="file" accept='application/pdf' onChange={handleFileChange} className="w-full text-sm text-[var(--text)] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[var(--accent)] file:text-white hover:file:bg-[var(--accent-hover)] cursor-pointer" />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-[var(--text)] mb-1 block">Target Role</label>
                                <input type="text" value={targetRole} placeholder='e.g. Software Engineer' onChange={(e) => setTargetRole(e.target.value)} className="w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-[var(--text)] mb-1 block">Experience Level</label>
                                <select name="level" value={level} onChange={(e) => setLevel(e.target.value)} className="w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]">
                                    <option value=""></option>
                                    <option value="Fresher">Fresher</option>
                                    <option value="Junior">Junior</option>
                                    <option value="Mid-Level">Mid-Level</option>
                                    <option value="Senior">Senior</option>
                                </select>
                            </div>

                            <button type='submit' disabled={loading} className="w-full rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--accent-hover)] disabled:opacity-50 transition-colors mt-4">
                                {loading ? "Analyzing Resume..." : "Analyze Resume"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
            {error && (
                <p className="text-sm text-[var(--danger)]">{error}</p>
            )}

            {result && (
                <div className="max-w-4xl mx-auto space-y-6 mt-8">
                    {/* Header: Score and Verdict */}
                    <div className="flex flex-col md:flex-row items-center justify-between p-6 bg-[var(--surface)] border border-[var(--border)] rounded-lg">
                        <div>
                            <h2 className="text-2xl font-bold text-[var(--text)]">ATS Evaluation Complete</h2>
                            <p className="text-[var(--text-muted)]">Target Role: {targetRole} | Level: {level}</p>
                        </div>
                        <div className="mt-4 md:mt-0 text-center">
                            <div className={`text-5xl font-extrabold ${result.overallScore >= 80 ? 'text-[var(--success)]' : result.overallScore >= 50 ? 'text-[var(--warning)]' : 'text-[var(--danger)]'}`}>
                                {result.overallScore}
                            </div>
                            <p className="text-sm uppercase tracking-widest font-bold mt-1 text-[var(--text-muted)]">
                                {result.scoreCategory}
                            </p>
                        </div>
                    </div>

                    {/* Critical Issues (Only show if there are any) */}
                    {result.criticalIssues && result.criticalIssues.length > 0 && (
                        <div className="p-4 bg-[var(--danger)]/10 border border-[var(--danger)] rounded-lg">
                            <h3 className="text-sm font-bold text-[var(--danger)] uppercase tracking-wider mb-2">Critical Issues Detected</h3>
                            <ul className="list-disc list-inside space-y-1 text-sm text-[var(--text)]">
                                {result.criticalIssues.map((issue: string, i: number) => (
                                    <li key={i}>{issue}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Section Scores Grid */}
                    <div>
                        <h3 className="text-lg font-bold text-[var(--text)] mb-3">Category Breakdown</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(result.sectionScores).map(([key, data]: [string, any]) => {
                                // DEFENSIVE CHECK: Did Gemini return just a number instead of the object?
                                const score = typeof data === 'number' ? data : data?.score || 0;
                                const feedback = typeof data === 'number' ? "Score assigned based on overall ATS parsability." : data?.feedback;

                                return (
                                    <div key={key} className="p-4 bg-[var(--surface)] border border-[var(--border)] rounded-lg flex justify-between items-start">
                                        <div>
                                            <p className="font-bold text-[var(--text)] capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                                            {feedback && <p className="text-sm text-[var(--text-muted)] mt-1">{feedback}</p>}
                                        </div>
                                        <div className={`text-xl font-bold ${score >= 8 ? 'text-[var(--success)]' : score >= 5 ? 'text-[var(--warning)]' : 'text-[var(--danger)]'}`}>
                                            {score}/10
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Line-by-Line Fixes (The Magic Feature) */}
                    {result.lineByLineFixes && result.lineByLineFixes.length > 0 && (
                        <div>
                            <h3 className="text-lg font-bold text-[var(--text)] mb-3">Line-by-Line Fixes</h3>
                            <div className="space-y-4">
                                {result.lineByLineFixes.map((fix: any, i: number) => (
                                    <div key={i} className="p-4 bg-[var(--surface)] border border-[var(--border)] rounded-lg">
                                        <p className="text-sm text-[var(--text-muted)] italic mb-2">"{fix.reason}"</p>
                                        <div className="space-y-2">
                                            <div className="p-3 bg-[var(--danger)]/5 border-l-4 border-[var(--danger)] rounded-r-md">
                                                <p className="text-xs text-[var(--danger)] font-bold uppercase mb-1">Original (Remove)</p>
                                                <p className="text-sm text-[var(--text)]">{fix.originalText}</p>
                                            </div>
                                            <div className="p-3 bg-[var(--success)]/5 border-l-4 border-[var(--success)] rounded-r-md">
                                                <p className="text-xs text-[var(--success)] font-bold uppercase mb-1">Rewrite (Add)</p>
                                                <p className="text-sm text-[var(--text)]">{fix.suggestedRewrite}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Missing Keywords */}
                    {result.missingKeywords && result.missingKeywords.length > 0 && (
                        <div className="p-4 bg-[var(--surface)] border border-[var(--border)] rounded-lg">
                            <h3 className="text-sm font-bold text-[var(--text)] mb-3">Missing Keywords</h3>
                            <div className="flex flex-wrap gap-2">
                                {result.missingKeywords.map((kw: string, i: number) => (
                                    <span key={i} className="px-3 py-1 bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text-muted)] rounded-full">
                                        {kw}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Reset Button */}
                    <button
                        onClick={() => { setResult(null); setFile(null); }}
                        className="w-full mt-6 rounded-md bg-[var(--accent)] px-4 py-3 text-sm font-medium text-white hover:bg-[var(--accent-hover)] transition-colors"
                    >
                        Check Another Resume
                    </button>
                </div>
            )}
        </div>
    )
}

export default AtsChecker
