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

  if (isAuthCheck) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center text-[var(--text)]">
        Loading...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/report/:id" element={<PublicReport />} />

        {/* Auth Routes */}
        <Route
          path="/register"
          element={
            isAuthenticate ? <Navigate to="/dashboard" replace /> : <Registration />
          }
        />
        <Route
          path="/login"
          element={
            isAuthenticate ? <Navigate to="/dashboard" replace /> : <Login />
          }
        />
        <Route
          path="/verify-otp"
          element={
            isAuthenticate ? <Navigate to="/dashboard" replace /> : <VerifyOtp />
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/resume-upload"
          element={
            <ProtectedRoute>
              <ResumeUpload />
            </ProtectedRoute>
          }
        />

        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          }
        />

        <Route
          path="/interview"
          element={
            <ProtectedRoute>
              <Interview />
            </ProtectedRoute>
          }
        />

        <Route
          path="/feedback"
          element={
            <ProtectedRoute>
              <Feedback />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ats-check"
          element={
            <ProtectedRoute>
              <AtsChecker />
            </ProtectedRoute>
          }
        />

        <Route
          path="/review/:id"
          element={
            <ProtectedRoute>
              <Review />
            </ProtectedRoute>
          }
        />

        <Route
          path="/learning"
          element={
            <ProtectedRoute>
              <LearningHub />
            </ProtectedRoute>
          }
        />

        <Route
          path="/learning/:categoryId"
          element={
            <ProtectedRoute>
              <LearningSheet />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
