import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "student" | "admin" | "instructor";
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { user, userProfile, isLoading } = useAuth();

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4 w-full max-w-md px-4">
          <Skeleton className="h-12 rounded-lg" />
          <Skeleton className="h-12 rounded-lg" />
          <Skeleton className="h-12 rounded-lg" />
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user || !userProfile) {
    return <Navigate to="/login" replace />;
  }

  // Check role if required
  if (requiredRole && userProfile.role !== requiredRole) {
    // Redirect to appropriate dashboard based on role
    if (userProfile.role === "admin") {
      return <Navigate to="/admin" replace />;
    } else if (userProfile.role === "student" || userProfile.role === "instructor") {
      return <Navigate to="/student" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
