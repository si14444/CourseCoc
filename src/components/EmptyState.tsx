import { Heart, Sparkles } from "lucide-react";
import { Button } from "./ui/button";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {/* Romantic Icon Background */}
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full bg-[var(--very-light-pink)] flex items-center justify-center relative overflow-hidden">
          {/* Floating hearts animation */}
          <div className="absolute inset-0 opacity-20">
            <Heart
              className="w-6 h-6 text-[var(--light-pink)] absolute top-2 left-3 animate-pulse"
              style={{ animationDelay: "0s" }}
            />
            <Heart
              className="w-4 h-4 text-[var(--coral-pink)] absolute bottom-3 right-2 animate-pulse"
              style={{ animationDelay: "1s" }}
            />
            <Sparkles
              className="w-5 h-5 text-[var(--light-pink)] absolute top-4 right-4 animate-pulse"
              style={{ animationDelay: "0.5s" }}
            />
          </div>

          {/* Main Icon */}
          <Heart className="w-12 h-12 text-[var(--light-pink)] fill-current relative z-10" />
        </div>

        {/* Subtle glow effect */}
        <div className="absolute inset-0 w-24 h-24 rounded-full bg-[var(--coral-pink)] opacity-5 blur-xl animate-pulse" />
      </div>

      {/* Encouraging Content */}
      <div className="max-w-md mx-auto mb-8">
        <h2 className="font-bold text-[var(--text-primary)] mb-3">
          아직 코스가 없어요
        </h2>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          첫 번째 데이트 코스를 만들고 멋진 로맨틱한 경험을 계획해보세요! 모든 아름다운 사랑 이야기는 완벽한 첫 걸음부터 시작됩니다.
        </p>
      </div>

      {/* CTA Button */}
      <Button
        size="lg"
        className="bg-gradient-to-r from-[var(--very-light-pink)] via-[var(--light-pink)] to-[var(--coral-pink)] text-white hover:shadow-lg hover:shadow-[var(--pink-shadow)] transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105 px-8 py-3"
      >
        <Heart className="w-5 h-5 mr-2 fill-current" />
        첫 코스 만들기
      </Button>

      {/* Subtle decorative elements */}
      <div className="mt-12 flex items-center space-x-3 opacity-30">
        <div
          className="w-2 h-2 rounded-full bg-[var(--coral-pink)] animate-pulse"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="w-2 h-2 rounded-full bg-[var(--light-pink)] animate-pulse"
          style={{ animationDelay: "0.3s" }}
        />
        <div
          className="w-2 h-2 rounded-full bg-[var(--coral-pink)] animate-pulse"
          style={{ animationDelay: "0.6s" }}
        />
      </div>
    </div>
  );
}
