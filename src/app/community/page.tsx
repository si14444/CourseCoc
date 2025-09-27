"use client";

import { useState, useEffect } from "react";
import { CourseCard } from "../../components/CoursesCard";
import { EmptyState } from "../../components/EmptyState";
import { Header } from "../../components/Header";
import { SearchAndFilter } from "../../components/SearchAndFilter";
import { getPublishedCourses, Course } from "../../lib/firebaseCourses";
import { CONTAINER_CLASSES, COURSE_GRID_CLASSES } from "@/utils/layouts";

export default function Community() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Firebase에서 코스 데이터 가져오기
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const publishedCourses = await getPublishedCourses();
        setCourses(publishedCourses);
        setFilteredCourses(publishedCourses);
      } catch (err: any) {
        console.error("코스 데이터 로딩 실패:", err);
        setError(err.message || "코스 데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // 검색 및 필터링 로직
  useEffect(() => {
    let filtered = courses;

    // 검색어로 필터링
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        course =>
          course.title.toLowerCase().includes(searchLower) ||
          course.description.toLowerCase().includes(searchLower) ||
          course.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
          course.locations?.some(location =>
            location.name.toLowerCase().includes(searchLower) ||
            location.description.toLowerCase().includes(searchLower)
          )
      );
    }

    // 선택된 태그로 필터링
    if (selectedTags.length > 0) {
      filtered = filtered.filter(course =>
        selectedTags.every(tag => course.tags.includes(tag))
      );
    }

    setFilteredCourses(filtered);
  }, [courses, searchTerm, selectedTags]);

  // 검색어 변경 핸들러
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  // 태그 필터 변경 핸들러
  const handleTagFilter = (tags: string[]) => {
    setSelectedTags(tags);
  };


  return (
    <div
      className="min-h-screen bg-white"
      suppressHydrationWarning
    >
      <Header />

      {/* Main Content */}
      <main className="pt-20 pb-8">
        <div className={CONTAINER_CLASSES}>
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              완벽한 데이트 코스 만들기
            </h1>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              아름다운 이야기를 담은 로맨틱한 경험을 디자인해보세요. 모든 순간,
              모든 발걸음이 사랑으로 만들어집니다.
            </p>

          </div>

          <SearchAndFilter
            onSearch={handleSearch}
            onTagFilter={handleTagFilter}
          />


          {/* 로딩 상태 */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--coral-pink)] mx-auto mb-4"></div>
              <p className="text-gray-600">멋진 데이트 코스들을 불러오는 중...</p>
            </div>
          )}

          {/* 에러 상태 */}
          {error && (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  오류가 발생했습니다
                </h3>
                <p className="text-red-600 mb-4">{error}</p>
              </div>
            </div>
          )}

          {/* Content Area */}
          {!loading && !error && (
            <>
              {filteredCourses.length === 0 ? (
                courses.length === 0 ? (
                  <EmptyState />
                ) : (
                  // 검색/필터 결과가 없는 경우
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      검색 결과가 없습니다
                    </h3>
                    <p className="text-gray-600 mb-4">
                      다른 키워드나 태그로 검색해보세요
                    </p>
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedTags([]);
                      }}
                      className="text-[var(--coral-pink)] hover:underline"
                    >
                      모든 코스 보기
                    </button>
                  </div>
                )
              ) : (
                <div className={COURSE_GRID_CLASSES}>
                  {filteredCourses.map((course) => (
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
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
