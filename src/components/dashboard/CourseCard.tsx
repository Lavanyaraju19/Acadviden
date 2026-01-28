import { Play, FileText, ClipboardCheck, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface CourseCardProps {
  title: string;
  description: string;
  image: string;
  progress?: number;
  lessons?: number;
  duration?: string;
  students?: number;
  onView?: () => void;
}

export const CourseCard = ({
  title,
  description,
  image,
  progress = 0,
  lessons = 12,
  duration = "8 weeks",
  students = 1500,
  onView,
}: CourseCardProps) => {
  return (
    <div className="glass rounded-xl overflow-hidden group transition-all duration-300 hover:glow-teal">
      {/* Image */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center">
            <Play className="w-5 h-5 text-primary-foreground ml-1" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-display font-semibold text-foreground mb-2 line-clamp-1">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {description}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <FileText className="w-3 h-3" />
            {lessons} lessons
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {duration}
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {students.toLocaleString()}
          </div>
        </div>

        {/* Progress */}
        {progress > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Progress</span>
              <span className="text-primary font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        )}

        <Button
          onClick={onView}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          size="sm"
        >
          Continue Learning
        </Button>
      </div>
    </div>
  );
};
