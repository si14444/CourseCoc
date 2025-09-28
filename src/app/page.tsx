import { Header } from "../components/Header";
import { CTASection } from "../components/home/CTASection";
import { FeaturesSection } from "../components/home/FeaturesSection";
import { Footer } from "../components/home/Footer";
import { NoSSR } from "../components/NoSSR";
import dynamic from "next/dynamic";

// SSR 비활성화로 dynamic import
const HeroSection = dynamic(() => import("../components/home/HeroSection").then(mod => ({ default: mod.HeroSection })), {
  ssr: false,
  loading: () => (
    <section className="relative overflow-hidden bg-gradient-to-br from-[var(--warm-white)] via-[var(--very-light-pink)] to-[var(--light-pink)] py-20 lg:py-32">
      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="text-lg text-[var(--text-secondary)]">로딩 중...</div>
      </div>
    </section>
  )
});

const PopularCoursesSection = dynamic(() => import("../components/home/PopularCoursesSection").then(mod => ({ default: mod.PopularCoursesSection })), {
  ssr: false,
  loading: () => (
    <section className="py-20 bg-gradient-to-br from-[var(--very-light-pink)] to-[var(--light-pink)]/30">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <div className="text-lg text-[var(--text-secondary)]">코스를 불러오고 있습니다...</div>
        </div>
      </div>
    </section>
  )
});

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
