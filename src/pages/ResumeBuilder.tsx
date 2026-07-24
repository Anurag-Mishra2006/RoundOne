import { useState } from "react";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import ResumePDF from "@/components/resume-builder/ResumePDF";
import PersonalInfoForm from "@/components/resume-builder/PersonalInfoForm";
import ProjectsForm from "@/components/resume-builder/ProjectsForm";
import EducationForm from "@/components/resume-builder/EducationForm";
import SkillsForm from "@/components/resume-builder/SkillsForm";
import ExperienceForm from "@/components/resume-builder/ExperienceForm";
import AchievementsForm from "@/components/resume-builder/AchievementsForm";
import ReviewForm from "@/components/resume-builder/ReviewForm";
import useResumeBuilderStore from "@/store/resumeBuilderStore";
import { trackResumeDownload } from "@/services/api";

type Tab = "personal" | "education" | "experience" | "projects" | "skills" | "achievements" | "review";

function ResumeBuilder() {
    const [activeTab, setActiveTab] = useState<Tab>("personal");
    const [showMobilePreview, setShowMobilePreview] = useState(false); // Mobile toggle state
    const state = useResumeBuilderStore(); 

    const tabs: { id: Tab; label: string; icon: string }[] = [
        { id: "personal", label: "Personal", icon: "👤" },
        { id: "education", label: "Education", icon: "🎓" },
        { id: "skills", label: "Skills", icon: "🛠️" },
        { id: "experience", label: "Experience", icon: "💼" },
        { id: "projects", label: "Projects", icon: "🚀" },
        { id: "achievements", label: "Achievements", icon: "🏆" },
        { id: "review", label: "Review & Export", icon: "✅" }
    ];

    let strengthScore = 0;
    if (state.personalInfo.fullName) strengthScore += 10;
    if (state.personalInfo.email && state.personalInfo.phone) strengthScore += 10;
    if (state.personalInfo.linkedin && state.personalInfo.github) strengthScore += 10;
    if (state.education.length > 0) strengthScore += 15;
    if (state.skills.some(s => s.items.length > 0)) strengthScore += 15;
    if (state.projects.length > 0) strengthScore += 20;
    if (state.experience.length > 0 || state.achievements.length > 0) strengthScore += 20;

    const strengthColor = strengthScore >= 80 ? "bg-[var(--success)]" : strengthScore >= 50 ? "bg-[var(--warning)]" : "bg-[var(--danger)]";

    return (
        <div className="min-h-[100dvh] bg-[var(--bg)] font-sans flex flex-col">
            <Navbar />

            <div className="flex-grow flex flex-col lg:flex-row overflow-hidden relative">

                {/* LEFT SIDE: The Editor */}
                <div className={`w-full lg:w-1/2 flex-col bg-[var(--bg)] border-r border-[var(--border)] h-[calc(100dvh-64px)] relative ${showMobilePreview ? 'hidden' : 'flex'}`}>

                    <div className="px-4 sm:px-6 py-4 bg-[var(--surface)] border-b border-[var(--border)]">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Resume Strength</span>
                            <span className={`text-sm font-bold ${strengthScore >= 80 ? 'text-[var(--success)]' : strengthScore >= 50 ? 'text-[var(--warning)]' : 'text-[var(--danger)]'}`}>
                                {strengthScore}% {strengthScore === 100 && "🔥"}
                            </span>
                        </div>
                        <div className="w-full h-1.5 bg-[var(--bg)] rounded-full overflow-hidden border border-[var(--border)]">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${strengthScore}%` }} transition={{ duration: 0.5, ease: "easeOut" }} className={`h-full ${strengthColor}`} />
                        </div>
                    </div>

                    <div className="flex overflow-x-auto border-b border-[var(--border)] bg-[var(--surface)] p-2 gap-2 hide-scrollbar">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab.id ? "bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/50" : "text-[var(--text-muted)] hover:bg-[var(--surface-hover)] hover:text-white border border-transparent"}`}
                            >
                                <span>{tab.icon}</span> {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex-grow overflow-y-auto p-4 sm:p-6 md:p-10 relative">
                        <motion.div key={activeTab} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                            {activeTab === "personal" && <PersonalInfoForm />}
                            {activeTab === "education" && <EducationForm />}
                            {activeTab === "skills" && <SkillsForm />}
                            {activeTab === "experience" && <ExperienceForm />}
                            {activeTab === "projects" && <ProjectsForm />}
                            {activeTab === "achievements" && <AchievementsForm />}
                            {activeTab === "review" && <ReviewForm />}
                        </motion.div>
                    </div>

                    {/* MOBILE  :  Floating button to open Preview on small screens */}
                    <button 
                        onClick={() => setShowMobilePreview(true)}
                        className="lg:hidden absolute bottom-6 right-6 z-40 bg-[var(--accent)] text-white shadow-[0_0_20px_rgba(170,59,255,0.4)] px-5 py-3.5 rounded-full font-bold flex items-center gap-2 hover:bg-[var(--accent-hover)] transition-transform active:scale-95"
                    >
                        👁️ Preview PDF
                    </button>
                </div>

                {/* RIGHT SIDE: Live PDF Preview */}
                <div className={`${showMobilePreview ? 'flex fixed inset-0 z-50 bg-[var(--bg)]' : 'hidden'} lg:static lg:flex w-full lg:w-1/2 bg-[#333] flex-col relative border-l border-[var(--border)] lg:h-[calc(100dvh-64px)]`}>

                    <div className="h-[60px] lg:h-[70px] bg-[var(--surface)] border-b border-[var(--border)] flex items-center justify-between px-4 sm:px-6 shrink-0">
                        
                        {/* Mobile Back Button */}
                        <button 
                            onClick={() => setShowMobilePreview(false)}
                            className="lg:hidden text-sm font-bold text-[var(--text)] flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-[var(--border)]"
                        >
                            ← Back to Edit
                        </button>

                        <button
                            onClick={() => { if (confirm("Are you sure you want to clear all data and start a new resume?")) state.resetBuilder(); }}
                            className="hidden lg:flex text-xs font-bold text-[var(--danger)] hover:text-red-400 transition-colors items-center gap-2 bg-[var(--danger)]/10 px-3 py-1.5 rounded-md border border-[var(--danger)]/20"
                        >
                            <span>🗑️</span> Start Fresh
                        </button>

                        <PDFDownloadLink 
                            document={<ResumePDF />} 
                            fileName="RoundOne_Resume.pdf" 
                            onClick={() => trackResumeDownload().catch(console.error)}
                            className="px-4 py-2 bg-[var(--accent)] text-white text-xs font-bold rounded-lg hover:bg-[var(--accent-hover)] transition-all shadow-lg flex items-center gap-2"
                        >
                            {({ loading }) => (loading ? '⏳ Preparing...' : '⬇ Download PDF')}
                        </PDFDownloadLink>
                    </div>

                    {/* PDF Viewer */}
                    <div className="flex-grow w-full overflow-hidden h-[calc(100dvh-60px)] lg:h-full">
                        <PDFViewer key={state.sectionOrder.join('-')} width="100%" height="100%" className="border-none bg-[#333]">
                            <ResumePDF />
                        </PDFViewer>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default ResumeBuilder;
