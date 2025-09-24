"use client";

import { useState } from "react";
import { CourseCard } from "../../components/CoursesCard";
import { EmptyState } from "../../components/EmptyState";
import { Header } from "../../components/Header";
import { SearchAndFilter } from "../../components/SearchAndFilter";

// 샘플 데이터
const sampleCourses = [
  {
    id: 1,
    title: "도심 속 로맨틱 이브닝",
    description:
      "친밀한 디너 스팟과 아름다운 도시 야경을 즐기는 완벽한 데이트 코스입니다. 도시의 로맨스를 경험해보세요.",
    placeCount: 5,
    likes: 124,
    views: 856,
    steps: ["선셋 카페", "미술관", "저녁식사", "야경 산책", "디저트 바"],
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
    steps: ["박물관 투어", "갤러리", "커피숍", "서점", "와인바", "라이브 음악"],
    imageUrl:
      "https://images.unsplash.com/photo-1696238378039-821fc376ebd4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBnYWxsZXJ5JTIwbXVzZXVtJTIwZGF0ZXxlbnwxfHx8fDE3NTg2MzEwNTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
];

export default function Coumunity() {
  const [courses] = useState(sampleCourses);
  const [showEmpty, setShowEmpty] = useState(false);

  return (
    <div
      className="min-h-screen bg-white flex justify-center"
      suppressHydrationWarning
    >
      <Header />

      {/* Main Content */}
      <main className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              완벽한 데이트 코스 만들기
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              아름다운 이야기를 담은 로맨틱한 경험을 디자인해보세요. 모든 순간,
              모든 발걸음이 사랑으로 만들어집니다.
            </p>
          </div>

          <SearchAndFilter />

          {/* Toggle between empty state and courses for demo */}
          <div className="mb-6 flex justify-center">
            <button
              onClick={() => setShowEmpty(!showEmpty)}
              className="text-sm text-pink-500 hover:underline"
            >
              {showEmpty ? "샘플 코스 보기" : "빈 상태 보기"}
            </button>
          </div>

          {/* Content Area */}
          {showEmpty || courses.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  id={course.id}
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
          )}

        </div>
      </main>
    </div>
  );
}
