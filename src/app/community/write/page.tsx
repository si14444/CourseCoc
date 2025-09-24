"use client";

import { useState, useEffect, useRef } from "react";
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
  Save,
  Send
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { AddressAutocomplete } from "../../../components/ui/AddressAutocomplete";
import { Map, MapMarker, Polyline } from "react-kakao-maps-sdk";

declare global {
  interface Window {
    kakao: {
      maps: {
        load: (callback: () => void) => void;
        services: {
          Status: {
            OK: string;
          };
        };
      };
    };
  }
}

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

interface CourseData {
  title: string;
  description: string;
  tags: string[];
  duration: string;
  budget: string;
  season: string;
  heroImage?: string;
  locations: Location[];
}

const AVAILABLE_TAGS = [
  "로맨틱", "액티브", "문화", "자연", "카페", "맛집",
  "야경", "데이트", "산책", "쇼핑", "예술", "힐링"
];

const DURATION_OPTIONS = [
  "2-3시간", "3-4시간", "4-5시간", "5-6시간", "하루종일"
];

const BUDGET_OPTIONS = [
  "5만원 이하", "5-10만원", "10-15만원", "15-20만원", "20만원 이상"
];

const SEASON_OPTIONS = [
  "봄", "여름", "가을", "겨울", "사계절"
];

// 미리보기 지도 컴포넌트
function PreviewMap({ locations }: { locations: Location[] }) {
  if (locations.length === 0) return null;

  // 좌표가 있는 장소들만 필터링
  const validLocations = locations.filter(loc => loc.position);

  if (validLocations.length === 0) {
    return (
      <div className="h-48 bg-gradient-to-br from-[var(--very-light-pink)] to-[var(--light-pink)] rounded-lg flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-8 h-8 mx-auto mb-2 text-[var(--coral-pink)]" />
          <p className="text-sm text-[var(--text-secondary)]">주소를 입력하면 지도가 표시됩니다</p>
        </div>
      </div>
    );
  }

  // 지도 중심 좌표 계산
  const center = {
    lat: validLocations.reduce((sum, loc) => sum + loc.position!.lat, 0) / validLocations.length,
    lng: validLocations.reduce((sum, loc) => sum + loc.position!.lng, 0) / validLocations.length,
  };

  return (
    <div className="h-48 rounded-lg overflow-hidden">
      <Map
        center={center}
        style={{ width: "100%", height: "100%" }}
        level={8}
      >
        {/* 마커들 */}
        {validLocations.map((location, index) => (
          <MapMarker
            key={location.id}
            position={location.position!}
            image={{
              src: '/pin.png',
              size: { width: 30, height: 30 },
              options: { offset: { x: 15, y: 30 } }
            }}
            title={`${index + 1}. ${location.name}`}
          />
        ))}

        {/* 경로 표시 */}
        {validLocations.length > 1 && (
          <Polyline
            path={validLocations.map(location => location.position!)}
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
  const [step, setStep] = useState(1);
  const [courseData, setCourseData] = useState<CourseData>({
    title: "",
    description: "",
    tags: [],
    duration: "",
    budget: "",
    season: "",
    locations: []
  });

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const heroImageInputRef = useRef<HTMLInputElement>(null);
  const locationImageInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // 카카오맵 API 로드
  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAPS_API_KEY}&autoload=false&libraries=services`;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        setIsMapLoaded(true);
      });
    };

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const addLocation = () => {
    const newLocation: Location = {
      id: Date.now().toString(),
      name: "",
      address: "",
      time: "",
      description: "",
      detail: ""
    };
    setCourseData(prev => ({
      ...prev,
      locations: [...prev.locations, newLocation]
    }));
  };

  // 주소 자동완성 선택 시 처리
  const handleAddressSelect = (index: number, result: { x: string; y: string; road_address_name?: string; address_name: string }) => {
    const coords = {
      lat: parseFloat(result.y),
      lng: parseFloat(result.x)
    };

    setCourseData(prev => ({
      ...prev,
      locations: prev.locations.map((loc, i) =>
        i === index ? {
          ...loc,
          address: result.road_address_name || result.address_name,
          position: coords
        } : loc
      )
    }));
  };

  const updateLocation = (index: number, field: keyof Location, value: string) => {
    setCourseData(prev => ({
      ...prev,
      locations: prev.locations.map((loc, i) =>
        i === index ? { ...loc, [field]: value } : loc
      )
    }));
  };

  const removeLocation = (index: number) => {
    setCourseData(prev => ({
      ...prev,
      locations: prev.locations.filter((_, i) => i !== index)
    }));
  };

  const toggleTag = (tag: string) => {
    setCourseData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
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

    setCourseData(prev => ({
      ...prev,
      locations: newLocations
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
        setCourseData(prev => ({
          ...prev,
          heroImage: event.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // 장소 이미지 업로드 처리
  const handleLocationImageClick = (locationId: string) => {
    locationImageInputRefs.current[locationId]?.click();
  };

  const handleLocationImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCourseData(prev => ({
          ...prev,
          locations: prev.locations.map((loc, i) =>
            i === index ? { ...loc, image: event.target?.result as string } : loc
          )
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="pt-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-[var(--very-light-pink)] to-[var(--light-pink)] py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4">
              새로운 데이트 코스 작성하기
            </h1>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              특별한 추억이 될 로맨틱한 코스를 공유해보세요
            </p>

            {/* 진행 단계 표시기 */}
            <div className="flex justify-center items-center mt-8 space-x-4">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium ${
                step >= 1 ? 'bg-[var(--coral-pink)] text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                1
              </div>
              <div className={`w-16 h-0.5 ${step >= 2 ? 'bg-[var(--coral-pink)]' : 'bg-gray-200'}`} />
              <div className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium ${
                step >= 2 ? 'bg-[var(--coral-pink)] text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                2
              </div>
              <div className={`w-16 h-0.5 ${step >= 3 ? 'bg-[var(--coral-pink)]' : 'bg-gray-200'}`} />
              <div className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium ${
                step >= 3 ? 'bg-[var(--coral-pink)] text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                3
              </div>
            </div>
            <div className="flex justify-center items-center mt-2 space-x-8 text-sm text-[var(--text-secondary)]">
              <span>기본정보</span>
              <span>장소추가</span>
              <span>미리보기</span>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* 메인 입력 영역 */}
            <div className="lg:col-span-2">
              {step === 1 && (
                <Card className="shadow-romantic">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold mb-6 text-[var(--text-primary)]">기본 정보</h2>

                    {/* 코스 제목 */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        코스 제목 *
                      </label>
                      <input
                        type="text"
                        value={courseData.title}
                        onChange={(e) => setCourseData(prev => ({ ...prev, title: e.target.value }))}
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
                        onChange={(e) => setCourseData(prev => ({ ...prev, description: e.target.value }))}
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
                        {AVAILABLE_TAGS.map(tag => (
                          <button
                            key={tag}
                            onClick={() => toggleTag(tag)}
                            className={`px-3 py-1 rounded-full text-sm transition-colors ${
                              courseData.tags.includes(tag)
                                ? 'bg-[var(--coral-pink)] text-white'
                                : 'bg-[var(--very-light-pink)] text-[var(--text-secondary)] hover:bg-[var(--light-pink)]'
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
                          onChange={(e) => setCourseData(prev => ({ ...prev, duration: e.target.value }))}
                          className="w-full"
                        >
                          <option value="">선택하세요</option>
                          {DURATION_OPTIONS.map(option => (
                            <option key={option} value={option}>{option}</option>
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
                          onChange={(e) => setCourseData(prev => ({ ...prev, budget: e.target.value }))}
                          className="w-full"
                        >
                          <option value="">선택하세요</option>
                          {BUDGET_OPTIONS.map(option => (
                            <option key={option} value={option}>{option}</option>
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
                          onChange={(e) => setCourseData(prev => ({ ...prev, season: e.target.value }))}
                          className="w-full"
                        >
                          <option value="">선택하세요</option>
                          {SEASON_OPTIONS.map(option => (
                            <option key={option} value={option}>{option}</option>
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
                              <span className="text-white ml-2">이미지 변경</span>
                            </div>
                          </div>
                        ) : (
                          <>
                            <Camera className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                            <p className="text-sm text-gray-500">클릭하여 이미지를 업로드하세요</p>
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
                      <h2 className="text-2xl font-bold text-[var(--text-primary)]">장소 추가</h2>
                      <Button onClick={addLocation} className="btn-outline">
                        <Plus className="w-4 h-4 mr-2" />
                        장소 추가
                      </Button>
                    </div>

                    {courseData.locations.length === 0 ? (
                      <div className="text-center py-12">
                        <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-500 mb-4">아직 추가된 장소가 없습니다</p>
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
                                    onChange={(e) => updateLocation(index, 'name', e.target.value)}
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
                                    onChange={(value) => updateLocation(index, 'address', value)}
                                    onSelect={(result) => handleAddressSelect(index, result)}
                                    placeholder="주소 또는 장소명을 입력하세요"
                                  />
                                  <input
                                    type="text"
                                    value={location.time}
                                    onChange={(e) => updateLocation(index, 'time', e.target.value)}
                                    placeholder="방문 시간 (예: 17:00 - 18:30)"
                                  />
                                </div>

                                {/* 간단 설명 */}
                                <input
                                  type="text"
                                  value={location.description}
                                  onChange={(e) => updateLocation(index, 'description', e.target.value)}
                                  placeholder="장소에 대한 간단한 설명을 입력하세요"
                                />

                                {/* 상세 설명 */}
                                <textarea
                                  value={location.detail}
                                  onChange={(e) => updateLocation(index, 'detail', e.target.value)}
                                  placeholder="이 장소에서의 특별한 경험이나 팁을 자세히 설명해주세요..."
                                  rows={3}
                                  className="w-full"
                                />

                                {/* 이미지 업로드 */}
                                <div
                                  onClick={() => handleLocationImageClick(location.id)}
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
                                        <span className="text-white text-xs ml-1">변경</span>
                                      </div>
                                    </div>
                                  ) : (
                                    <>
                                      <Camera className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                                      <p className="text-xs text-gray-500">장소 이미지 업로드</p>
                                    </>
                                  )}
                                  <input
                                    ref={el => locationImageInputRefs.current[location.id] = el}
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => handleLocationImageChange(e, index)}
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
                    <h2 className="text-2xl font-bold mb-6 text-[var(--text-primary)]">미리보기 및 게시</h2>
                    <p className="text-[var(--text-secondary)] mb-8">
                      작성하신 데이트 코스를 확인하고 게시해보세요
                    </p>

                    {/* 미리보기 섹션은 오른쪽 사이드바에서 처리 */}

                    <div className="flex justify-between">
                      <Button onClick={() => setStep(2)} variant="outline">
                        이전 단계
                      </Button>
                      <div className="space-x-4">
                        <Button variant="outline">
                          <Save className="w-4 h-4 mr-2" />
                          임시저장
                        </Button>
                        <Button className="btn-primary">
                          <Send className="w-4 h-4 mr-2" />
                          게시하기
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* 사이드바 - 미리보기 */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <Card className="shadow-romantic">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <Eye className="w-5 h-5 text-[var(--coral-pink)]" />
                      <h3 className="font-bold text-[var(--text-primary)]">실시간 미리보기</h3>
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
                            {courseData.description || "코스 설명을 입력하세요"}
                          </p>

                          {/* 메타 정보 */}
                          <div className="flex items-center space-x-3 mb-3 text-xs text-[var(--text-secondary)]">
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-3 h-3 text-[var(--coral-pink)]" />
                              <span>{courseData.locations.length}개 장소</span>
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
                              {courseData.tags.slice(0, 3).map(tag => (
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
                                <p className="text-sm text-[var(--text-secondary)]">지도 로딩중...</p>
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
                                <div key={location.id} className="flex items-center space-x-3 p-2 bg-[var(--very-light-pink)] rounded-lg">
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
                      <div className="bg-white rounded-2xl shadow-[0_4px_20px_var(--pink-shadow)] overflow-hidden">
                        {/* 최종 미리보기 카드 */}
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
                              <span>{courseData.locations.length}개 장소</span>
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
                              {courseData.tags.slice(0, 3).map(tag => (
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

                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}