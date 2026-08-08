import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

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
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import { getMe } from "./services/api";
import useUserStore from "./store/authStore";
import ProtectedRoute from "./components/ProtectedRoute";
import Privacy from "./pages/Privacy";
import VerifyResetOtp from "./pages/VerifyResetPassword";
import PracticeDashboard from "./pages/PractiseDashboard";
import PracticeArena from "./pages/PracticeArena";
import ContactUs from "./pages/ContactUs";
import AboutUs from "./pages/AboutUs";
import ResumeBuilder from "./pages/ResumeBuilder";
import MockSetup from "./pages/DsaMockSetup";
import DsaMockArena from "./pages/DsaMockArena";
import DsaMockReview from "./pages/DsaMockReview";

// Get Backend URL to send our tracking data to
const rawUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
const BACKEND_URL = rawUrl.replace(/\/$/, "");

function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    // This runs every time the route (location) changes

    // 1. Get or create a unique visitor ID so GA4 knows it's the same user clicking around
    let clientId = localStorage.getItem("visitor_client_id");
    if (!clientId) {
      clientId = uuidv4();
      localStorage.setItem("visitor_client_id", clientId);
    }

    // 2. Send the pageview secretly to YOUR backend (Ad blockers ignore this!)
    const trackPage = async () => {
      try {
        await axios.post(`${BACKEND_URL}/analytics/track`, {
          // Send the full URL (e.g., https://roundoneprep.me/dashboard)
          page: window.location.origin + location.pathname + location.search,
          clientId: clientId
        });
      } catch (error) {
        // We catch the error silently so if tracking fails, the user's website doesn't break
        console.error("Tracking error:", error);
      }
    };

    trackPage();
  }, [location]);

  return null; // This component doesn't render anything UI-wise
}

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

  // Shared loader/redirect logic for public-only auth routes (login, register, otp, reset flow)
  const renderAuthRoute = (element: React.ReactNode) => {
    if (isAuthCheck) {
      return (
        <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }
    if (isAuthenticate) {
      return <Navigate to="/dashboard" replace />;
    }
    return element;
  };

  return (
    <BrowserRouter>
      {/* Our Custom Server-Side Tracker */}
      <AnalyticsTracker />
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/report/:id" element={<PublicReport />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        
        {/* Auth Routes - We show a small loader if checking, otherwise bypass to dashboard! */}
        <Route path="/register" element={renderAuthRoute(<Registration />)} />
        <Route path="/login" element={renderAuthRoute(<Login />)} />
        <Route path="/verify-otp" element={renderAuthRoute(<VerifyOtp />)} />
        <Route path="/forgot-password" element={renderAuthRoute(<ForgotPassword />)} />
        <Route path="/verify-reset-otp" element={renderAuthRoute(<VerifyResetOtp />)} />
        <Route path="/reset-password" element={renderAuthRoute(<ResetPassword />)} />

        {/* Protected Routes */}
        <Route path="/practice" element={<ProtectedRoute isAuthCheck={isAuthCheck}><PracticeDashboard /></ProtectedRoute>} />
        <Route path="/practice/:slug" element={<ProtectedRoute isAuthCheck={isAuthCheck}><PracticeArena /></ProtectedRoute>} />
        <Route path="/dsa-mock/setup" element={<ProtectedRoute isAuthCheck={isAuthCheck}><MockSetup /></ProtectedRoute>} />
        <Route path="/arena/:sessionId" element={<ProtectedRoute isAuthCheck={isAuthCheck}><DsaMockArena /></ProtectedRoute>} />
        <Route path="/dsa-mock/review/:sessionId" element={<ProtectedRoute isAuthCheck={isAuthCheck}><DsaMockReview /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute isAuthCheck={isAuthCheck}><Dashboard /></ProtectedRoute>} />
        <Route path="/resume-upload" element={<ProtectedRoute isAuthCheck={isAuthCheck}><ResumeUpload /></ProtectedRoute>} />
        <Route path="/onboarding" element={<ProtectedRoute isAuthCheck={isAuthCheck}><Onboarding /></ProtectedRoute>} />
        <Route path="/interview" element={<ProtectedRoute isAuthCheck={isAuthCheck}><Interview /></ProtectedRoute>} />
        <Route path="/feedback" element={<ProtectedRoute isAuthCheck={isAuthCheck}><Feedback /></ProtectedRoute>} />
        <Route path="/ats-check" element={<ProtectedRoute isAuthCheck={isAuthCheck}><AtsChecker /></ProtectedRoute>} />
        <Route path="/review/:id" element={<ProtectedRoute isAuthCheck={isAuthCheck}><Review /></ProtectedRoute>} />
        <Route path="/learning" element={<ProtectedRoute isAuthCheck={isAuthCheck}><LearningHub /></ProtectedRoute>} />
        <Route path="/learning/:categoryId" element={<ProtectedRoute isAuthCheck={isAuthCheck}><LearningSheet /></ProtectedRoute>} />
        <Route path='/resume-builder' element={<ProtectedRoute isAuthCheck={isAuthCheck}><ResumeBuilder /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
