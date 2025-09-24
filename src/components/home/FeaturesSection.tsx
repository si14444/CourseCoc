import { Calendar, Heart, Map, Palette, Share, Users } from "lucide-react";
import { Card, CardContent } from "../ui/card";

export function FeaturesSection() {
  const features = [
    {
      icon: Map,
      title: "Interactive Maps",
      description:
        "Visualize your date course on beautiful interactive maps. See the full journey from start to finish.",
      color:
        "bg-gradient-to-br from-[var(--very-light-pink)] to-[var(--light-pink)]",
    },
    {
      icon: Heart,
      title: "Romantic Planning",
      description:
        "Curated suggestions for romantic spots, activities, and experiences tailored to your love story.",
      color:
        "bg-gradient-to-br from-[var(--light-pink)] to-[var(--coral-pink)]/20",
    },
    {
      icon: Palette,
      title: "3D Visualization",
      description:
        "Experience your date course in stunning 3D. Preview every location before your special day.",
      color:
        "bg-gradient-to-br from-[var(--very-light-pink)] to-[var(--light-pink)]",
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description:
        "Optimize timing and logistics. Get the perfect schedule that flows naturally from one moment to the next.",
      color:
        "bg-gradient-to-br from-[var(--light-pink)] to-[var(--coral-pink)]/20",
    },
    {
      icon: Users,
      title: "Community Sharing",
      description:
        "Share your courses with the community and discover amazing date ideas from couples worldwide.",
      color:
        "bg-gradient-to-br from-[var(--very-light-pink)] to-[var(--light-pink)]",
    },
    {
      icon: Share,
      title: "Easy Sharing",
      description:
        "Share your perfect date course with your partner or friends. Export to any calendar or map app.",
      color:
        "bg-gradient-to-br from-[var(--light-pink)] to-[var(--coral-pink)]/20",
    },
  ];

  return (
    <section className="py-20 bg-[var(--background)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
            Everything You Need for Perfect Dates
          </h2>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            CourseCoc provides all the tools you need to plan, visualize, and
            share romantic experiences that create lasting memories.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="bg-white rounded-2xl shadow-[0_4px_20px_var(--pink-shadow)] hover:shadow-[0_8px_30px_var(--pink-shadow-hover)] transition-all duration-300 transform hover:-translate-y-1 border-0 overflow-hidden group"
              >
                <CardContent className="p-6">
                  {/* Icon */}
                  <div
                    className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-8 h-8 text-[var(--coral-pink)]" />
                  </div>

                  {/* Content */}
                  <h3 className="font-bold text-[var(--text-primary)] mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-[var(--text-secondary)] leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
