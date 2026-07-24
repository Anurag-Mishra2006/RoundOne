import useResumeBuilderStore from "@/store/resumeBuilderStore";
import { pdf } from '@react-pdf/renderer';
import ResumePDF from './ResumePDF';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ReviewForm() {
  const { projects, sectionOrder, updateSectionOrder } = useResumeBuilderStore();
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);

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
    const newOrder = [...sectionOrder];
    const element = newOrder[index];
    newOrder.splice(index, 1);
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    newOrder.splice(targetIndex, 0, element);
    updateSectionOrder(newOrder);
  };

  const handleInstantAtsScan = async () => {
    setIsScanning(true);
    try {
      const blob = await pdf(<ResumePDF />).toBlob();
      const file = new File([blob], "My_Resume.pdf", { type: "application/pdf" });
      navigate("/ats-check", { state: { autoUploadFile: file } });
    } catch (err) {
      console.error("Failed to generate PDF for scan", err);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-8 pb-24 lg:pb-10">
      
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Final Review</h2>
        <p className="text-sm text-[var(--text-muted)]">Check for errors, reorder your sections, and scan your ATS-friendly PDF.</p>
      </div>

      {placeholderIssues.length > 0 ? (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 sm:p-5 bg-[var(--danger)]/10 border border-[var(--danger)]/30 rounded-xl shadow-[0_0_15px_rgba(239,68,68,0.1)]">
          <h3 className="text-sm font-bold text-[var(--danger)] uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="animate-pulse">⚠️</span> Placeholders Detected!
          </h3>
          <p className="text-xs text-[var(--text-muted)] mb-4 leading-relaxed">
            You have AI-generated placeholders left in your projects. Replace them in the <b className="text-[var(--text)]">Projects tab</b> before downloading.
          </p>
          <ul className="space-y-3">
            {placeholderIssues.map((issue, i) => (
              <li key={i} className="text-sm text-[var(--text)] bg-[var(--bg)]/50 p-3 sm:p-4 rounded-lg border border-[var(--danger)]/20">
                <span className="font-bold text-[var(--danger)] block mb-1.5">{issue.projectTitle}</span>
                <span className="font-mono text-xs opacity-80 leading-relaxed block">{issue.bullet}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-4 bg-[var(--success)]/10 border border-[var(--success)]/30 rounded-xl flex items-center gap-3">
            <span className="text-xl">✅</span>
            <p className="text-sm font-bold text-[var(--success)]">Your resume looks clean. No placeholders detected.</p>
        </motion.div>
      )}

      <div>
        <h3 className="text-lg font-bold text-white mb-2">Reorder Sections</h3>
        <p className="text-xs text-[var(--text-muted)] mb-5">Experienced developer? Move Projects up. Student? Keep Education top.</p>
        
        <div className="space-y-2 flex flex-col">
          {sectionOrder.map((section, index) => (
            <motion.div 
              layout 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key={`section-${section}`} 
              className="flex items-center justify-between p-3 sm:p-3.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl z-10"
            >
              <span className="text-sm font-bold text-[var(--text)] capitalize px-2 flex items-center gap-2 sm:gap-3">
                <span className="text-[var(--text-muted)] text-lg">⋮⋮</span> {section}
              </span>
              <div className="flex gap-2">
                {/* Mobile fixes: increased width/height of buttons to w-10 h-10 for touch */}
                <button
                  onClick={() => moveSection(index, 'up')}
                  disabled={index === 0}
                  className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center bg-[var(--bg)] border border-[var(--border)] rounded-lg hover:text-[var(--accent)] hover:border-[var(--accent)]/50 disabled:opacity-30 transition-all"
                >
                  ▲
                </button>
                <button
                  onClick={() => moveSection(index, 'down')}
                  disabled={index === sectionOrder.length - 1}
                  className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center bg-[var(--bg)] border border-[var(--border)] rounded-lg hover:text-[var(--accent)] hover:border-[var(--accent)]/50 disabled:opacity-30 transition-all"
                >
                  ▼
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-[var(--border)]">
        <button
          onClick={handleInstantAtsScan}
          disabled={isScanning || placeholderIssues.length > 0}
          className="w-full py-4 rounded-xl bg-[var(--accent)] text-white font-bold hover:bg-[var(--accent-hover)] transition-all shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 flex justify-center items-center gap-2"
        >
          {isScanning ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div><span>Transporting...</span></>
          ) : "🔍 Scan in ATS Checker ➔"}
        </button>
      </div>
    </div>
  );
}
