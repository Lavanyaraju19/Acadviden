import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Award, Download, Eye, Share2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const certificates = [
  {
    id: 1,
    title: "Digital Marketing Fundamentals",
    issueDate: "2024-01-15",
    credentialId: "DM-2024-001234",
    skills: ["SEO", "Content Marketing", "Analytics"],
    status: "earned",
  },
  {
    id: 2,
    title: "Social Media Marketing Specialist",
    issueDate: "2024-01-22",
    credentialId: "SMM-2024-005678",
    skills: ["Facebook", "Instagram", "LinkedIn", "Content Creation"],
    status: "earned",
  },
  {
    id: 3,
    title: "Email Marketing Professional",
    issueDate: "2024-02-01",
    credentialId: "EMP-2024-009012",
    skills: ["Email Automation", "Copywriting", "A/B Testing"],
    status: "earned",
  },
  {
    id: 4,
    title: "Google Ads Certified",
    progress: 85,
    skills: ["Search Ads", "Display Ads", "Video Ads"],
    status: "in-progress",
  },
  {
    id: 5,
    title: "Analytics & Data-Driven Marketing",
    progress: 45,
    skills: ["Google Analytics", "Data Visualization", "Reporting"],
    status: "in-progress",
  },
];

const StudentCertificates = () => {
  const earnedCertificates = certificates.filter((c) => c.status === "earned");
  const inProgressCertificates = certificates.filter((c) => c.status === "in-progress");

  return (
    <DashboardLayout variant="student" userName="John Doe">
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold">
            My <span className="text-gradient">Certificates</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            View and download your earned certificates.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass rounded-xl p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/20 text-primary">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold">{earnedCertificates.length}</p>
              <p className="text-sm text-muted-foreground">Earned</p>
            </div>
          </div>
          <div className="glass rounded-xl p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-yellow-500/20 text-yellow-400">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold">{inProgressCertificates.length}</p>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </div>
          </div>
          <div className="glass rounded-xl p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-blue-500/20 text-blue-400">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold">2</p>
              <p className="text-sm text-muted-foreground">Shared</p>
            </div>
          </div>
        </div>

        {/* Earned Certificates */}
        <div>
          <h2 className="font-display font-semibold text-xl mb-4">Earned Certificates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {earnedCertificates.map((cert) => (
              <div
                key={cert.id}
                className="glass rounded-xl overflow-hidden group transition-all duration-300 hover:glow-teal"
              >
                {/* Certificate Preview */}
                <div className="relative h-40 bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center">
                  <div className="text-center">
                    <Award className="w-12 h-12 text-primary mx-auto mb-2" />
                    <p className="font-display font-bold text-lg text-foreground">
                      Certificate
                    </p>
                  </div>
                  <Badge className="absolute top-2 right-2 bg-green-500 text-white">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-display font-semibold text-foreground mb-2">
                    {cert.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    Issued: {new Date(cert.issueDate!).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Credential ID: {cert.credentialId}
                  </p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {cert.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* In Progress */}
        <div>
          <h2 className="font-display font-semibold text-xl mb-4">In Progress</h2>
          <div className="space-y-4">
            {inProgressCertificates.map((cert) => (
              <div key={cert.id} className="glass rounded-xl p-4 lg:p-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="p-3 rounded-lg bg-yellow-500/20 text-yellow-400">
                    <Award className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">{cert.title}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {cert.skills.map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-display font-bold text-primary">
                        {cert.progress}%
                      </p>
                      <p className="text-xs text-muted-foreground">Progress</p>
                    </div>
                    <Button size="sm" className="bg-primary text-primary-foreground">
                      Continue
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentCertificates;
