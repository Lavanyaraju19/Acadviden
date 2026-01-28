import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Trash2,
  Edit,
  X,
  Search,
  Filter,
  Download,
  Users,
  BookOpen,
  DollarSign,
  Award,
  Video,
  AlertCircle,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type TabType = "courses" | "modules" | "videos" | "assignments" | "quizzes" | "students" | "certificates" | "payments" | "jobs";

interface Stats {
  totalStudents: number;
  totalCourses: number;
  completedModules: number;
  totalPayments: number;
}

interface TableRow {
  id: string;
  [key: string]: any;
}

const AdminManagement = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();

  // Check admin access
  useEffect(() => {
    if (userProfile?.role !== "admin") {
      navigate("/student");
    }
  }, [userProfile, navigate]);

  const [activeTab, setActiveTab] = useState<TabType>("courses");
  const [stats, setStats] = useState<Stats>({
    totalStudents: 0,
    totalCourses: 0,
    completedModules: 0,
    totalPayments: 0,
  });

  // Table state
  const [tableData, setTableData] = useState<TableRow[]>([]);
  const [filteredData, setFilteredData] = useState<TableRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState("");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "delete">("create");
  const [selectedRow, setSelectedRow] = useState<TableRow | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [submitting, setSubmitting] = useState(false);

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [studentsRes, coursesRes, modulesRes, paymentsRes] =
          await Promise.all([
            (supabase as any).from("students").select("id", { count: "exact" }),
            (supabase as any).from("courses").select("id", { count: "exact" }),
            (supabase as any)
              .from("modules")
              .select("id")
              .eq("is_completed", true),
            (supabase as any).from("payments").select("amount"),
          ]);

        setStats({
          totalStudents: studentsRes.count || 0,
          totalCourses: coursesRes.count || 0,
          completedModules: modulesRes.data?.length || 0,
          totalPayments: paymentsRes.data?.reduce((sum: number, p: any) => sum + (p.amount || 0), 0) || 0,
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    fetchStats();
  }, []);

  // Fetch table data
  useEffect(() => {
    const fetchTableData = async () => {
      setLoading(true);
      try {
        const { data, error } = await (supabase as any)
          .from(getTableName(activeTab))
          .select("*")
          .order("created_at", { ascending: false })
          .limit(100);

        if (error) throw error;
        setTableData(data || []);
        setFilteredData(data || []);
      } catch (err) {
        console.error(`Error fetching ${activeTab}:`, err);
        setTableData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTableData();
  }, [activeTab]);

  // Search and filter
  useEffect(() => {
    let filtered = tableData;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((row) =>
        Object.values(row).some((val) =>
          String(val).toLowerCase().includes(searchLower)
        )
      );
    }

    if (filterValue) {
      filtered = filtered.filter((row) => {
        const filterKey = getFilterKey(activeTab);
        return row[filterKey] === filterValue;
      });
    }

    setFilteredData(filtered);
  }, [searchTerm, filterValue, tableData]);

  const getTableName = (tab: TabType) => {
    const tableMap: Record<TabType, string> = {
      courses: "courses",
      modules: "modules",
      videos: "videos",
      assignments: "assignments",
      quizzes: "quizzes",
      students: "students",
      certificates: "certificates",
      payments: "payments",
      jobs: "job_board",
    };
    return tableMap[tab];
  };

  const getFilterKey = (tab: TabType): string => {
    const filterMap: Record<TabType, string> = {
      courses: "status",
      modules: "course_id",
      videos: "module_id",
      assignments: "module_id",
      quizzes: "module_id",
      students: "role",
      certificates: "status",
      payments: "status",
      jobs: "status",
    };
    return filterMap[tab];
  };

  const getColumns = (tab: TabType): string[] => {
    const columnMap: Record<TabType, string[]> = {
      courses: ["id", "title", "description", "status", "created_at"],
      modules: ["id", "title", "course_id", "order", "is_completed"],
      videos: ["id", "title", "url", "duration", "module_id"],
      assignments: ["id", "title", "module_id", "due_date"],
      quizzes: ["id", "title", "module_id"],
      students: ["id", "name", "email", "role"],
      certificates: ["id", "title", "student_id", "status", "issued_at"],
      payments: ["id", "student_id", "amount", "status", "date"],
      jobs: ["id", "title", "company", "status", "posted_at"],
    };
    return columnMap[tab];
  };

  const getFilterOptions = (tab: TabType): string[] => {
    const optionsMap: Record<TabType, string[]> = {
      courses: ["active", "inactive", "archived"],
      modules: [],
      videos: [],
      assignments: [],
      quizzes: [],
      students: ["student", "admin", "instructor"],
      certificates: ["pending", "issued", "revoked"],
      payments: ["completed", "pending", "failed"],
      jobs: ["active", "closed", "archived"],
    };
    return optionsMap[tab];
  };

  const handleCreate = () => {
    setModalMode("create");
    setSelectedRow(null);
    setFormData({});
    setShowModal(true);
  };

  const handleEdit = (row: TableRow) => {
    setModalMode("edit");
    setSelectedRow(row);
    setFormData({ ...row });
    setShowModal(true);
  };

  const handleDelete = (row: TableRow) => {
    setModalMode("delete");
    setSelectedRow(row);
    setShowModal(true);
  };

  const handleFormSubmit = async () => {
    if (!formData.title && !formData.name) {
      alert("Please fill in required fields");
      return;
    }

    setSubmitting(true);
    try {
      const tableName = getTableName(activeTab);

      if (modalMode === "create") {
        const { error } = await (supabase as any)
          .from(tableName)
          .insert([formData]);

        if (error) throw error;
        alert("Created successfully!");
      } else if (modalMode === "edit" && selectedRow) {
        const { error } = await (supabase as any)
          .from(tableName)
          .update(formData)
          .eq("id", selectedRow.id);

        if (error) throw error;
        alert("Updated successfully!");
      } else if (modalMode === "delete" && selectedRow) {
        const { error } = await (supabase as any)
          .from(tableName)
          .delete()
          .eq("id", selectedRow.id);

        if (error) throw error;
        alert("Deleted successfully!");
      }

      setShowModal(false);
      // Refresh data
      const { data } = await (supabase as any)
        .from(tableName)
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      setTableData(data || []);
      setFilteredData(data || []);
    } catch (err) {
      console.error("Error:", err);
      alert("Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: "courses", label: "Courses", icon: <BookOpen className="w-4 h-4" /> },
    { id: "modules", label: "Modules", icon: <BookOpen className="w-4 h-4" /> },
    { id: "videos", label: "Videos", icon: <Video className="w-4 h-4" /> },
    { id: "assignments", label: "Assignments", icon: <BookOpen className="w-4 h-4" /> },
    { id: "quizzes", label: "Quizzes", icon: <BookOpen className="w-4 h-4" /> },
    { id: "students", label: "Students", icon: <Users className="w-4 h-4" /> },
    { id: "certificates", label: "Certificates", icon: <Award className="w-4 h-4" /> },
    { id: "payments", label: "Payments", icon: <DollarSign className="w-4 h-4" /> },
    { id: "jobs", label: "Job Board", icon: <BookOpen className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Admin Management</h1>
        <p className="text-muted-foreground">Manage all platform data with CRUD operations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Students"
          value={stats.totalStudents}
          icon={<Users className="w-6 h-6 text-primary" />}
        />
        <StatCard
          label="Total Courses"
          value={stats.totalCourses}
          icon={<BookOpen className="w-6 h-6 text-blue-500" />}
        />
        <StatCard
          label="Completed Modules"
          value={stats.completedModules}
          icon={<Award className="w-6 h-6 text-green-500" />}
        />
        <StatCard
          label="Total Payments"
          value={`$${(stats.totalPayments / 100).toFixed(2)}`}
          icon={<DollarSign className="w-6 h-6 text-yellow-500" />}
        />
      </div>

      {/* Tabs */}
      <div className="mb-6 flex flex-wrap gap-2 border-b border-border pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setSearchTerm("");
              setFilterValue("");
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted text-muted-foreground"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {getFilterOptions(activeTab).length > 0 && (
          <select
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            className="px-4 py-2 rounded-lg border border-border bg-background hover:bg-muted transition-colors flex items-center gap-2 cursor-pointer"
          >
            <option value="">All</option>
            {getFilterOptions(activeTab).map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        )}

        <Button onClick={handleCreate} className="gap-2">
          <Plus className="w-4 h-4" />
          New {activeTab.slice(0, -1)}
        </Button>
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12" />
            ))}
          </div>
        ) : filteredData.length === 0 ? (
          <div className="p-8 text-center">
            <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
            <p className="text-muted-foreground">No data found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  {getColumns(activeTab).map((col) => (
                    <th key={col} className="px-6 py-3 text-left text-sm font-semibold">
                      {col.replace(/_/g, " ").toUpperCase()}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-right text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row, idx) => (
                  <tr
                    key={row.id}
                    className={`border-b border-border hover:bg-muted/50 transition-colors ${
                      idx % 2 === 0 ? "bg-background" : "bg-muted/20"
                    }`}
                  >
                    {getColumns(activeTab).map((col) => (
                      <td key={col} className="px-6 py-4 text-sm">
                        {col === "created_at" || col === "issued_at" || col === "posted_at" || col === "due_date"
                          ? new Date(row[col]).toLocaleDateString()
                          : col === "status"
                          ? <Badge variant="outline">{row[col]}</Badge>
                          : col === "amount"
                          ? `$${(row[col] / 100).toFixed(2)}`
                          : String(row[col]).slice(0, 50)}
                      </td>
                    ))}
                    <td className="px-6 py-4 text-right flex gap-2 justify-end">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(row)}
                        className="gap-2"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(row)}
                        className="gap-2 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {modalMode === "create"
                ? `Create New ${activeTab.slice(0, -1)}`
                : modalMode === "edit"
                ? `Edit ${activeTab.slice(0, -1)}`
                : `Delete ${activeTab.slice(0, -1)}`}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {modalMode === "delete" ? (
              <div className="py-4">
                <p className="text-sm text-muted-foreground">
                  Are you sure you want to delete this {activeTab.slice(0, -1)}? This action cannot be undone.
                </p>
              </div>
            ) : (
              <>
                {getColumns(activeTab).map((col) => (
                  <div key={col}>
                    <label className="text-sm font-medium capitalize">
                      {col.replace(/_/g, " ")}
                    </label>
                    {col === "description" ? (
                      <textarea
                        value={formData[col] || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, [col]: e.target.value })
                        }
                        className="w-full mt-1 p-2 rounded-lg border border-border bg-background"
                        rows={3}
                      />
                    ) : col === "status" ? (
                      <select
                        value={formData[col] || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, [col]: e.target.value })
                        }
                        className="w-full mt-1 p-2 rounded-lg border border-border bg-background"
                      >
                        <option value="">Select status</option>
                        {getFilterOptions(activeTab).map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={col === "amount" || col === "duration" || col === "order" ? "number" : col.includes("date") ? "date" : "text"}
                        value={formData[col] || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, [col]: e.target.value })
                        }
                        className="w-full mt-1 p-2 rounded-lg border border-border bg-background"
                      />
                    )}
                  </div>
                ))}
              </>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleFormSubmit}
              disabled={submitting}
              variant={modalMode === "delete" ? "destructive" : "default"}
              className="gap-2"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {modalMode === "create"
                ? "Create"
                : modalMode === "edit"
                ? "Update"
                : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}

const StatCard = ({ label, value, icon }: StatCardProps) => (
  <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-muted-foreground mb-2">{label}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
      {icon}
    </div>
  </Card>
);

export default AdminManagement;
