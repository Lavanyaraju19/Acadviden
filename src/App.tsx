import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AuthRedirect } from "@/components/AuthRedirect";

// Public Pages
import Index from "./pages/Index";
import Courses from "./pages/Courses";
import Tools from "./pages/Tools";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import AuthCallback from "./pages/AuthCallback";
import NotFound from "./pages/NotFound";

// Student Pages
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentCourses from "./pages/student/StudentCourses";
import StudentLessons from "./pages/student/StudentLessons";
import StudentResources from "./pages/student/StudentResources";
import StudentAssignments from "./pages/student/StudentAssignments";
import StudentProjects from "./pages/student/StudentProjects";
import StudentPortfolio from "./pages/student/StudentPortfolio";
import StudentInternships from "./pages/student/StudentInternships";
import StudentJobs from "./pages/student/StudentJobs";
import StudentCertificates from "./pages/student/StudentCertificates";
import StudentEvents from "./pages/student/StudentEvents";
import StudentMessages from "./pages/student/StudentMessages";
import StudentProgress from "./pages/student/StudentProgress";
import StudentModuleView from "./pages/student/StudentModuleView";
import StudentProgressPortfolio from "./pages/student/StudentProgressPortfolio";
import CareerSupport from "./pages/student/CareerSupport";
import LiveSessions from "./pages/student/LiveSessions";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminLessons from "./pages/admin/AdminLessons";
import AdminTools from "./pages/admin/AdminTools";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminCertificates from "./pages/admin/AdminCertificates";
import AdminJobs from "./pages/admin/AdminJobs";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminManagement from "./pages/admin/AdminManagement";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <Routes>

              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/dashboard" element={<AuthRedirect />} />

              {/* Student Routes */}
              <Route
                path="/student"
                element={
                  <ProtectedRoute>
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/student/courses" element={<ProtectedRoute><StudentCourses /></ProtectedRoute>} />
              <Route path="/student/courses/:courseId/modules/:moduleId" element={<ProtectedRoute><StudentModuleView /></ProtectedRoute>} />
              <Route path="/student/lessons" element={<ProtectedRoute><StudentLessons /></ProtectedRoute>} />
              <Route path="/student/resources" element={<ProtectedRoute><StudentResources /></ProtectedRoute>} />
              <Route path="/student/assignments" element={<ProtectedRoute><StudentAssignments /></ProtectedRoute>} />
              <Route path="/student/projects" element={<ProtectedRoute><StudentProjects /></ProtectedRoute>} />
              <Route path="/student/portfolio" element={<ProtectedRoute><StudentPortfolio /></ProtectedRoute>} />
              <Route path="/student/internships" element={<ProtectedRoute><StudentInternships /></ProtectedRoute>} />
              <Route path="/student/jobs" element={<ProtectedRoute><StudentJobs /></ProtectedRoute>} />
              <Route path="/student/certificates" element={<ProtectedRoute><StudentCertificates /></ProtectedRoute>} />
              <Route path="/student/events" element={<ProtectedRoute><StudentEvents /></ProtectedRoute>} />
              <Route path="/student/messages" element={<ProtectedRoute><StudentMessages /></ProtectedRoute>} />
              <Route path="/student/progress" element={<ProtectedRoute><StudentProgress /></ProtectedRoute>} />
              <Route path="/student/progress-portfolio" element={<ProtectedRoute><StudentProgressPortfolio /></ProtectedRoute>} />
              <Route path="/student/career-support" element={<ProtectedRoute><CareerSupport /></ProtectedRoute>} />
              <Route path="/student/live-sessions" element={<ProtectedRoute><LiveSessions /></ProtectedRoute>} />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/admin/courses" element={<ProtectedRoute requiredRole="admin"><AdminCourses /></ProtectedRoute>} />
              <Route path="/admin/lessons" element={<ProtectedRoute requiredRole="admin"><AdminLessons /></ProtectedRoute>} />
              <Route path="/admin/tools" element={<ProtectedRoute requiredRole="admin"><AdminTools /></ProtectedRoute>} />
              <Route path="/admin/students" element={<ProtectedRoute requiredRole="admin"><AdminStudents /></ProtectedRoute>} />
              <Route path="/admin/certificates" element={<ProtectedRoute requiredRole="admin"><AdminCertificates /></ProtectedRoute>} />
              <Route path="/admin/jobs" element={<ProtectedRoute requiredRole="admin"><AdminJobs /></ProtectedRoute>} />
              <Route path="/admin/events" element={<ProtectedRoute requiredRole="admin"><AdminEvents /></ProtectedRoute>} />
              <Route path="/admin/analytics" element={<ProtectedRoute requiredRole="admin"><AdminAnalytics /></ProtectedRoute>} />
              <Route path="/admin/messages" element={<ProtectedRoute requiredRole="admin"><AdminMessages /></ProtectedRoute>} />
              <Route path="/admin/settings" element={<ProtectedRoute requiredRole="admin"><AdminSettings /></ProtectedRoute>} />
              <Route path="/admin/management" element={<ProtectedRoute requiredRole="admin"><AdminManagement /></ProtectedRoute>} />

              {/* Fallback */}
              <Route path="*" element={<NotFound />} />

            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
