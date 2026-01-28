import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Briefcase, MapPin, Clock, DollarSign, ExternalLink, Bookmark, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const jobs = [
  {
    id: 1,
    title: "Digital Marketing Specialist",
    company: "TechCorp Inc.",
    location: "Remote",
    type: "Full-time",
    salary: "$50,000 - $70,000",
    posted: "2 days ago",
    description: "Looking for a skilled digital marketer to lead our online campaigns.",
    skills: ["SEO", "Google Ads", "Content Marketing"],
    logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop",
    featured: true,
  },
  {
    id: 2,
    title: "Social Media Manager",
    company: "Creative Agency",
    location: "New York, NY",
    type: "Full-time",
    salary: "$55,000 - $75,000",
    posted: "3 days ago",
    description: "Manage social media presence for multiple high-profile clients.",
    skills: ["Social Media", "Content Creation", "Analytics"],
    logo: "https://images.unsplash.com/photo-1572021335469-31706a17ber0?w=100&h=100&fit=crop",
    featured: true,
  },
  {
    id: 3,
    title: "SEO Analyst",
    company: "Growth Marketing Co.",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$60,000 - $80,000",
    posted: "1 week ago",
    description: "Drive organic growth through strategic SEO initiatives.",
    skills: ["SEO", "Analytics", "Technical SEO"],
    logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop",
    featured: false,
  },
  {
    id: 4,
    title: "Content Marketing Intern",
    company: "StartupXYZ",
    location: "Remote",
    type: "Internship",
    salary: "$20/hour",
    posted: "1 week ago",
    description: "Great opportunity to learn content marketing in a fast-paced environment.",
    skills: ["Writing", "Research", "Social Media"],
    logo: "https://images.unsplash.com/photo-1572021335469-31706a17ber0?w=100&h=100&fit=crop",
    featured: false,
  },
  {
    id: 5,
    title: "PPC Campaign Manager",
    company: "AdTech Solutions",
    location: "Austin, TX",
    type: "Full-time",
    salary: "$65,000 - $85,000",
    posted: "2 weeks ago",
    description: "Manage and optimize PPC campaigns across multiple platforms.",
    skills: ["Google Ads", "Facebook Ads", "Analytics"],
    logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop",
    featured: false,
  },
  {
    id: 6,
    title: "Email Marketing Specialist",
    company: "E-commerce Giant",
    location: "Remote",
    type: "Contract",
    salary: "$45/hour",
    posted: "3 weeks ago",
    description: "Build and optimize email marketing campaigns for our e-commerce platform.",
    skills: ["Email Marketing", "Automation", "Copywriting"],
    logo: "https://images.unsplash.com/photo-1572021335469-31706a17ber0?w=100&h=100&fit=crop",
    featured: false,
  },
];

const StudentJobs = () => {
  return (
    <DashboardLayout variant="student" userName="John Doe">
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold">
            Job <span className="text-gradient">Board</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Find your dream job in digital marketing.
          </p>
        </div>

        {/* Filters */}
        <div className="glass rounded-xl p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input placeholder="Search jobs..." className="bg-background" />
            <Select defaultValue="all">
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="eu">Europe</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-primary text-primary-foreground">
              Search Jobs
            </Button>
          </div>
        </div>

        {/* Job Listings */}
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className={`glass rounded-xl p-6 transition-all duration-300 hover:glow-teal ${
                job.featured ? "ring-1 ring-primary/50" : ""
              }`}
            >
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Company Logo */}
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <img
                    src={job.logo}
                    alt={job.company}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop";
                    }}
                  />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display font-semibold text-lg text-foreground">
                          {job.title}
                        </h3>
                        {job.featured && (
                          <Badge className="bg-primary text-primary-foreground">
                            Featured
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building className="w-4 h-4" />
                        {job.company}
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Bookmark className="w-5 h-5" />
                    </Button>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">
                    {job.description}
                  </p>

                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {job.type}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {job.salary}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {job.posted}
                    </div>
                  </div>

                  {/* Skills & Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <ExternalLink className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                      <Button size="sm" className="bg-primary text-primary-foreground">
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Career Resources */}
        <div className="glass rounded-xl p-6">
          <h2 className="font-display font-semibold text-lg mb-4">Career Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
              <span className="text-primary">📄</span>
              <span>Resume Templates</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
              <span className="text-primary">💡</span>
              <span>Interview Tips</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
              <span className="text-primary">🎯</span>
              <span>Career Coaching</span>
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentJobs;
