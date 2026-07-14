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
    const state = useResumeBuilderStore(); // Grab full state for the Strength Meter

    const tabs: { id: Tab; label: string; icon: string }[] = [
        { id: "personal", label: "Personal", icon: "👤" },
        { id: "education", label: "Education", icon: "🎓" },
        { id: "skills", label: "Skills", icon: "🛠️" },
        { id: "experience", label: "Experience", icon: "💼" },
        { id: "projects", label: "Projects", icon: "🚀" },
        { id: "achievements", label: "Achievements", icon: "🏆" },
        { id: "review", label: "Review & Export", icon: "✅" }
    ];

    // GAMIFICATION: Calculate Resume Strength
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
        <div className="min-h-screen bg-[var(--bg)] font-sans flex flex-col">
            <Navbar />

            <div className="flex-grow flex flex-col lg:flex-row overflow-hidden">

                {/* LEFT SIDE: The Editor */}
                <div className="w-full lg:w-1/2 flex flex-col bg-[var(--bg)] border-r border-[var(--border)] h-[calc(100vh-70px)] relative">

                    {/* GAMIFICATION: Resume Strength Meter */}
                    <div className="px-6 py-4 bg-[var(--surface)] border-b border-[var(--border)]">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Resume Strength</span>
                            <span className={`text-sm font-bold ${strengthScore >= 80 ? 'text-[var(--success)]' : strengthScore >= 50 ? 'text-[var(--warning)]' : 'text-[var(--danger)]'}`}>
                                {strengthScore}% {strengthScore === 100 && "🔥"}
                            </span>
                        </div>
                        <div className="w-full h-1.5 bg-[var(--bg)] rounded-full overflow-hidden border border-[var(--border)]">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${strengthScore}%` }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className={`h-full ${strengthColor}`}
                            />
                        </div>
                    </div>

                    {/* Top Tab Bar */}
                    <div className="flex overflow-x-auto border-b border-[var(--border)] bg-[var(--surface)] p-2 gap-2 hide-scrollbar">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors
                                ${activeTab === tab.id
                                        ? "bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/50"
                                        : "text-[var(--text-muted)] hover:bg-[var(--surface-hover)] hover:text-white border border-transparent"
                                    }`}
                            >
                                <span>{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Form Content Area (Scrollable) */}
                    <div className="flex-grow overflow-y-auto p-6 md:p-10 relative">
                        <motion.div
                            key={activeTab} // Forces animation when tab changes
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {activeTab === "personal" && <PersonalInfoForm />}
                            {activeTab === "education" && <EducationForm />}
                            {activeTab === "skills" && <SkillsForm />}
                            {activeTab === "experience" && <ExperienceForm />}
                            {activeTab === "projects" && <ProjectsForm />}
                            {activeTab === "achievements" && <AchievementsForm />}
                            {activeTab === "review" && <ReviewForm />}
                        </motion.div>
                    </div>
                </div>

                {/* RIGHT SIDE: Live PDF Preview */}
                <div className="hidden lg:flex w-1/2 bg-[#333] flex-col relative border-l border-[var(--border)]">

                    {/* Top Bar for Action Buttons */}
                    <div className="h-[60px] bg-[var(--surface)] border-b border-[var(--border)] flex items-center justify-between px-6">
                        
                        {/* Start New Resume Button */}
                        <button
                            onClick={() => {
                                if (confirm("Are you sure you want to clear all data and start a new resume?")) {
                                    state.resetBuilder();
                                }
                            }}
                            className="text-xs font-bold text-[var(--danger)] hover:text-red-400 transition-colors flex items-center gap-2 bg-[var(--danger)]/10 px-3 py-1.5 rounded-md border border-[var(--danger)]/20"
                        >
                            <span>🗑️</span> Start Fresh
                        </button>

                        {/* Download PDF Button */}
                        <PDFDownloadLink 
                            document={<ResumePDF />} 
                            fileName="RoundOne_Resume.pdf" 
                            onClick={() => trackResumeDownload().catch(console.error)}
                            className="px-4 py-2 bg-[var(--accent)] text-white text-xs font-bold rounded hover:bg-[var(--accent-hover)] transition-all shadow-lg flex items-center gap-2 hover:-translate-y-0.5"
                        >
                            {({ loading }) => (loading ? '⏳ Preparing PDF...' : '⬇ Download PDF')}
                        </PDFDownloadLink>
                    </div>

                    {/* The Live Viewer */}
                    <div className="flex-grow w-full h-[calc(100vh-130px)]">
                        <PDFViewer key={state.sectionOrder.join('-')} width="100%" height="100%" className="border-none">
                            <ResumePDF />
                        </PDFViewer>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default ResumeBuilder;
