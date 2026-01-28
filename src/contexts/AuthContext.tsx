import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";

type UserRole = "student" | "admin" | "instructor";

interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  student_id?: string | null;
  is_confirmed?: boolean;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);

      if (data.session?.user) {
        fetchUserProfile(data.session.user);
      } else {
        setIsLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        fetchUserProfile(session.user);
      } else {
        setUserProfile(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (authUser: User) => {
    try {
      const { data: profile, error } = await (supabase as any)
        .from("profiles")
        .select("id, name, role, student_id, is_confirmed")
        .eq("id", authUser.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
      }

      if (profile) {
        setUserProfile({
          id: profile.id,
          name: profile.name ?? "User",
          role: profile.role as UserRole,
          email: authUser.email ?? "",
          student_id: profile.student_id,
          is_confirmed: profile.is_confirmed,
        });
      } else {
        const userName = authUser.user_metadata?.full_name || 
                        authUser.email?.split("@")[0] || "User";
        const userType = authUser.user_metadata?.user_type || "student";
        
        const { data: newProfile, error: insertError } = await (supabase as any)
          .from("profiles")
          .insert({
            id: authUser.id,
            email: authUser.email ?? "",
            name: userName,
            role: userType,
            is_confirmed: false,
          })
          .select()
          .single();

        if (insertError) {
          console.error("Error creating profile:", insertError);
          setUserProfile({
            id: authUser.id,
            name: userName,
            role: userType as UserRole,
            email: authUser.email ?? "",
          });
        } else if (newProfile) {
          setUserProfile({
            id: newProfile.id,
            name: newProfile.name,
            role: newProfile.role as UserRole,
            email: authUser.email ?? "",
            student_id: newProfile.student_id,
            is_confirmed: newProfile.is_confirmed,
          });
        }
      }
    } catch (err) {
      console.error("Auth profile error:", err);
      setUserProfile({
        id: authUser.id,
        name: authUser.email?.split("@")[0] ?? "User",
        role: "student",
        email: authUser.email ?? "",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setUserProfile(null);
  };

  const isAdmin = userProfile?.role === "admin";

  return (
    <AuthContext.Provider
      value={{ session, user, userProfile, isLoading, signOut, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
