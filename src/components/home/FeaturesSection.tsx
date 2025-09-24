import { Calendar, Heart, Map, Palette, Share, Users } from "lucide-react";
import { Card, CardContent } from "../ui/card";

export function FeaturesSection() {
  const features = [
    {
      icon: Map,
      title: "인터랙티브 지도",
      description:
        "아름다운 인터랙티브 지도에서 데이트 코스를 시각화하세요. 시작부터 끝까지 전체 여정을 확인해보세요.",
      color:
        "bg-gradient-to-br from-[var(--very-light-pink)] to-[var(--light-pink)]",
    },
    {
      icon: Heart,
      title: "로맨틱 플래닝",
      description:
        "당신의 사랑 이야기에 맞춘 로맨틱한 장소, 액티비티, 그리고 경험을 위한 큐레이션된 제안을 받아보세요.",
      color:
        "bg-gradient-to-br from-[var(--light-pink)] to-[var(--coral-pink)]/20",
    },
    {
      icon: Palette,
      title: "3D 시각화",
      description:
        "놀라운 3D로 데이트 코스를 경험해보세요. 특별한 날 전에 모든 장소를 미리 확인할 수 있습니다.",
      color:
        "bg-gradient-to-br from-[var(--very-light-pink)] to-[var(--light-pink)]",
    },
    {
      icon: Calendar,
      title: "스마트 스케줄링",
      description:
        "타이밍과 동선을 최적화하세요. 한 순간에서 다음 순간으로 자연스럽게 이어지는 완벽한 일정을 만들어보세요.",
      color:
        "bg-gradient-to-br from-[var(--light-pink)] to-[var(--coral-pink)]/20",
    },
    {
      icon: Users,
      title: "커뮤니티 공유",
      description:
        "커뮤니티와 코스를 공유하고 전 세계 커플들의 놀라운 데이트 아이디어를 발견해보세요.",
      color:
        "bg-gradient-to-br from-[var(--very-light-pink)] to-[var(--light-pink)]",
    },
    {
      icon: Share,
      title: "간편한 공유",
      description:
        "완벽한 데이트 코스를 파트너나 친구들과 공유하세요. 모든 캘린더나 지도 앱으로 내보낼 수 있습니다.",
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
            완벽한 데이트를 위한 모든 것
          </h2>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            CourseCoc은 지속적인 추억을 만드는 로맨틱한 경험을 계획하고, 시각화하며,
            공유하는 데 필요한 모든 도구를 제공합니다.
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
