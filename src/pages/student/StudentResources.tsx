import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { FileText, Download, Eye, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const resources = [
  {
    id: 1,
    title: "SEO Checklist 2024",
    type: "PDF",
    size: "2.4 MB",
    category: "SEO",
    downloads: 1234,
  },
  {
    id: 2,
    title: "Social Media Calendar Template",
    type: "XLSX",
    size: "1.8 MB",
    category: "Social Media",
    downloads: 892,
  },
  {
    id: 3,
    title: "Content Marketing Playbook",
    type: "PDF",
    size: "5.2 MB",
    category: "Content",
    downloads: 2341,
  },
  {
    id: 4,
    title: "Google Ads Best Practices",
    type: "PDF",
    size: "3.1 MB",
    category: "PPC",
    downloads: 1567,
  },
  {
    id: 5,
    title: "Email Campaign Templates",
    type: "ZIP",
    size: "8.4 MB",
    category: "Email",
    downloads: 789,
  },
  {
    id: 6,
    title: "Brand Guidelines Template",
    type: "PDF",
    size: "4.2 MB",
    category: "Branding",
    downloads: 1023,
  },
  {
    id: 7,
    title: "Analytics Dashboard Setup",
    type: "PDF",
    size: "2.8 MB",
    category: "Analytics",
    downloads: 654,
  },
  {
    id: 8,
    title: "Marketing Strategy Worksheet",
    type: "DOCX",
    size: "1.2 MB",
    category: "Strategy",
    downloads: 1876,
  },
];

const categories = ["All", "SEO", "Social Media", "Content", "PPC", "Email", "Analytics"];

const getFileIcon = (type: string) => {
  const colors: Record<string, string> = {
    PDF: "text-red-400 bg-red-400/20",
    XLSX: "text-green-400 bg-green-400/20",
    DOCX: "text-blue-400 bg-blue-400/20",
    ZIP: "text-yellow-400 bg-yellow-400/20",
  };
  return colors[type] || "text-primary bg-primary/20";
};

const StudentResources = () => {
  return (
    <DashboardLayout variant="student" userName="John Doe">
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold">
            <span className="text-gradient">Resources</span> & Materials
          </h1>
          <p className="text-muted-foreground mt-1">
            Download PDFs, brochures, templates, and learning materials.
          </p>
        </div>

        <Tabs defaultValue="All" className="w-full">
          <TabsList className="bg-muted/50 flex-wrap h-auto gap-1 p-1">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="text-xs">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category} value={category} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {resources
                  .filter((r) => category === "All" || r.category === category)
                  .map((resource) => (
                    <div
                      key={resource.id}
                      className="glass rounded-xl p-4 transition-all duration-300 hover:glow-teal group"
                    >
                      <div className="flex items-start gap-3 mb-4">
                        <div className={`p-3 rounded-lg ${getFileIcon(resource.type)}`}>
                          <FileText className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm text-foreground line-clamp-2">
                            {resource.title}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            {resource.type} • {resource.size}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {resource.downloads.toLocaleString()} downloads
                        </span>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-primary">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
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

export default StudentResources;
