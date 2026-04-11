import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

interface ProtectedRouteProps {
  requireRole?: string;
}

export const ProtectedRoute = ({ requireRole }: ProtectedRouteProps) => {
  const { isAuthenticated, hasRole } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requireRole && !hasRole(requireRole)) return <Navigate to="/" replace />;
  return <Outlet />;
};
