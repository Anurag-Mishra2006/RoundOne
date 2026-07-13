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

type Tab = "personal" | "education" | "experience" | "projects" | "skills" | "achievements" | "review";

function ResumeBuilder() {
    const [activeTab, setActiveTab] = useState<Tab>("personal");

    const tabs: { id: Tab; label: string; icon: string }[] = [
        { id: "personal", label: "Personal", icon: "👤" },
        { id: "education", label: "Education", icon: "🎓" },
        { id: "skills", label: "Skills", icon: "🛠️" },
        { id: "experience", label: "Experience", icon: "💼" },
        { id: "projects", label: "Projects", icon: "🚀" },
        { id: "achievements", label: "Achievements", icon: "🏆" },
        { id: "review", label: "Review & Export", icon: "✅" }
    ];
     const { sectionOrder } = useResumeBuilderStore();
    return (
        <div className="min-h-screen bg-[var(--bg)] font-sans flex flex-col">
            <Navbar />

            <div className="flex-grow flex flex-col lg:flex-row overflow-hidden">

                {/* LEFT SIDE: The Editor */}
                <div className="w-full lg:w-1/2 flex flex-col bg-[var(--bg)] border-r border-[var(--border)] h-[calc(100vh-70px)]">

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
                            {activeTab === "review" && <ReviewForm />}`
                        </motion.div>
                    </div>
                </div>

                <div className="hidden lg:flex w-1/2 bg-[#333] flex-col relative border-l border-[var(--border)]">

                    {/* Top Bar for Download Button */}
                    <div className="h-[50px] bg-[var(--surface)] border-b border-[var(--border)] flex items-center justify-end px-4">
                        <PDFDownloadLink document={<ResumePDF />} fileName="RoundOne_Resume.pdf" className="px-4 py-1.5 bg-[var(--accent)] text-white text-xs font-bold rounded hover:bg-[var(--accent-hover)] transition-colors shadow-lg">
                            {({ loading }) => (loading ? 'Preparing PDF...' : '⬇ Download PDF')}
                        </PDFDownloadLink>
                    </div>

                    {/* The Live Viewer */}
                     <div className="flex-grow w-full h-[calc(100vh-120px)]">
                        {/* ADD THE KEY PROP HERE: */}
                        <PDFViewer key={sectionOrder.join('-')} width="100%" height="100%" className="border-none">
                            <ResumePDF />
                        </PDFViewer>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default ResumeBuilder;
