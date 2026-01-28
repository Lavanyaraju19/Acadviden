import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DataTable } from "@/components/dashboard/DataTable";
import { Plus, Search, Calendar, Video, Users } from "lucide-react";
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

const events = [
  { id: 1, title: "SEO Masterclass", type: "Webinar", date: "2024-02-15", attendees: 156, status: "Upcoming" },
  { id: 2, title: "Social Media Workshop", type: "Workshop", date: "2024-02-18", attendees: 89, status: "Upcoming" },
  { id: 3, title: "Networking Event", type: "Networking", date: "2024-02-20", attendees: 234, status: "Upcoming" },
  { id: 4, title: "Google Ads Q&A", type: "Webinar", date: "2024-02-10", attendees: 178, status: "Completed" },
  { id: 5, title: "Content Bootcamp", type: "Workshop", date: "2024-02-05", attendees: 112, status: "Completed" },
];

const columns = [
  { key: "title", label: "Event" },
  {
    key: "type",
    label: "Type",
    render: (value: string) => (
      <div className="flex items-center gap-2">
        {value === "Webinar" ? (
          <Video className="w-4 h-4 text-blue-400" />
        ) : value === "Workshop" ? (
          <Users className="w-4 h-4 text-purple-400" />
        ) : (
          <Calendar className="w-4 h-4 text-green-400" />
        )}
        {value}
      </div>
    ),
  },
  { key: "date", label: "Date" },
  { key: "attendees", label: "Attendees" },
  {
    key: "status",
    label: "Status",
    render: (value: string) => (
      <Badge
        variant="outline"
        className={
          value === "Upcoming"
            ? "border-blue-500/50 text-blue-400"
            : "border-green-500/50 text-green-400"
        }
      >
        {value}
      </Badge>
    ),
  },
];

const AdminEvents = () => {
  return (
    <DashboardLayout variant="admin" userName="Admin User">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl lg:text-3xl font-bold">
              Manage <span className="text-gradient">Events</span>
            </h1>
            <p className="text-muted-foreground mt-1">
              Schedule and manage webinars, workshops, and networking events.
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
                <DialogDescription>
                  Schedule a new event for students.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Event Title</Label>
                  <Input placeholder="e.g. SEO Masterclass" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Event Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="webinar">Webinar</SelectItem>
                        <SelectItem value="workshop">Workshop</SelectItem>
                        <SelectItem value="networking">Networking</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label>Time</Label>
                    <Input type="time" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea placeholder="Event description..." rows={3} />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button className="bg-primary text-primary-foreground">
                    Create Event
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="glass rounded-xl p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search events..." className="pl-10 bg-background" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-40 bg-background">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="webinar">Webinar</SelectItem>
                <SelectItem value="workshop">Workshop</SelectItem>
                <SelectItem value="networking">Networking</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-32 bg-background">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Events Table */}
        <DataTable
          columns={columns}
          data={events}
          onView={(row) => console.log("View", row)}
          onEdit={(row) => console.log("Edit", row)}
          onDelete={(row) => console.log("Delete", row)}
        />

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass rounded-xl p-4 text-center">
            <p className="text-2xl font-display font-bold text-primary">{events.length}</p>
            <p className="text-sm text-muted-foreground">Total Events</p>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <p className="text-2xl font-display font-bold text-blue-400">
              {events.filter(e => e.status === "Upcoming").length}
            </p>
            <p className="text-sm text-muted-foreground">Upcoming</p>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <p className="text-2xl font-display font-bold text-green-400">
              {events.reduce((acc, e) => acc + e.attendees, 0)}
            </p>
            <p className="text-sm text-muted-foreground">Total Attendees</p>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <p className="text-2xl font-display font-bold text-yellow-400">4</p>
            <p className="text-sm text-muted-foreground">This Month</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminEvents;
