import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import useUserStore from "@/store/authStore";

interface ProtectedRouteProps {
  children: ReactNode;
  isAuthCheck: boolean;  
}

const ProtectedRoute = ({ children, isAuthCheck }: ProtectedRouteProps) => {
  const { isAuthenticate } = useUserStore();

  // If the app is still checking the cookie, show a smooth loader
  if (isAuthCheck) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center text-[var(--text)]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-[var(--text-muted)] animate-pulse">Verifying session...</p>
        </div>
      </div>
    );
  }

  // If check is done and they aren't logged in, kick them out
  if (!isAuthenticate) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
