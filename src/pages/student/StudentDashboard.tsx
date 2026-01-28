import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { CourseCard } from "@/components/dashboard/CourseCard";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { supabase } from "@/integrations/supabase/client";
import {
  BookOpen,
  Video,
  Award,
  Clock,
  Calendar,
  Users,
  AlertCircle,
  Play,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  modules_completed: number;
  modules_total: number;
}

interface LiveSession {
  id: string;
  title: string;
  description?: string;
  scheduled_at: string;
  instructor_name: string;
}

interface StudentProfile {
  name: string;
  overall_completion_percentage?: number;
}

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [studentName, setStudentName] = useState("Student");
  const [courses, setCourses] = useState<Course[]>([]);
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [overallCompletion, setOverallCompletion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch student profile
  const fetchStudentProfile = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      // Get student profile from database
      const { data, error: profileError } = await supabase
        .from("students")
        .select("name, overall_completion_percentage")
        .eq("user_id", user.id)
        .single();

      if (profileError) {
        console.warn("Could not fetch student profile:", profileError);
        setStudentName(user.email?.split("@")[0] || "Student");
      } else if (data) {
        setStudentName(data.name || user.email?.split("@")[0] || "Student");
        setOverallCompletion(data.overall_completion_percentage || 0);
      }
    } catch (err) {
      console.error("Error fetching student profile:", err);
    }
  };

  // Fetch enrolled courses
  const fetchCourses = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      // Get enrolled courses with completion data
      const { data, error: coursesError } = await supabase
        .from("courses")
        .select(
          `
          id,
          title,
          description,
          thumbnail,
          enrollments!inner(
            id,
            user_id
          )
        `
        )
        .eq("enrollments.user_id", user.id)
        .limit(6);

      if (coursesError) {
        console.error("Error fetching courses:", coursesError);
        setError("Failed to load courses");
        return;
      }

      if (data) {
        // Fetch modules completion for each course
        const coursesWithProgress = await Promise.all(
          data.map(async (course) => {
            const { data: modulesData } = await supabase
              .from("course_modules")
              .select("id, is_completed", {
                count: "exact",
              })
              .eq("course_id", course.id);

            const completedModules = modulesData?.filter(
              (m) => m.is_completed
            ).length || 0;
            const totalModules = modulesData?.length || 0;

            return {
              id: course.id,
              title: course.title,
              description: course.description || "",
              thumbnail:
                course.thumbnail ||
                `https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop`,
              modules_completed: completedModules,
              modules_total: totalModules,
            };
          })
        );

        setCourses(coursesWithProgress);
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError("Failed to load courses");
    }
  };

  // Fetch upcoming live sessions
  const fetchLiveSessions = async () => {
    try {
      const now = new Date().toISOString();

      const { data, error: sessionsError } = await supabase
        .from("live_sessions")
        .select("id, title, description, scheduled_at, instructor_name")
        .gte("scheduled_at", now)
        .order("scheduled_at", { ascending: true })
        .limit(5);

      if (sessionsError) {
        console.error("Error fetching live sessions:", sessionsError);
        return;
      }

      if (data) {
        setLiveSessions(data);
      }
    } catch (err) {
      console.error("Error fetching live sessions:", err);
    }
  };

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        await fetchStudentProfile();
        await fetchCourses();
        await fetchLiveSessions();
      } catch (err) {
        console.error("Error loading dashboard:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleCourseClick = (courseId: string) => {
    navigate(`/student/courses/${courseId}`);
  };

  const calculateCompletionPercentage = (completed: number, total: number) => {
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const enrolledCoursesCount = courses.length;
  const totalLessonsCompleted = courses.reduce(
    (sum, course) => sum + course.modules_completed,
    0
  );

  return (
    <DashboardLayout variant="student" userName={studentName}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold">
            Welcome back, <span className="text-gradient">{studentName}!</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Continue your learning journey and track your progress.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </>
          ) : (
            <>
              <StatsCard
                title="Enrolled Courses"
                value={enrolledCoursesCount}
                change={`${courses.length} total`}
                changeType="neutral"
                icon={BookOpen}
              />
              <StatsCard
                title="Lessons Completed"
                value={totalLessonsCompleted}
                change={`of ${courses.reduce(
                  (sum, c) => sum + c.modules_total,
                  0
                )} lessons`}
                changeType="neutral"
                icon={Video}
              />
              <StatsCard
                title="Overall Progress"
                value={`${overallCompletion}%`}
                change="Keep going!"
                changeType="positive"
                icon={Award}
              />
              <StatsCard
                title="Active Sessions"
                value={liveSessions.length}
                change="upcoming"
                changeType="neutral"
                icon={Calendar}
              />
            </>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Courses */}
          <div className="lg:col-span-2 space-y-6">
            {/* Enrolled Courses Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl font-semibold">
                  My Courses
                </h2>
                <a
                  href="/student/courses"
                  className="text-primary text-sm hover:underline flex items-center gap-1"
                >
                  View All <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-80 rounded-xl" />
                  ))}
                </div>
              ) : courses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {courses.map((course) => {
                    const completionPercentage = calculateCompletionPercentage(
                      course.modules_completed,
                      course.modules_total
                    );

                    return (
                      <div
                        key={course.id}
                        className="glass rounded-xl overflow-hidden group transition-all duration-300 hover:glow-teal cursor-pointer"
                        onClick={() => handleCourseClick(course.id)}
                      >
                        {/* Image */}
                        <div className="relative h-40 overflow-hidden">
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center">
                              <Play className="w-5 h-5 text-primary-foreground ml-1" />
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          <h3 className="font-display font-semibold text-foreground mb-2 line-clamp-2">
                            {course.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {course.description}
                          </p>

                          {/* Progress */}
                          <div className="mb-4">
                            <div className="flex justify-between text-xs mb-2">
                              <span className="text-muted-foreground">
                                Progress
                              </span>
                              <span className="text-primary font-medium">
                                {completionPercentage}%
                              </span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                style={{
                                  width: `${completionPercentage}%`,
                                }}
                              />
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                              {course.modules_completed} of{" "}
                              {course.modules_total} modules
                            </p>
                          </div>

                          <Button
                            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                            size="sm"
                          >
                            Continue Learning
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                  <p className="text-muted-foreground mb-4">
                    You haven't enrolled in any courses yet.
                  </p>
                  <Button
                    onClick={() => navigate("/student/courses")}
                    className="bg-primary"
                  >
                    Explore Courses
                  </Button>
                </Card>
              )}
            </div>
          </div>

          {/* Right Column - Student Info & Live Sessions */}
          <div className="space-y-6">
            {/* Student Info Card */}
            <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <h3 className="font-display font-semibold text-lg mb-4">
                Your Progress
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">
                      Overall Completion
                    </span>
                    <span className="font-semibold text-primary">
                      {overallCompletion}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div
                      className="bg-primary h-3 rounded-full transition-all duration-300"
                      style={{ width: `${overallCompletion}%` }}
                    />
                  </div>
                </div>
                <div className="pt-4 border-t border-primary/20">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <BookOpen className="w-4 h-4" />
                      <span>Courses</span>
                    </div>
                    <span className="font-semibold text-foreground">
                      {enrolledCoursesCount}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Video className="w-4 h-4" />
                      <span>Modules Done</span>
                    </div>
                    <span className="font-semibold text-foreground">
                      {totalLessonsCompleted}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Upcoming Live Sessions */}
            <Card className="p-6">
              <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Upcoming Sessions
              </h3>

              {loading ? (
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <Skeleton key={i} className="h-20 rounded-lg" />
                  ))}
                </div>
              ) : liveSessions.length > 0 ? (
                <div className="space-y-3">
                  {liveSessions.slice(0, 5).map((session) => {
                    const sessionDate = new Date(session.scheduled_at);
                    const isToday =
                      sessionDate.toDateString() === new Date().toDateString();
                    const isSoon =
                      sessionDate.getTime() - new Date().getTime() <
                      24 * 60 * 60 * 1000;

                    return (
                      <div
                        key={session.id}
                        className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="font-medium text-sm line-clamp-1">
                            {session.title}
                          </h4>
                          {isSoon && (
                            <span className="text-xs px-2 py-1 rounded bg-orange-500/20 text-orange-600">
                              Soon
                            </span>
                          )}
                          {isToday && (
                            <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-600">
                              Today
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          {session.instructor_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {sessionDate.toLocaleDateString()} at{" "}
                          {sessionDate.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Users className="w-10 h-10 mx-auto text-muted-foreground mb-2 opacity-50" />
                  <p className="text-sm text-muted-foreground">
                    No upcoming sessions
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
