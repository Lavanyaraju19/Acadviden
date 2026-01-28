import { ReactNode } from "react";
import { AdminSidebar } from "@/components/AdminSidebar";

interface AdminLayoutProps {
  children: ReactNode;
  userName?: string;
}

export function AdminLayout({ children, userName = "Admin" }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <AdminSidebar userName={userName} />

      {/* Main Content */}
      <main className="flex-1 md:ml-64 pt-16 md:pt-0">
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
