import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import "./App.css";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import VerifyOtp from "./pages/VerifyOtp";
import Dashboard from "./pages/Dashboard";
import ResumeUpload from "./pages/ResumeUpload";
import Onboarding from "./pages/Onboarding";
import Interview from "./pages/Interview";
import Feedback from "./pages/Feedback";
import AtsChecker from "./pages/AtsChecker";
import Review from "./pages/Review";
import PublicReport from "./pages/PublicReport";
import LearningHub from "./pages/LearningHub";
import LearningSheet from "./pages/LearningSheet";

import { getMe } from "./services/api";
import useUserStore from "./store/authStore";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const { isAuthenticate, setUser, clearUser } = useUserStore();
  const [isAuthCheck, setIsAuthCheck] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await getMe();
        if (response.status === 200) {
          setUser(response.data.user);
        }
      } catch (error) {
        clearUser();
      } finally {
        setIsAuthCheck(false);
      }
    };
    checkAuthStatus();
  }, [setUser, clearUser]);


  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/report/:id" element={<PublicReport />} />

        {/* Auth Routes - We show a small loader if checking, otherwise bypass to dashboard! */}
        <Route path="/register" element={
            isAuthCheck ? <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center"><div className="w-8 h-8 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div></div> 
            : isAuthenticate ? <Navigate to="/dashboard" replace /> : <Registration />
        }/>
        <Route path="/login" element={
            isAuthCheck ? <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center"><div className="w-8 h-8 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div></div> 
            : isAuthenticate ? <Navigate to="/dashboard" replace /> : <Login />
        }/>
        <Route path="/verify-otp" element={
            isAuthCheck ? <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center"><div className="w-8 h-8 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div></div> 
            : isAuthenticate ? <Navigate to="/dashboard" replace /> : <VerifyOtp />
        }/>

        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute isAuthCheck={isAuthCheck}><Dashboard /></ProtectedRoute>} />
        <Route path="/resume-upload" element={<ProtectedRoute isAuthCheck={isAuthCheck}><ResumeUpload /></ProtectedRoute>} />
        <Route path="/onboarding" element={<ProtectedRoute isAuthCheck={isAuthCheck}><Onboarding /></ProtectedRoute>} />
        <Route path="/interview" element={<ProtectedRoute isAuthCheck={isAuthCheck}><Interview /></ProtectedRoute>} />
        <Route path="/feedback" element={<ProtectedRoute isAuthCheck={isAuthCheck}><Feedback /></ProtectedRoute>} />
        <Route path="/ats-check" element={<ProtectedRoute isAuthCheck={isAuthCheck}><AtsChecker /></ProtectedRoute>} />
        <Route path="/review/:id" element={<ProtectedRoute isAuthCheck={isAuthCheck}><Review /></ProtectedRoute>} />
        <Route path="/learning" element={<ProtectedRoute isAuthCheck={isAuthCheck}><LearningHub /></ProtectedRoute>} />
        <Route path="/learning/:categoryId" element={<ProtectedRoute isAuthCheck={isAuthCheck}><LearningSheet /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
