import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { GraduationCap, CheckCircle, Clock, Upload, FileText, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const internshipTasks = [
  {
    id: 1,
    title: "Complete Company Research",
    description: "Research 5 companies in your target industry and document your findings.",
    dueDate: "2024-02-20",
    status: "completed",
    points: 50,
  },
  {
    id: 2,
    title: "Build Marketing Campaign Brief",
    description: "Create a complete campaign brief for a hypothetical product launch.",
    dueDate: "2024-02-25",
    status: "in-progress",
    points: 100,
    progress: 60,
  },
  {
    id: 3,
    title: "Social Media Audit",
    description: "Conduct a comprehensive social media audit for assigned brand.",
    dueDate: "2024-03-01",
    status: "pending",
    points: 75,
  },
  {
    id: 4,
    title: "SEO Implementation Project",
    description: "Implement SEO improvements on the test website and document results.",
    dueDate: "2024-03-05",
    status: "pending",
    points: 150,
  },
  {
    id: 5,
    title: "Final Presentation",
    description: "Present your internship learnings and projects to the review panel.",
    dueDate: "2024-03-15",
    status: "pending",
    points: 200,
  },
];

const getStatusConfig = (status: string) => {
  switch (status) {
    case "completed":
      return { badge: "border-green-500/50 text-green-400", icon: CheckCircle };
    case "in-progress":
      return { badge: "border-blue-500/50 text-blue-400", icon: Clock };
    case "pending":
      return { badge: "border-yellow-500/50 text-yellow-400", icon: AlertCircle };
    default:
      return { badge: "", icon: Clock };
  }
};

const StudentInternships = () => {
  const completedTasks = internshipTasks.filter((t) => t.status === "completed").length;
  const totalPoints = internshipTasks.reduce((acc, t) => acc + t.points, 0);
  const earnedPoints = internshipTasks
    .filter((t) => t.status === "completed")
    .reduce((acc, t) => acc + t.points, 0);

  return (
    <DashboardLayout variant="student" userName="John Doe">
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold">
            <span className="text-gradient">Internship</span> Module
          </h1>
          <p className="text-muted-foreground mt-1">
            Complete real-world tasks to earn your internship certificate.
          </p>
        </div>

        {/* Progress Overview */}
        <div className="glass rounded-xl p-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-xl bg-primary/20 text-primary">
                <GraduationCap className="w-10 h-10" />
              </div>
              <div>
                <h2 className="font-display font-semibold text-xl">
                  Digital Marketing Internship
                </h2>
                <p className="text-muted-foreground">
                  8-week virtual internship program
                </p>
              </div>
            </div>
            <div className="flex-1 lg:max-w-md">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Overall Progress</span>
                <span className="text-primary font-medium">
                  {completedTasks}/{internshipTasks.length} tasks
                </span>
              </div>
              <Progress
                value={(completedTasks / internshipTasks.length) * 100}
                className="h-3"
              />
            </div>
            <div className="text-center lg:text-right">
              <p className="text-2xl font-display font-bold text-primary">
                {earnedPoints}/{totalPoints}
              </p>
              <p className="text-sm text-muted-foreground">Points Earned</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="glass rounded-xl p-4 text-center">
            <p className="text-2xl font-display font-bold text-green-400">{completedTasks}</p>
            <p className="text-sm text-muted-foreground">Completed</p>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <p className="text-2xl font-display font-bold text-blue-400">
              {internshipTasks.filter((t) => t.status === "in-progress").length}
            </p>
            <p className="text-sm text-muted-foreground">In Progress</p>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <p className="text-2xl font-display font-bold text-yellow-400">
              {internshipTasks.filter((t) => t.status === "pending").length}
            </p>
            <p className="text-sm text-muted-foreground">Pending</p>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <p className="text-2xl font-display font-bold text-primary">Week 3</p>
            <p className="text-sm text-muted-foreground">Current Week</p>
          </div>
        </div>

        {/* Tasks */}
        <div className="space-y-4">
          <h2 className="font-display font-semibold text-xl">Internship Tasks</h2>
          {internshipTasks.map((task) => {
            const statusConfig = getStatusConfig(task.status);
            const StatusIcon = statusConfig.icon;

            return (
              <div key={task.id} className="glass rounded-xl p-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/20 text-primary">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-foreground">{task.title}</h3>
                      <Badge variant="outline" className={statusConfig.badge}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {task.status.charAt(0).toUpperCase() + task.status.slice(1).replace("-", " ")}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {task.description}
                    </p>
                    {task.status === "in-progress" && task.progress && (
                      <div className="max-w-md">
                        <Progress value={task.progress} className="h-2" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-primary">{task.points} pts</p>
                      <p className="text-xs text-muted-foreground">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    {task.status === "pending" && (
                      <Button size="sm" className="bg-primary text-primary-foreground">
                        Start
                      </Button>
                    )}
                    {task.status === "in-progress" && (
                      <Button size="sm" className="bg-primary text-primary-foreground">
                        <Upload className="w-4 h-4 mr-1" />
                        Submit
                      </Button>
                    )}
                    {task.status === "completed" && (
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Completion Banner */}
        <div className="glass rounded-xl p-6 border border-primary/30 bg-primary/5">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/20 text-primary">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h3 className="font-display font-semibold text-lg">
                Complete all tasks to earn your certificate!
              </h3>
              <p className="text-muted-foreground">
                Finish your internship tasks to receive a verified certificate and add it to your portfolio.
              </p>
            </div>
            <Button className="bg-primary text-primary-foreground" disabled>
              Certificate Pending
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentInternships;
