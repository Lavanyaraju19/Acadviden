import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface AdminRouteProps {
  children: React.ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated and is admin
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // Check user role (would need to fetch from database)
  // For now, we check if user exists (assumes admin login verified in login page)
  if (user.user_metadata?.role !== "admin" && !user.email?.includes("admin")) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}

export default AdminRoute;
