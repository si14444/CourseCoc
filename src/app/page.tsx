import { Header } from "../components/Header";
import { CTASection } from "../components/home/CTASection";
import { FeaturesSection } from "../components/home/FeaturesSection";
import { Footer } from "../components/home/Footer";
import { HeroSection } from "../components/home/HeroSection";
import { PopularCoursesSection } from "../components/home/PopularCoursesSection";

export default function App() {
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

    </div>
  );
}
