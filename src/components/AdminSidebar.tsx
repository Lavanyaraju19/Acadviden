import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Layers,
  Users,
  FileText,
  Briefcase,
  Award,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  ChevronDown,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: <LayoutDashboard className="w-4 h-4" />, label: "Dashboard", path: "/admin/dashboard" },
  { icon: <BookOpen className="w-4 h-4" />, label: "Courses", path: "/admin/courses" },
  { icon: <Layers className="w-4 h-4" />, label: "Modules", path: "/admin/modules" },
  { icon: <Users className="w-4 h-4" />, label: "Students", path: "/admin/students" },
  { icon: <FileText className="w-4 h-4" />, label: "Assignments", path: "/admin/assignments" },
  { icon: <Briefcase className="w-4 h-4" />, label: "Jobs", path: "/admin/jobs" },
  { icon: <Award className="w-4 h-4" />, label: "Certificates", path: "/admin/certificates" },
];

export function AdminSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      logout();
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white dark:bg-gray-900"
        >
          {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white transition-transform duration-300 z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full p-6 space-y-6">
          {/* Logo */}
          <div className="flex items-center gap-2 pt-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center font-bold">
              AD
            </div>
            <div className="flex-1">
              <h1 className="font-bold text-lg">Admin</h1>
              <p className="text-xs text-gray-400">Portal</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? "bg-indigo-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                {item.icon}
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* User Section */}
          <div className="space-y-4 border-t border-gray-700 pt-4">
            {/* User Info */}
            <div className="px-4 py-3 bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-400">Logged in as</p>
              <p className="text-sm font-medium truncate">{user?.email}</p>
            </div>

            {/* Logout Button */}
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="w-full"
              size="sm"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

export default AdminSidebar;
