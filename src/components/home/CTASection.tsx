import { Heart, Plus, Sparkles } from "lucide-react";
import { Button } from "../ui/button";

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-[var(--coral-pink)] to-[var(--coral-pink)]/90 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white opacity-10 blur-2xl animate-pulse" />
        <div
          className="absolute bottom-16 right-16 w-24 h-24 rounded-full bg-white opacity-15 blur-xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/3 w-16 h-16 rounded-full bg-white opacity-5 blur-lg animate-pulse"
          style={{ animationDelay: "4s" }}
        />
      </div>

      {/* Floating hearts */}
      <div className="absolute inset-0 pointer-events-none">
        <Heart
          className="absolute top-20 left-1/4 w-8 h-8 text-white opacity-20 animate-pulse fill-current"
          style={{ animationDelay: "0s" }}
        />
        <Heart
          className="absolute bottom-1/4 right-1/4 w-6 h-6 text-white opacity-15 animate-pulse fill-current"
          style={{ animationDelay: "3s" }}
        />
        <Sparkles
          className="absolute top-1/3 right-1/3 w-7 h-7 text-white opacity-25 animate-pulse"
          style={{ animationDelay: "1.5s" }}
        />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Content */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Ready to Create Your
            <span className="block">Perfect Date Course?</span>
          </h2>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            Join thousands of couples who have already discovered the magic of
            perfectly planned romantic experiences. Start your love story today.
          </p>
        </div>

        {/* CTA Button */}
        <div className="mb-12">
          <Button
            size="lg"
            className="bg-white text-[var(--coral-pink)] hover:bg-white/90 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 px-12 py-6 text-lg font-semibold"
          >
            <Plus className="w-6 h-6 mr-3" />
            Start Creating Now
          </Button>
        </div>

        {/* Trust indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white/80">
          <div className="flex flex-col items-center">
            <div className="text-2xl mb-2">💝</div>
            <div className="text-sm">Free to Start</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-2xl mb-2">✨</div>
            <div className="text-sm">No Credit Card Required</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-2xl mb-2">🎯</div>
            <div className="text-sm">Create in Minutes</div>
          </div>
        </div>
      </div>
    </section>
  );
}
