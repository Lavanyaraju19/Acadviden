import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

export const AuthRedirect: React.FC = () => {
  const navigate = useNavigate();
  const { user, userProfile, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!user || !userProfile) {
        // Not authenticated, go to login
        navigate("/login", { replace: true });
      } else {
        // Authenticated, redirect based on role
        if (userProfile.role === "admin") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/student", { replace: true });
        }
      }
    }
  }, [user, userProfile, isLoading, navigate]);

  // Show loading state while determining where to redirect
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="space-y-4 w-full max-w-md px-4">
        <Skeleton className="h-12 rounded-lg" />
        <Skeleton className="h-12 rounded-lg" />
        <Skeleton className="h-12 rounded-lg" />
      </div>
    </div>
  );
};
