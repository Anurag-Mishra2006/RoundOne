//  Axios instance + all API call 
import axios from "axios";

const api = axios.create({
    // baseURL: "https://roundone-backend.onrender.com",
    baseURL: "http://localhost:3000",
    withCredentials : true
});
// auth calls
export const signup = async (data: {name: string, email : string, password: string})=>{
    return  await api.post("/user/signup", data);
}
export const login = async(data: {email : string, password: string})=>{
    return await api.post("/user/login", data);
}
export const verifyOtp = async(data: {email: string, otp: string})=>{
    return await api.post("/user/verify-otp", data);
};
export const resendOtp = async(data: {email: string})=>{
    return await api.post("/user/resend-otp", data);
};
export const logout = async()=>{
    return await api.post("/user/logout");
};

// resume time
export const uploadResume = async(file : File)=>{
    const formData = new FormData();
    formData.append("resume", file);
    return await api.post("/resume/upload", formData);
}

// interview 
export const interviewStart = async(data: { company: string, role: string, level: string, language:string })=>{
    return await api.post("/interview/start", data);
}
export const evaluateInterview = async(data: {round: string, company: string, question: string, answer: string})=>{
    return await api.post("/interview/evaluate", data);
}
