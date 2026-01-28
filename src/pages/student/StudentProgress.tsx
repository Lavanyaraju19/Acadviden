import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ProgressChart } from "@/components/dashboard/ProgressChart";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { BookOpen, Video, Award, Clock, Target, TrendingUp, CheckCircle, Calendar } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const courseProgress = [
  { label: "Digital Marketing Fundamentals", value: 75, color: "bg-primary" },
  { label: "Social Media Marketing", value: 45, color: "bg-blue-500" },
  { label: "Google Ads & PPC", value: 20, color: "bg-yellow-500" },
  { label: "Email Marketing", value: 100, color: "bg-green-500" },
  { label: "Content Marketing", value: 60, color: "bg-purple-500" },
];

const weeklyActivity = [
  { day: "Mon", hours: 2.5 },
  { day: "Tue", hours: 1.5 },
  { day: "Wed", hours: 3 },
  { day: "Thu", hours: 2 },
  { day: "Fri", hours: 4 },
  { day: "Sat", hours: 1 },
  { day: "Sun", hours: 0.5 },
];

const achievements = [
  { title: "Fast Learner", description: "Completed 5 lessons in one day", icon: "🚀" },
  { title: "Perfect Score", description: "Got 100% on a quiz", icon: "⭐" },
  { title: "Early Bird", description: "Studied before 7 AM", icon: "🌅" },
  { title: "Consistent", description: "7-day learning streak", icon: "🔥" },
];

const StudentProgress = () => {
  const maxHours = Math.max(...weeklyActivity.map((d) => d.hours));

  return (
    <DashboardLayout variant="student" userName="John Doe">
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold">
            Progress <span className="text-gradient">Tracking</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor your learning journey and achievements.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Overall Progress"
            value="68%"
            change="+5% this week"
            changeType="positive"
            icon={Target}
          />
          <StatsCard
            title="Hours This Week"
            value="14.5"
            change="+2.5 vs last week"
            changeType="positive"
            icon={Clock}
          />
          <StatsCard
            title="Lessons Completed"
            value="48"
            change="12 remaining"
            changeType="neutral"
            icon={Video}
          />
          <StatsCard
            title="Current Streak"
            value="7 days"
            change="Personal best!"
            changeType="positive"
            icon={TrendingUp}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Course Progress */}
          <ProgressChart data={courseProgress} title="Course Progress" />

          {/* Weekly Activity */}
          <div className="glass rounded-xl p-6">
            <h3 className="font-display font-semibold text-lg mb-6">
              Weekly Activity
            </h3>
            <div className="flex items-end justify-between h-40 gap-2">
              {weeklyActivity.map((day, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div
                    className="w-full bg-primary rounded-t transition-all duration-300 hover:bg-primary/80"
                    style={{ height: `${(day.hours / maxHours) * 100}%`, minHeight: "8px" }}
                  />
                  <span className="text-xs text-muted-foreground mt-2">{day.day}</span>
                  <span className="text-xs text-primary font-medium">{day.hours}h</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Milestones */}
          <div className="glass rounded-xl p-6">
            <h3 className="font-display font-semibold text-lg mb-6">
              Learning Milestones
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-green-500/20 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Complete 50 lessons</p>
                  <Progress value={96} className="h-2 mt-2" />
                </div>
                <span className="text-sm text-muted-foreground">48/50</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-primary/20 text-primary">
                  <Award className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Earn 5 certificates</p>
                  <Progress value={60} className="h-2 mt-2" />
                </div>
                <span className="text-sm text-muted-foreground">3/5</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-yellow-500/20 text-yellow-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Complete all courses</p>
                  <Progress value={40} className="h-2 mt-2" />
                </div>
                <span className="text-sm text-muted-foreground">2/5</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">30-day streak</p>
                  <Progress value={23} className="h-2 mt-2" />
                </div>
                <span className="text-sm text-muted-foreground">7/30</span>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="glass rounded-xl p-6">
            <h3 className="font-display font-semibold text-lg mb-6">
              Recent Achievements
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-muted/50 text-center transition-all duration-300 hover:bg-muted"
                >
                  <span className="text-3xl">{achievement.icon}</span>
                  <p className="font-medium text-sm mt-2">{achievement.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {achievement.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentProgress;
