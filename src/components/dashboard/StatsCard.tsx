import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
}

export const StatsCard = ({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  iconColor = "text-primary",
}: StatsCardProps) => {
  return (
    <div className="glass rounded-xl p-6 transition-all duration-300 hover:glow-teal">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl lg:text-3xl font-display font-bold mt-1">
            {value}
          </p>
          {change && (
            <p
              className={cn(
                "text-sm mt-2",
                changeType === "positive" && "text-green-400",
                changeType === "negative" && "text-red-400",
                changeType === "neutral" && "text-muted-foreground"
              )}
            >
              {change}
            </p>
          )}
        </div>
        <div className={cn("p-3 rounded-lg bg-primary/10", iconColor)}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
