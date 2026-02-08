"use client";

import {
  Bookmark,
  Clock,
  Heart,
  MapPin,
  Share2,
  Users,
  Eye,
  MessageCircle,
} from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CustomOverlayMap, Map, Polyline } from "react-kakao-maps-sdk";
import { Header } from "../../../components/Header";
import { AdSpot } from "@/components/AdSpot";
import {
  Course,
  getCourseById,
  updateCourseBookmarks,
} from "../../../lib/firebaseCourses";
import {
  toggleLikeCourse,
  checkUserLikedCourse,
} from "../../../lib/firebaseCourseLikes";
import { useAuth } from "../../../contexts/AuthContext";
import { Location } from "../../../types";

// Comments 컴포넌트를 동적으로 로드하여 하이드레이션 문제 해결
const Comments = dynamic(
  () =>
    import("../../../components/Comments").then((mod) => ({
      default: mod.Comments,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="mt-8 p-6 bg-[var(--surface)] rounded-lg">
        <div className="animate-pulse">
          <div className="h-6 bg-[var(--accent-color)] rounded w-24 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex space-x-3">
                <div className="w-10 h-10 bg-[var(--accent-color)] rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-[var(--accent-color)] rounded w-32 mb-2"></div>
                  <div className="h-4 bg-[var(--accent-color)] rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
);

// Kakao Map Component
function CourseMap({ locations }: { locations: Location[] }) {
  // 좌표가 있는 위치만 필터링
  const validLocations = locations.filter(
    (loc) => loc.position && loc.position.lat && loc.position.lng,
  );

  if (validLocations.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">지도에 표시할 위치 정보가 없습니다</p>
        </div>
      </div>
    );
  }

  // 지도 중심 좌표 계산 (모든 위치의 중점)
  const center = {
    lat:
      validLocations.reduce((sum, loc) => sum + (loc.position?.lat || 0), 0) /
      validLocations.length,
    lng:
      validLocations.reduce((sum, loc) => sum + (loc.position?.lng || 0), 0) /
      validLocations.length,
  };

  return (
    <Map
      center={center}
      style={{
        width: "100%",
        height: "100%",
      }}
      level={6}
    >
      {/* 위치 마커들 */}
      {validLocations.map(
        (location, index) =>
          location.position && (
            <CustomOverlayMap
              key={index}
              position={location.position}
              xAnchor={0.5}
              yAnchor={1}
              zIndex={index + 1}
            >
              <div className="relative w-10 h-10 cursor-pointer group">
                {/* Heart Pin Image */}
                <img
                  src="/pin.png"
                  alt={`Location ${index + 1}`}
                  className="w-full h-full object-contain object-bottom drop-shadow-sm"
                />

                {/* Number Badge - Below the Pin */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md border border-[var(--coral-pink)] z-20">
                  <span className="text-[var(--coral-pink)] font-bold text-xs">
                    {index + 1}
                  </span>
                </div>

                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 border border-gray-100 overflow-hidden min-w-[160px]">
                  {location.image && (
                    <div className="w-full h-24 bg-gray-100">
                      <img
                        src={location.image}
                        alt={location.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="px-3 py-2 text-center">
                    <div className="text-gray-800 text-sm font-bold whitespace-nowrap">
                      {location.name}
                    </div>
                    {location.time && (
                      <div className="text-[var(--coral-pink)] text-xs mt-0.5">
                        {location.time}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CustomOverlayMap>
          ),
      )}

      {/* 경로 표시 (2개 이상의 위치가 있을 때만) */}
      {validLocations.length > 1 && (
        <Polyline
          path={validLocations
            .map((location) => location.position)
            .filter((pos): pos is { lat: number; lng: number } => Boolean(pos))}
          strokeWeight={5}
          strokeColor={"#ff6b6b"}
          strokeOpacity={0.9}
          strokeStyle={"solid"}
        />
      )}
    </Map>
  );
}

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    // Kakao Maps API 헬퍼: SDK가 이미 layout.tsx에서 로드되었으므로 load 이벤트만 대기
    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(() => {
        setIsMapLoaded(true);
      });
    }
  }, []);

  // Firebase에서 코스 데이터 가져오기
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!courseId || courseId === "undefined" || courseId === "null") {
          throw new Error("잘못된 코스 ID입니다.");
        }

        const courseData = await getCourseById(courseId);

        if (courseData) {
          setCourse(courseData);
          setLikeCount(courseData.likes);
        } else {
          setError("해당 코스를 찾을 수 없습니다.");
        }
      } catch (err: unknown) {
        console.error("코스 데이터 로딩 실패:", err);
        if (err instanceof Error) {
          console.error("에러 메시지:", err.message);
        }

        const errorCode = (err as { code?: string })?.code;
        if (errorCode === "permission-denied") {
          setError(
            "게시글을 볼 수 있는 권한이 없습니다. Firebase 보안 규칙을 확인해주세요.",
          );
        } else if (errorCode === "not-found") {
          setError("요청하신 게시글이 존재하지 않습니다.");
        } else {
          setError(
            `데이터 로딩 오류: ${
              err instanceof Error ? err.message : "알 수 없는 오류"
            }`,
          );
        }
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    } else {
      console.error("courseId가 없습니다.");
      setError("게시글 ID가 제공되지 않았습니다.");
    }
  }, [courseId]);

  // Check if user liked this course
  useEffect(() => {
    const checkLike = async () => {
      if (user && courseId) {
        const liked = await checkUserLikedCourse(courseId, user.uid);
        setIsLiked(liked);
      }
    };
    checkLike();
  }, [user, courseId]);

  // 좋아요 처리
  const handleLike = async () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (!course) return;

    const prevLiked = isLiked;
    const prevCount = likeCount;
    setIsLiked(!prevLiked);
    setLikeCount(prevLiked ? prevCount - 1 : prevCount + 1);

    const result = await toggleLikeCourse(course.id, user.uid, prevCount);
    if (!result.success) {
      setIsLiked(prevLiked);
      setLikeCount(prevCount);
      alert("좋아요 처리 중 오류가 발생했습니다.");
    }
  };

  // 북마크 처리 (임시로 로컬 상태만 변경)
  const handleBookmark = async () => {
    if (!course) return;

    try {
      const increment = bookmarked ? -1 : 1;

      // Firebase 업데이트 시도, 실패 시 로컬 상태만 변경
      try {
        await updateCourseBookmarks(course.id, increment);
        setCourse((prev) =>
          prev ? { ...prev, bookmarks: prev.bookmarks + increment } : null,
        );
      } catch (firebaseError) {
        console.warn(
          "Firebase 북마크 업데이트 실패, 로컬 상태만 변경:",
          firebaseError,
        );
        // 로컬 상태만 변경 (새로고침 시 원래대로 돌아감)
        setCourse((prev) =>
          prev ? { ...prev, bookmarks: prev.bookmarks + increment } : null,
        );
        alert("북마크는 임시로만 반영됩니다. Firebase 권한 설정이 필요합니다.");
      }

      setBookmarked(!bookmarked);
    } catch (error) {
      console.error("북마크 처리 실패:", error);
      alert("북마크 처리 중 오류가 발생했습니다.");
    }
  };

  // 공유 처리
  const handleShare = async () => {
    if (!course) return;

    try {
      const shareData = {
        title: course.title,
        text: course.description,
        url: window.location.href,
      };

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: 클립보드에 복사
        await navigator.clipboard.writeText(window.location.href);
        alert("링크가 클립보드에 복사되었습니다!");
      }
    } catch (error) {
      console.error("공유 실패:", error);
    }
  };

  // 로딩 상태
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-16 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--coral-pink)] mx-auto mb-4"></div>
            <p className="text-gray-600">멋진 데이트 코스를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error || (!loading && !course)) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-16 flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-4xl mx-auto px-4">
            <div className="text-6xl mb-4">😞</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              게시글을 불러올 수 없습니다
            </h1>
            <p className="text-gray-600 mb-4">
              {error || "요청하신 게시글이 존재하지 않습니다."}
            </p>

            {/* 디버깅 정보 */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left text-sm">
              <h3 className="font-semibold mb-2">디버깅 정보:</h3>
              <ul className="space-y-1 text-gray-600">
                <li>
                  • 게시글 ID:{" "}
                  <code className="bg-gray-200 px-1 rounded">{courseId}</code>
                </li>
                <li>• 현재 상태: {loading ? "로딩 중" : "로딩 완료"}</li>
                <li>• 에러 메시지: {error || "없음"}</li>
                <li>• 프로젝트: coursecoc-1c242</li>
                <li>• 컬렉션: courses</li>
              </ul>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  window.location.reload();
                }}
                className="block w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                페이지 새로고침
              </button>

              <button
                onClick={() => router.push("/courses")}
                className="block w-full px-6 py-3 bg-[var(--coral-pink)] text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                코스 목록으로 돌아가기
              </button>

              <p className="text-xs text-gray-500 mt-4">
                계속 문제가 발생하면 Firebase 보안 규칙을 확인해주세요.
                <br />
                콘솔(F12)에서 더 자세한 에러 정보를 확인할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-gray-600">코스를 찾을 수 없습니다.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-20">
        <div className="max-w-[1600px] mx-auto px-6">
          <div className="flex gap-8 justify-center">
            {/* Left Ad Spot */}
            <div className="mt-20">
              <AdSpot position="left" />
            </div>

            {/* Main Content */}
            <div className="flex-1 max-w-[1000px]">
              {/* Hero Section */}
              <div
                className={`relative overflow-hidden rounded-2xl mb-12 ${
                  course.heroImage || course.locations?.[0]?.image ? "h-[60vh]" : "h-96"
                }`}
              >
        {course.heroImage || course.locations?.[0]?.image ? (
          <Image
            src={course.heroImage || course.locations?.[0]?.image || ""}
            alt={course.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          // Fallback: 대표 이미지가 없을 때 아름다운 기본 배경
          <div className="w-full h-full bg-gradient-to-br from-[var(--coral-pink)]/20 via-[var(--very-light-pink)] to-[var(--light-pink)] flex items-center justify-center relative overflow-hidden">
            {/* 장식적 요소들 */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-[var(--coral-pink)]/30 animate-pulse"></div>
              <div className="absolute top-32 right-16 w-12 h-12 rounded-full bg-[var(--coral-pink)]/20 animate-pulse delay-1000"></div>
              <div className="absolute bottom-20 left-20 w-16 h-16 rounded-full bg-[var(--coral-pink)]/25 animate-pulse delay-500"></div>
              <div className="absolute bottom-32 right-32 w-8 h-8 rounded-full bg-[var(--coral-pink)]/30 animate-pulse delay-300"></div>
            </div>
          </div>
        )}
        {/* 이미지가 있을 때만 텍스트 가독성을 위한 오버레이 적용 */}
        {(course.heroImage || course.locations?.[0]?.image) && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
        )}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div
            className={`text-center px-4 ${
              course.heroImage || course.locations?.[0]?.image
                ? "text-white"
                : "text-[var(--coral-pink)]"
            }`}
          >
            <h1
              className={`font-bold drop-shadow-lg ${
                course.heroImage || course.locations?.[0]?.image
                  ? "text-5xl md:text-6xl mb-6"
                  : "text-4xl mb-4"
              }`}
            >
              {course.title}
            </h1>
            <p
              className={`drop-shadow-md ${
                course.heroImage || course.locations?.[0]?.image
                  ? "text-xl md:text-2xl max-w-5xl"
                  : "text-lg max-w-4xl"
              } ${
                course.heroImage || course.locations?.[0]?.image
                  ? "opacity-90"
                  : "opacity-80"
              }`}
            >
              {course.description}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 py-12">
        {/* Kakao Map Course Overview */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">코스 지도 미리보기</h2>
          <div className="h-[500px] rounded-2xl overflow-hidden border border-gray-200 shadow-lg">
            {isMapLoaded ? (
              <CourseMap locations={course.locations} />
            ) : (
              <div className="flex items-center justify-center h-full bg-gradient-to-br from-[var(--very-light-pink)] to-[var(--light-pink)]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--coral-pink)] mx-auto mb-4"></div>
                  <p className="text-gray-600">지도 로딩중...</p>
                </div>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-4 text-center">
            지도를 드래그하여 이동하고, 스크롤로 확대/축소할 수 있습니다. 핀을
            클릭하면 장소 정보를 확인할 수 있어요!
          </p>
        </div>

        {/* Course Steps */}
        <div className="space-y-16 mb-16">
          <h2 className="text-2xl font-bold mb-6">데이트 코스 순서</h2>
          {course.locations.map((location: Location, index: number) => (
            <div
              key={location.id || index}
              className="grid md:grid-cols-2 gap-8 items-center"
            >
              {/* Image */}
              <div className={`${index % 2 === 1 ? "md:order-2" : ""}`}>
                <div className="relative">
                  {location.image ? (
                    <div className="relative w-full h-64">
                      <Image
                        src={location.image}
                        alt={location.name}
                        fill
                        className="object-cover rounded-2xl"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-64 bg-gradient-to-br from-[var(--very-light-pink)] to-[var(--light-pink)] rounded-2xl flex items-center justify-center">
                      <MapPin className="w-12 h-12 text-[var(--coral-pink)]" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4 w-10 h-10 bg-[var(--coral-pink)] text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {index + 1}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className={`${index % 2 === 1 ? "md:order-1" : ""}`}>
                <div className="mb-4">
                  {location.time && (
                    <span className="text-sm text-[var(--coral-pink)] font-medium">
                      {location.time}
                    </span>
                  )}
                  <h3 className="text-2xl font-bold mt-1 mb-3">
                    {location.name}
                  </h3>
                  {location.description && (
                    <p className="text-lg text-gray-600 mb-4">
                      {location.description}
                    </p>
                  )}
                </div>
                {location.detail && (
                  <p className="text-gray-700 leading-relaxed">
                    {location.detail}
                  </p>
                )}
                {location.address && (
                  <p className="text-sm text-gray-500 mt-3">
                    📍 {location.address}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Content Section */}
        {course.content && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6">코스 소개</h2>
            <div
              className="prose max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: course.content }}
            />
          </div>
        )}

        {/* Interactive Kakao Map Final View */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">
            전체 코스 한눈에 보기
          </h2>
          <div className="h-[600px] rounded-2xl overflow-hidden border border-gray-200 shadow-lg">
            {isMapLoaded ? (
              <CourseMap locations={course.locations} />
            ) : (
              <div className="flex items-center justify-center h-full bg-gradient-to-br from-[var(--coral-pink)]/10 to-[var(--light-pink)]/30">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--coral-pink)] mx-auto mb-4"></div>
                  <p className="text-lg text-gray-600">
                    데이트 코스 지도 로딩중...
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              🗺️ 총 {course.locations.length}개 장소를 연결하는 로맨틱한 데이트
              코스
            </p>
            <p className="text-xs text-gray-500 mt-1">
              빨간 선은 추천 이동 경로입니다
            </p>
          </div>
        </div>

        {/* Tags */}
        {course.tags && course.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {course.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1 bg-[var(--very-light-pink)] text-[var(--coral-pink)] rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Course Info Summary */}
        {(course.duration || course.budget || course.season) && (
          <div className="bg-[var(--very-light-pink)] rounded-2xl p-8 mb-8">
            <h3 className="text-xl font-bold mb-6">코스 정보</h3>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              {course.duration && (
                <div>
                  <div className="text-sm text-gray-600 mb-1">소요 시간</div>
                  <div className="font-semibold">{course.duration}</div>
                </div>
              )}
              {course.budget && (
                <div>
                  <div className="text-sm text-gray-600 mb-1">예상 비용</div>
                  <div className="font-semibold">{course.budget}</div>
                </div>
              )}
              {course.season && (
                <div>
                  <div className="text-sm text-gray-600 mb-1">추천 계절</div>
                  <div className="font-semibold">{course.season}</div>
                </div>
              )}
            </div>

            {/* Stats and Like Button */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <span className="flex items-center space-x-1.5">
                  <Eye className="w-4 h-4" />
                  <span>{course.views}</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <MapPin className="w-4 h-4" />
                  <span>{course.locations.length}개 장소</span>
                </span>
              </div>

              {/* Like Button */}
              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  isLiked
                    ? "text-white shadow-md"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
                style={isLiked ? { backgroundColor: "#ff6b6b" } : {}}
              >
                <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
                <span className="font-medium">{likeCount}</span>
              </button>
            </div>
          </div>
        )}

        {/* Comments Section */}
        <Comments courseId={course.id} />
      </div>

            {/* Right Ad Spot */}
            <div className="mt-20">
              <AdSpot position="right" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
