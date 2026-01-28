import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { userProfile, isLoading } = useAuth();

  useEffect(() => {
    // Wait for auth to load
    if (!isLoading) {
      if (!userProfile) {
        navigate("/login");
      } else if (userProfile.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/student");
      }
    }
  }, [isLoading, userProfile, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-muted-foreground">Signing you in...</p>
      </div>
    </div>
  );
}
