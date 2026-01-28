import { ReactNode, useState } from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardHeader } from "./DashboardHeader";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
  variant: "student" | "admin";
  userName?: string;
}

export const DashboardLayout = ({
  children,
  variant,
  userName = "John Doe",
}: DashboardLayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <DashboardSidebar variant={variant} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-64 bg-sidebar-background border-r border-sidebar-border">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
            <DashboardSidebar variant={variant} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="lg:ml-64">
        <DashboardHeader
          userName={userName}
          userRole={variant === "student" ? "Student" : "Administrator"}
          onMenuClick={() => setMobileMenuOpen(true)}
        />
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
};
