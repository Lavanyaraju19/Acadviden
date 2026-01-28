import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type UserRole = "student" | "admin" | "instructor";

interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
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
      // Try student
      const { data: student } = await (supabase as any)
        .from("students")
        .select("id, name, role")
        .eq("user_id", authUser.id)
        .maybeSingle();

      if (student) {
        setUserProfile({
          id: student.id,
          name: student.name ?? "Student",
          role: "student",
          email: authUser.email ?? "",
        });
        setIsLoading(false);
        return;
      }

      // Try admin
      const { data: admin } = await (supabase as any)
        .from("admins")
        .select("id, name")
        .eq("user_id", authUser.id)
        .maybeSingle();

      if (admin) {
        setUserProfile({
          id: admin.id,
          name: admin.name ?? "Admin",
          role: "admin",
          email: authUser.email ?? "",
        });
        setIsLoading(false);
        return;
      }

      // Create default student
      const { data: newStudent } = await (supabase as any)
        .from("students")
        .insert({
          user_id: authUser.id,
          name: authUser.email?.split("@")[0] ?? "Student",
          role: "student",
        })
        .select()
        .single();

      if (newStudent) {
        setUserProfile({
          id: newStudent.id,
          name: newStudent.name,
          role: "student",
          email: authUser.email ?? "",
        });
      } else {
        throw new Error("Failed to create student profile");
      }
    } catch (err) {
      console.error("Auth profile error:", err);
      setUserProfile({
        id: authUser.id,
        name: "Student",
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

  return (
    <AuthContext.Provider
      value={{ session, user, userProfile, isLoading, signOut }}
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
