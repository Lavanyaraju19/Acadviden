import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminTable, TableColumn } from "@/components/AdminTable";
import { Badge } from "@/components/ui/badge";
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

interface Assignment {
  id: string;
  title: string;
  module_id: string;
  description: string;
  due_date: string;
  status: string;
  created_at: string;
}

export function AdminAssignments() {
  const { toast } = useToast();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    module_id: "",
    description: "",
    due_date: "",
    status: "active",
  });

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("assignments")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAssignments(data || []);
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
        description: "Please enter an assignment title",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      if (editingId) {
        const { error } = await supabase
          .from("assignments")
          .update(formData)
          .eq("id", editingId);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Assignment updated successfully",
        });
      } else {
        const { error } = await supabase
          .from("assignments")
          .insert([formData]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Assignment created successfully",
        });
      }

      setIsOpen(false);
      setFormData({
        title: "",
        module_id: "",
        description: "",
        due_date: "",
        status: "active",
      });
      setEditingId(null);
      fetchAssignments();
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

  const handleEdit = (assignment: Assignment) => {
    setFormData({
      title: assignment.title,
      module_id: assignment.module_id,
      description: assignment.description,
      due_date: assignment.due_date,
      status: assignment.status,
    });
    setEditingId(assignment.id);
    setIsOpen(true);
  };

  const handleDelete = async (assignment: Assignment) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("assignments")
        .delete()
        .eq("id", assignment.id);

      if (error) throw error;
      toast({
        title: "Success",
        description: "Assignment deleted successfully",
      });
      fetchAssignments();
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
    { key: "title", label: "Assignment Title" },
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
      key: "due_date",
      label: "Due Date",
      render: (val) => val ? new Date(val).toLocaleDateString() : "-",
    },
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
        data={assignments}
        title="Manage Assignments"
        searchPlaceholder="Search assignments..."
        onAdd={() => {
          setFormData({
            title: "",
            module_id: "",
            description: "",
            due_date: "",
            status: "active",
          });
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
            <DialogTitle>
              {editingId ? "Edit Assignment" : "Add New Assignment"}
            </DialogTitle>
            <DialogDescription>
              {editingId
                ? "Update the assignment details below"
                : "Create a new assignment"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Assignment Title *
              </label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter assignment title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter assignment description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Due Date</label>
              <Input
                type="date"
                value={formData.due_date}
                onChange={(e) =>
                  setFormData({ ...formData, due_date: e.target.value })
                }
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
                <option value="closed">Closed</option>
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

export default AdminAssignments;
