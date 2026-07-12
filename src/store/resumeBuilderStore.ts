import { create } from "zustand";

export interface Experience {
    id: string;
    company: string;
    isCurrent: boolean;
    role: string;
    startDate: string;
    endDate: string;
    bullets: string[];
}

export interface Project {
    id: string;
    title: string;
    techStack: string;
    githubUrl: string;
    liveUrl: string;
    startDate: string;
    endDate: string;
    brainDump: string;
    bullets: string[];
}

export interface Education {
    id: string;
    institution: string; // College or School name
    type: | "University" | "College" | "High School" | "Intermediate" | "Other";
    degree: string;
    board?: string;
    startDate: string;
    endDate: string;
    score: string;
    maxScore: string;
    coursework?: string;
}

export interface Achievement {
    id: string;
    title: string;
    description: string;
}

interface ResumeBuilderState {
    personalInfo: {
        fullName: string;
        email: string;
        phone: string;
        linkedin: string;
        github: string;
        portfolio: string;
        location: string;
    };
    education: Education[];
    experience: Experience[];
    projects: Project[];
    achievements: Achievement[];
    skills: {
        languages: string;
        frontend: string;
        backend: string;
        tools: string;
    };
    sectionOrder: string[];

    // Actions
    updatePersonalInfo: (field: string, value: string) => void;
    updateSkills: (field: string, value: string) => void;
    updateSectionOrder: (newOrder: string[]) => void;

    // Education Actions
    addEducation: () => void;
    updateEducation: (id: string, field: string, value: string) => void;
    removeEducation: (id: string) => void;

    // Experience Actions
    addExperience: () => void;
    updateExperience: (id: string, field: string, value: any) => void;
    removeExperience: (id: string) => void;

    // Project Actions
    addProject: () => void;
    updateProject: (id: string, field: string, value: any) => void;
    removeProject: (id: string) => void;

    // Achievement Actions
    addAchievement: () => void;
    updateAchievement: (id: string, field: string, value: string) => void;
    removeAchievement: (id: string) => void;

    resetBuilder: () => void;
};

const ResumeBuilderStore = create<ResumeBuilderState>((set) => ({

    personalInfo: { fullName: "", email: "", phone: "", linkedin: "", github: "", portfolio: "", location: "" },
    education: [],
    experience: [],
    projects: [],
    achievements: [],
    skills: { languages: "", frontend: "", backend: "", tools: "" },
    sectionOrder: ["education", "experience", "projects", "skills", "achievements"],

    updatePersonalInfo: (field, value) =>
        set((state) => ({ personalInfo: { ...state.personalInfo, [field]: value } })),

    updateSkills: (field, value) =>
        set((state) => ({ skills: { ...state.skills, [field]: value } })),

    updateSectionOrder: (newOrder) =>
        set({ sectionOrder: newOrder }),

    addEducation: () =>
        set((state) => ({ education: [...state.education, { id: crypto.randomUUID(), institution: "", type: "University", degree: "", board: "", startDate: "", endDate: "", score: "", maxScore: "", coursework: "" }] })),

    updateEducation: (id, field, value) =>
        set((state) => ({ education: state.education.map((item) => item.id === id ? { ...item, [field]: value } : item) })),

    removeEducation: (id) =>
        set((state) => ({ education: state.education.filter((item) => item.id !== id) })),

    addExperience: () =>
        set((state) => ({ experience: [...state.experience, { id: crypto.randomUUID(),isCurrent: false,  company: "", role: "", startDate: "", endDate: "", bullets: [] }] })),

    updateExperience: (id, field, value) =>
        set((state) => ({ experience: state.experience.map((item) => item.id === id ? { ...item, [field]: value } : item) })),

    removeExperience: (id) =>
        set((state) => ({ experience: state.experience.filter((item) => item.id !== id) })),

    addProject: () =>
        set((state) => ({ projects: [...state.projects, { id: crypto.randomUUID(), title: "", techStack: "", githubUrl: "", liveUrl: "" , startDate: "", endDate: "", brainDump: "", bullets: [] }] })),

    updateProject: (id, field, value) =>
        set((state) => ({ projects: state.projects.map((item) => item.id === id ? { ...item, [field]: value } : item) })),

    removeProject: (id) =>
        set((state) => ({ projects: state.projects.filter((item) => item.id !== id) })),

    addAchievement: () =>
        set((state) => ({ achievements: [...state.achievements, { id: crypto.randomUUID(), title: "", description: "" }] })),

    updateAchievement: (id, field, value) =>
        set((state) => ({ achievements: state.achievements.map((item) => item.id === id ? { ...item, [field]: value } : item) })),

    removeAchievement: (id) =>
        set((state) => ({ achievements: state.achievements.filter((item) => item.id !== id) })),

    resetBuilder: () => set({
        personalInfo: { fullName: "", email: "", phone: "", linkedin: "", github: "", portfolio: "",location: "" },
        education: [],
        experience: [],
        projects: [],
        achievements: [],
        skills: { languages: "", frontend: "", backend: "", tools: "" },
        sectionOrder: ["education", "experience", "projects", "skills", "achievements"],
        
    })
}))

export default ResumeBuilderStore;
