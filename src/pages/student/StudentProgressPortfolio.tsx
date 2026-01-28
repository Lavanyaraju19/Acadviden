import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  BookOpen,
  CheckCircle,
  AlertCircle,
  Loader2,
  Download,
  ExternalLink,
  Filter,
  Award,
  FileText,
  BarChart3,
  Code,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface Course {
  id: string;
  title: string;
  modules_completed: number;
  modules_total: number;
}

interface Assignment {
  id: string;
  title: string;
  module_id: string;
  due_date?: string;
  submission_status: "pending" | "submitted" | "graded";
  grade?: number;
  feedback?: string;
}

interface Quiz {
  id: string;
  title: string;
  module_id: string;
  score?: number;
  total_questions?: number;
  passed: boolean;
  completed_at?: string;
}

interface Project {
  id: string;
  title: string;
  description?: string;
  category: "SEO" | "PPC" | "Social Media" | "Other";
  file_url?: string;
  live_url?: string;
  submitted_at: string;
  status: "pending" | "submitted" | "reviewed";
  feedback?: string;
}

interface ProgressStats {
  overallCompletion: number;
  totalAssignments: number;
  completedAssignments: number;
  totalQuizzes: number;
  quizzesPassed: number;
  averageQuizScore: number;
  submittedProjects: number;
}

type CategoryFilter = "All" | "SEO" | "PPC" | "Social Media" | "Other";

const StudentProgressPortfolio = () => {
  const { userProfile } = useAuth();

  // State
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<ProgressStats>({
    overallCompletion: 0,
    totalAssignments: 0,
    completedAssignments: 0,
    totalQuizzes: 0,
    quizzesPassed: 0,
    averageQuizScore: 0,
    submittedProjects: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("All");
  const [activeTab, setActiveTab] = useState<"progress" | "assignments" | "quizzes" | "portfolio">("progress");

  // Fetch all data
  useEffect(() => {
    const fetchAllData = async () => {
      if (!userProfile?.id) return;

      setLoading(true);
      setError(null);

      try {
        // Fetch courses with completion data
        const { data: enrollmentsData } = await (supabase as any)
          .from("enrollments")
          .select("course_id")
          .eq("student_id", userProfile.id);

        if (enrollmentsData && enrollmentsData.length > 0) {
          const courseIds = enrollmentsData.map((e) => e.course_id);
          const { data: coursesData } = await (supabase as any)
            .from("courses")
            .select("id, title");

          if (coursesData) {
            // Fetch module completion for each course
            const coursesWithProgress = await Promise.all(
              coursesData.map(async (course) => {
                const { data: modulesData } = await (supabase as any)
                  .from("modules")
                  .select("id, is_completed")
                  .eq("course_id", course.id);

                const completed = modulesData?.filter(
                  (m) => m.is_completed
                ).length || 0;
                const total = modulesData?.length || 0;

                return {
                  id: course.id,
                  title: course.title,
                  modules_completed: completed,
                  modules_total: total,
                };
              })
            );

            setCourses(coursesWithProgress);
          }
        }

        // Fetch assignments
        const { data: assignmentsData } = await (supabase as any)
          .from("assignments")
          .select("*");

        if (assignmentsData) {
          setAssignments(assignmentsData);
        }

        // Fetch quizzes with submissions
        const { data: quizzesData } = await (supabase as any)
          .from("quizzes")
          .select("*");

        let quizzesWithScores: Quiz[] = [];
        if (quizzesData) {
          quizzesWithScores = await Promise.all(
            quizzesData.map(async (quiz) => {
              const { data: submissionData } = await (supabase as any)
                .from("quiz_submissions")
                .select("*")
                .eq("quiz_id", quiz.id)
                .eq("student_id", userProfile.id)
                .single();

              return {
                id: quiz.id,
                title: quiz.title,
                module_id: quiz.module_id,
                score: submissionData?.score,
                total_questions: submissionData?.answers
                  ? Object.keys(submissionData.answers).length
                  : 0,
                passed: submissionData?.passed || false,
                completed_at: submissionData?.submitted_at,
              };
            })
          );

          setQuizzes(quizzesWithScores);
        }

        // Fetch projects
        const { data: projectsData } = await (supabase as any)
          .from("projects")
          .select("*")
          .eq("student_id", userProfile.id)
          .order("submitted_at", { ascending: false });

        if (projectsData) {
          setProjects(projectsData);
        }

        // Calculate stats
        const overallCompletion = courses.length > 0
          ? Math.round(
              (courses.reduce((sum, c) => sum + c.modules_completed, 0) /
                courses.reduce((sum, c) => sum + c.modules_total, 0)) *
                100
            )
          : 0;

        const completedAssignments = assignmentsData?.filter(
          (a) => a.submission_status === "submitted" || a.submission_status === "graded"
        ).length || 0;

        const quizzesPassed = quizzesWithScores?.filter((q) => q.passed).length || 0;

        const averageQuizScore = quizzesWithScores && quizzesWithScores.length > 0
          ? Math.round(
              quizzesWithScores.reduce((sum, q) => sum + (q.score || 0), 0) /
                quizzesWithScores.length
            )
          : 0;

        setStats({
          overallCompletion,
          totalAssignments: assignmentsData?.length || 0,
          completedAssignments,
          totalQuizzes: quizzesWithScores?.length || 0,
          quizzesPassed,
          averageQuizScore,
          submittedProjects: projectsData?.filter(
            (p) => p.status === "submitted" || p.status === "reviewed"
          ).length || 0,
        });
      } catch (err) {
        console.error("Error fetching student data:", err);
        setError("Failed to load progress data");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [userProfile?.id]);

  const filteredProjects = projects.filter(
    (p) => categoryFilter === "All" || p.category === categoryFilter
  );

  const categories: CategoryFilter[] = ["All", "SEO", "PPC", "Social Media", "Other"];

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 lg:p-8">
        <Skeleton className="h-12 w-48 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Progress & Portfolio</h1>
        <p className="text-muted-foreground">Track your learning journey and showcase your work</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Overall Completion"
          value={`${stats.overallCompletion}%`}
          icon={<BarChart3 className="w-6 h-6 text-primary" />}
        />
        <StatCard
          label="Assignments"
          value={`${stats.completedAssignments}/${stats.totalAssignments}`}
          icon={<FileText className="w-6 h-6 text-blue-500" />}
        />
        <StatCard
          label="Quizzes Passed"
          value={`${stats.quizzesPassed}/${stats.totalQuizzes}`}
          icon={<Award className="w-6 h-6 text-green-500" />}
        />
        <StatCard
          label="Projects Submitted"
          value={stats.submittedProjects}
          icon={<Code className="w-6 h-6 text-purple-500" />}
        />
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 mb-6">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6 flex flex-wrap gap-2 border-b border-border pb-4">
        {[
          { id: "progress", label: "Progress" },
          { id: "assignments", label: "Assignments" },
          { id: "quizzes", label: "Quizzes" },
          { id: "portfolio", label: "Portfolio" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted text-muted-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "progress" && (
        <div className="space-y-6">
          {/* Overall Progress */}
          <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <h3 className="font-semibold text-lg mb-4">Overall Completion Progress</h3>
            <div className="space-y-3">
              <Progress value={stats.overallCompletion} className="h-3" />
              <p className="text-sm text-muted-foreground">
                You've completed {stats.overallCompletion}% of all course modules
              </p>
            </div>
          </Card>

          {/* Course Progress */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-6">Course Progress</h3>
            {courses.length === 0 ? (
              <p className="text-muted-foreground">No courses enrolled yet</p>
            ) : (
              <div className="space-y-4">
                {courses.map((course) => {
                  const percentage = course.modules_total > 0
                    ? Math.round((course.modules_completed / course.modules_total) * 100)
                    : 0;
                  return (
                    <div key={course.id}>
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium">{course.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {course.modules_completed}/{course.modules_total} modules
                        </p>
                      </div>
                      <Progress value={percentage} />
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Learning Stats */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Learning Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{stats.totalAssignments}</p>
                <p className="text-sm text-muted-foreground">Total Assignments</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-500">{stats.completedAssignments}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-500">{stats.totalQuizzes}</p>
                <p className="text-sm text-muted-foreground">Total Quizzes</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-500">{stats.averageQuizScore}%</p>
                <p className="text-sm text-muted-foreground">Avg Quiz Score</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === "assignments" && (
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-6">Assignments</h3>
          {assignments.length === 0 ? (
            <p className="text-muted-foreground">No assignments available</p>
          ) : (
            <div className="space-y-3">
              {assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex items-start justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{assignment.title}</h4>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="outline"
                        className={
                          assignment.submission_status === "graded"
                            ? "bg-green-500/20 text-green-600 border-green-500/30"
                            : assignment.submission_status === "submitted"
                            ? "bg-blue-500/20 text-blue-600 border-blue-500/30"
                            : "bg-yellow-500/20 text-yellow-600 border-yellow-500/30"
                        }
                      >
                        {assignment.submission_status.charAt(0).toUpperCase() +
                          assignment.submission_status.slice(1)}
                      </Badge>
                      {assignment.due_date && (
                        <p className="text-sm text-muted-foreground">
                          Due: {new Date(assignment.due_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    {assignment.grade !== undefined && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Grade: <span className="font-semibold text-primary">{assignment.grade}%</span>
                      </p>
                    )}
                    {assignment.feedback && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Feedback: {assignment.feedback}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {activeTab === "quizzes" && (
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-6">Quizzes</h3>
          {quizzes.length === 0 ? (
            <p className="text-muted-foreground">No quizzes available</p>
          ) : (
            <div className="space-y-3">
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="flex items-start justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-medium mb-2">{quiz.title}</h4>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="outline"
                        className={
                          quiz.passed
                            ? "bg-green-500/20 text-green-600 border-green-500/30"
                            : quiz.completed_at
                            ? "bg-yellow-500/20 text-yellow-600 border-yellow-500/30"
                            : "bg-gray-500/20 text-gray-600 border-gray-500/30"
                        }
                      >
                        {quiz.passed ? "✓ Passed" : quiz.completed_at ? "Completed" : "Not Started"}
                      </Badge>
                    </div>
                    {quiz.score !== undefined && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Score: <span className="font-semibold text-primary">{quiz.score}%</span>
                      </p>
                    )}
                    {quiz.completed_at && (
                      <p className="text-sm text-muted-foreground">
                        Completed: {new Date(quiz.completed_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {activeTab === "portfolio" && (
        <div className="space-y-6">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  categoryFilter === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80 text-muted-foreground"
                }`}
              >
                <Filter className="w-4 h-4" />
                {cat}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          {filteredProjects.length === 0 ? (
            <Card className="p-8 text-center">
              <Code className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
              <p className="text-muted-foreground">No projects in this category yet</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <Card
                  key={project.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  <div className="p-6">
                    {/* Category Badge */}
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
                        {project.category}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={
                          project.status === "reviewed"
                            ? "bg-green-500/20 text-green-600 border-green-500/30"
                            : project.status === "submitted"
                            ? "bg-blue-500/20 text-blue-600 border-blue-500/30"
                            : "bg-yellow-500/20 text-yellow-600 border-yellow-500/30"
                        }
                      >
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                      </Badge>
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{project.title}</h3>

                    {/* Description */}
                    {project.description && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        {project.description}
                      </p>
                    )}

                    {/* Links */}
                    <div className="flex flex-col gap-2 mb-4">
                      {project.file_url && (
                        <a
                          href={project.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                        >
                          <Download className="w-4 h-4" />
                          Download Files
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                        >
                          <ExternalLink className="w-4 h-4" />
                          View Live
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    {/* Feedback */}
                    {project.feedback && (
                      <div className="p-3 rounded-lg bg-muted/50 border border-border">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Feedback:</p>
                        <p className="text-sm">{project.feedback}</p>
                      </div>
                    )}

                    {/* Date */}
                    <p className="text-xs text-muted-foreground mt-4">
                      Submitted: {new Date(project.submitted_at).toLocaleDateString()}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}

const StatCard = ({ label, value, icon }: StatCardProps) => (
  <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
    <div className="flex items-start justify-between mb-4">
      <div>
        <p className="text-sm text-muted-foreground mb-2">{label}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
      {icon}
    </div>
  </Card>
);

export default StudentProgressPortfolio;
