import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Briefcase, ExternalLink, Eye, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const portfolioItems = [
  {
    id: 1,
    title: "E-commerce SEO Audit",
    description: "Comprehensive SEO audit for an online fashion retailer with 50% traffic improvement.",
    category: "SEO",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
    skills: ["Technical SEO", "Keyword Research", "Competitor Analysis"],
    date: "2024-01",
    featured: true,
  },
  {
    id: 2,
    title: "Social Media Campaign - Restaurant Launch",
    description: "Created viral social media campaign for local restaurant opening, reaching 50K+ users.",
    category: "Social Media",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=250&fit=crop",
    skills: ["Content Creation", "Facebook Ads", "Instagram Strategy"],
    date: "2024-01",
    featured: true,
  },
  {
    id: 3,
    title: "Google Ads Campaign Optimization",
    description: "Reduced CPA by 40% while increasing conversions for SaaS company.",
    category: "PPC",
    image: "https://images.unsplash.com/photo-1553484771-371a605b060b?w=400&h=250&fit=crop",
    skills: ["Google Ads", "Landing Pages", "A/B Testing"],
    date: "2023-12",
    featured: false,
  },
  {
    id: 4,
    title: "Email Automation Workflow",
    description: "Built 5-email nurture sequence achieving 35% open rate and 12% conversion.",
    category: "Email Marketing",
    image: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=400&h=250&fit=crop",
    skills: ["Mailchimp", "Copywriting", "Marketing Automation"],
    date: "2023-12",
    featured: false,
  },
];

const StudentPortfolio = () => {
  return (
    <DashboardLayout variant="student" userName="John Doe">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl lg:text-3xl font-bold">
              My <span className="text-gradient">Portfolio</span>
            </h1>
            <p className="text-muted-foreground mt-1">
              Showcase your approved projects and achievements.
            </p>
          </div>
          <Button className="bg-primary text-primary-foreground">
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="glass rounded-xl p-4 text-center">
            <p className="text-2xl font-display font-bold text-primary">{portfolioItems.length}</p>
            <p className="text-sm text-muted-foreground">Total Projects</p>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <p className="text-2xl font-display font-bold text-primary">
              {portfolioItems.filter((p) => p.featured).length}
            </p>
            <p className="text-sm text-muted-foreground">Featured</p>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <p className="text-2xl font-display font-bold text-primary">4</p>
            <p className="text-sm text-muted-foreground">Categories</p>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <p className="text-2xl font-display font-bold text-primary">12</p>
            <p className="text-sm text-muted-foreground">Skills Showcased</p>
          </div>
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioItems.map((item) => (
            <div
              key={item.id}
              className="glass rounded-xl overflow-hidden group transition-all duration-300 hover:glow-teal"
            >
              {/* Image */}
              <div className="relative h-40 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                {item.featured && (
                  <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
                    Featured
                  </Badge>
                )}
                <Badge
                  variant="secondary"
                  className="absolute bottom-2 left-2"
                >
                  {item.category}
                </Badge>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-display font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {item.description}
                </p>

                {/* Skills */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {item.skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {new Date(item.date).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-primary">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Add New Card */}
          <div className="glass rounded-xl border-2 border-dashed border-border hover:border-primary/50 transition-colors flex flex-col items-center justify-center p-8 min-h-[300px] cursor-pointer group">
            <div className="p-4 rounded-full bg-primary/10 text-primary mb-4 group-hover:bg-primary/20 transition-colors">
              <Plus className="w-8 h-8" />
            </div>
            <p className="font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              Add New Project
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Complete a project to add it here
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentPortfolio;
