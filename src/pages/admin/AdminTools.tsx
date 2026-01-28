import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DataTable } from "@/components/dashboard/DataTable";
import { Plus, Search, ExternalLink } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const tools = [
  { id: 1, name: "Google Analytics", category: "Analytics", status: "Active", users: 2340 },
  { id: 2, name: "SEMrush", category: "SEO", status: "Active", users: 1890 },
  { id: 3, name: "Hootsuite", category: "Social Media", status: "Active", users: 1567 },
  { id: 4, name: "Mailchimp", category: "Email", status: "Active", users: 2100 },
  { id: 5, name: "Canva", category: "Design", status: "Active", users: 2450 },
  { id: 6, name: "Ahrefs", category: "SEO", status: "Inactive", users: 1234 },
  { id: 7, name: "Buffer", category: "Social Media", status: "Active", users: 987 },
  { id: 8, name: "HubSpot", category: "CRM", status: "Active", users: 1678 },
];

const columns = [
  { key: "name", label: "Tool Name" },
  {
    key: "category",
    label: "Category",
    render: (value: string) => (
      <Badge variant="secondary">{value}</Badge>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (value: string) => (
      <Badge
        variant="outline"
        className={
          value === "Active"
            ? "border-green-500/50 text-green-400"
            : "border-red-500/50 text-red-400"
        }
      >
        {value}
      </Badge>
    ),
  },
  {
    key: "users",
    label: "Users",
    render: (value: number) => value.toLocaleString(),
  },
];

const AdminTools = () => {
  return (
    <DashboardLayout variant="admin" userName="Admin User">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl lg:text-3xl font-bold">
              Manage <span className="text-gradient">Tools</span>
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage the 75+ marketing tools in your catalog.
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Add Tool
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Tool</DialogTitle>
                <DialogDescription>
                  Add a marketing tool to your catalog.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Tool Name</Label>
                  <Input placeholder="Enter tool name" />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="seo">SEO</SelectItem>
                      <SelectItem value="social">Social Media</SelectItem>
                      <SelectItem value="email">Email Marketing</SelectItem>
                      <SelectItem value="analytics">Analytics</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="crm">CRM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Website URL</Label>
                  <Input placeholder="https://example.com" />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input placeholder="Brief description" />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button className="bg-primary text-primary-foreground">
                    Add Tool
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
              <Input placeholder="Search tools..." className="pl-10 bg-background" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-40 bg-background">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="seo">SEO</SelectItem>
                <SelectItem value="social">Social Media</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="analytics">Analytics</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-32 bg-background">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tools Table */}
        <DataTable
          columns={columns}
          data={tools}
          onView={(row) => console.log("View", row)}
          onEdit={(row) => console.log("Edit", row)}
          onDelete={(row) => console.log("Delete", row)}
        />

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass rounded-xl p-4 text-center">
            <p className="text-2xl font-display font-bold text-primary">75+</p>
            <p className="text-sm text-muted-foreground">Total Tools</p>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <p className="text-2xl font-display font-bold text-green-400">
              {tools.filter(t => t.status === "Active").length}
            </p>
            <p className="text-sm text-muted-foreground">Active</p>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <p className="text-2xl font-display font-bold text-blue-400">8</p>
            <p className="text-sm text-muted-foreground">Categories</p>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <p className="text-2xl font-display font-bold text-yellow-400">
              {tools.reduce((acc, t) => acc + t.users, 0).toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Total Users</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminTools;
