import { LucideIcon, BookOpen, Award, CheckCircle, MessageSquare } from "lucide-react";

interface Activity {
  id: string;
  type: "course" | "achievement" | "completion" | "message";
  title: string;
  description: string;
  time: string;
}

const iconMap: Record<string, LucideIcon> = {
  course: BookOpen,
  achievement: Award,
  completion: CheckCircle,
  message: MessageSquare,
};

const colorMap: Record<string, string> = {
  course: "bg-blue-500/20 text-blue-400",
  achievement: "bg-yellow-500/20 text-yellow-400",
  completion: "bg-green-500/20 text-green-400",
  message: "bg-primary/20 text-primary",
};

interface ActivityFeedProps {
  activities: Activity[];
}

export const ActivityFeed = ({ activities }: ActivityFeedProps) => {
  return (
    <div className="glass rounded-xl p-6">
      <h3 className="font-display font-semibold text-lg mb-6">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = iconMap[activity.type];
          return (
            <div key={activity.id} className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${colorMap[activity.type]}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {activity.title}
                </p>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {activity.description}
                </p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {activity.time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
