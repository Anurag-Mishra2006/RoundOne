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
  institution: string; 
  type: "University" | "School"; // Simplified
  degree: string; // e.g., B.Tech or XII (ISC)
  board?: string; // Optional for university
  startDate?: string; // Optional for schools
  endDate: string; // Acts as "Passing Year" for schools
  scoreType: "CGPA" | "Percentage"; // <-- NEW
  score: string;
  maxScore: string;
}

export interface SkillCategory {
  id: string;
  category: string; // e.g., "Languages", "AI/ML", "Frameworks"
  items: string;    // e.g., "React, Node, TensorFlow"
}

export interface Achievement {
  id: string;
  title: string;       // e.g., "Codeforces"
  subtitle: string;    // e.g., "Pupil | Max-Rating 1368"
  link: string;        // <-- NEW
  bullets: string[];   // Changed to array so they can have multiple lines if needed
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
  coursework: string; // Global coursework field
  education: Education[];
  experience: Experience[];
  projects: Project[];
  achievements: Achievement[];
  skills: SkillCategory[]; // Dynamic array instead of fixed object!
  sectionOrder: string[];
  targetRole: string,
  targetCompany : string,
  // Global Actions
  updateGlobalField: (field: "targetRole" | "targetCompany" | "coursework", value: string) => void;
  updatePersonalInfo: (field: string, value: string) => void;
  updateCoursework: (value: string) => void;
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
  updateAchievement: (id: string, field: string, value: any) => void;
  removeAchievement: (id: string) => void;

  // Skill Actions
  addSkillCategory: () => void;
  updateSkillCategory: (id: string, field: string, value: string) => void;
  removeSkillCategory: (id: string) => void;

  resetBuilder: () => void;
};

const useResumeBuilderStore = create<ResumeBuilderState>((set) => ({
  personalInfo: { fullName: "", email: "", phone: "", linkedin: "", github: "", portfolio: "", location: "" },
  coursework: "",
  education: [],
  experience: [],
  projects: [],
  achievements: [],
  skills: [
    { id: crypto.randomUUID(), category: "Languages", items: "" },
    { id: crypto.randomUUID(), category: "Frontend", items: "" },
    { id: crypto.randomUUID(), category: "Backend", items: "" }
  ],
  targetRole: "",
  targetCompany : "",
  sectionOrder: ["education", "coursework", "experience", "projects", "skills", "achievements"],
  updateGlobalField: (field, value) => set({ [field]: value }),
  updatePersonalInfo: (field, value) => set((state) => ({ personalInfo: { ...state.personalInfo, [field]: value } })),
  updateCoursework: (value) => set({ coursework: value }),
  updateSectionOrder: (newOrder) => set({ sectionOrder: newOrder }),

  addEducation: () => set((state) => ({ education: [...state.education, { id: crypto.randomUUID(), institution: "", type: "University", degree: "", board: "", startDate: "", endDate: "", scoreType: "CGPA", score: "", maxScore: "" }] })),
  updateEducation: (id, field, value) => set((state) => ({ education: state.education.map((item) => item.id === id ? { ...item, [field]: value } : item) })),
  removeEducation: (id) => set((state) => ({ education: state.education.filter((item) => item.id !== id) })),

  addExperience: () => set((state) => ({ experience: [...state.experience, { id: crypto.randomUUID(), isCurrent: false, company: "", role: "", startDate: "", endDate: "", bullets: [] }] })),
  updateExperience: (id, field, value) => set((state) => ({ experience: state.experience.map((item) => item.id === id ? { ...item, [field]: value } : item) })),
  removeExperience: (id) => set((state) => ({ experience: state.experience.filter((item) => item.id !== id) })),

  addProject: () => set((state) => ({ projects: [...state.projects, { id: crypto.randomUUID(), title: "", techStack: "", githubUrl: "", liveUrl: "", startDate: "", endDate: "", brainDump: "", bullets: [] }] })),
  updateProject: (id, field, value) => set((state) => ({ projects: state.projects.map((item) => item.id === id ? { ...item, [field]: value } : item) })),
  removeProject: (id) => set((state) => ({ projects: state.projects.filter((item) => item.id !== id) })),

  addAchievement: () => set((state) => ({ achievements: [...state.achievements, { id: crypto.randomUUID(), title: "", subtitle: "", link: "", bullets: [] }] })),
  updateAchievement: (id, field, value) => set((state) => ({ achievements: state.achievements.map((item) => item.id === id ? { ...item, [field]: value } : item) })),
  removeAchievement: (id) => set((state) => ({ achievements: state.achievements.filter((item) => item.id !== id) })),

  addSkillCategory: () => set((state) => ({ skills: [...state.skills, { id: crypto.randomUUID(), category: "", items: "" }] })),
  updateSkillCategory: (id, field, value) => set((state) => ({ skills: state.skills.map((item) => item.id === id ? { ...item, [field]: value } : item) })),
  removeSkillCategory: (id) => set((state) => ({ skills: state.skills.filter((item) => item.id !== id) })),

  resetBuilder: () => set({
    personalInfo: { fullName: "", email: "", phone: "", linkedin: "", github: "", portfolio: "", location: "" },
    coursework: "", education: [], experience: [], projects: [], achievements: [],
    skills: [{ id: crypto.randomUUID(), category: "Languages", items: "" }, { id: crypto.randomUUID(), category: "Frontend", items: "" }, { id: crypto.randomUUID(), category: "Backend", items: "" }],
    sectionOrder: ["education", "coursework", "experience", "projects", "skills", "achievements"],
  })
}));

export default useResumeBuilderStore;
