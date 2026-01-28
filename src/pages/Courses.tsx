import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Clock, Users, Star, ArrowRight, Play } from "lucide-react";

const courses = [
  {
    id: 1,
    title: "Digital Marketing Fundamentals",
    description: "Master the core concepts of digital marketing including SEO, SEM, and content strategy.",
    duration: "8 weeks",
    students: 2450,
    rating: 4.9,
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
  },
  {
    id: 2,
    title: "Social Media Marketing Mastery",
    description: "Learn to create viral campaigns and grow audiences across all major social platforms.",
    duration: "6 weeks",
    students: 1890,
    rating: 4.8,
    level: "Intermediate",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=250&fit=crop",
  },
  {
    id: 3,
    title: "Google Ads & PPC Advertising",
    description: "Become proficient in paid advertising with hands-on Google Ads campaigns.",
    duration: "5 weeks",
    students: 1567,
    rating: 4.9,
    level: "Intermediate",
    image: "https://images.unsplash.com/photo-1553484771-371a605b060b?w=400&h=250&fit=crop",
  },
  {
    id: 4,
    title: "Content Marketing Strategy",
    description: "Create compelling content that drives traffic, engagement, and conversions.",
    duration: "7 weeks",
    students: 2100,
    rating: 4.7,
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop",
  },
  {
    id: 5,
    title: "Email Marketing & Automation",
    description: "Build effective email campaigns and automate your marketing workflows.",
    duration: "4 weeks",
    students: 1345,
    rating: 4.8,
    level: "Intermediate",
    image: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=400&h=250&fit=crop",
  },
  {
    id: 6,
    title: "Analytics & Data-Driven Marketing",
    description: "Make informed decisions using Google Analytics and marketing intelligence tools.",
    duration: "6 weeks",
    students: 1678,
    rating: 4.9,
    level: "Advanced",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
  },
];

const getLevelColor = (level: string) => {
  switch (level) {
    case "Beginner":
      return "bg-green-500/20 text-green-400";
    case "Intermediate":
      return "bg-yellow-500/20 text-yellow-400";
    case "Advanced":
      return "bg-red-500/20 text-red-400";
    default:
      return "bg-primary/20 text-primary";
  }
};

const Courses = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24">
        {/* Header */}
        <section className="py-16 bg-card/50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
                <span className="text-foreground">Explore Our </span>
                <span className="text-gradient">Courses</span>
              </h1>
              <p className="text-muted-foreground text-lg">
                From fundamentals to advanced strategies, find the perfect course to accelerate your digital marketing career.
              </p>
            </div>
          </div>
        </section>

        {/* Course Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="group glass rounded-xl overflow-hidden transition-all duration-300 hover:glow-teal"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
                        {course.level}
                      </span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center">
                        <Play className="w-6 h-6 text-primary-foreground ml-1" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-display text-lg font-semibold text-foreground mb-2 line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {course.description}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {course.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {course.students.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Star className="w-4 h-4 fill-current" />
                        {course.rating}
                      </div>
                    </div>

                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 group/btn">
                      View Course
                      <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Courses;
