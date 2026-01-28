import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Video,
  FileText,
  ClipboardCheck,
  FolderKanban,
  Briefcase,
  Award,
  Calendar,
  MessageSquare,
  BarChart3,
  Settings,
  Users,
  Wrench,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface SidebarLink {
  name: string;
  path: string;
  icon: React.ElementType;
}

const studentLinks: SidebarLink[] = [
  { name: "Dashboard", path: "/student", icon: LayoutDashboard },
  { name: "My Courses", path: "/student/courses", icon: BookOpen },
  { name: "Video Lessons", path: "/student/lessons", icon: Video },
  { name: "Resources", path: "/student/resources", icon: FileText },
  { name: "Assignments", path: "/student/assignments", icon: ClipboardCheck },
  { name: "Projects", path: "/student/projects", icon: FolderKanban },
  { name: "Portfolio", path: "/student/portfolio", icon: Briefcase },
  { name: "Internships", path: "/student/internships", icon: GraduationCap },
  { name: "Job Board", path: "/student/jobs", icon: Briefcase },
  { name: "Certificates", path: "/student/certificates", icon: Award },
  { name: "Events", path: "/student/events", icon: Calendar },
  { name: "Messages", path: "/student/messages", icon: MessageSquare },
  { name: "Progress", path: "/student/progress", icon: BarChart3 },
];

const adminLinks: SidebarLink[] = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { name: "Courses", path: "/admin/courses", icon: BookOpen },
  { name: "Lessons", path: "/admin/lessons", icon: Video },
  { name: "Tools", path: "/admin/tools", icon: Wrench },
  { name: "Students", path: "/admin/students", icon: Users },
  { name: "Certificates", path: "/admin/certificates", icon: Award },
  { name: "Jobs", path: "/admin/jobs", icon: Briefcase },
  { name: "Events", path: "/admin/events", icon: Calendar },
  { name: "Analytics", path: "/admin/analytics", icon: BarChart3 },
  { name: "Messages", path: "/admin/messages", icon: MessageSquare },
  { name: "Settings", path: "/admin/settings", icon: Settings },
];

interface DashboardSidebarProps {
  variant: "student" | "admin";
}

export const DashboardSidebar = ({ variant }: DashboardSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const links = variant === "student" ? studentLinks : adminLinks;

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-sidebar-background border-r border-sidebar-border transition-all duration-300 z-40",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="h-16 lg:h-20 flex items-center justify-between px-4 border-b border-sidebar-border">
        {!collapsed && (
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/acadvizen-logo.png"
              alt="Acadvizen"
              className="h-10 w-auto object-contain"
            />
            <span className="font-display text-sm font-bold text-gradient">
              ACADVIZEN
            </span>
          </Link>
        )}
        {collapsed && (
          <Link to="/" className="mx-auto">
            <img
              src="/acadvizen-logo.png"
              alt="Acadvizen"
              className="h-8 w-auto object-contain"
            />
          </Link>
        )}
      </div>

      {/* Navigation */}
      <nav className="p-2 space-y-1 overflow-y-auto h-[calc(100vh-10rem)]">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
              isActive(link.path)
                ? "bg-primary/20 text-primary"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-primary"
            )}
          >
            <link.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="text-sm font-medium">{link.name}</span>}
          </Link>
        ))}
      </nav>

      {/* Collapse Button */}
      <div className="absolute bottom-4 left-0 right-0 px-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full justify-center text-muted-foreground hover:text-foreground"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </Button>
      </div>
    </aside>
  );
};
