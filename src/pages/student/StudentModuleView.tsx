import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  FileText,
  Download,
  Upload,
  PlayCircle,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Video,
  BookOpen,
  FileCode,
  Video as VideoIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useState as useStateCheck } from "react";

interface Module {
  id: string;
  title: string;
  description: string;
  course_id: string;
  order: number;
  is_completed?: boolean;
}

interface VideoLecture {
  id: string;
  title: string;
  url: string;
  duration?: number;
  description?: string;
}

interface Material {
  id: string;
  title: string;
  file_url: string;
  file_type: string;
}

interface Quiz {
  id: string;
  title: string;
  description?: string;
  questions: QuizQuestion[];
}

interface QuizQuestion {
  id: string;
  question_text: string;
  options: string[];
  correct_answer: number;
}

interface LiveSession {
  id: string;
  title: string;
  scheduled_at: string;
  join_url?: string;
  instructor_name: string;
}

interface Assignment {
  id: string;
  title: string;
  description?: string;
  due_date?: string;
  submission_status?: "pending" | "submitted" | "graded";
}

interface QuizAnswer {
  [questionId: string]: number;
}

const StudentModuleView = () => {
  const { courseId, moduleId } = useParams<{
    courseId: string;
    moduleId: string;
  }>();
  const navigate = useNavigate();
  const { userProfile } = useAuth();

  // State
  const [module, setModule] = useState<Module | null>(null);
  const [videos, setVideos] = useState<VideoLecture[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI State
  const [selectedVideo, setSelectedVideo] = useState<VideoLecture | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswer>({});
  const [assignmentFile, setAssignmentFile] = useState<File | null>(null);
  const [submittingAssignment, setSubmittingAssignment] = useState(false);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);

  // Fetch module data
  useEffect(() => {
    const fetchModuleData = async () => {
      if (!courseId || !moduleId) {
        setError("Invalid course or module ID");
        setLoading(false);
        return;
      }

      try {
        // Fetch module info
        const { data: moduleData, error: moduleError } = await (supabase as any)
          .from("modules")
          .select("*")
          .eq("id", moduleId)
          .eq("course_id", courseId)
          .single();

        if (moduleError) throw moduleError;
        setModule(moduleData);

        // Fetch videos
        const { data: videosData } = await (supabase as any)
          .from("videos")
          .select("*")
          .eq("module_id", moduleId)
          .order("order", { ascending: true });

        if (videosData) {
          setVideos(videosData);
          if (videosData.length > 0) setSelectedVideo(videosData[0]);
        }

        // Fetch materials
        const { data: materialsData } = await (supabase as any)
          .from("materials")
          .select("*")
          .eq("module_id", moduleId)
          .order("created_at", { ascending: false });

        if (materialsData) setMaterials(materialsData);

        // Fetch quizzes
        const { data: quizzesData } = await (supabase as any)
          .from("quizzes")
          .select("*")
          .eq("module_id", moduleId);

        if (quizzesData) setQuizzes(quizzesData);

        // Fetch live sessions
        const { data: sessionsData } = await (supabase as any)
          .from("live_sessions")
          .select("*")
          .eq("module_id", moduleId)
          .gte("scheduled_at", new Date().toISOString())
          .order("scheduled_at", { ascending: true });

        if (sessionsData) setLiveSessions(sessionsData);

        // Fetch assignments
        const { data: assignmentsData } = await (supabase as any)
          .from("assignments")
          .select("*")
          .eq("module_id", moduleId);

        if (assignmentsData) setAssignments(assignmentsData);
      } catch (err) {
        console.error("Error fetching module data:", err);
        setError("Failed to load module content");
      } finally {
        setLoading(false);
      }
    };

    fetchModuleData();
  }, [courseId, moduleId]);

  const handleAssignmentSubmit = async (assignmentId: string) => {
    if (!assignmentFile || !userProfile) {
      alert("Please select a file to submit");
      return;
    }

    setSubmittingAssignment(true);
    try {
      // Upload file to Supabase storage
      const fileName = `${userProfile.id}/${assignmentId}/${Date.now()}_${assignmentFile.name}`;
      const { error: uploadError } = await (supabase as any).storage
        .from("assignment_submissions")
        .upload(fileName, assignmentFile);

      if (uploadError) throw uploadError;

      // Create submission record
      const { error: submissionError } = await (supabase as any)
        .from("assignment_submissions")
        .insert({
          assignment_id: assignmentId,
          student_id: userProfile.id,
          file_url: fileName,
          submitted_at: new Date().toISOString(),
        });

      if (submissionError) throw submissionError;

      alert("Assignment submitted successfully!");
      setAssignmentFile(null);
    } catch (err) {
      console.error("Error submitting assignment:", err);
      alert("Failed to submit assignment");
    } finally {
      setSubmittingAssignment(false);
    }
  };

  const handleQuizSubmit = async (quizId: string) => {
    if (!userProfile || Object.keys(quizAnswers).length === 0) {
      alert("Please answer all questions");
      return;
    }

    setSubmittingQuiz(true);
    try {
      const { error } = await (supabase as any)
        .from("quiz_submissions")
        .insert({
          quiz_id: quizId,
          student_id: userProfile.id,
          answers: quizAnswers,
          submitted_at: new Date().toISOString(),
        });

      if (error) throw error;

      alert("Quiz submitted successfully!");
      setQuizAnswers({});
    } catch (err) {
      console.error("Error submitting quiz:", err);
      alert("Failed to submit quiz");
    } finally {
      setSubmittingQuiz(false);
    }
  };

  const handleDownloadMaterial = (material: Material) => {
    // Create a temporary link and trigger download
    const link = document.createElement("a");
    link.href = material.file_url;
    link.download = material.title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 lg:p-8">
        <Skeleton className="h-10 w-32 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="lg:col-span-2 h-96" />
          <div className="space-y-4">
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !module) {
    return (
      <div className="min-h-screen bg-background p-4 lg:p-8 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <AlertCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error Loading Module</h2>
          <p className="text-muted-foreground mb-6">{error || "Module not found"}</p>
          <Button onClick={() => navigate(-1)} variant="outline">
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-primary hover:text-primary/80 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-3xl font-bold mb-2">{module.title}</h1>
          <p className="text-muted-foreground">{module.description}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Video & Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Video Player */}
            {selectedVideo && (
              <Card className="overflow-hidden">
                <div className="aspect-video bg-black flex items-center justify-center">
                  <iframe
                    src={selectedVideo.url}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={selectedVideo.title}
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-2">{selectedVideo.title}</h2>
                  {selectedVideo.description && (
                    <p className="text-muted-foreground">{selectedVideo.description}</p>
                  )}
                  {selectedVideo.duration && (
                    <p className="text-sm text-muted-foreground mt-4">
                      Duration: {Math.floor(selectedVideo.duration / 60)} minutes
                    </p>
                  )}
                </div>
              </Card>
            )}

            {/* Video List */}
            {videos.length > 1 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Video className="w-5 h-5 text-primary" />
                  Video Lectures
                </h3>
                <div className="space-y-2">
                  {videos.map((video) => (
                    <button
                      key={video.id}
                      onClick={() => setSelectedVideo(video)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedVideo?.id === video.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <PlayCircle className="w-5 h-5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{video.title}</p>
                          {video.duration && (
                            <p className="text-sm opacity-75">
                              {Math.floor(video.duration / 60)} min
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </Card>
            )}

            {/* Materials */}
            {materials.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Course Materials
                </h3>
                <div className="space-y-2">
                  {materials.map((material) => (
                    <div
                      key={material.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {material.file_type === "pdf" ? (
                          <FileText className="w-5 h-5 text-red-500 flex-shrink-0" />
                        ) : material.file_type === "video" ? (
                          <VideoIcon className="w-5 h-5 text-blue-500 flex-shrink-0" />
                        ) : (
                          <FileCode className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{material.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {material.file_type.toUpperCase()}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownloadMaterial(material)}
                        className="gap-2"
                      >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Download</span>
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Assignments */}
            {assignments.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-primary" />
                  Assignments
                </h3>
                <div className="space-y-4">
                  {assignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="border border-border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">{assignment.title}</h4>
                          {assignment.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {assignment.description}
                            </p>
                          )}
                        </div>
                        {assignment.submission_status && (
                          <div
                            className={`text-xs px-2 py-1 rounded ${
                              assignment.submission_status === "graded"
                                ? "bg-green-500/20 text-green-600"
                                : assignment.submission_status === "submitted"
                                ? "bg-blue-500/20 text-blue-600"
                                : "bg-yellow-500/20 text-yellow-600"
                            }`}
                          >
                            {assignment.submission_status.charAt(0).toUpperCase() +
                              assignment.submission_status.slice(1)}
                          </div>
                        )}
                      </div>

                      {assignment.due_date && (
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Due: {new Date(assignment.due_date).toLocaleDateString()}
                        </p>
                      )}

                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            onChange={(e) =>
                              setAssignmentFile(e.target.files?.[0] || null)
                            }
                            className="flex-1 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                          />
                        </div>
                        {assignmentFile && (
                          <p className="text-sm text-muted-foreground">
                            Selected: {assignmentFile.name}
                          </p>
                        )}
                        <Button
                          onClick={() => handleAssignmentSubmit(assignment.id)}
                          disabled={!assignmentFile || submittingAssignment}
                          className="w-full gap-2"
                        >
                          {submittingAssignment ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4" />
                              Submit Assignment
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Quizzes */}
            {quizzes.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Quizzes
                </h3>
                <div className="space-y-6">
                  {quizzes.map((quiz) => (
                    <div
                      key={quiz.id}
                      className="border border-border rounded-lg p-4 space-y-4"
                    >
                      <div>
                        <h4 className="font-semibold">{quiz.title}</h4>
                        {quiz.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {quiz.description}
                          </p>
                        )}
                      </div>

                      <div className="space-y-4">
                        {quiz.questions.map((question) => (
                          <div key={question.id} className="space-y-2">
                            <p className="font-medium text-sm">
                              {question.question_text}
                            </p>
                            <div className="space-y-2">
                              {question.options.map((option, index) => (
                                <label
                                  key={index}
                                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer"
                                >
                                  <input
                                    type="radio"
                                    name={`question-${question.id}`}
                                    value={index}
                                    checked={quizAnswers[question.id] === index}
                                    onChange={(e) =>
                                      setQuizAnswers({
                                        ...quizAnswers,
                                        [question.id]: parseInt(e.target.value),
                                      })
                                    }
                                    className="w-4 h-4"
                                  />
                                  <span className="text-sm">{option}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      <Button
                        onClick={() => handleQuizSubmit(quiz.id)}
                        disabled={
                          Object.keys(quizAnswers).length !==
                            quiz.questions.length || submittingQuiz
                        }
                        className="w-full gap-2"
                      >
                        {submittingQuiz ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          "Submit Quiz"
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Module Info */}
            <Card className="p-6 bg-primary/5 border-primary/20">
              <h3 className="font-semibold text-lg mb-4">Module Info</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    {module.is_completed ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-green-600">Completed</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-5 h-5 text-yellow-500" />
                        <span className="text-yellow-600">In Progress</span>
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground">Module {module.order}</p>
                </div>
              </div>
            </Card>

            {/* Live Sessions */}
            {liveSessions.length > 0 && (
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <PlayCircle className="w-5 h-5 text-primary" />
                  Live Sessions
                </h3>
                <div className="space-y-3">
                  {liveSessions.map((session) => {
                    const sessionDate = new Date(session.scheduled_at);
                    return (
                      <div
                        key={session.id}
                        className="p-3 rounded-lg bg-muted/50 border border-border"
                      >
                        <p className="font-medium text-sm line-clamp-2">
                          {session.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {session.instructor_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {sessionDate.toLocaleDateString()} at{" "}
                          {sessionDate.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        {session.join_url && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full mt-2 text-xs h-8"
                            asChild
                          >
                            <a
                              href={session.join_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Join Session
                            </a>
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}

            {/* Content Summary */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Module Content</h3>
              <div className="space-y-2 text-sm">
                {videos.length > 0 && (
                  <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                    <span className="text-muted-foreground">
                      {videos.length} Video{videos.length !== 1 ? "s" : ""}
                    </span>
                    <Video className="w-4 h-4 text-primary" />
                  </div>
                )}
                {materials.length > 0 && (
                  <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                    <span className="text-muted-foreground">
                      {materials.length} Material{materials.length !== 1 ? "s" : ""}
                    </span>
                    <FileText className="w-4 h-4 text-primary" />
                  </div>
                )}
                {assignments.length > 0 && (
                  <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                    <span className="text-muted-foreground">
                      {assignments.length} Assignment
                      {assignments.length !== 1 ? "s" : ""}
                    </span>
                    <Upload className="w-4 h-4 text-primary" />
                  </div>
                )}
                {quizzes.length > 0 && (
                  <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                    <span className="text-muted-foreground">
                      {quizzes.length} Quiz{quizzes.length !== 1 ? "zes" : ""}
                    </span>
                    <BookOpen className="w-4 h-4 text-primary" />
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentModuleView;
