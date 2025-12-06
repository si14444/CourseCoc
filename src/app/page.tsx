"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  MessageCircle,
  Flame,
  Clock,
  User,
  Hash,
  TrendingUp,
  Heart,
  Megaphone,
  BarChart3,
  FileText,
  Map,
} from "lucide-react";
import { Header } from "../components/Header";
import { PostCard } from "../components/PostCard";
import { CourseCard } from "../components/CoursesCard";
import { getPosts, Post } from "../lib/firebasePosts";
import { getPublishedCourses, Course } from "../lib/firebaseCourses";
import { useAuth } from "../contexts/AuthContext";

type SortOption = "latest" | "popular";

// 광고 배너 컴포넌트
function AdBanner({
  variant = "horizontal",
}: {
  variant?: "horizontal" | "sidebar";
}) {
  if (variant === "sidebar") {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
        <div className="flex items-center space-x-2 text-gray-600 mb-2">
          <Megaphone className="w-4 h-4" />
          <span className="text-xs font-medium">광고</span>
        </div>
        <div className="h-32 bg-white rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
          <span className="text-sm text-gray-400">AD SPACE</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-xl p-4 border border-gray-200">
      <div className="flex items-center space-x-2 text-gray-600 mb-2">
        <Megaphone className="w-4 h-4" />
        <span className="text-xs font-medium">광고</span>
      </div>
      <div className="h-24 bg-white rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
        <span className="text-sm text-gray-400">AD BANNER SPACE</span>
      </div>
    </div>
  );
}

// 더미 게시글 데이터
const DUMMY_POSTS: Post[] = [
  {
    id: "dummy-1",
    authorId: "dummy-user-1",
    author: { nickname: "로맨틱커플" },
    title: "첫 데이트 코스 추천해주세요! 🌸",
    content:
      "다음 주에 여자친구랑 첫 데이트를 하는데요, 서울에서 좋은 코스 있을까요?",
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    likes: 15,
    views: 128,
    commentCount: 8,
  },
  {
    id: "dummy-2",
    authorId: "dummy-user-2",
    author: { nickname: "힐링여행" },
    title: "한강 야경 데이트 후기 ✨",
    content: "어제 여의도 한강공원에서 야경 보고 왔는데 진짜 너무 좋았어요!",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    likes: 42,
    views: 256,
    commentCount: 12,
  },
];

export default function Home() {
  const { user, userProfile } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>("latest");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [postsResult, coursesResult] = await Promise.all([
          getPosts(),
          getPublishedCourses(),
        ]);

        setPosts(
          postsResult.posts.length > 0 ? postsResult.posts : DUMMY_POSTS
        );
        setCourses(
          coursesResult
            .sort((a, b) => (b.likes || 0) - (a.likes || 0))
            .slice(0, 6) // 6개로 증가
        );
      } catch (err) {
        console.error("데이터 로딩 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const sortedPosts = [...posts].sort((a, b) => {
    if (sortBy === "popular") {
      return b.likes + b.commentCount - (a.likes + a.commentCount);
    }
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  const popularTags = ["데이트", "카페", "맛집", "서울", "야경", "드라이브"];

  return (
    <div
      className="min-h-screen bg-[var(--background)]"
      suppressHydrationWarning
    >
      <Header />

      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar - 프로필 + 태그 + 통계 */}
            <aside className="hidden lg:block lg:col-span-3">
              <div className="sticky top-20 space-y-4">
                {/* 프로필 카드 */}
                {user ? (
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center space-x-3 mb-4">
                      {userProfile?.profileImageUrl ? (
                        <Image
                          src={userProfile.profileImageUrl}
                          alt="프로필"
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-[var(--light-pink)]"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-[var(--coral-pink)]/80 to-[var(--coral-pink)] rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            {(userProfile?.nickname ||
                              user.displayName ||
                              "U")[0].toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {userProfile?.nickname ||
                            user.displayName ||
                            "사용자"}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <Link href="/community/post">
                      <button className="w-full py-2.5 bg-[var(--coral-pink)] text-white rounded-lg font-medium hover:bg-[var(--coral-pink)]/90 transition-colors flex items-center justify-center space-x-2">
                        <Plus className="w-4 h-4" />
                        <span>새 글 작성</span>
                      </button>
                    </Link>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="text-center mb-3">
                      <Heart className="w-8 h-8 text-[var(--coral-pink)] mx-auto mb-2" />
                      <p className="text-gray-600 text-sm">
                        로그인하고 글을 작성해보세요
                      </p>
                    </div>
                    <Link href="/auth/login">
                      <button className="w-full py-2.5 bg-[var(--coral-pink)] text-white rounded-lg font-medium hover:bg-[var(--coral-pink)]/90 transition-colors">
                        로그인
                      </button>
                    </Link>
                  </div>
                )}

                {/* 인기 태그 */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center space-x-2 mb-3">
                    <TrendingUp className="w-5 h-5 text-[var(--coral-pink)]" />
                    <h3 className="font-semibold text-gray-900">인기 태그</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {popularTags.map((tag) => (
                      <button
                        key={tag}
                        className="flex items-center space-x-1 px-3 py-1.5 bg-gray-50 hover:bg-[var(--very-light-pink)] text-gray-600 hover:text-[var(--coral-pink)] rounded-full text-sm transition-colors"
                      >
                        <Hash className="w-3 h-3" />
                        <span>{tag}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 통계 */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center space-x-2 mb-3">
                    <BarChart3 className="w-5 h-5 text-[var(--coral-pink)]" />
                    <h3 className="font-semibold text-gray-900">통계</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          전체 게시글
                        </span>
                      </div>
                      <span className="font-semibold text-[var(--coral-pink)]">
                        {posts.length}개
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Map className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">전체 코스</span>
                      </div>
                      <span className="font-semibold text-[var(--coral-pink)]">
                        {courses.length}개
                      </span>
                    </div>
                  </div>
                </div>

                {/* 광고 배너 */}
                <AdBanner variant="sidebar" />

                {/* 코스 목록 바로가기 */}
                <Link href="/course-list" className="block">
                  <div className="bg-gradient-to-r from-[var(--coral-pink)] to-[var(--coral-pink)]/90 rounded-xl p-4 text-white hover:shadow-lg transition-all">
                    <h3 className="font-semibold mb-1">데이트 코스 보기</h3>
                    <p className="text-sm text-white/90">
                      다른 커플들의 코스를 둘러보세요 →
                    </p>
                  </div>
                </Link>
              </div>
            </aside>

            {/* Main Content - 더 넓게 */}
            <div className="lg:col-span-9">
              {/* 모바일 네비게이션 */}
              <div className="lg:hidden flex items-center justify-between mb-4">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSortBy("latest")}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      sortBy === "latest"
                        ? "bg-pink-500 text-white"
                        : "bg-white text-gray-600 border border-gray-200"
                    }`}
                  >
                    최신
                  </button>
                  <button
                    onClick={() => setSortBy("popular")}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      sortBy === "popular"
                        ? "bg-pink-500 text-white"
                        : "bg-white text-gray-600 border border-gray-200"
                    }`}
                  >
                    인기
                  </button>
                </div>
                {user && (
                  <Link href="/community/post">
                    <button className="p-2 bg-pink-500 text-white rounded-full hover:shadow-lg transition-all">
                      <Plus className="w-5 h-5" />
                    </button>
                  </Link>
                )}
              </div>

              {loading ? (
                <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-500 mx-auto mb-3"></div>
                  <p className="text-gray-600">로딩 중...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* 인기 데이트 코스 - 메인 섹션 */}
                  {courses.length > 0 && (
                    <div className="bg-gradient-to-br from-[var(--very-light-pink)] via-white to-[var(--very-light-pink)] rounded-2xl p-8 border border-[var(--coral-pink)]/20 shadow-md">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
                          <Heart className="w-7 h-7 text-[var(--coral-pink)]" />
                          <span>인기 데이트 코스</span>
                        </h2>
                        <Link
                          href="/course-list"
                          className="text-sm text-[var(--coral-pink)] hover:text-[var(--coral-pink)]/80 font-semibold flex items-center space-x-1"
                        >
                          <span>전체보기</span>
                          <span>→</span>
                        </Link>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {courses.map((course) => (
                          <CourseCard
                            key={course.id}
                            id={course.id}
                            title={course.title}
                            description={course.description}
                            placeCount={
                              course.placeCount || course.locations?.length || 0
                            }
                            likes={course.likes}
                            views={course.views}
                            steps={
                              course.steps ||
                              course.locations
                                ?.map((loc) => loc.name)
                                .filter(Boolean) ||
                              []
                            }
                            imageUrl={course.imageUrl || course.heroImage}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 광고 배너 */}
                  <AdBanner variant="horizontal" />

                  {/* 커뮤니티 게시글 */}
                  <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                        <MessageCircle className="w-5 h-5 text-[var(--coral-pink)]" />
                        <span>커뮤니티 게시글</span>
                      </h2>
                      {/* 데스크톱 네비게이션 */}
                      <div className="hidden lg:flex space-x-2">
                        <button
                          onClick={() => setSortBy("latest")}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            sortBy === "latest"
                              ? "bg-pink-50 text-pink-600"
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          <Clock className="w-4 h-4 inline mr-1" />
                          최신글
                        </button>
                        <button
                          onClick={() => setSortBy("popular")}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            sortBy === "popular"
                              ? "bg-pink-50 text-pink-600"
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          <Flame className="w-4 h-4 inline mr-1" />
                          인기글
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {sortedPosts.slice(0, 5).map((post) => (
                        <PostCard key={post.id} post={post} />
                      ))}
                    </div>

                    {sortedPosts.length > 5 && (
                      <div className="mt-4 text-center">
                        <Link
                          href="/community"
                          className="text-sm text-pink-600 hover:text-pink-700 font-medium"
                        >
                          더 많은 게시글 보기 →
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
