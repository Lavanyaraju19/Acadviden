import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('/homepage-hero.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Overlay gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-24">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-muted-foreground">
              Digital Marketing Academy
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <span className="text-foreground">WHERE DIGITAL DREAMS</span>
            <br />
            <span className="text-gradient">MEET MARKETING MASTERY</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Data-Driven Strategies. Creative Solutions. Measurable Results.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Link to="/login">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 glow-teal group px-8"
              >
                Student Login
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/courses">
              <Button
                size="lg"
                variant="outline"
                className="border-primary/50 text-foreground hover:bg-primary/10 hover:border-primary group px-8"
              >
                <Play className="mr-2 h-5 w-5" />
                Explore Courses
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-border/50 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <div>
              <p className="font-display text-3xl font-bold text-primary">75+</p>
              <p className="text-sm text-muted-foreground">Marketing Tools</p>
            </div>
            <div>
              <p className="font-display text-3xl font-bold text-primary">50+</p>
              <p className="text-sm text-muted-foreground">Expert Courses</p>
            </div>
            <div>
              <p className="font-display text-3xl font-bold text-primary">10K+</p>
              <p className="text-sm text-muted-foreground">Active Students</p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};
