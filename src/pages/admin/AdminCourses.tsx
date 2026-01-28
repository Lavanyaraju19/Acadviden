import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DataTable } from "@/components/dashboard/DataTable";
import { Plus, Search, Upload, Image } from "lucide-react";
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

const courses = [
  { id: 1, title: "Digital Marketing Fundamentals", instructor: "Sarah Johnson", students: 2450, lessons: 24, status: "Published", price: "$99" },
  { id: 2, title: "Social Media Marketing", instructor: "Mike Chen", students: 1890, lessons: 18, status: "Published", price: "$79" },
  { id: 3, title: "Google Ads & PPC", instructor: "David Miller", students: 1567, lessons: 15, status: "Published", price: "$129" },
  { id: 4, title: "Content Marketing", instructor: "Emma Wilson", students: 2100, lessons: 20, status: "Draft", price: "$89" },
  { id: 5, title: "Email Marketing", instructor: "Sarah Johnson", students: 1345, lessons: 12, status: "Published", price: "$69" },
  { id: 6, title: "Analytics & Data", instructor: "Mike Chen", students: 1678, lessons: 16, status: "Review", price: "$99" },
];

const columns = [
  { key: "title", label: "Course Title" },
  { key: "instructor", label: "Instructor" },
  { 
    key: "students", 
    label: "Students",
    render: (value: number) => value.toLocaleString()
  },
  { key: "lessons", label: "Lessons" },
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
  { key: "price", label: "Price" },
];

const AdminCourses = () => {
  return (
    <DashboardLayout variant="admin" userName="Admin User">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl lg:text-3xl font-bold">
              Manage <span className="text-gradient">Courses</span>
            </h1>
            <p className="text-muted-foreground mt-1">
              Create and manage your course catalog.
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Add Course
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Course</DialogTitle>
                <DialogDescription>
                  Add a new course to your catalog. Fill in the details below.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Course Title</Label>
                  <Input placeholder="Enter course title" />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea placeholder="Enter course description" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Instructor</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select instructor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sarah">Sarah Johnson</SelectItem>
                        <SelectItem value="mike">Mike Chen</SelectItem>
                        <SelectItem value="david">David Miller</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Price</Label>
                    <Input placeholder="$99" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Thumbnail</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors">
                    <Image className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload or drag and drop
                    </p>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button className="bg-primary text-primary-foreground">
                    Create Course
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
              <Input placeholder="Search courses..." className="pl-10 bg-background" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-40 bg-background">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="review">Review</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-40 bg-background">
                <SelectValue placeholder="Instructor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Instructors</SelectItem>
                <SelectItem value="sarah">Sarah Johnson</SelectItem>
                <SelectItem value="mike">Mike Chen</SelectItem>
                <SelectItem value="david">David Miller</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Courses Table */}
        <DataTable
          columns={columns}
          data={courses}
          onView={(row) => console.log("View", row)}
          onEdit={(row) => console.log("Edit", row)}
          onDelete={(row) => console.log("Delete", row)}
        />

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass rounded-xl p-4 text-center">
            <p className="text-2xl font-display font-bold text-primary">{courses.length}</p>
            <p className="text-sm text-muted-foreground">Total Courses</p>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <p className="text-2xl font-display font-bold text-green-400">
              {courses.filter(c => c.status === "Published").length}
            </p>
            <p className="text-sm text-muted-foreground">Published</p>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <p className="text-2xl font-display font-bold text-yellow-400">
              {courses.filter(c => c.status === "Draft").length}
            </p>
            <p className="text-sm text-muted-foreground">Drafts</p>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <p className="text-2xl font-display font-bold text-blue-400">
              {courses.reduce((acc, c) => acc + c.students, 0).toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Total Students</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminCourses;
