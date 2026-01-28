import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ClipboardCheck, Clock, CheckCircle, AlertCircle, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const assignments = [
  {
    id: 1,
    title: "Create SEO Audit Report",
    course: "Digital Marketing Fundamentals",
    dueDate: "2024-02-15",
    status: "pending",
    type: "assignment",
    points: 100,
  },
  {
    id: 2,
    title: "Social Media Campaign Plan",
    course: "Social Media Marketing",
    dueDate: "2024-02-18",
    status: "submitted",
    type: "assignment",
    points: 150,
    submittedDate: "2024-02-16",
  },
  {
    id: 3,
    title: "Google Ads Fundamentals Quiz",
    course: "Google Ads & PPC",
    dueDate: "2024-02-20",
    status: "pending",
    type: "quiz",
    points: 50,
    questions: 20,
  },
  {
    id: 4,
    title: "Content Calendar Creation",
    course: "Content Marketing",
    dueDate: "2024-02-10",
    status: "graded",
    type: "assignment",
    points: 100,
    score: 92,
  },
  {
    id: 5,
    title: "Email Marketing Quiz",
    course: "Email Marketing",
    dueDate: "2024-02-08",
    status: "graded",
    type: "quiz",
    points: 50,
    score: 45,
    questions: 25,
  },
  {
    id: 6,
    title: "Analytics Report Analysis",
    course: "Analytics & Data",
    dueDate: "2024-02-25",
    status: "pending",
    type: "assignment",
    points: 120,
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return <Badge variant="outline" className="border-yellow-500/50 text-yellow-400">Pending</Badge>;
    case "submitted":
      return <Badge variant="outline" className="border-blue-500/50 text-blue-400">Submitted</Badge>;
    case "graded":
      return <Badge variant="outline" className="border-green-500/50 text-green-400">Graded</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const StudentAssignments = () => {
  const pendingAssignments = assignments.filter((a) => a.status === "pending");
  const submittedAssignments = assignments.filter((a) => a.status === "submitted");
  const gradedAssignments = assignments.filter((a) => a.status === "graded");

  return (
    <DashboardLayout variant="student" userName="John Doe">
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold">
            Assignments & <span className="text-gradient">Quizzes</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Complete assignments and quizzes to test your knowledge.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass rounded-xl p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-yellow-500/20 text-yellow-400">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold">{pendingAssignments.length}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </div>
          <div className="glass rounded-xl p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-blue-500/20 text-blue-400">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold">{submittedAssignments.length}</p>
              <p className="text-sm text-muted-foreground">Submitted</p>
            </div>
          </div>
          <div className="glass rounded-xl p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-green-500/20 text-green-400">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold">{gradedAssignments.length}</p>
              <p className="text-sm text-muted-foreground">Graded</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="pending">Pending ({pendingAssignments.length})</TabsTrigger>
            <TabsTrigger value="submitted">Submitted ({submittedAssignments.length})</TabsTrigger>
            <TabsTrigger value="graded">Graded ({gradedAssignments.length})</TabsTrigger>
          </TabsList>

          {["pending", "submitted", "graded"].map((tab) => (
            <TabsContent key={tab} value={tab} className="mt-6">
              <div className="space-y-4">
                {assignments
                  .filter((a) => a.status === tab)
                  .map((assignment) => (
                    <div
                      key={assignment.id}
                      className="glass rounded-xl p-4 lg:p-6 flex flex-col lg:flex-row lg:items-center gap-4"
                    >
                      <div className={`p-3 rounded-lg ${assignment.type === "quiz" ? "bg-purple-500/20 text-purple-400" : "bg-primary/20 text-primary"}`}>
                        <ClipboardCheck className="w-6 h-6" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-foreground">
                            {assignment.title}
                          </h3>
                          <Badge variant="secondary" className="text-xs">
                            {assignment.type === "quiz" ? "Quiz" : "Assignment"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {assignment.course}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                          <span>{assignment.points} points</span>
                          {assignment.type === "quiz" && (
                            <span>{assignment.questions} questions</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {assignment.status === "graded" && (
                          <div className="text-right">
                            <p className="text-lg font-display font-bold text-primary">
                              {assignment.score}/{assignment.points}
                            </p>
                            <p className="text-xs text-muted-foreground">Score</p>
                          </div>
                        )}
                        {getStatusBadge(assignment.status)}
                        {assignment.status === "pending" && (
                          <Button size="sm" className="bg-primary text-primary-foreground">
                            {assignment.type === "quiz" ? "Start Quiz" : "Submit"}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default StudentAssignments;
