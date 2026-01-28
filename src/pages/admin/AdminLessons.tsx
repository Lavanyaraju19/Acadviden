import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DataTable } from "@/components/dashboard/DataTable";
import { Plus, Search, Video, FileText, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const lessons = [
  { id: 1, title: "Introduction to Digital Marketing", course: "Digital Marketing Fundamentals", type: "Video", duration: "15 min", status: "Published" },
  { id: 2, title: "Understanding Your Audience", course: "Digital Marketing Fundamentals", type: "Video", duration: "22 min", status: "Published" },
  { id: 3, title: "SEO Fundamentals", course: "Digital Marketing Fundamentals", type: "Video", duration: "28 min", status: "Published" },
  { id: 4, title: "Keyword Research", course: "Digital Marketing Fundamentals", type: "Video", duration: "35 min", status: "Draft" },
  { id: 5, title: "Social Media Strategy", course: "Social Media Marketing", type: "Video", duration: "30 min", status: "Published" },
  { id: 6, title: "Content Planning Guide", course: "Content Marketing", type: "PDF", duration: "-", status: "Published" },
  { id: 7, title: "Google Ads Setup", course: "Google Ads & PPC", type: "Video", duration: "45 min", status: "Review" },
  { id: 8, title: "Email Templates Pack", course: "Email Marketing", type: "PDF", duration: "-", status: "Published" },
];

const columns = [
  { key: "title", label: "Lesson Title" },
  { key: "course", label: "Course" },
  {
    key: "type",
    label: "Type",
    render: (value: string) => (
      <div className="flex items-center gap-2">
        {value === "Video" ? (
          <Video className="w-4 h-4 text-blue-400" />
        ) : (
          <FileText className="w-4 h-4 text-red-400" />
        )}
        {value}
      </div>
    ),
  },
  { key: "duration", label: "Duration" },
  {
    key: "status",
    label: "Status",
    render: (value: string) => (
      <Badge
        variant="outline"
        className={
          value === "Published"
            ? "border-green-500/50 text-green-400"
            : value === "Draft"
            ? "border-yellow-500/50 text-yellow-400"
            : "border-blue-500/50 text-blue-400"
        }
      >
        {value}
      </Badge>
    ),
  },
];

const AdminLessons = () => {
  return (
    <DashboardLayout variant="admin" userName="Admin User">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl lg:text-3xl font-bold">
              Manage <span className="text-gradient">Lessons</span>
            </h1>
            <p className="text-muted-foreground mt-1">
              Create and organize lesson content for your courses.
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Add Lesson
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Lesson</DialogTitle>
                <DialogDescription>
                  Add a new lesson to a course.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Lesson Title</Label>
                  <Input placeholder="Enter lesson title" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Course</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select course" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dm">Digital Marketing Fundamentals</SelectItem>
                        <SelectItem value="sm">Social Media Marketing</SelectItem>
                        <SelectItem value="ga">Google Ads & PPC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Content Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="pdf">PDF Document</SelectItem>
                        <SelectItem value="text">Text Content</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea placeholder="Enter lesson description" />
                </div>
                <div className="space-y-2">
                  <Label>Upload Content</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Upload video or PDF file
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Max file size: 500MB
                    </p>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button className="bg-primary text-primary-foreground">
                    Create Lesson
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filters */}
        <div className="glass rounded-xl p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search lessons..." className="pl-10 bg-background" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-48 bg-background">
                <SelectValue placeholder="Course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                <SelectItem value="dm">Digital Marketing</SelectItem>
                <SelectItem value="sm">Social Media</SelectItem>
                <SelectItem value="ga">Google Ads</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-32 bg-background">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Lessons Table */}
        <DataTable
          columns={columns}
          data={lessons}
          onView={(row) => console.log("View", row)}
          onEdit={(row) => console.log("Edit", row)}
          onDelete={(row) => console.log("Delete", row)}
        />

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass rounded-xl p-4 text-center">
            <p className="text-2xl font-display font-bold text-primary">{lessons.length}</p>
            <p className="text-sm text-muted-foreground">Total Lessons</p>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <p className="text-2xl font-display font-bold text-blue-400">
              {lessons.filter(l => l.type === "Video").length}
            </p>
            <p className="text-sm text-muted-foreground">Videos</p>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <p className="text-2xl font-display font-bold text-red-400">
              {lessons.filter(l => l.type === "PDF").length}
            </p>
            <p className="text-sm text-muted-foreground">PDFs</p>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <p className="text-2xl font-display font-bold text-green-400">
              {lessons.filter(l => l.status === "Published").length}
            </p>
            <p className="text-sm text-muted-foreground">Published</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminLessons;
