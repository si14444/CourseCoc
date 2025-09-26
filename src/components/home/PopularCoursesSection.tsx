import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { CourseCard } from "../CoursesCard";
import { Button } from "../ui/button";
import { CONTAINER_CLASSES, COURSE_GRID_CLASSES } from "@/utils/layouts";

export function PopularCoursesSection() {
  // Sample popular courses
  const popularCourses = [
    {
      id: 1,
      title: "도심 속 로맨틱 이브닝",
      description:
        "친밀한 디너 스팟과 아름다운 도시 야경을 즐기는 완벽한 데이트 코스입니다. 도시의 로맨스를 경험해보세요.",
      placeCount: 5,
      likes: 124,
      views: 856,
      steps: [
        "선셋 카페",
        "미술관",
        "저녁식사",
        "야경 산책",
        "디저트 바",
      ],
      imageUrl:
        "https://images.unsplash.com/photo-1621596016740-c831e613dc49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbnRpYyUyMGRpbm5lciUyMGRhdGUlMjByZXN0YXVyYW50fGVufDF8fHx8MTc1ODYzMTA0N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: 2,
      title: "자연 속 사랑 여행",
      description:
        "자연과 모험을 사랑하는 커플을 위한 아름다운 야외 장소들을 발견해보세요. 신선한 공기와 멋진 경관이 보장됩니다.",
      placeCount: 4,
      likes: 89,
      views: 623,
      steps: ["공원 산책", "피크닉 장소", "호수 전망", "일몰 명소"],
      imageUrl:
        "https://images.unsplash.com/photo-1724216605131-c8b0d4974458?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3VwbGVzJTIwd2Fsa2luZyUyMHBhcmslMjBzdW5zZXR8ZW58MXx8fHwxNzU4NjMxMDQ5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: 3,
      title: "문화적 데이트 체험",
      description:
        "예술, 문화, 그리고 지적인 대화에 흠뻑 빠져보세요. 세련된 것을 좋아하는 커플에게 완벽한 코스입니다.",
      placeCount: 6,
      likes: 156,
      views: 1024,
      steps: [
        "박물관 투어",
        "갤러리",
        "커피숍",
        "서점",
        "와인바",
        "라이브 음악",
      ],
      imageUrl:
        "https://images.unsplash.com/photo-1696238378039-821fc376ebd4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBnYWxsZXJ5JTIwbXVzZXVtJTIwZGF0ZXxlbnwxfHx8fDE3NTg2MzEwNTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-[var(--very-light-pink)] to-[var(--light-pink)]/30">
      <div className={CONTAINER_CLASSES}>
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
            인기 데이트 코스
          </h2>
          <p className="text-lg text-[var(--text-secondary)] max-w-4xl mx-auto mb-8">
            우리 커뮤니티에서 만들어진 가장 사랑받는 데이트 코스들을 발견해보세요.
            영감을 얻고 나만의 로맨틱한 여정을 만들어보세요.
          </p>
        </div>

        {/* Courses Grid */}
        <div className={`${COURSE_GRID_CLASSES} mb-12`}>
          {popularCourses.map((course) => (
            <CourseCard
              key={course.id}
              title={course.title}
              description={course.description}
              placeCount={course.placeCount}
              likes={course.likes}
              views={course.views}
              steps={course.steps}
              imageUrl={course.imageUrl}
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link href="/community">
            <Button
              variant="outline"
              size="lg"
              className="border-[var(--coral-pink)] text-[var(--coral-pink)] hover:bg-[var(--coral-pink)] hover:text-white transition-all duration-300 px-8 py-4"
            >
              모든 코스 보기
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
