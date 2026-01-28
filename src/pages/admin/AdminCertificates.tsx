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

interface Certificate {
  id: string;
  student_id: string;
  course_id: string;
  certificate_number: string;
  issued_date: string;
  status: string;
  created_at: string;
}

export function AdminCertificatesPage() {
  const { toast } = useToast();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    student_id: "",
    course_id: "",
    certificate_number: "",
    issued_date: "",
    status: "active",
  });

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("certificates")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCertificates(data || []);
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
    if (!formData.certificate_number.trim() || !formData.student_id.trim()) {
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
          .from("certificates")
          .update(formData)
          .eq("id", editingId);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Certificate updated successfully",
        });
      } else {
        const { error } = await supabase
          .from("certificates")
          .insert([formData]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Certificate issued successfully",
        });
      }

      setIsOpen(false);
      setFormData({
        student_id: "",
        course_id: "",
        certificate_number: "",
        issued_date: "",
        status: "active",
      });
      setEditingId(null);
      fetchCertificates();
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

  const handleEdit = (certificate: Certificate) => {
    setFormData({
      student_id: certificate.student_id,
      course_id: certificate.course_id,
      certificate_number: certificate.certificate_number,
      issued_date: certificate.issued_date,
      status: certificate.status,
    });
    setEditingId(certificate.id);
    setIsOpen(true);
  };

  const handleDelete = async (certificate: Certificate) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("certificates")
        .delete()
        .eq("id", certificate.id);

      if (error) throw error;
      toast({
        title: "Success",
        description: "Certificate deleted successfully",
      });
      fetchCertificates();
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
    { key: "certificate_number", label: "Certificate #" },
    { key: "student_id", label: "Student ID" },
    { key: "course_id", label: "Course ID" },
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
      key: "issued_date",
      label: "Issued Date",
      render: (val) => val ? new Date(val).toLocaleDateString() : "-",
    },
  ];

  return (
    <>
      <AdminTable
        columns={columns}
        data={certificates}
        title="Manage Certificates"
        searchPlaceholder="Search certificates..."
        onAdd={() => {
          setFormData({
            student_id: "",
            course_id: "",
            certificate_number: "",
            issued_date: "",
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
              {editingId ? "Edit Certificate" : "Issue New Certificate"}
            </DialogTitle>
            <DialogDescription>
              {editingId
                ? "Update the certificate details below"
                : "Issue a new certificate to a student"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Certificate Number *
              </label>
              <Input
                value={formData.certificate_number}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    certificate_number: e.target.value,
                  })
                }
                placeholder="e.g., CERT-2024-001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Student ID *
              </label>
              <Input
                value={formData.student_id}
                onChange={(e) =>
                  setFormData({ ...formData, student_id: e.target.value })
                }
                placeholder="Enter student ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Course ID</label>
              <Input
                value={formData.course_id}
                onChange={(e) =>
                  setFormData({ ...formData, course_id: e.target.value })
                }
                placeholder="Enter course ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Issued Date
              </label>
              <Input
                type="date"
                value={formData.issued_date}
                onChange={(e) =>
                  setFormData({ ...formData, issued_date: e.target.value })
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
                <option value="revoked">Revoked</option>
              </select>
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={loading}>
                {editingId ? "Update" : "Issue"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AdminCertificatesPage;