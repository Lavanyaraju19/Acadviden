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

interface Module {
  id: string;
  title: string;
  course_id: string;
  description: string;
  order: number;
  created_at: string;
}

export function AdminModules() {
  const { toast } = useToast();
  const [modules, setModules] = useState<Module[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    course_id: "",
    description: "",
    order: 1,
  });

  useEffect(() => {
    Promise.all([fetchModules(), fetchCourses()]);
  }, []);

  const fetchModules = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("modules")
        .select("*")
        .order("order", { ascending: true });

      if (error) throw error;
      setModules(data || []);
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

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from("courses")
        .select("id, title");

      if (error) throw error;
      setCourses(data || []);
    } catch (error: any) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.course_id) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      if (editingId) {
        const { error } = await supabase
          .from("modules")
          .update(formData)
          .eq("id", editingId);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Module updated successfully",
        });
      } else {
        const { error } = await supabase
          .from("modules")
          .insert([formData]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Module created successfully",
        });
      }

      setIsOpen(false);
      setFormData({ title: "", course_id: "", description: "", order: 1 });
      setEditingId(null);
      fetchModules();
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

  const handleEdit = (module: Module) => {
    setFormData({
      title: module.title,
      course_id: module.course_id,
      description: module.description,
      order: module.order,
    });
    setEditingId(module.id);
    setIsOpen(true);
  };

  const handleDelete = async (module: Module) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("modules")
        .delete()
        .eq("id", module.id);

      if (error) throw error;
      toast({
        title: "Success",
        description: "Module deleted successfully",
      });
      fetchModules();
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
    { key: "title", label: "Module Title" },
    {
      key: "course_id",
      label: "Course",
      render: (val) => courses.find((c) => c.id === val)?.title || val,
    },
    { key: "order", label: "Order" },
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
        data={modules}
        title="Manage Modules"
        searchPlaceholder="Search modules..."
        onAdd={() => {
          setFormData({ title: "", course_id: "", description: "", order: 1 });
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
            <DialogTitle>{editingId ? "Edit Module" : "Add New Module"}</DialogTitle>
            <DialogDescription>
              Create or update a course module
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Module Title *</label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter module title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Course *</label>
              <select
                value={formData.course_id}
                onChange={(e) =>
                  setFormData({ ...formData, course_id: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">Select a course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter module description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Order</label>
              <Input
                type="number"
                value={formData.order}
                onChange={(e) =>
                  setFormData({ ...formData, order: parseInt(e.target.value) })
                }
                min="1"
              />
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

export default AdminModules;
