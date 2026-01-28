import { BookOpen, Award, Users, Zap, Globe, Shield } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Expert-Led Courses",
    description: "Learn from industry professionals with real-world experience in digital marketing.",
  },
  {
    icon: Award,
    title: "Certification",
    description: "Earn recognized certificates upon course completion to boost your career.",
  },
  {
    icon: Users,
    title: "Community Access",
    description: "Join a thriving community of marketers to network and collaborate.",
  },
  {
    icon: Zap,
    title: "Hands-On Projects",
    description: "Apply your learning with practical projects and real-world case studies.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Access courses anytime, anywhere with our mobile-friendly platform.",
  },
  {
    icon: Shield,
    title: "Lifetime Access",
    description: "Get unlimited access to course materials and future updates.",
  },
];

export const FeaturesSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            <span className="text-foreground">Why Choose </span>
            <span className="text-gradient">Acadvizen?</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We provide everything you need to become a successful digital marketer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group p-6 rounded-xl glass transition-all duration-300 hover:glow-teal"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
