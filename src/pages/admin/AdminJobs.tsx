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

interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  status: string;
  created_at: string;
}

export function AdminJobsPage() {
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
    location: "",
    status: "active",
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setJobs(data || []);
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
    if (!formData.title.trim() || !formData.company.trim()) {
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
          .from("jobs")
          .update(formData)
          .eq("id", editingId);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Job updated successfully",
        });
      } else {
        const { error } = await supabase
          .from("jobs")
          .insert([formData]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Job posted successfully",
        });
      }

      setIsOpen(false);
      setFormData({
        title: "",
        company: "",
        description: "",
        location: "",
        status: "active",
      });
      setEditingId(null);
      fetchJobs();
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

  const handleEdit = (job: Job) => {
    setFormData({
      title: job.title,
      company: job.company,
      description: job.description,
      location: job.location,
      status: job.status,
    });
    setEditingId(job.id);
    setIsOpen(true);
  };

  const handleDelete = async (job: Job) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("jobs")
        .delete()
        .eq("id", job.id);

      if (error) throw error;
      toast({
        title: "Success",
        description: "Job deleted successfully",
      });
      fetchJobs();
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
    { key: "title", label: "Job Title" },
    { key: "company", label: "Company" },
    { key: "location", label: "Location" },
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
      key: "created_at",
      label: "Posted",
      render: (val) => new Date(val).toLocaleDateString(),
    },
  ];

  return (
    <>
      <AdminTable
        columns={columns}
        data={jobs}
        title="Manage Jobs"
        searchPlaceholder="Search jobs..."
        onAdd={() => {
          setFormData({
            title: "",
            company: "",
            description: "",
            location: "",
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
            <DialogTitle>{editingId ? "Edit Job" : "Post New Job"}</DialogTitle>
            <DialogDescription>
              {editingId
                ? "Update the job details below"
                : "Post a new job opportunity"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Job Title *
              </label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter job title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Company *</label>
              <Input
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                placeholder="Enter company name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <Input
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="Enter location"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter job description"
                rows={4}
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
                {editingId ? "Update" : "Post"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AdminJobsPage;

