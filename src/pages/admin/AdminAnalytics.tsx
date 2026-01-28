import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ProgressChart } from "@/components/dashboard/ProgressChart";
import { Users, BookOpen, DollarSign, TrendingUp, Award, Video } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const courseEngagement = [
  { label: "Digital Marketing", value: 85, color: "bg-primary" },
  { label: "Social Media", value: 72, color: "bg-blue-500" },
  { label: "Google Ads", value: 68, color: "bg-yellow-500" },
  { label: "Email Marketing", value: 91, color: "bg-green-500" },
  { label: "Content Marketing", value: 78, color: "bg-purple-500" },
];

const monthlyRevenue = [
  { month: "Jan", revenue: 12500, students: 145 },
  { month: "Feb", revenue: 15800, students: 178 },
  { month: "Mar", revenue: 14200, students: 156 },
  { month: "Apr", revenue: 18900, students: 198 },
  { month: "May", revenue: 22100, students: 234 },
  { month: "Jun", revenue: 19500, students: 212 },
  { month: "Jul", revenue: 25400, students: 267 },
  { month: "Aug", revenue: 28900, students: 289 },
  { month: "Sep", revenue: 24600, students: 254 },
  { month: "Oct", revenue: 31200, students: 312 },
  { month: "Nov", revenue: 35800, students: 345 },
  { month: "Dec", revenue: 42500, students: 398 },
];

const AdminAnalytics = () => {
  const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.revenue));

  return (
    <DashboardLayout variant="admin" userName="Admin User">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl lg:text-3xl font-bold">
              <span className="text-gradient">Analytics</span> Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Track performance metrics and insights.
            </p>
          </div>
          <Select defaultValue="30">
            <SelectTrigger className="w-40 bg-background">
              <SelectValue placeholder="Time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Revenue"
            value="$291,500"
            change="+18% vs last year"
            changeType="positive"
            icon={DollarSign}
          />
          <StatsCard
            title="Total Students"
            value="2,988"
            change="+156 this month"
            changeType="positive"
            icon={Users}
          />
          <StatsCard
            title="Course Completions"
            value="1,234"
            change="+12% this month"
            changeType="positive"
            icon={BookOpen}
          />
          <StatsCard
            title="Avg Completion Rate"
            value="78%"
            change="+5% vs last month"
            changeType="positive"
            icon={TrendingUp}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <div className="glass rounded-xl p-6">
            <h3 className="font-display font-semibold text-lg mb-6">Monthly Revenue</h3>
            <div className="h-64 flex items-end justify-between gap-1">
              {monthlyRevenue.map((data, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div className="w-full flex flex-col items-center">
                    <span className="text-xs text-primary font-medium mb-1">
                      ${(data.revenue / 1000).toFixed(0)}k
                    </span>
                    <div
                      className="w-full bg-primary rounded-t transition-all duration-300 hover:bg-primary/80"
                      style={{ height: `${(data.revenue / maxRevenue) * 180}px` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground mt-2">
                    {data.month}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Course Engagement */}
          <ProgressChart data={courseEngagement} title="Course Engagement" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Student Growth */}
          <div className="glass rounded-xl p-6">
            <h3 className="font-display font-semibold text-lg mb-6">Student Growth</h3>
            <div className="h-48 flex items-end justify-between gap-2">
              {monthlyRevenue.map((data, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div
                    className="w-full bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-400"
                    style={{ height: `${(data.students / Math.max(...monthlyRevenue.map(m => m.students))) * 150}px` }}
                  />
                  <span className="text-xs text-muted-foreground mt-2">
                    {data.month}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Metrics */}
          <div className="glass rounded-xl p-6">
            <h3 className="font-display font-semibold text-lg mb-6">Key Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <Video className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <p className="text-2xl font-display font-bold">156</p>
                <p className="text-sm text-muted-foreground">Total Lessons</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <Award className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <p className="text-2xl font-display font-bold">892</p>
                <p className="text-sm text-muted-foreground">Certificates</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <p className="text-2xl font-display font-bold">4.8</p>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <Users className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <p className="text-2xl font-display font-bold">89%</p>
                <p className="text-sm text-muted-foreground">Retention</p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Performing Content */}
        <div className="glass rounded-xl p-6">
          <h3 className="font-display font-semibold text-lg mb-6">Top Performing Content</h3>
          <div className="space-y-4">
            {[
              { title: "Digital Marketing Fundamentals", type: "Course", views: 15420, completion: "85%" },
              { title: "SEO Masterclass", type: "Webinar", views: 8920, completion: "92%" },
              { title: "Social Media Strategy", type: "Course", views: 7650, completion: "78%" },
              { title: "Google Ads Setup Guide", type: "Lesson", views: 6340, completion: "88%" },
              { title: "Email Marketing Templates", type: "Resource", views: 5890, completion: "95%" },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.type}</p>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-right">
                    <p className="font-medium">{item.views.toLocaleString()}</p>
                    <p className="text-muted-foreground">Views</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-primary">{item.completion}</p>
                    <p className="text-muted-foreground">Completion</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminAnalytics;
