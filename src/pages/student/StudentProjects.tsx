import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { FolderKanban, Upload, Eye, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const projects = [
  {
    id: 1,
    title: "Complete SEO Audit for E-commerce Website",
    description: "Conduct a comprehensive SEO audit including technical, on-page, and off-page analysis.",
    course: "Digital Marketing Fundamentals",
    dueDate: "2024-02-28",
    status: "in-progress",
    progress: 65,
    deliverables: ["Technical Audit Report", "Keyword Analysis", "Competitor Analysis", "Recommendations"],
  },
  {
    id: 2,
    title: "Social Media Campaign for Local Business",
    description: "Create and execute a 2-week social media campaign for a local restaurant.",
    course: "Social Media Marketing",
    dueDate: "2024-03-05",
    status: "pending",
    progress: 0,
    deliverables: ["Campaign Strategy", "Content Calendar", "Visual Assets", "Performance Report"],
  },
  {
    id: 3,
    title: "Google Ads Campaign Setup & Optimization",
    description: "Set up and optimize a Google Ads campaign with at least $100 budget.",
    course: "Google Ads & PPC",
    dueDate: "2024-03-10",
    status: "pending",
    progress: 0,
    deliverables: ["Account Setup", "Campaign Structure", "Ad Copy", "Landing Page", "Performance Report"],
  },
  {
    id: 4,
    title: "Email Marketing Automation Workflow",
    description: "Build an automated email sequence for lead nurturing.",
    course: "Email Marketing",
    dueDate: "2024-02-01",
    status: "approved",
    progress: 100,
    deliverables: ["Email Sequence (5 emails)", "Automation Flow", "A/B Test Results"],
    score: 95,
  },
  {
    id: 5,
    title: "Content Marketing Strategy",
    description: "Develop a 3-month content marketing strategy for a B2B company.",
    course: "Content Marketing",
    dueDate: "2024-02-15",
    status: "submitted",
    progress: 100,
    deliverables: ["Content Strategy Document", "Editorial Calendar", "Content Briefs (5)"],
  },
];

const getStatusConfig = (status: string) => {
  switch (status) {
    case "pending":
      return { badge: "border-yellow-500/50 text-yellow-400", icon: Clock, color: "text-yellow-400" };
    case "in-progress":
      return { badge: "border-blue-500/50 text-blue-400", icon: AlertCircle, color: "text-blue-400" };
    case "submitted":
      return { badge: "border-purple-500/50 text-purple-400", icon: Upload, color: "text-purple-400" };
    case "approved":
      return { badge: "border-green-500/50 text-green-400", icon: CheckCircle, color: "text-green-400" };
    default:
      return { badge: "", icon: Clock, color: "" };
  }
};

const StudentProjects = () => {
  return (
    <DashboardLayout variant="student" userName="John Doe">
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold">
            Real-World <span className="text-gradient">Projects</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Apply your skills with hands-on projects that build your portfolio.
          </p>
        </div>

        <div className="space-y-6">
          {projects.map((project) => {
            const statusConfig = getStatusConfig(project.status);
            const StatusIcon = statusConfig.icon;

            return (
              <div key={project.id} className="glass rounded-xl overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/20 text-primary">
                      <FolderKanban className="w-6 h-6" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-display font-semibold text-lg text-foreground">
                            {project.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {project.course}
                          </p>
                        </div>
                        <Badge variant="outline" className={statusConfig.badge}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {project.status.charAt(0).toUpperCase() + project.status.slice(1).replace("-", " ")}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground mb-4">
                        {project.description}
                      </p>

                      {/* Progress */}
                      {project.status !== "pending" && (
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="text-primary font-medium">{project.progress}%</span>
                          </div>
                          <Progress value={project.progress} className="h-2" />
                        </div>
                      )}

                      {/* Deliverables */}
                      <div className="mb-4">
                        <p className="text-xs text-muted-foreground mb-2">Deliverables:</p>
                        <div className="flex flex-wrap gap-2">
                          {project.deliverables.map((deliverable, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {deliverable}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          Due: {new Date(project.dueDate).toLocaleDateString()}
                        </span>
                        <div className="flex gap-2">
                          {project.status === "pending" && (
                            <Button size="sm" className="bg-primary text-primary-foreground">
                              Start Project
                            </Button>
                          )}
                          {project.status === "in-progress" && (
                            <>
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4 mr-1" />
                                View Details
                              </Button>
                              <Button size="sm" className="bg-primary text-primary-foreground">
                                <Upload className="w-4 h-4 mr-1" />
                                Submit
                              </Button>
                            </>
                          )}
                          {(project.status === "submitted" || project.status === "approved") && (
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4 mr-1" />
                              View Submission
                            </Button>
                          )}
                        </div>
                      </div>

                      {project.status === "approved" && project.score && (
                        <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                          <p className="text-sm text-green-400">
                            ✓ Project approved with score: <span className="font-bold">{project.score}/100</span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentProjects;
