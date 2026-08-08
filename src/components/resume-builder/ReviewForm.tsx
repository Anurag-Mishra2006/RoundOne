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
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 bg-[var(--accent)]/10 border border-[var(--accent)]/20 rounded-lg text-[var(--accent)]">
            {/* Clipboard Check SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white">Final Review</h2>
        </div>
        <p className="text-sm text-[var(--text-muted)] mt-2">Check for errors, reorder your sections, and scan your ATS-friendly PDF.</p>
      </div>

      {placeholderIssues.length > 0 ? (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 sm:p-5 bg-[var(--danger)]/10 border border-[var(--danger)]/30 rounded-xl shadow-[0_0_15px_rgba(239,68,68,0.1)]">
          <h3 className="text-sm font-bold text-[var(--danger)] uppercase tracking-wider mb-3 flex items-center gap-2">
            {/* Warning Triangle SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 animate-pulse">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Placeholders Detected!
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
            {/* Check Circle SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-[var(--success)]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
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
              className="flex items-center justify-between p-3 sm:p-3.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl z-10 hover:border-[var(--border)]/80 transition-colors group"
            >
              <span className="text-sm font-bold text-[var(--text)] capitalize px-2 flex items-center gap-3">
                {/* Drag Handle Grip SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--text)] transition-colors">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
                </svg>
                {section}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => moveSection(index, 'up')}
                  disabled={index === 0}
                  className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text-muted)] hover:text-[var(--accent)] hover:border-[var(--accent)]/50 disabled:opacity-30 transition-all"
                >
                  {/* Chevron Up SVG */}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                  </svg>
                </button>
                <button
                  onClick={() => moveSection(index, 'down')}
                  disabled={index === sectionOrder.length - 1}
                  className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text-muted)] hover:text-[var(--accent)] hover:border-[var(--accent)]/50 disabled:opacity-30 transition-all"
                >
                  {/* Chevron Down SVG */}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
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
          className="w-full py-4 rounded-xl bg-[var(--accent)] text-white font-bold hover:bg-[var(--accent-hover)] transition-all shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0 flex justify-center items-center gap-2 group"
        >
          {isScanning ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Transporting...</span>
              </>
          ) : (
            <>
              {/* Magnifying Glass SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <span>Scan in ATS Checker</span>
              {/* Arrow Right SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:translate-x-1 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
