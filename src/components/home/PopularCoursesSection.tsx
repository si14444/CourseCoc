"use client";

import { ArrowRight, Plus } from "lucide-react";
import Link from "next/link";
import { CourseCard } from "../CoursesCard";
import { Button } from "../ui/button";
import { CONTAINER_CLASSES, COURSE_GRID_CLASSES } from "@/utils/layouts";
import { useEffect, useState } from "react";
import { getPublishedCourses, Course } from "@/lib/firebaseCourses";

export function PopularCoursesSection() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const publishedCourses = await getPublishedCourses();
        // 최대 3개만 표시하고, 좋아요 순으로 정렬
        const sortedCourses = publishedCourses
          .sort((a, b) => (b.likes || 0) - (a.likes || 0))
          .slice(0, 3);
        setCourses(sortedCourses);
      } catch (error) {
        console.error('코스 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  return (
    <section className="py-20 bg-gradient-to-br from-[var(--very-light-pink)] to-[var(--light-pink)]/30">
      <div className={CONTAINER_CLASSES}>
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
            {courses.length > 0 ? "인기 데이트 코스" : "곧 만나볼 데이트 코스"}
          </h2>
          <p className="text-lg text-[var(--text-secondary)] max-w-4xl mx-auto mb-8">
            {courses.length > 0
              ? "우리 커뮤니티에서 만들어진 가장 사랑받는 데이트 코스들을 발견해보세요. 영감을 얻고 나만의 로맨틱한 여정을 만들어보세요."
              : "첫 번째 코스 제작자가 되어보세요! 당신만의 특별한 데이트 이야기를 공유하고 다른 커플들에게 영감을 선사해보세요."
            }
          </p>
        </div>

        {/* Courses Grid or Empty State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-lg text-[var(--text-secondary)]">
              코스를 불러오고 있습니다...
            </div>
          </div>
        ) : courses.length > 0 ? (
          <>
            <div className={`${COURSE_GRID_CLASSES} mb-12`}>
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  id={course.id}
                  title={course.title}
                  description={course.description}
                  placeCount={course.placeCount || course.locations?.length || 0}
                  likes={course.likes}
                  views={course.views}
                  steps={course.steps || course.locations?.map(loc => loc.name).filter(Boolean) || []}
                  imageUrl={course.imageUrl || course.heroImage}
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
          </>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-12 border border-[var(--coral-pink)]/20 max-w-2xl mx-auto">
              <div className="text-6xl mb-6">💕</div>
              <h3 className="text-2xl font-bold text-[var(--coral-pink)] mb-4">
                첫 번째 코스를 기다리고 있어요!
              </h3>
              <p className="text-[var(--text-secondary)] mb-6">
                CourseCoc과 함께 새로운 시작을 해보세요.<br />
                당신의 로맨틱한 아이디어가 많은 커플들에게 영감이 될 수 있습니다.
              </p>
              <Link href="/community/write">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[var(--very-light-pink)] via-[var(--light-pink)] to-[var(--coral-pink)] text-white hover:shadow-xl hover:shadow-[var(--pink-shadow)] transition-all duration-300 transform hover:-translate-y-1 px-8 py-4"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  첫 번째 코스 만들기
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
