import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { CourseCard } from "@/components/dashboard/CourseCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const courses = [
  {
    id: 1,
    title: "Digital Marketing Fundamentals",
    description: "Master the core concepts of digital marketing including SEO, SEM, and content strategy.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
    progress: 75,
    lessons: 24,
    duration: "8 weeks",
    students: 2450,
    status: "in-progress",
  },
  {
    id: 2,
    title: "Social Media Marketing Mastery",
    description: "Learn to create viral campaigns and grow audiences across all major social platforms.",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=250&fit=crop",
    progress: 45,
    lessons: 18,
    duration: "6 weeks",
    students: 1890,
    status: "in-progress",
  },
  {
    id: 3,
    title: "Google Ads & PPC Advertising",
    description: "Become proficient in paid advertising with hands-on Google Ads campaigns.",
    image: "https://images.unsplash.com/photo-1553484771-371a605b060b?w=400&h=250&fit=crop",
    progress: 20,
    lessons: 15,
    duration: "5 weeks",
    students: 1567,
    status: "in-progress",
  },
  {
    id: 4,
    title: "Email Marketing & Automation",
    description: "Build effective email campaigns and automate your marketing workflows.",
    image: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=400&h=250&fit=crop",
    progress: 100,
    lessons: 12,
    duration: "4 weeks",
    students: 1345,
    status: "completed",
  },
  {
    id: 5,
    title: "Content Marketing Strategy",
    description: "Create compelling content that drives traffic, engagement, and conversions.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop",
    progress: 100,
    lessons: 20,
    duration: "7 weeks",
    students: 2100,
    status: "completed",
  },
];

const StudentCourses = () => {
  const inProgressCourses = courses.filter((c) => c.status === "in-progress");
  const completedCourses = courses.filter((c) => c.status === "completed");

  return (
    <DashboardLayout variant="student" userName="John Doe">
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold">
            My <span className="text-gradient">Courses</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your enrolled courses and continue learning.
          </p>
        </div>

        <Tabs defaultValue="in-progress" className="w-full">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="in-progress">
              In Progress ({inProgressCourses.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedCourses.length})
            </TabsTrigger>
            <TabsTrigger value="all">All Courses ({courses.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="in-progress" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {inProgressCourses.map((course) => (
                <CourseCard key={course.id} {...course} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {completedCourses.map((course) => (
                <CourseCard key={course.id} {...course} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {courses.map((course) => (
                <CourseCard key={course.id} {...course} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default StudentCourses;
