"use client";

import { useState, useEffect } from "react";
import { Header } from "../../components/Header";
import { SearchAndFilter } from "../../components/SearchAndFilter";
import { EmptyState } from "../../components/EmptyState";
import { CourseCard } from "../../components/CoursesCard";
import { useAuth } from "../../contexts/AuthContext";
import { getUserCourses, Course } from "../../lib/firebaseCourses";
import { getCourseImageUrl, handleImageError } from "../../utils/defaultImages";
import {
  Plus,
  Calendar,
  BarChart3,
  Heart,
  Eye,
  MapPin,
  Edit3,
  Trash2,
  MoreVertical,
  BookOpen,
  Clock
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { CONTAINER_CLASSES } from "@/utils/layouts";
import Link from "next/link";

export default function MyCoursesPage() {
  const { user, loading: authLoading } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showStats, setShowStats] = useState(true);

  // Firebase에서 사용자 코스 데이터 가져오기
  useEffect(() => {
    const fetchUserCourses = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const userCourses = await getUserCourses(user.uid);
        setCourses(userCourses);
      } catch (err: any) {
        console.error("사용자 코스 데이터 로딩 실패:", err);
        setError(err.message || "코스 데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchUserCourses();
    }
  }, [user, authLoading]);

  // 통계 계산
  const stats = {
    totalCourses: courses.length,
    totalViews: courses.reduce((sum, course) => sum + (course.views || 0), 0),
    totalLikes: courses.reduce((sum, course) => sum + (course.likes || 0), 0),
    avgRating: 4.8 // 평점 시스템이 구현되면 실제 계산으로 변경
  };

  // 모든 코스 표시 (필터링 없음)
  const filteredCourses = courses;

  const handleDeleteCourse = (courseId: string) => {
    if (confirm("정말로 이 코스를 삭제하시겠습니까?")) {
      setCourses(prev => prev.filter(course => course.id !== courseId));
      // TODO: Firebase에서 삭제하는 함수 추가
    }
  };


  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";
    try {
      // Firebase Timestamp 객체인 경우
      if (timestamp.toDate) {
        return timestamp.toDate().toLocaleDateString('ko-KR');
      }
      // Date 객체인 경우
      if (timestamp instanceof Date) {
        return timestamp.toLocaleDateString('ko-KR');
      }
      // 문자열인 경우
      return new Date(timestamp).toLocaleDateString('ko-KR');
    } catch (error) {
      return "";
    }
  };

  // 로딩 상태 (인증 로딩 중이거나 데이터 로딩 중)
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-20 pb-8">
          <div className={CONTAINER_CLASSES}>
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-color)] mx-auto mb-4"></div>
              <p className="text-[var(--text-secondary)]">코스 데이터를 불러오는 중...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // 로그인하지 않은 사용자
  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-20 pb-8">
          <div className={CONTAINER_CLASSES}>
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
                로그인이 필요합니다
              </h3>
              <p className="text-[var(--text-secondary)] mb-6">
                내 코스를 보려면 먼저 로그인해주세요.
              </p>
              <Link href="/auth/login">
                <Button className="btn-primary">
                  로그인하기
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-20 pb-8">
        <div className={CONTAINER_CLASSES}>
          {/* 페이지 헤더 */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-2">
                내 코스 관리
              </h1>
              <p className="text-lg text-[var(--text-secondary)]">
                나만의 특별한 데이트 코스를 관리하고 공유해보세요
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Link href="/community/write">
                <Button className="btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  새 코스 만들기
                </Button>
              </Link>
            </div>
          </div>

          {/* 통계 카드 */}
          {showStats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="shadow-romantic">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <BookOpen className="h-8 w-8 text-[var(--coral-pink)]" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-[var(--text-secondary)]">총 코스</p>
                      <p className="text-2xl font-bold text-[var(--text-primary)]">{stats.totalCourses}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-romantic">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Eye className="h-8 w-8 text-[var(--coral-pink)]" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-[var(--text-secondary)]">총 조회수</p>
                      <p className="text-2xl font-bold text-[var(--text-primary)]">{stats.totalViews.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-romantic">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Heart className="h-8 w-8 text-[var(--coral-pink)]" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-[var(--text-secondary)]">총 좋아요</p>
                      <p className="text-2xl font-bold text-[var(--text-primary)]">{stats.totalLikes}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-romantic">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <BarChart3 className="h-8 w-8 text-[var(--coral-pink)]" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-[var(--text-secondary)]">평균 평점</p>
                      <p className="text-2xl font-bold text-[var(--text-primary)]">{stats.avgRating}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}


          {/* 에러 상태 */}
          {error && (
            <div className="text-center py-12 mb-8">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  오류가 발생했습니다
                </h3>
                <p className="text-red-600 mb-4">{error}</p>
                <Button
                  onClick={() => window.location.reload()}
                  className="text-red-800 border-red-300 hover:bg-red-50"
                  variant="outline"
                >
                  다시 시도
                </Button>
              </div>
            </div>
          )}

          {/* 검색 및 필터 */}
          <SearchAndFilter />

          {/* 코스 목록 */}
          {!error && filteredCourses.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
                {activeTab === "all" ? "아직 만든 코스가 없습니다" : `${activeTab} 상태의 코스가 없습니다`}
              </h3>
              <p className="text-[var(--text-secondary)] mb-6">
                첫 번째 로맨틱한 데이트 코스를 만들어보세요!
              </p>
              <Link href="/community/write">
                <Button className="btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  새 코스 만들기
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <div key={course.id} className="relative group">
                  <Card className="shadow-romantic hover:shadow-[0_8px_30px_var(--pink-shadow-hover)] transition-all duration-300 overflow-hidden">
                    {/* 이미지 */}
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[var(--very-light-pink)] to-[var(--light-pink)]">
                      {(course.heroImage || course.imageUrl || (course.locations?.some(loc => loc.image))) ? (
                        <img
                          src={getCourseImageUrl(
                            course.heroImage || course.imageUrl,
                            course.locations?.map(loc => loc.image).filter(Boolean),
                            course.tags
                          )}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => handleImageError(e, course.tags)}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[var(--coral-pink)]/20 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                              <span className="text-lg sm:text-2xl">💕</span>
                            </div>
                            <p className="text-xs sm:text-sm text-[var(--coral-pink)] font-medium">로맨틱 데이트 코스</p>
                          </div>
                        </div>
                      )}

                      {/* 관리 버튼들 */}
                      <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/community/write?edit=${course.id}`}>
                          <button className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors">
                            <Edit3 className="w-4 h-4 text-gray-600" />
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDeleteCourse(course.id)}
                          className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      {/* 제목과 설명 */}
                      <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2 line-clamp-1">
                        {course.title}
                      </h3>
                      <p className="text-[var(--text-secondary)] text-sm mb-4 line-clamp-2">
                        {course.description}
                      </p>

                      {/* 메타 정보 */}
                      <div className="flex items-center justify-between mb-4 text-sm text-[var(--text-secondary)]">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{course.placeCount}개 장소</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Heart className="w-4 h-4" />
                            <span>{course.likes}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{course.views}</span>
                          </div>
                        </div>
                      </div>

                      {/* 업데이트 날짜 */}
                      <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>업데이트: {formatDate(course.updatedAt)}</span>
                        </div>
                        <Link href={`/community/course/${course.id}`}>
                          <Button variant="outline" size="sm" className="text-xs">
                            상세보기
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}