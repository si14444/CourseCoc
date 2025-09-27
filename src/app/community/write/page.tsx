"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../../lib/firebase";
import { useAuth } from "../../../contexts/AuthContext";
import { Header } from "../../../components/Header";
import {
  Camera,
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  Plus,
  X,
  GripVertical,
  Eye,
  Send,
  Heart,
  Bookmark,
  Share2,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { AddressAutocomplete } from "../../../components/ui/AddressAutocomplete";
import { RichTextEditor } from "../../../components/ui/RichTextEditor";
import { Map, MapMarker, Polyline } from "react-kakao-maps-sdk";

interface Location {
  id: string;
  name: string;
  address: string;
  time: string;
  description: string;
  detail: string;
  image?: string;
  position?: {
    lat: number;
    lng: number;
  };
}

interface FirebaseError extends Error {
  code?: string;
  message: string;
  stack?: string;
}

interface CourseDocument {
  title: string;
  description: string;
  tags: string[];
  duration: string;
  budget: string;
  season: string;
  locations: Location[];
  content: string;
  isDraft: boolean;
  createdAt: ReturnType<typeof serverTimestamp>;
  updatedAt: ReturnType<typeof serverTimestamp>;
  likes: number;
  views: number;
  bookmarks: number;
  heroImage?: string;
  authorId: string;
  authorName?: string;
}

interface CourseData {
  title: string;
  description: string;
  tags: string[];
  duration: string;
  budget: string;
  season: string;
  heroImage?: string;
  locations: Location[];
  content: string;
}

const AVAILABLE_TAGS = [
  "로맨틱",
  "액티브",
  "문화",
  "자연",
  "카페",
  "맛집",
  "야경",
  "데이트",
  "산책",
  "쇼핑",
  "예술",
  "힐링",
];

const DURATION_OPTIONS = [
  "2-3시간",
  "3-4시간",
  "4-5시간",
  "5-6시간",
  "하루종일",
];

const BUDGET_OPTIONS = [
  "5만원 이하",
  "5-10만원",
  "10-15만원",
  "15-20만원",
  "20만원 이상",
];

const SEASON_OPTIONS = ["봄", "여름", "가을", "겨울", "사계절"];

// 미리보기 지도 컴포넌트
function PreviewMap({ locations }: { locations: Location[] }) {
  if (locations.length === 0) return null;

  // 좌표가 있는 장소들만 필터링
  const validLocations = locations.filter((loc) => loc.position);

  if (validLocations.length === 0) {
    return (
      <div className="h-48 bg-gradient-to-br from-[var(--very-light-pink)] to-[var(--light-pink)] rounded-lg flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-8 h-8 mx-auto mb-2 text-[var(--coral-pink)]" />
          <p className="text-sm text-[var(--text-secondary)]">
            주소를 입력하면 지도가 표시됩니다
          </p>
        </div>
      </div>
    );
  }

  // 지도 중심 좌표 계산
  const center = {
    lat:
      validLocations.reduce((sum, loc) => sum + loc.position!.lat, 0) /
      validLocations.length,
    lng:
      validLocations.reduce((sum, loc) => sum + loc.position!.lng, 0) /
      validLocations.length,
  };

  return (
    <div className="h-48 rounded-lg overflow-hidden">
      <Map center={center} style={{ width: "100%", height: "100%" }} level={8}>
        {/* 마커들 */}
        {validLocations.map((location, index) => (
          <MapMarker
            key={location.id}
            position={location.position!}
            image={{
              src: "/pin.png",
              size: { width: 30, height: 30 },
              options: { offset: { x: 15, y: 30 } },
            }}
            title={`${index + 1}. ${location.name}`}
          />
        ))}

        {/* 경로 표시 */}
        {validLocations.length > 1 && (
          <Polyline
            path={validLocations.map((location) => location.position!)}
            strokeWeight={3}
            strokeColor={"#ff6b6b"}
            strokeOpacity={0.8}
            strokeStyle={"solid"}
          />
        )}
      </Map>
    </div>
  );
}

export default function WritePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [courseData, setCourseData] = useState<CourseData>({
    title: "",
    description: "",
    tags: [],
    duration: "",
    budget: "",
    season: "",
    locations: [],
    content: "",
  });

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const heroImageInputRef = useRef<HTMLInputElement>(null);
  const locationImageInputRefs = useRef<{
    [key: string]: HTMLInputElement | null;
  }>({});

  // 카카오맵 API 로드 (services 라이브러리 포함)
  useEffect(() => {
    // 이미 로드된 스크립트가 있는지 확인
    const existingScript = document.querySelector('script[src*="dapi.kakao.com"]');
    if (existingScript) {
      if (window.kakao && window.kakao.maps) {
        setIsMapLoaded(true);
      }
      return;
    }

    const script = document.createElement("script");
    script.async = true;
    // services 라이브러리 추가 (Places API 사용을 위해 필수)
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAPS_API_KEY}&autoload=false&libraries=services`;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        setIsMapLoaded(true);
      });
    };

    script.onerror = () => {
      console.error('Kakao Maps API 로드 실패');
    };

    return () => {
      // 컴포넌트 언마운트 시에는 스크립트를 제거하지 않음 (다른 컴포넌트에서 사용할 수 있음)
    };
  }, []);

  const addLocation = () => {
    const newLocation: Location = {
      id: Date.now().toString(),
      name: "",
      address: "",
      time: "",
      description: "",
      detail: "",
    };
    setCourseData((prev) => ({
      ...prev,
      locations: [...prev.locations, newLocation],
    }));
  };

  // 주소 자동완성 선택 시 처리
  const handleAddressSelect = (
    index: number,
    result: {
      x: string;
      y: string;
      road_address_name?: string;
      address_name: string;
    }
  ) => {
    const coords = {
      lat: parseFloat(result.y),
      lng: parseFloat(result.x),
    };

    setCourseData((prev) => ({
      ...prev,
      locations: prev.locations.map((loc, i) =>
        i === index
          ? {
              ...loc,
              address: result.road_address_name || result.address_name,
              position: coords,
            }
          : loc
      ),
    }));
  };

  const updateLocation = (
    index: number,
    field: keyof Location,
    value: string
  ) => {
    setCourseData((prev) => ({
      ...prev,
      locations: prev.locations.map((loc, i) =>
        i === index ? { ...loc, [field]: value } : loc
      ),
    }));
  };

  const removeLocation = (index: number) => {
    setCourseData((prev) => ({
      ...prev,
      locations: prev.locations.filter((_, i) => i !== index),
    }));
  };

  const toggleTag = (tag: string) => {
    setCourseData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (dropIndex: number) => {
    if (draggedIndex === null) return;

    const newLocations = [...courseData.locations];
    const draggedItem = newLocations[draggedIndex];
    newLocations.splice(draggedIndex, 1);
    newLocations.splice(dropIndex, 0, draggedItem);

    setCourseData((prev) => ({
      ...prev,
      locations: newLocations,
    }));
    setDraggedIndex(null);
  };

  // 대표 이미지 업로드 처리
  const handleHeroImageClick = () => {
    heroImageInputRef.current?.click();
  };

  const handleHeroImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCourseData((prev) => ({
          ...prev,
          heroImage: event.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // 장소 이미지 업로드 처리
  const handleLocationImageClick = (locationId: string) => {
    locationImageInputRefs.current[locationId]?.click();
  };

  const handleLocationImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCourseData((prev) => ({
          ...prev,
          locations: prev.locations.map((loc, i) =>
            i === index
              ? { ...loc, image: event.target?.result as string }
              : loc
          ),
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // 이미지 Firebase Storage 업로드 함수
  const uploadImageToStorage = async (base64Image: string, path: string): Promise<string> => {
    try {
      const imageRef = ref(storage, path);
      await uploadString(imageRef, base64Image, 'data_url');
      const downloadURL = await getDownloadURL(imageRef);
      return downloadURL;
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      throw new Error('이미지 업로드에 실패했습니다.');
    }
  };

  // Firebase 저장 함수들
  const saveCourse = async () => {
    // 기본 유효성 검사
    if (!courseData.title?.trim() || !courseData.description?.trim()) {
      alert("제목과 설명은 필수 항목입니다.");
      return;
    }

    if (!courseData.locations || courseData.locations.length === 0) {
      alert("최소 1개 이상의 장소를 추가해주세요.");
      return;
    }

    if (!courseData.content?.trim()) {
      alert("상세 내용을 작성해주세요.");
      return;
    }

    // 장소별 필수 정보 검증
    for (let i = 0; i < courseData.locations.length; i++) {
      const location = courseData.locations[i];
      if (!location.name?.trim()) {
        alert(`${i + 1}번째 장소의 이름을 입력해주세요.`);
        return;
      }
      if (!location.address?.trim()) {
        alert(`${i + 1}번째 장소의 주소를 입력해주세요.`);
        return;
      }
    }

    // 태그 검증 및 정리
    const validTags = courseData.tags?.filter(tag => tag && tag.trim() !== "") || [];
    if (validTags.length === 0) {
      alert("최소 1개의 태그를 선택해주세요.");
      return;
    }

    setIsPublishing(true);


    try {
      // 이미지 업로드 처리
      let heroImageUrl = '';
      if (courseData.heroImage?.trim()) {
        try {
          const timestamp = Date.now();
          const heroImagePath = `course-images/hero-${timestamp}.jpg`;
          heroImageUrl = await uploadImageToStorage(courseData.heroImage, heroImagePath);
        } catch (error) {
          console.warn('대표 이미지 업로드 실패:', error);
          // 이미지 업로드 실패해도 게시글 저장은 계속 진행
        }
      }

      // Firebase는 undefined 값을 허용하지 않으므로 필터링
      const courseDoc: CourseDocument = {
        title: courseData.title.trim(),
        description: courseData.description.trim(),
        tags: validTags,
        duration: courseData.duration?.trim() || "",
        budget: courseData.budget?.trim() || "",
        season: courseData.season?.trim() || "",
        locations: [],
        content: courseData.content.trim(),
        isDraft: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        likes: 0,
        views: 0,
        bookmarks: 0,
        // 작성자 정보 추가
        authorId: user?.uid || '',
        authorName: user?.displayName || user?.email || ''
      };

      // heroImage URL이 있을 때만 추가
      if (heroImageUrl) {
        courseDoc.heroImage = heroImageUrl;
      }

      // locations 데이터 처리 - 이미지 업로드 포함
      const processedLocations = await Promise.all(
        courseData.locations.map(async (location, index) => {
          const cleanLocation: Location = {
            id: location.id || `loc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: location.name.trim(),
            address: location.address.trim(),
            time: location.time?.trim() || "",
            description: location.description?.trim() || "",
            detail: location.detail?.trim() || "",
          };

          // 이미지 업로드 처리
          if (location.image?.trim()) {
            try {
              const timestamp = Date.now();
              const locationImagePath = `course-images/location-${timestamp}-${index}.jpg`;
              const locationImageUrl = await uploadImageToStorage(location.image, locationImagePath);
              cleanLocation.image = locationImageUrl;
            } catch (error) {
              console.warn(`장소 ${index + 1} 이미지 업로드 실패:`, error);
              // 이미지 업로드 실패해도 장소 정보는 저장
            }
          }

          // 위치 정보 처리
          if (location.position &&
              typeof location.position.lat === 'number' &&
              typeof location.position.lng === 'number' &&
              !isNaN(location.position.lat) &&
              !isNaN(location.position.lng)) {
            cleanLocation.position = {
              lat: location.position.lat,
              lng: location.position.lng
            };
          }

          return cleanLocation;
        })
      );

      courseDoc.locations = processedLocations;

      await addDoc(collection(db, "courses"), courseDoc);

      alert("게시글이 성공적으로 발행되었습니다!");
      // 발행 성공 후 커뮤니티 페이지로 리다이렉트
      setTimeout(() => {
        router.push('/community');
      }, 1000); // 1초 후 이동 (사용자가 성공 메시지를 볼 수 있도록)
    } catch (error) {
      const firebaseError = error as FirebaseError;
      console.error("저장 중 오류가 발생했습니다:", error);
      console.error("에러 상세:", {
        code: firebaseError?.code,
        message: firebaseError?.message,
        stack: firebaseError?.stack
      });

      // Firebase 권한 에러인 경우 특별 처리
      if (firebaseError?.code === 'permission-denied' || firebaseError?.message?.includes('permission')) {
        alert(`권한 오류가 발생했습니다.

관리자에게 문의하여 Firebase 보안 규칙을 확인해주세요.

기술적 세부사항:
- 오류 코드: ${firebaseError?.code || 'permission-denied'}
- 오류 메시지: ${firebaseError?.message || 'Missing or insufficient permissions'}`);
      } else if (firebaseError?.code === 'unavailable') {
        alert("네트워크 오류입니다. 인터넷 연결을 확인하고 다시 시도해주세요.");
      } else if (firebaseError?.code === 'invalid-argument') {
        alert("입력된 데이터에 문제가 있습니다. 모든 필드를 다시 확인해주세요.");
      } else {
        alert(`저장 중 오류가 발생했습니다.

오류 정보:
- 코드: ${firebaseError?.code || '알 수 없음'}
- 메시지: ${firebaseError?.message || '알 수 없는 오류'}

다시 시도해주시거나 관리자에게 문의해주세요.`);
      }
    } finally {
      setIsPublishing(false);
    }
  };

  const handlePublish = () => {
    saveCourse();
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="pt-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-[var(--very-light-pink)] to-[var(--light-pink)] py-16">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4">
              새로운 데이트 코스 작성하기
            </h1>
            <p className="text-lg text-[var(--text-secondary)] max-w-4xl mx-auto">
              특별한 추억이 될 로맨틱한 코스를 공유해보세요
            </p>

            {/* 진행 단계 표시기 - 개선된 버전 */}
            <div className="flex justify-center items-center mt-10 space-x-4">
              <div className="flex flex-col items-center">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full text-sm font-semibold transition-all duration-300 ${
                    step >= 1
                      ? "bg-[var(--coral-pink)] text-white shadow-[0_4px_12px_var(--pink-shadow)]"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  1
                </div>
                <span
                  className={`text-xs mt-2 font-medium transition-colors duration-300 ${
                    step >= 1
                      ? "text-[var(--coral-pink)]"
                      : "text-[var(--text-secondary)]"
                  }`}
                >
                  기본정보
                </span>
              </div>

              <div
                className={`w-16 h-0.5 rounded-full transition-colors duration-300 ${
                  step >= 2 ? "bg-[var(--coral-pink)]" : "bg-gray-200"
                }`}
              />

              <div className="flex flex-col items-center">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full text-sm font-semibold transition-all duration-300 ${
                    step >= 2
                      ? "bg-[var(--coral-pink)] text-white shadow-[0_4px_12px_var(--pink-shadow)]"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  2
                </div>
                <span
                  className={`text-xs mt-2 font-medium transition-colors duration-300 ${
                    step >= 2
                      ? "text-[var(--coral-pink)]"
                      : "text-[var(--text-secondary)]"
                  }`}
                >
                  장소추가
                </span>
              </div>

              <div
                className={`w-16 h-0.5 rounded-full transition-colors duration-300 ${
                  step >= 3 ? "bg-[var(--coral-pink)]" : "bg-gray-200"
                }`}
              />

              <div className="flex flex-col items-center">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full text-sm font-semibold transition-all duration-300 ${
                    step >= 3
                      ? "bg-[var(--coral-pink)] text-white shadow-[0_4px_12px_var(--pink-shadow)]"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  3
                </div>
                <span
                  className={`text-xs mt-2 font-medium transition-colors duration-300 ${
                    step >= 3
                      ? "text-[var(--coral-pink)]"
                      : "text-[var(--text-secondary)]"
                  }`}
                >
                  내용작성
                </span>
              </div>

              <div
                className={`w-16 h-0.5 rounded-full transition-colors duration-300 ${
                  step >= 4 ? "bg-[var(--coral-pink)]" : "bg-gray-200"
                }`}
              />

              <div className="flex flex-col items-center">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full text-sm font-semibold transition-all duration-300 ${
                    step >= 4
                      ? "bg-[var(--coral-pink)] text-white shadow-[0_4px_12px_var(--pink-shadow)]"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  4
                </div>
                <span
                  className={`text-xs mt-2 font-medium transition-colors duration-300 ${
                    step >= 4
                      ? "text-[var(--coral-pink)]"
                      : "text-[var(--text-secondary)]"
                  }`}
                >
                  미리보기
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[1600px] mx-auto px-6 py-12">
          <div
            className={`grid ${
              step === 4 ? "grid-cols-1" : "lg:grid-cols-3"
            } gap-8`}
          >
            {/* 메인 입력 영역 */}
            <div className={step === 4 ? "col-span-1" : "lg:col-span-2"}>
              {step === 1 && (
                <Card className="shadow-romantic">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold mb-6 text-[var(--text-primary)]">
                      기본 정보
                    </h2>

                    {/* 코스 제목 */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        코스 제목 *
                      </label>
                      <input
                        type="text"
                        value={courseData.title}
                        onChange={(e) =>
                          setCourseData((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        placeholder="예: 도심 속 로맨틱 이브닝"
                        className="w-full"
                      />
                    </div>

                    {/* 코스 설명 */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        코스 설명 *
                      </label>
                      <textarea
                        value={courseData.description}
                        onChange={(e) =>
                          setCourseData((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        placeholder="이 데이트 코스의 특별한 점을 설명해주세요..."
                        rows={4}
                        className="w-full"
                      />
                    </div>

                    {/* 태그 선택 */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        태그 선택
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {AVAILABLE_TAGS.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => toggleTag(tag)}
                            className={`px-3 py-1 rounded-full text-sm transition-colors ${
                              courseData.tags.includes(tag)
                                ? "bg-[var(--coral-pink)] text-white"
                                : "bg-[var(--very-light-pink)] text-[var(--text-secondary)] hover:bg-[var(--light-pink)]"
                            }`}
                          >
                            #{tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 기본 정보 그리드 */}
                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                      {/* 소요시간 */}
                      <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                          <Clock className="w-4 h-4 inline mr-1" />
                          소요시간
                        </label>
                        <select
                          value={courseData.duration}
                          onChange={(e) =>
                            setCourseData((prev) => ({
                              ...prev,
                              duration: e.target.value,
                            }))
                          }
                          className="w-full"
                        >
                          <option value="">선택하세요</option>
                          {DURATION_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* 예상 비용 */}
                      <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                          <DollarSign className="w-4 h-4 inline mr-1" />
                          예상 비용
                        </label>
                        <select
                          value={courseData.budget}
                          onChange={(e) =>
                            setCourseData((prev) => ({
                              ...prev,
                              budget: e.target.value,
                            }))
                          }
                          className="w-full"
                        >
                          <option value="">선택하세요</option>
                          {BUDGET_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* 추천 계절 */}
                      <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                          <Calendar className="w-4 h-4 inline mr-1" />
                          추천 계절
                        </label>
                        <select
                          value={courseData.season}
                          onChange={(e) =>
                            setCourseData((prev) => ({
                              ...prev,
                              season: e.target.value,
                            }))
                          }
                          className="w-full"
                        >
                          <option value="">선택하세요</option>
                          {SEASON_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* 대표 이미지 업로드 */}
                    <div className="mb-8">
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        <Camera className="w-4 h-4 inline mr-1" />
                        대표 이미지
                      </label>
                      <div
                        onClick={handleHeroImageClick}
                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[var(--coral-pink)] transition-colors cursor-pointer"
                      >
                        {courseData.heroImage ? (
                          <div className="relative">
                            <img
                              src={courseData.heroImage}
                              alt="대표 이미지"
                              className="w-full h-32 object-cover rounded-lg mx-auto"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                              <Camera className="w-8 h-8 text-white" />
                              <span className="text-white ml-2">
                                이미지 변경
                              </span>
                            </div>
                          </div>
                        ) : (
                          <>
                            <Camera className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                            <p className="text-sm text-gray-500">
                              클릭하여 이미지를 업로드하세요
                            </p>
                          </>
                        )}
                        <input
                          ref={heroImageInputRef}
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleHeroImageChange}
                        />
                      </div>
                    </div>

                    {/* 다음 단계 버튼 */}
                    <div className="flex justify-end">
                      <Button
                        onClick={() => setStep(2)}
                        disabled={!courseData.title || !courseData.description}
                        className="btn-primary"
                      >
                        다음 단계
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {step === 2 && (
                <Card className="shadow-romantic">
                  <CardContent className="p-8">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                        장소 추가
                      </h2>
                      <Button onClick={addLocation} className="btn-outline">
                        <Plus className="w-4 h-4 mr-2" />
                        장소 추가
                      </Button>
                    </div>

                    {courseData.locations.length === 0 ? (
                      <div className="text-center py-12">
                        <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-500 mb-4">
                          아직 추가된 장소가 없습니다
                        </p>
                        <Button onClick={addLocation} className="btn-primary">
                          첫 번째 장소 추가하기
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {courseData.locations.map((location, index) => (
                          <div
                            key={location.id}
                            draggable
                            onDragStart={() => handleDragStart(index)}
                            onDragOver={handleDragOver}
                            onDrop={() => handleDrop(index)}
                            className="bg-[var(--very-light-pink)] rounded-lg p-6 relative"
                          >
                            <div className="flex items-start space-x-4">
                              {/* 드래그 핸들 */}
                              <div className="flex flex-col items-center">
                                <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                                <div className="w-8 h-8 bg-[var(--coral-pink)] text-white rounded-full flex items-center justify-center text-sm font-bold mt-2">
                                  {index + 1}
                                </div>
                              </div>

                              <div className="flex-1 space-y-4">
                                {/* 장소명 & 삭제 버튼 */}
                                <div className="flex items-center space-x-4">
                                  <input
                                    type="text"
                                    value={location.name}
                                    onChange={(e) =>
                                      updateLocation(
                                        index,
                                        "name",
                                        e.target.value
                                      )
                                    }
                                    placeholder="장소명을 입력하세요"
                                    className="flex-1"
                                  />
                                  <button
                                    onClick={() => removeLocation(index)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>

                                {/* 주소 & 시간 */}
                                <div className="grid md:grid-cols-2 gap-4">
                                  <AddressAutocomplete
                                    value={location.address}
                                    onChange={(value) =>
                                      updateLocation(index, "address", value)
                                    }
                                    onSelect={(result) =>
                                      handleAddressSelect(index, result)
                                    }
                                    placeholder="주소 또는 장소명을 입력하세요"
                                  />
                                  <input
                                    type="text"
                                    value={location.time}
                                    onChange={(e) =>
                                      updateLocation(
                                        index,
                                        "time",
                                        e.target.value
                                      )
                                    }
                                    placeholder="방문 시간 (예: 17:00 - 18:30)"
                                  />
                                </div>

                                {/* 간단 설명 */}
                                <input
                                  type="text"
                                  value={location.description}
                                  onChange={(e) =>
                                    updateLocation(
                                      index,
                                      "description",
                                      e.target.value
                                    )
                                  }
                                  placeholder="장소에 대한 간단한 설명을 입력하세요"
                                />

                                {/* 상세 설명 */}
                                <textarea
                                  value={location.detail}
                                  onChange={(e) =>
                                    updateLocation(
                                      index,
                                      "detail",
                                      e.target.value
                                    )
                                  }
                                  placeholder="이 장소에서의 특별한 경험이나 팁을 자세히 설명해주세요..."
                                  rows={3}
                                  className="w-full"
                                />

                                {/* 이미지 업로드 */}
                                <div
                                  onClick={() =>
                                    handleLocationImageClick(location.id)
                                  }
                                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[var(--coral-pink)] transition-colors cursor-pointer"
                                >
                                  {location.image ? (
                                    <div className="relative">
                                      <img
                                        src={location.image}
                                        alt={`${location.name} 이미지`}
                                        className="w-full h-24 object-cover rounded-lg mx-auto"
                                      />
                                      <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                        <Camera className="w-6 h-6 text-white" />
                                        <span className="text-white text-xs ml-1">
                                          변경
                                        </span>
                                      </div>
                                    </div>
                                  ) : (
                                    <>
                                      <Camera className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                                      <p className="text-xs text-gray-500">
                                        장소 이미지 업로드
                                      </p>
                                    </>
                                  )}
                                  <input
                                    ref={(el) => {
                                      locationImageInputRefs.current[
                                        location.id
                                      ] = el;
                                    }}
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) =>
                                      handleLocationImageChange(e, index)
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 이전/다음 버튼 */}
                    <div className="flex justify-between mt-8">
                      <Button onClick={() => setStep(1)} variant="outline">
                        이전 단계
                      </Button>
                      <Button
                        onClick={() => setStep(3)}
                        disabled={courseData.locations.length === 0}
                        className="btn-primary"
                      >
                        다음 단계
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {step === 3 && (
                <Card className="shadow-romantic">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold mb-6 text-[var(--text-primary)]">
                      상세 내용 작성
                    </h2>
                    <p className="text-[var(--text-secondary)] mb-6">
                      블로그처럼 자유롭게 글을 작성하고 이미지를 추가해보세요
                    </p>

                    {/* 리치 텍스트 에디터 */}
                    <div className="mb-8">
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
                        데이트 코스 상세 내용
                      </label>
                      <RichTextEditor
                        content={courseData.content}
                        onChange={(content) =>
                          setCourseData((prev) => ({ ...prev, content }))
                        }
                        placeholder="코스에 대한 내용을 자유롭게 작성해보세요."
                        className="w-full"
                      />
                    </div>

                    <div className="flex justify-between">
                      <Button onClick={() => setStep(2)} variant="outline">
                        이전 단계
                      </Button>
                      <Button
                        onClick={() => setStep(4)}
                        disabled={!courseData.content.trim()}
                        className="btn-primary"
                      >
                        다음 단계
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {step === 4 && (
                <Card className="shadow-romantic">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold mb-6 text-[var(--text-primary)]">
                      최종 미리보기 및 게시
                    </h2>
                    <p className="text-[var(--text-secondary)] mb-8">
                      작성하신 데이트 코스를 최종 확인하고 게시해보세요
                    </p>

                    {/* 상세 페이지와 동일한 미리보기 */}
                    <div className="bg-white border border-[var(--color-border)] rounded-lg overflow-hidden mb-8">
                      {/* Hero Section - 상세 페이지와 동일 */}
                      <div className="relative h-96 overflow-hidden">
                        {courseData.heroImage ? (
                          <img
                            src={courseData.heroImage}
                            alt={courseData.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[var(--very-light-pink)] to-[var(--light-pink)] flex items-center justify-center">
                            <Camera className="w-16 h-16 text-gray-400" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black bg-opacity-30" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center text-white px-4">
                            <h1 className="text-4xl font-bold mb-4">
                              {courseData.title || "코스 제목"}
                            </h1>
                            <p className="text-lg opacity-90 max-w-4xl">
                              {courseData.description || "코스 설명"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-6">
                        {/* Course Info - 상세 페이지와 동일 */}
                        <div className="flex flex-wrap gap-6 mb-8 text-sm text-gray-600">
                          {courseData.duration && (
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{courseData.duration}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{courseData.locations.length}개 장소</span>
                          </div>
                          {courseData.budget && (
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4" />
                              <span>{courseData.budget}</span>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons - 상세 페이지와 동일 */}
                        <div className="flex gap-4 mb-12">
                          <button className="flex items-center gap-2 px-6 py-3 bg-[var(--coral-pink)] text-white rounded-lg hover:opacity-90 transition-opacity">
                            <Heart className="w-5 h-5" />
                            좋아요 0
                          </button>
                          <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            <Bookmark className="w-5 h-5" />
                            저장
                          </button>
                          <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            <Share2 className="w-5 h-5" />
                            공유
                          </button>
                        </div>

                        {/* 지도 미리보기 - 상세 페이지와 동일 */}
                        {courseData.locations.length > 0 && (
                          <div className="mb-16">
                            <h2 className="text-2xl font-bold mb-6">
                              코스 지도 미리보기
                            </h2>
                            <div className="h-[500px] bg-gradient-to-br from-[var(--very-light-pink)] to-[var(--light-pink)] rounded-2xl overflow-hidden">
                              {isMapLoaded ? (
                                <PreviewMap locations={courseData.locations} />
                              ) : (
                                <div className="flex items-center justify-center h-full">
                                  <div className="text-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--coral-pink)] mx-auto mb-4"></div>
                                    <p className="text-gray-600">
                                      지도 로딩중...
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-4 text-center">
                              지도를 드래그하여 이동하고, 스크롤로 확대/축소할
                              수 있습니다. 핀을 클릭하면 장소 정보를 확인할 수
                              있어요!
                            </p>
                          </div>
                        )}

                        {/* Course Steps - 상세 페이지와 동일한 그리드 레이아웃 */}
                        {courseData.locations.length > 0 && (
                          <div className="space-y-16 mb-16">
                            {courseData.locations.map((location, index) => (
                              <div
                                key={location.id}
                                className="grid md:grid-cols-2 gap-8 items-center"
                              >
                                {/* Image */}
                                <div
                                  className={`${
                                    index % 2 === 1 ? "md:order-2" : ""
                                  }`}
                                >
                                  <div className="relative">
                                    {location.image ? (
                                      <img
                                        src={location.image}
                                        alt={location.name}
                                        className="w-full h-64 object-cover rounded-2xl"
                                      />
                                    ) : (
                                      <div className="w-full h-64 bg-gradient-to-br from-[var(--very-light-pink)] to-[var(--light-pink)] rounded-2xl flex items-center justify-center">
                                        <Camera className="w-12 h-12 text-gray-400" />
                                      </div>
                                    )}
                                    <div className="absolute top-4 left-4 w-10 h-10 bg-[var(--coral-pink)] text-white rounded-full flex items-center justify-center font-bold text-lg">
                                      {index + 1}
                                    </div>
                                  </div>
                                </div>

                                {/* Content */}
                                <div
                                  className={`${
                                    index % 2 === 1 ? "md:order-1" : ""
                                  }`}
                                >
                                  <div className="mb-4">
                                    {location.time && (
                                      <span className="text-sm text-[var(--coral-pink)] font-medium">
                                        {location.time}
                                      </span>
                                    )}
                                    <h3 className="text-2xl font-bold mt-1 mb-3">
                                      {location.name || `장소 ${index + 1}`}
                                    </h3>
                                    <p className="text-lg text-gray-600 mb-4">
                                      {location.description || "장소 설명"}
                                    </p>
                                  </div>
                                  <p className="text-gray-700 leading-relaxed">
                                    {location.detail ||
                                      "장소에 대한 자세한 내용이 여기에 표시됩니다."}
                                  </p>
                                  {location.address && (
                                    <p className="text-sm text-gray-500 mt-3">
                                      📍 {location.address}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* 상세 내용 */}
                        {courseData.content && (
                          <div className="mb-12">
                            <div
                              className="prose-preview text-[var(--text-primary)] leading-relaxed"
                              dangerouslySetInnerHTML={{
                                __html: courseData.content,
                              }}
                            />
                          </div>
                        )}

                        {/* Tags - 상세 페이지와 동일 */}
                        {courseData.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-8">
                            {courseData.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-3 py-1 bg-[var(--very-light-pink)] text-[var(--coral-pink)] rounded-full text-sm"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Course Info Summary - 상세 페이지와 동일 */}
                        {(courseData.duration ||
                          courseData.budget ||
                          courseData.season) && (
                          <div className="bg-[var(--very-light-pink)] rounded-2xl p-8">
                            <h3 className="text-xl font-bold mb-6">
                              코스 정보
                            </h3>
                            <div className="grid md:grid-cols-3 gap-6">
                              {courseData.duration && (
                                <div>
                                  <div className="text-sm text-gray-600 mb-1">
                                    소요 시간
                                  </div>
                                  <div className="font-semibold">
                                    {courseData.duration}
                                  </div>
                                </div>
                              )}
                              {courseData.budget && (
                                <div>
                                  <div className="text-sm text-gray-600 mb-1">
                                    예상 비용
                                  </div>
                                  <div className="font-semibold">
                                    {courseData.budget}
                                  </div>
                                </div>
                              )}
                              {courseData.season && (
                                <div>
                                  <div className="text-sm text-gray-600 mb-1">
                                    추천 계절
                                  </div>
                                  <div className="font-semibold">
                                    {courseData.season}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Button onClick={() => setStep(3)} variant="outline">
                        이전 단계
                      </Button>
                      <div className="space-x-4">
                        <Button
                          className="btn-primary"
                          onClick={handlePublish}
                          disabled={isPublishing}
                        >
                          <Send className="w-4 h-4 mr-2" />
                          {isPublishing ? "발행중..." : "게시하기"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* 사이드바 - 미리보기 (4단계가 아닐 때만 표시) */}
            {step !== 4 && (
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <Card className="shadow-romantic">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2 mb-4">
                        <Eye className="w-5 h-5 text-[var(--coral-pink)]" />
                        <h3 className="font-bold text-[var(--text-primary)]">
                          실시간 미리보기
                        </h3>
                      </div>

                      {/* 단계별 미리보기 */}
                      {step === 1 && (
                        <div className="bg-white rounded-2xl shadow-[0_4px_20px_var(--pink-shadow)] overflow-hidden">
                          {/* 이미지 영역 */}
                          <div className="h-32 bg-gradient-to-br from-[var(--very-light-pink)] to-[var(--light-pink)] relative overflow-hidden">
                            {courseData.heroImage ? (
                              <img
                                src={courseData.heroImage}
                                alt="코스 대표 이미지"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                <Camera className="w-8 h-8" />
                              </div>
                            )}
                          </div>

                          <div className="p-4">
                            {/* 제목 */}
                            <h4 className="font-bold text-[var(--text-primary)] mb-2 line-clamp-1">
                              {courseData.title || "코스 제목을 입력하세요"}
                            </h4>

                            {/* 설명 */}
                            <p className="text-[var(--text-secondary)] text-sm line-clamp-2 mb-3">
                              {courseData.description ||
                                "코스 설명을 입력하세요"}
                            </p>

                            {/* 메타 정보 */}
                            <div className="flex items-center space-x-3 mb-3 text-xs text-[var(--text-secondary)]">
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-3 h-3 text-[var(--coral-pink)]" />
                                <span>
                                  {courseData.locations.length}개 장소
                                </span>
                              </div>
                              {courseData.duration && (
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-3 h-3 text-[var(--coral-pink)]" />
                                  <span>{courseData.duration}</span>
                                </div>
                              )}
                            </div>

                            {/* 태그 */}
                            {courseData.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {courseData.tags.slice(0, 3).map((tag) => (
                                  <span
                                    key={tag}
                                    className="px-2 py-0.5 bg-[var(--very-light-pink)] text-[var(--coral-pink)] rounded-full text-xs"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                                {courseData.tags.length > 3 && (
                                  <span className="text-xs text-[var(--text-secondary)]">
                                    +{courseData.tags.length - 3}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {step === 2 && (
                        <div className="space-y-4">
                          {/* 지도 미리보기 */}
                          <div>
                            <h5 className="text-sm font-medium text-[var(--text-secondary)] mb-2">
                              코스 지도
                            </h5>
                            {isMapLoaded ? (
                              <PreviewMap locations={courseData.locations} />
                            ) : (
                              <div className="h-48 bg-gradient-to-br from-[var(--very-light-pink)] to-[var(--light-pink)] rounded-lg flex items-center justify-center">
                                <div className="text-center">
                                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--coral-pink)] mx-auto mb-2"></div>
                                  <p className="text-sm text-[var(--text-secondary)]">
                                    지도 로딩중...
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* 장소 목록 */}
                          {courseData.locations.length > 0 && (
                            <div>
                              <h5 className="text-sm font-medium text-[var(--text-secondary)] mb-2">
                                코스 순서 ({courseData.locations.length}개 장소)
                              </h5>
                              <div className="space-y-2">
                                {courseData.locations.map((location, index) => (
                                  <div
                                    key={location.id}
                                    className="flex items-center space-x-3 p-2 bg-[var(--very-light-pink)] rounded-lg"
                                  >
                                    <div className="w-6 h-6 bg-[var(--coral-pink)] text-white rounded-full flex items-center justify-center text-xs font-bold">
                                      {index + 1}
                                    </div>
                                    <div className="flex-1">
                                      <div className="text-sm font-medium text-[var(--text-primary)]">
                                        {location.name || `장소 ${index + 1}`}
                                      </div>
                                      {location.address && (
                                        <div className="text-xs text-[var(--text-secondary)]">
                                          {location.address}
                                        </div>
                                      )}
                                      {location.time && (
                                        <div className="text-xs text-[var(--coral-pink)]">
                                          {location.time}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {step === 3 && (
                        <div className="space-y-4">
                          {/* 최종 미리보기 카드 */}
                          <div className="bg-white rounded-2xl shadow-[0_4px_20px_var(--pink-shadow)] overflow-hidden">
                            <div className="h-32 bg-gradient-to-br from-[var(--very-light-pink)] to-[var(--light-pink)] relative overflow-hidden">
                              {courseData.heroImage ? (
                                <img
                                  src={courseData.heroImage}
                                  alt="코스 대표 이미지"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                  <Camera className="w-8 h-8" />
                                </div>
                              )}
                            </div>

                            <div className="p-4">
                              <h4 className="font-bold text-[var(--text-primary)] mb-2 line-clamp-1">
                                {courseData.title || "코스 제목"}
                              </h4>

                              <p className="text-[var(--text-secondary)] text-sm line-clamp-2 mb-3">
                                {courseData.description || "코스 설명"}
                              </p>

                              <div className="flex items-center space-x-3 mb-3 text-xs text-[var(--text-secondary)]">
                                <div className="flex items-center space-x-1">
                                  <MapPin className="w-3 h-3 text-[var(--coral-pink)]" />
                                  <span>
                                    {courseData.locations.length}개 장소
                                  </span>
                                </div>
                                {courseData.duration && (
                                  <div className="flex items-center space-x-1">
                                    <Clock className="w-3 h-3 text-[var(--coral-pink)]" />
                                    <span>{courseData.duration}</span>
                                  </div>
                                )}
                              </div>

                              {courseData.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {courseData.tags.slice(0, 3).map((tag) => (
                                    <span
                                      key={tag}
                                      className="px-2 py-0.5 bg-[var(--very-light-pink)] text-[var(--coral-pink)] rounded-full text-xs"
                                    >
                                      #{tag}
                                    </span>
                                  ))}
                                  {courseData.tags.length > 3 && (
                                    <span className="text-xs text-[var(--text-secondary)]">
                                      +{courseData.tags.length - 3}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* 상세 내용 미리보기 */}
                          {courseData.content && (
                            <div className="bg-white rounded-lg p-4 border border-[var(--color-border)]">
                              <h5 className="text-sm font-medium text-[var(--text-secondary)] mb-3">
                                상세 내용 미리보기
                              </h5>
                              <div
                                className="prose-preview text-sm text-[var(--text-primary)] max-h-40 overflow-y-auto"
                                dangerouslySetInnerHTML={{
                                  __html: courseData.content,
                                }}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
