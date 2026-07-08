import { Navigate } from "react-router-dom";
import useUserStore from "@/store/authStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticate } = useUserStore();

  if (!isAuthenticate) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
