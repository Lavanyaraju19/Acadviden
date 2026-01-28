import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Play, Clock, CheckCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const lessons = [
  {
    id: 1,
    title: "Introduction to Digital Marketing",
    duration: "15 min",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=170&fit=crop",
    completed: true,
    locked: false,
  },
  {
    id: 2,
    title: "Understanding Your Target Audience",
    duration: "22 min",
    thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=170&fit=crop",
    completed: true,
    locked: false,
  },
  {
    id: 3,
    title: "SEO Fundamentals",
    duration: "28 min",
    thumbnail: "https://images.unsplash.com/photo-1571721795195-a2ca2d3370a9?w=300&h=170&fit=crop",
    completed: true,
    locked: false,
  },
  {
    id: 4,
    title: "Keyword Research Strategies",
    duration: "35 min",
    thumbnail: "https://images.unsplash.com/photo-1553484771-371a605b060b?w=300&h=170&fit=crop",
    completed: false,
    locked: false,
    current: true,
  },
  {
    id: 5,
    title: "On-Page SEO Optimization",
    duration: "30 min",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=170&fit=crop",
    completed: false,
    locked: false,
  },
  {
    id: 6,
    title: "Link Building Techniques",
    duration: "25 min",
    thumbnail: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=300&h=170&fit=crop",
    completed: false,
    locked: true,
  },
  {
    id: 7,
    title: "Content Marketing Essentials",
    duration: "32 min",
    thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300&h=170&fit=crop",
    completed: false,
    locked: true,
  },
  {
    id: 8,
    title: "Social Media Integration",
    duration: "28 min",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=170&fit=crop",
    completed: false,
    locked: true,
  },
];

const StudentLessons = () => {
  const completedCount = lessons.filter((l) => l.completed).length;
  const progress = (completedCount / lessons.length) * 100;

  return (
    <DashboardLayout variant="student" userName="John Doe">
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold">
            Video <span className="text-gradient">Lessons</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Watch video lessons and track your progress.
          </p>
        </div>

        {/* Progress Overview */}
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display font-semibold text-lg">
                Digital Marketing Fundamentals
              </h2>
              <p className="text-sm text-muted-foreground">
                {completedCount} of {lessons.length} lessons completed
              </p>
            </div>
            <span className="text-2xl font-display font-bold text-primary">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              className={`glass rounded-xl overflow-hidden transition-all duration-300 ${
                lesson.locked ? "opacity-60" : "hover:glow-teal"
              }`}
            >
              {/* Thumbnail */}
              <div className="relative h-32 overflow-hidden">
                <img
                  src={lesson.thumbnail}
                  alt={lesson.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                
                {/* Status Icon */}
                <div className="absolute top-2 right-2">
                  {lesson.completed && (
                    <div className="w-6 h-6 rounded-full bg-green-500/90 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                  {lesson.locked && (
                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                      <Lock className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Play Button */}
                {!lesson.locked && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`w-10 h-10 rounded-full ${lesson.current ? 'bg-primary animate-pulse-glow' : 'bg-primary/80'} flex items-center justify-center`}>
                      <Play className="w-4 h-4 text-primary-foreground ml-0.5" />
                    </div>
                  </div>
                )}

                {/* Duration */}
                <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-background/80 px-2 py-0.5 rounded text-xs">
                  <Clock className="w-3 h-3" />
                  {lesson.duration}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-medium text-sm text-foreground line-clamp-2">
                  {lesson.title}
                </h3>
                {lesson.current && (
                  <span className="inline-block mt-2 text-xs text-primary font-medium">
                    Continue watching
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentLessons;
