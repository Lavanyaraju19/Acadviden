import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export const CTASection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/5" />
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `radial-gradient(circle at 25% 50%, hsl(var(--primary) / 0.15) 0%, transparent 50%),
                          radial-gradient(circle at 75% 50%, hsl(var(--accent) / 0.15) 0%, transparent 50%)`
      }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              Start Your Journey Today
            </span>
          </div>

          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-foreground">Ready to Transform Your </span>
            <span className="text-gradient">Digital Marketing Career?</span>
          </h2>

          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Join thousands of students who have already accelerated their careers with Acadvizen's comprehensive digital marketing programs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 glow-teal group px-8"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/courses">
              <Button
                size="lg"
                variant="outline"
                className="border-primary/50 text-foreground hover:bg-primary/10 hover:border-primary px-8"
              >
                View All Courses
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
