import { cn } from "@/lib/utils";

interface ProgressChartProps {
  data: { label: string; value: number; color?: string }[];
  title: string;
}

export const ProgressChart = ({ data, title }: ProgressChartProps) => {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="glass rounded-xl p-6">
      <h3 className="font-display font-semibold text-lg mb-6">{title}</h3>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">{item.label}</span>
              <span className="font-medium">{item.value}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  item.color || "bg-primary"
                )}
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
