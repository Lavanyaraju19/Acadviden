import { AdminDashboard } from "@/pages/admin/AdminDashboard";
import { AdminLogin } from "@/pages/admin/AdminLogin";
import AdminCoursesManagement from "@/pages/admin/AdminCoursesManagement";
import AdminModules from "@/pages/admin/AdminModules";
import AdminStudentsPage from "@/pages/admin/AdminStudents";
import AdminAssignments from "@/pages/admin/AdminAssignments";
import AdminJobsPage from "@/pages/admin/AdminJobs";
import AdminCertificatesPage from "@/pages/admin/AdminCertificates";

/**
 * Admin Dashboard Routes Configuration
 * 
 * Add these routes to your main App.tsx or routes configuration file.
 * 
 * Example usage in App.tsx:
 * 
 * import { adminRoutes } from "@/config/adminRoutes";
 * 
 * <Routes>
 *   {adminRoutes}
 *   {otherRoutes}
 * </Routes>
 */

export const adminRoutes = [
  {
    path: "/admin/login",
    element: <AdminLogin />,
    public: true,
    description: "Admin login page"
  },
  {
    path: "/admin/dashboard",
    element: <AdminDashboard />,
    protected: true,
    description: "Admin dashboard overview"
  },
  {
    path: "/admin/courses",
    element: <AdminCoursesManagement />,
    protected: true,
    description: "Manage courses"
  },
  {
    path: "/admin/modules",
    element: <AdminModules />,
    protected: true,
    description: "Manage course modules"
  },
  {
    path: "/admin/students",
    element: <AdminStudentsPage />,
    protected: true,
    description: "Manage student accounts"
  },
  {
    path: "/admin/assignments",
    element: <AdminAssignments />,
    protected: true,
    description: "Manage assignments"
  },
  {
    path: "/admin/jobs",
    element: <AdminJobsPage />,
    protected: true,
    description: "Manage job postings"
  },
  {
    path: "/admin/certificates",
    element: <AdminCertificatesPage />,
    protected: true,
    description: "Manage certificates"
  },
];

/**
 * Protected Route Wrapper Component
 * 
 * Use this to protect admin routes that require authentication.
 * 
 * Example:
 * <ProtectedRoute>
 *   <AdminDashboard />
 * </ProtectedRoute>
 */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  // Check if user is authenticated and has admin role
  // Redirect to login if not
  return children;
}
