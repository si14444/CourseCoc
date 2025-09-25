import { useState } from "react";
import { LoginPage } from "../../../components/auth/LoginPage";
import { Header } from "../../../components/Header";
import { CTASection } from "../../../components/home/CTASection";
import { FeaturesSection } from "../../../components/home/FeaturesSection";
import { Footer } from "../../../components/home/Footer";
import { HeroSection } from "../../../components/home/HeroSection";
import { PopularCoursesSection } from "../../../components/home/PopularCoursesSection";

export default function App() {
  const [currentPage, setCurrentPage] = useState<"home" | "login">("home");

  if (currentPage === "login") {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Popular Courses Section */}
      <PopularCoursesSection />

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <Footer />

      {/* Floating Hearts Animation */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
        <div className="absolute top-1/4 left-1/4 w-4 h-4 text-[var(--light-pink)] opacity-20 animate-pulse">
          ❤️
        </div>
        <div
          className="absolute top-3/4 right-1/3 w-3 h-3 text-[var(--coral-pink)] opacity-15 animate-pulse"
          style={{ animationDelay: "2s" }}
        >
          💖
        </div>
        <div
          className="absolute top-1/2 right-1/4 w-2 h-2 text-[var(--light-pink)] opacity-10 animate-pulse"
          style={{ animationDelay: "4s" }}
        >
          💕
        </div>
      </div>

      {/* Temporary Login Button for Demo */}
      <button
        onClick={() => setCurrentPage("login")}
        className="fixed bottom-4 right-4 bg-[var(--coral-pink)] text-white px-4 py-2 rounded-lg shadow-lg hover:bg-[var(--coral-pink)]/90 transition-all duration-300 z-50"
      >
        로그인 페이지 보기
      </button>
    </div>
  );
}
