//  Axios instance + all API call 
import axios from "axios";

const api = axios.create({
    // If local, use localhost:3000. If on Vercel, use the magic /api proxy!
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true
});

// auth calls
export const getMe = async () => {
    return await api.get("/user/me");
}
export const signup = async (data: { name: string, email: string, password: string }) => {
    return await api.post("/user/signup", data);
}
export const login = async (data: { email: string, password: string }) => {
    return await api.post("/user/login", data);
}
export const verifyOtp = async (data: { email: string, otp: string }) => {
    return await api.post("/user/verify-otp", data);
};
export const resendOtp = async (data: { email: string }) => {
    return await api.post("/user/resend-otp", data);
};
export const logout = async () => {
    return await api.post("/user/logout");
};
export const forgotPassword = async (data: { email: string }) => {
    return await api.post("/user/forgot-password", data);
};
export const verifyResetOtp = async (data: { email: string; otp: string }) => {
    return await api.post("/user/verify-reset-otp", data);
};
export const resetPassword = async (data: { resetToken: string; password: string; confirmPassword: string }) => {
    return await api.post("/user/update-password", data);
};
// resume time
export const uploadResume = async (file: File) => {
    const formData = new FormData();
    formData.append("resume", file);
    return await api.post("/resume/upload", formData);
}
export const checkAtsResume = async (file: File, targetRole: string, experienceLevel: string) => {
    const formData = new FormData();
    formData.append("resume", file);

    if (targetRole) formData.append("targetRole", targetRole);
    if (experienceLevel) formData.append("experienceLevel", experienceLevel);

    return await api.post("/resume/ats-check", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    })
}
//build resume
// enhanceBullet points
export const enhanceBullets = async (data: { techStack: string, brainDump: string, userFeedback?: string }) => {
    return await api.post("/resume/enhance-bullets", data);
};
// track kitne resume bane h
export const trackResumeDownload = async()=>{
    return await api.post("/resume/track-download");
}
// interview 
export const interviewStart = async (data: { company: string, role: string, level: string, language: string }) => {
    return await api.post("/interview/start", data);
}
export const evaluateInterview = async (data: { round: string, company: string, question: string, answer: string, spokenApproach?: string }) => {
    return await api.post("/interview/evaluate", data);
}

export const generateSpeech = async (data: { text: string; voice: string; rate: string; pitch: string }) => {
    return await api.post("/interview/speak", data, {
        responseType: "blob" // CRITICAL: Tells Axios we are downloading an audio file, not JSON!
    });
};
export const transcribeAudio = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm");

    return await api.post("/interview/transcribe", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })

}
export const saveSessionToDb = async (data: any) => {
    return await api.post("/interview/save", data);
};
export const getInterviewHistory = async () => {
    return await api.get("/interview/history");
};
export const getPublicReport = async (id: string) => {
    return await api.get(`/interview/report/${id}`);
};

// code run
// export const runCode = async(data: {language: string, code: string, testCases: {input: string; output: string}[]})=>{
//     return await api.post("/code/run", data);
// }
export const submitCode = async (data: { language: string, code: string, testCases: { input: string; expectedOutput: string }[] }) => {
    return await api.post("/code/execute", data);
}
export const getCodeResult = async (submissionId: string) => {
    return await api.get(`/code/result/${submissionId}`);
}

// progress
export const getProgress = async (sheetId: string) => {
    return await api.get(`/progress/${sheetId}`);
};
export const toggleProgress = async (data: { sheetId: string, taskId: string }) => {
    return await api.post("/progress/toggle", data)
}
// practice
export const getPracticeQuestions = async (params: any) => {
    return await api.get("/practice/questions", { params });
};
export const getPracticeQuestionBySlug = async (slug: string) => {
    return await api.get(`/practice/questions/${slug}`);
};
export const submitPracticeCode = async (data: { questionId: string, language: string, code: string, userApproach?: string }) => {
    return await api.post("/practice/submit", data);
};
export const getDsaSubmissions = async () => {
    return await api.get("/practice/submissions");
};
export const getQuestionSubmissions = async (questionId: string) => {
    return await api.get(`/practice/${questionId}/submissions`);
};
