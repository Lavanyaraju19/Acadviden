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
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface Student {
  id: string;
  email: string;
  full_name: string;
  status: string;
  enrollment_date: string;
  last_login?: string;
}

export function AdminStudentsPage() {
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    status: "active",
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "student")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setStudents(data || []);
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
    if (!formData.email.trim() || !formData.full_name.trim()) {
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
          .from("profiles")
          .update(formData)
          .eq("id", editingId);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Student updated successfully",
        });
      } else {
        const { error } = await supabase
          .from("profiles")
          .insert([{ ...formData, role: "student" }]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Student created successfully",
        });
      }

      setIsOpen(false);
      setFormData({ email: "", full_name: "", status: "active" });
      setEditingId(null);
      fetchStudents();
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

  const handleEdit = (student: Student) => {
    setFormData({
      email: student.email,
      full_name: student.full_name,
      status: student.status,
    });
    setEditingId(student.id);
    setIsOpen(true);
  };

  const handleDelete = async (student: Student) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", student.id);

      if (error) throw error;
      toast({
        title: "Success",
        description: "Student deleted successfully",
      });
      fetchStudents();
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
    { key: "full_name", label: "Name" },
    { key: "email", label: "Email" },
    {
      key: "status",
      label: "Status",
      render: (val) => (
        <Badge variant={val === "active" ? "default" : "secondary"}>
          {val}
        </Badge>
      ),
    },
    {
      key: "enrollment_date",
      label: "Enrolled",
      render: (val) => val ? new Date(val).toLocaleDateString() : "-",
    },
  ];

  return (
    <>
      <AdminTable
        columns={columns}
        data={students}
        title="Manage Students"
        searchPlaceholder="Search students..."
        onAdd={() => {
          setFormData({ email: "", full_name: "", status: "active" });
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
            <DialogTitle>{editingId ? "Edit Student" : "Add New Student"}</DialogTitle>
            <DialogDescription>
              {editingId
                ? "Update the student information below"
                : "Add a new student to the system"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name *</label>
              <Input
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
                placeholder="Enter full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Enter email address"
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
                <option value="suspended">Suspended</option>
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

export default AdminStudentsPage;
