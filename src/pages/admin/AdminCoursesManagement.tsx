import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminTable, TableColumn } from "@/components/AdminTable";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  status: string;
  students: number;
  created_at: string;
}

export function AdminCourses() {
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    instructor: "",
    status: "active",
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a course title",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      if (editingId) {
        const { error } = await supabase
          .from("courses")
          .update(formData)
          .eq("id", editingId);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Course updated successfully",
        });
      } else {
        const { error } = await supabase
          .from("courses")
          .insert([formData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Course created successfully",
        });
      }

      setIsOpen(false);
      setFormData({ title: "", description: "", instructor: "", status: "active" });
      setEditingId(null);
      fetchCourses();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (course: Course) => {
    setFormData({
      title: course.title,
      description: course.description,
      instructor: course.instructor,
      status: course.status,
    });
    setEditingId(course.id);
    setIsOpen(true);
  };

  const handleDelete = async (course: Course) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("courses")
        .delete()
        .eq("id", course.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Course deleted successfully",
      });

      fetchCourses();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const columns: TableColumn[] = [
    { key: "title", label: "Course Title" },
    { key: "instructor", label: "Instructor" },
    { key: "status", label: "Status" },
    { key: "students", label: "Students", render: (val) => val || 0 },
    {
      key: "created_at",
      label: "Created",
      render: (val) => new Date(val).toLocaleDateString(),
    },
  ];

  return (
    <>
      <AdminTable
        columns={columns}
        data={courses}
        title="Manage Courses"
        searchPlaceholder="Search courses..."
        onAdd={() => {
          setFormData({ title: "", description: "", instructor: "", status: "active" });
          setEditingId(null);
          setIsOpen(true);
        }}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Course" : "Add New Course"}</DialogTitle>
            <DialogDescription>
              {editingId
                ? "Update the course information below"
                : "Create a new course by filling in the details below"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Course Title</label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter course title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter course description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Instructor</label>
              <Input
                value={formData.instructor}
                onChange={(e) =>
                  setFormData({ ...formData, instructor: e.target.value })
                }
                placeholder="Enter instructor name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={loading}>
                {editingId ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AdminCourses;
