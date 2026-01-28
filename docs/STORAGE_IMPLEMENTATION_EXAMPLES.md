# Supabase Storage Implementation Examples

## Student Assignment Submission Page

```tsx
// src/pages/SubmitAssignment.tsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AssignmentUpload } from "@/components/AssignmentUpload";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Calendar, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Assignment {
  id: string;
  title: string;
  description: string;
  due_date: string;
  points: number;
}

export function SubmitAssignmentPage() {
  const { courseId, assignmentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [isOverdue, setIsOverdue] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAssignment();
  }, [assignmentId]);

  const loadAssignment = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from("assignments")
        .select("*")
        .eq("id", assignmentId)
        .single();

      if (error) throw error;

      setAssignment(data);
      setIsOverdue(new Date(data.due_date) < new Date());
    } catch (error) {
      console.error("Failed to load assignment:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading assignment...</div>;
  }

  if (!assignment) {
    return <div>Assignment not found</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Assignment Header */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold">{assignment.title}</h1>
              <p className="text-muted-foreground mt-2">{assignment.description}</p>
            </div>
            <Badge variant="outline" className="text-lg px-3 py-1">
              {assignment.points} pts
            </Badge>
          </div>

          {/* Assignment Details */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Due Date</p>
                <p className="font-semibold">
                  {new Date(assignment.due_date).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className={`font-semibold ${isOverdue ? "text-red-600" : "text-green-600"}`}>
                  {isOverdue ? "Overdue" : "Open"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Overdue Warning */}
      {isOverdue && (
        <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-red-700 dark:text-red-200">
            <p className="font-semibold">This assignment is overdue</p>
            <p className="mt-1">Late submissions may be subject to penalties</p>
          </div>
        </div>
      )}

      {/* Assignment Upload Form */}
      <AssignmentUpload
        assignmentId={assignmentId!}
        assignmentTitle={assignment.title}
        courseId={courseId!}
        moduleId="" // You would get this from the assignment or context
        onUploadSuccess={(submissionId) => {
          navigate(`/student/assignments/${submissionId}`);
        }}
      />
    </div>
  );
}

export default SubmitAssignmentPage;
```

## Instructor Video Upload Page

```tsx
// src/pages/teacher/UploadCourseVideo.tsx

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { VideoUpload } from "@/components/VideoUpload";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Video } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Module {
  id: string;
  title: string;
}

interface Course {
  id: string;
  title: string;
}

export function UploadCourseVideoPage() {
  const { courseId, moduleId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [course, setCourse] = useState<Course | null>(null);
  const [module, setModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourseAndModule();
  }, [courseId, moduleId]);

  const loadCourseAndModule = async () => {
    try {
      const [courseRes, moduleRes] = await Promise.all([
        (supabase as any)
          .from("courses")
          .select("id, title")
          .eq("id", courseId)
          .single(),
        (supabase as any)
          .from("course_modules")
          .select("id, title")
          .eq("id", moduleId)
          .single(),
      ]);

      if (courseRes.error) throw courseRes.error;
      if (moduleRes.error) throw moduleRes.error;

      setCourse(courseRes.data);
      setModule(moduleRes.data);
    } catch (error) {
      console.error("Failed to load data:", error);
      toast({
        title: "Error",
        description: "Failed to load course information",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!course || !module) return <div>Course or module not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Navigation */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <p className="text-sm text-muted-foreground">{course.title}</p>
          <h1 className="text-2xl font-bold">{module.title}</h1>
        </div>
      </div>

      {/* Upload Component */}
      <VideoUpload
        courseId={courseId!}
        moduleId={moduleId!}
        courseName={course.title}
        moduleName={module.title}
        onUploadSuccess={(videoId) => {
          toast({
            title: "Success",
            description: "Video uploaded and published successfully",
          });
        }}
      />

      {/* Video Tips */}
      <Card className="p-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Video className="w-5 h-5" />
          Video Tips
        </h3>
        <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-200">
          <li>✓ Use clear audio and good lighting for best quality</li>
          <li>✓ Keep videos between 5-20 minutes for better engagement</li>
          <li>✓ Include subtitles for accessibility</li>
          <li>✓ Test audio/video before uploading</li>
          <li>✓ Use descriptive titles and clear descriptions</li>
        </ul>
      </Card>
    </div>
  );
}

export default UploadCourseVideoPage;
```

## Course Material PDF Upload Page

```tsx
// src/pages/teacher/UploadCourseMaterial.tsx

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { PDFUpload } from "@/components/PDFUpload";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface CourseModule {
  id: string;
  title: string;
}

interface Course {
  id: string;
  title: string;
}

export function UploadCourseMaterialPage() {
  const { courseId, moduleId } = useParams();
  const { toast } = useToast();
  const [course, setCourse] = useState<Course | null>(null);
  const [module, setModule] = useState<CourseModule | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [courseId, moduleId]);

  const loadData = async () => {
    try {
      const [courseRes, moduleRes] = await Promise.all([
        (supabase as any)
          .from("courses")
          .select("id, title")
          .eq("id", courseId)
          .single(),
        (supabase as any)
          .from("course_modules")
          .select("id, title")
          .eq("id", moduleId)
          .single(),
      ]);

      if (courseRes.error) throw courseRes.error;
      if (moduleRes.error) throw moduleRes.error;

      setCourse(courseRes.data);
      setModule(moduleRes.data);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!course || !module) return <div>Not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <p className="text-sm text-muted-foreground">{course.title}</p>
          <h1 className="text-2xl font-bold">{module.title}</h1>
        </div>
      </div>

      {/* Upload Component */}
      <PDFUpload
        courseId={courseId!}
        moduleId={moduleId!}
        courseName={course.title}
        moduleName={module.title}
        onUploadSuccess={(pdfId) => {
          toast({
            title: "Success",
            description: "Course material uploaded successfully",
          });
        }}
      />

      {/* Material Organization Guide */}
      <Card className="p-6 bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Organizing Course Materials
        </h3>
        <div className="space-y-3 text-sm text-purple-700 dark:text-purple-200">
          <div>
            <p className="font-semibold">Lecture Notes</p>
            <p>Notes from your class lectures</p>
          </div>
          <div>
            <p className="font-semibold">Reading Material</p>
            <p>Recommended readings and textbook chapters</p>
          </div>
          <div>
            <p className="font-semibold">Assignment Guides</p>
            <p>Detailed instructions and rubrics for assignments</p>
          </div>
          <div>
            <p className="font-semibold">Reference Materials</p>
            <p>Additional resources and references</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default UploadCourseMaterialPage;
```

## Issue Certificates Page

```tsx
// src/pages/admin/IssueCertificates.tsx

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CertificateUpload } from "@/components/CertificateUpload";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Award, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface CourseInfo {
  id: string;
  title: string;
  students_count: number;
}

export function IssueCertificatesPage() {
  const { courseId } = useParams();
  const { toast } = useToast();
  const [course, setCourse] = useState<CourseInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourse();
  }, [courseId]);

  const loadCourse = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from("courses")
        .select("id, title, students_count")
        .eq("id", courseId)
        .single();

      if (error) throw error;
      setCourse(data);
    } catch (error) {
      console.error("Failed to load course:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!course) return <div>Course not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-600" />
            Issue Certificate
          </h1>
          <p className="text-muted-foreground">{course.title}</p>
        </div>
      </div>

      {/* Info Card */}
      <Card className="p-4 bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-amber-700 dark:text-amber-200">Students in Course</p>
            <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">
              {course.students_count}
            </p>
          </div>
          <Badge variant="outline" className="text-lg">
            {course.students_count} Students
          </Badge>
        </div>
      </Card>

      {/* Certificate Upload */}
      <CertificateUpload
        courseId={courseId!}
        courseName={course.title}
        onUploadSuccess={(certId) => {
          toast({
            title: "Success",
            description: "Certificate issued successfully",
          });
        }}
      />
    </div>
  );
}

export default IssueCertificatesPage;
```

## View Student Submissions Page

```tsx
// src/pages/teacher/ViewAssignmentSubmissions.tsx

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Download,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getSignedUrl } from "@/integrations/supabase/storage";

interface Submission {
  id: string;
  student_id: string;
  student_name: string;
  file_name: string;
  file_path: string;
  file_url: string;
  submitted_at: string;
  status: "submitted" | "grading" | "graded" | "returned";
  grade?: number;
  notes: string;
}

export function ViewAssignmentSubmissionsPage() {
  const { assignmentId } = useParams();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubmissions();
  }, [assignmentId]);

  const loadSubmissions = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from("assignment_submissions")
        .select(
          `
          id,
          student_id,
          file_name,
          file_path,
          file_url,
          submitted_at,
          status,
          grade,
          notes,
          users(full_name)
        `
        )
        .eq("assignment_id", assignmentId);

      if (error) throw error;

      setSubmissions(
        data.map((sub: any) => ({
          ...sub,
          student_name: sub.users?.full_name || "Unknown",
        }))
      );
    } catch (error) {
      console.error("Failed to load submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (filePath: string, fileName: string) => {
    try {
      const url = getSignedUrl("student-assignments", filePath);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "graded":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "grading":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "returned":
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
      default:
        return <FileText className="w-4 h-4 text-blue-600" />;
    }
  };

  if (loading) return <div>Loading submissions...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Student Submissions</h1>
        <p className="text-muted-foreground">
          {submissions.length} submission{submissions.length !== 1 ? "s" : ""}
        </p>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>File</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Grade</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((submission) => (
              <TableRow key={submission.id}>
                <TableCell className="font-medium">{submission.student_name}</TableCell>
                <TableCell>
                  {new Date(submission.submitted_at).toLocaleDateString()}
                </TableCell>
                <TableCell>{submission.file_name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="flex items-center gap-2 w-fit">
                    {getStatusIcon(submission.status)}
                    {submission.status}
                  </Badge>
                </TableCell>
                <TableCell>{submission.grade || "-"}</TableCell>
                <TableCell className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      handleDownload(submission.file_path, submission.file_name)
                    }
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

export default ViewAssignmentSubmissionsPage;
```

## Student Dashboard with Assignments

```tsx
// src/components/dashboard/AssignmentsSection.tsx

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Clock, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface AssignmentItem {
  id: string;
  title: string;
  due_date: string;
  course_id: string;
  points: number;
  status: "submitted" | "pending" | "graded" | "overdue";
  grade?: number;
}

export function AssignmentsSection() {
  const [assignments, setAssignments] = useState<AssignmentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from("assignments")
        .select(
          `
          id,
          title,
          due_date,
          course_id,
          points,
          assignment_submissions(status, grade)
        `
        )
        .order("due_date", { ascending: true })
        .limit(5);

      if (error) throw error;

      // Map submissions to status
      const mapped = data.map((a: any) => {
        const now = new Date();
        const due = new Date(a.due_date);
        const submitted = a.assignment_submissions?.[0];

        let status: "submitted" | "pending" | "graded" | "overdue";
        if (submitted?.status === "graded") {
          status = "graded";
        } else if (submitted) {
          status = "submitted";
        } else if (due < now) {
          status = "overdue";
        } else {
          status = "pending";
        }

        return {
          id: a.id,
          title: a.title,
          due_date: a.due_date,
          course_id: a.course_id,
          points: a.points,
          status,
          grade: submitted?.grade,
        };
      });

      setAssignments(mapped);
    } catch (error) {
      console.error("Failed to load assignments:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "graded":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "submitted":
        return <Clock className="w-4 h-4 text-blue-600" />;
      case "overdue":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "graded":
        return "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300";
      case "submitted":
        return "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300";
      case "overdue":
        return "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300";
      default:
        return "bg-gray-50 dark:bg-gray-950 text-gray-700 dark:text-gray-300";
    }
  };

  if (loading) return <div>Loading assignments...</div>;

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Assignments</h2>

      <div className="space-y-3">
        {assignments.map((assignment) => (
          <div
            key={assignment.id}
            className="p-4 border rounded-lg hover:bg-muted/50 transition"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{assignment.title}</p>
                <p className="text-sm text-muted-foreground">
                  Due: {new Date(assignment.due_date).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={`flex items-center gap-1 ${getStatusColor(assignment.status)}`}
                >
                  {getStatusIcon(assignment.status)}
                  {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                </Badge>

                {assignment.grade !== undefined && (
                  <Badge variant="secondary">
                    {assignment.grade}/{assignment.points}
                  </Badge>
                )}

                <Link
                  to={`/student/courses/${assignment.course_id}/assignments/${assignment.id}`}
                >
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default AssignmentsSection;
```

## Complete File Structure

After implementing these examples, your file structure should look like:

```
src/
├── components/
│   ├── FileUpload.tsx (existing)
│   ├── AssignmentUpload.tsx (existing)
│   ├── CertificateUpload.tsx (new)
│   ├── VideoUpload.tsx (new)
│   ├── PDFUpload.tsx (new)
│   └── dashboard/
│       └── AssignmentsSection.tsx (new)
├── integrations/
│   └── supabase/
│       ├── client.ts (existing)
│       ├── storage.ts (existing)
│       └── types.ts (existing)
├── pages/
│   ├── SubmitAssignment.tsx (new)
│   ├── admin/
│   │   └── IssueCertificates.tsx (new)
│   ├── student/
│   └── teacher/
│       ├── UploadCourseVideo.tsx (new)
│       ├── UploadCourseMaterial.tsx (new)
│       └── ViewAssignmentSubmissions.tsx (new)
└── docs/
    ├── STORAGE_DATABASE_SCHEMA.md (new)
    └── STORAGE_INTEGRATION_GUIDE.md (new)
```

## Integration Checklist

- [ ] Create all 4 storage buckets in Supabase
- [ ] Create all 4 database tables
- [ ] Enable RLS on tables
- [ ] Import components in your routes
- [ ] Add links in navigation
- [ ] Test file uploads with different file types
- [ ] Test file downloads
- [ ] Verify database records are created
- [ ] Test with large files (near limits)
- [ ] Test error handling with invalid files
- [ ] Verify signed URLs work correctly
- [ ] Test certificate issuance workflow
- [ ] Test video playback on different browsers
- [ ] Test PDF preview on different browsers
- [ ] Load test with multiple concurrent uploads

