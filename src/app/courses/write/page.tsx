"use client";

import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { LocationForm } from "@/components/write/LocationForm";
import { PreviewMap } from "@/components/write/PreviewMap";
import { StepIndicator } from "@/components/write/StepIndicator";
import { useAuth } from "@/contexts/AuthContext";
import {
  useImageUpload,
  useLocationManager,
  useWriteCourse,
} from "@/hooks/useWriteCourse";
import { Camera, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useRef } from "react";

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

function WritePageContent() {
  const { user, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const {
    step,
    setStep,
    courseData,
    setCourseData,
    isPublishing,
    loading,
    toggleTag,
  } = useWriteCourse(editId);

  const { handleImageSelect, uploadImageToStorage } = useImageUpload();

  const { addLocation, updateLocation, removeLocation, handleAddressSelect } =
    useLocationManager(courseData, setCourseData);

  // Validation functions
  const validateStep1 = (): boolean => {
    if (!courseData.title.trim()) {
      alert("코스 제목을 입력해주세요.");
      return false;
    }
    if (!courseData.description.trim()) {
      alert("간단한 설명을 입력해주세요.");
      return false;
    }
    if (courseData.tags.length === 0) {
      alert("최소 1개 이상의 태그를 선택해주세요.");
      return false;
    }
    return true;
  };

  const validateStep2 = (): boolean => {
    if (courseData.locations.length === 0) {
      alert("최소 1개 이상의 장소를 추가해주세요.");
      return false;
    }

    for (let i = 0; i < courseData.locations.length; i++) {
      const location = courseData.locations[i];
      if (!location.name.trim()) {
        alert(`장소 ${i + 1}의 장소명을 입력해주세요.`);
        return false;
      }
      if (!location.address.trim()) {
        alert(`장소 ${i + 1}의 주소를 입력해주세요.`);
        return false;
      }
    }
    return true;
  };

  const validateStep3 = (): boolean => {
    if (!courseData.content.trim()) {
      alert("코스 상세 설명을 작성해주세요.");
      return false;
    }
    return true;
  };

  const heroImageInputRef = useRef<HTMLInputElement>(null);
  const locationImageInputRefs = useRef<{
    [key: string]: HTMLInputElement | null;
  }>({});

  // 대표 이미지 업로드
  const handleHeroImageClick = () => {
    heroImageInputRef.current?.click();
  };

  const handleHeroImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageSelect(file, (dataUrl) => {
        setCourseData((prev) => ({ ...prev, heroImage: dataUrl }));
      });
    }
  };

  // 장소 이미지 업로드
  const handleLocationImageClick = (locationId: string) => {
    locationImageInputRefs.current[locationId]?.click();
  };

  const handleLocationImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageSelect(file, (dataUrl) => {
        setCourseData((prev) => ({
          ...prev,
          locations: prev.locations.map((loc, i) =>
            i === index ? { ...loc, image: dataUrl } : loc,
          ),
        }));
      });
    }
  };

  // 로딩 상태
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--coral-pink)] mx-auto mb-4"></div>
            <p className="text-[var(--text-secondary)]">
              {loading ? "기존 코스 데이터를 불러오는 중..." : "로딩 중..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 로그인하지 않은 사용자
  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-20 pb-8">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center py-16">
              <Plus className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
                로그인이 필요합니다
              </h3>
              <p className="text-[var(--text-secondary)] mb-6">
                코스를 만들려면 먼저 로그인해주세요.
              </p>
              <Link href="/auth/login">
                <Button className="bg-[var(--coral-pink)] text-white hover:bg-[var(--coral-pink)]/90">
                  로그인하기
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="pt-16">
        {/* Hero Section - Compact */}
        <div className="bg-gradient-to-br from-[var(--very-light-pink)] to-white py-6 border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <StepIndicator currentStep={step} />
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="space-y-8">
            {/* Step 1: 기본 정보 */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                  기본 정보
                </h2>

                {/* 대표 이미지 */}
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    대표 이미지
                  </label>
                  <div
                    onClick={handleHeroImageClick}
                    className="relative h-64 bg-gradient-to-br from-[var(--very-light-pink)] to-[var(--light-pink)] rounded-lg cursor-pointer hover:opacity-90 transition-opacity overflow-hidden"
                  >
                    {courseData.heroImage ? (
                      <Image
                        src={courseData.heroImage}
                        alt="대표 이미지"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <Camera className="w-16 h-16 text-[var(--coral-pink)] mb-2" />
                        <p className="text-sm text-[var(--text-secondary)]">
                          클릭하여 이미지 추가
                        </p>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={heroImageInputRef}
                    onChange={handleHeroImageChange}
                  />
                </div>

                {/* 제목 */}
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    코스 제목 *
                  </label>
                  <Input
                    value={courseData.title}
                    onChange={(e) =>
                      setCourseData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="예: 로맨틱한 서울 데이트 코스"
                    className="w-full"
                  />
                </div>

                {/* 설명 */}
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    간단한 설명 *
                  </label>
                  <textarea
                    value={courseData.description}
                    onChange={(e) =>
                      setCourseData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="이 코스에 대한 간단한 설명을 작성해주세요"
                    className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--coral-pink)] resize-none"
                  />
                </div>

                {/* 태그 */}
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    태그 선택 *
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {AVAILABLE_TAGS.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          courseData.tags.includes(tag)
                            ? "bg-[var(--coral-pink)] text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 소요 시간, 예산, 계절 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                      소요 시간
                    </label>
                    <select
                      value={courseData.duration}
                      onChange={(e) =>
                        setCourseData((prev) => ({
                          ...prev,
                          duration: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--coral-pink)]"
                    >
                      <option value="">선택하세요</option>
                      {DURATION_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                      예상 예산
                    </label>
                    <select
                      value={courseData.budget}
                      onChange={(e) =>
                        setCourseData((prev) => ({
                          ...prev,
                          budget: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--coral-pink)]"
                    >
                      <option value="">선택하세요</option>
                      {BUDGET_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--coral-pink)]"
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

                <div className="flex justify-end">
                  <Button
                    onClick={() => {
                      if (validateStep1()) {
                        setStep(2);
                      }
                    }}
                    className="bg-[var(--coral-pink)] text-white hover:bg-[var(--coral-pink)]/90"
                  >
                    다음 단계
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: 장소 추가 */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                    장소 추가
                  </h2>
                  <Button
                    onClick={addLocation}
                    className="bg-[var(--coral-pink)] text-white hover:bg-[var(--coral-pink)]/90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    장소 추가
                  </Button>
                </div>

                <div className="space-y-4">
                  {courseData.locations.map((location, index) => (
                    <LocationForm
                      key={location.id}
                      location={location}
                      index={index}
                      onUpdate={updateLocation}
                      onRemove={removeLocation}
                      onAddressSelect={handleAddressSelect}
                      onImageClick={handleLocationImageClick}
                      imageInputRef={(el, locationId) => {
                        locationImageInputRefs.current[locationId] = el;
                      }}
                      onImageChange={handleLocationImageChange}
                    />
                  ))}
                </div>

                <div className="flex justify-between">
                  <Button onClick={() => setStep(1)} variant="outline">
                    이전 단계
                  </Button>
                  <Button
                    onClick={() => {
                      if (validateStep2()) {
                        setStep(3);
                      }
                    }}
                    className="bg-[var(--coral-pink)] text-white hover:bg-[var(--coral-pink)]/90"
                  >
                    다음 단계
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: 상세 내용 */}
            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                  상세 내용 작성
                </h2>

                {/* Editor with macOS-style header */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/80">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#FF5F57]"></div>
                      <div className="w-3 h-3 rounded-full bg-[#FEBC2E]"></div>
                      <div className="w-3 h-3 rounded-full bg-[#28C840]"></div>
                    </div>
                    <span className="text-xs text-gray-400">
                      &apos;/&apos;로 서식 사용
                    </span>
                  </div>
                  <RichTextEditor
                    content={courseData.content}
                    onChange={(content) =>
                      setCourseData((prev) => ({ ...prev, content }))
                    }
                    placeholder="데이트 코스에 대한 자세한 이야기를 작성해주세요..."
                  />
                </div>

                <div className="flex justify-between pt-2">
                  <Button onClick={() => setStep(2)} variant="outline">
                    이전 단계
                  </Button>
                  <Button
                    onClick={() => {
                      if (validateStep3()) {
                        setStep(4);
                      }
                    }}
                    className="bg-[var(--coral-pink)] text-white hover:bg-[var(--coral-pink)]/90"
                  >
                    미리보기
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: 미리보기 */}
            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                  미리보기
                </h2>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  {courseData.heroImage && (
                    <div className="relative h-64">
                      <Image
                        src={courseData.heroImage}
                        alt={courseData.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="p-6">
                    <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-4">
                      {courseData.title || "제목 없음"}
                    </h1>

                    <p className="text-[var(--text-secondary)] mb-4">
                      {courseData.description || "설명 없음"}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {courseData.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-[var(--very-light-pink)] text-[var(--coral-pink)] rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div
                      className="prose prose-editor max-w-none mb-6"
                      dangerouslySetInnerHTML={{ __html: courseData.content }}
                    />

                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">
                      코스 경로
                    </h3>
                    <PreviewMap locations={courseData.locations} />
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button onClick={() => setStep(3)} variant="outline">
                    이전 단계
                  </Button>
                  <Button
                    onClick={async () => {
                      if (!user) {
                        alert("로그인이 필요합니다.");
                        return;
                      }

                      try {
                        const { publishCourse } =
                          await import("@/hooks/useWriteCourse");
                        const result = await publishCourse(
                          courseData,
                          user.uid,
                        );

                        if (result.success) {
                          alert("코스가 성공적으로 발행되었습니다!");
                          window.location.href = `/courses/${result.data}`;
                        } else {
                          alert(`발행 실패: ${result.error}`);
                        }
                      } catch (error) {
                        console.error("발행 중 오류:", error);
                        alert("발행 중 오류가 발생했습니다.");
                      }
                    }}
                    disabled={isPublishing}
                    className="bg-[var(--coral-pink)] text-white hover:bg-[var(--coral-pink)]/90"
                  >
                    {isPublishing ? "발행 중..." : "발행하기"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WritePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WritePageContent />
    </Suspense>
  );
}
