"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Header } from "../../../../components/Header";
import { Heart, MapPin, Clock, Users, Share2, Bookmark } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text, Box, Sphere } from "@react-three/drei";

// 3D Course Visualization Component
function Course3D({ locations }: { locations: any[] }) {
  return (
    <Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />

      {/* Course Path */}
      {locations.map((location, index) => (
        <group key={index} position={[index * 3 - 4, 0, 0]}>
          {/* Location Marker */}
          <Sphere args={[0.5, 16, 16]} position={[0, 1, 0]}>
            <meshStandardMaterial color="#ff6b6b" />
          </Sphere>

          {/* Location Number */}
          <Text
            position={[0, 2, 0]}
            fontSize={0.5}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            {index + 1}
          </Text>

          {/* Connection Line */}
          {index < locations.length - 1 && (
            <Box args={[3, 0.1, 0.1]} position={[1.5, 1, 0]}>
              <meshStandardMaterial color="#ffe0e0" />
            </Box>
          )}
        </group>
      ))}

      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
    </Canvas>
  );
}

// 더미 데이터
const courseData = {
  1: {
    id: 1,
    title: "도심 속 로맨틱 이브닝",
    subtitle: "친밀한 디너 스팟과 아름다운 도시 야경을 즐기는 완벽한 데이트 코스",
    author: "로맨틱커플",
    date: "2024.01.15",
    likes: 124,
    views: 856,
    bookmarks: 32,
    tags: ["로맨틱", "도심", "디너", "야경", "커플"],
    duration: "4-5시간",
    budget: "10-15만원",
    season: "사계절",
    heroImage: "https://images.unsplash.com/photo-1621596016740-c831e613dc49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbnRpYyUyMGRpbm5lciUyMGRhdGUlMjByZXN0YXVyYW50fGVufDF8fHx8MTc1ODYzMTA0N3ww&ixlib=rb-4.1.0&q=80&w=1080",
    locations: [
      {
        name: "선셋 카페",
        description: "황금빛 노을과 함께하는 로맨틱한 시작",
        time: "17:00 - 18:30",
        image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        detail: "도시의 스카이라인이 한눈에 보이는 루프탑 카페에서 따뜻한 커피와 함께 하루의 시작을 알립니다. 창가 자리에서 바라보는 노을은 두 사람만의 특별한 순간을 만들어줄 거예요."
      },
      {
        name: "미술관",
        description: "예술과 문화가 어우러진 감성적 공간",
        time: "18:30 - 19:30",
        image: "https://images.unsplash.com/photo-1577720643271-d4b6e5c8b03a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        detail: "현대적인 작품들이 전시된 갤러리를 천천히 둘러보며 서로의 감성을 나누어보세요. 각자 다른 관점으로 바라보는 작품에 대한 이야기는 더욱 깊은 대화를 이끌어낼 것입니다."
      },
      {
        name: "저녁식사",
        description: "촛불이 있는 로맨틱한 디너",
        time: "19:30 - 21:00",
        image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        detail: "은은한 조명과 촛불이 있는 레스토랑에서 정성스럽게 준비된 코스 요리를 즐기세요. 와인 한 잔과 함께하는 식사는 하루의 하이라이트가 될 것입니다."
      },
      {
        name: "야경 산책",
        description: "도시의 불빛 아래 로맨틱한 산책",
        time: "21:00 - 22:00",
        image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        detail: "반짝이는 도시의 불빛을 바라보며 천천히 걸어보세요. 시원한 밤바람과 함께하는 산책은 하루를 마무리하는 완벽한 방법입니다."
      },
      {
        name: "디저트 바",
        description: "달콤한 마무리",
        time: "22:00 - 23:00",
        image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        detail: "아늑한 디저트 바에서 달콤한 케이크와 음료로 완벽한 하루를 마무리하세요. 조용한 분위기에서 오늘 하루를 돌아보며 특별한 추억을 만들어보세요."
      }
    ]
  }
};

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.id as string;
  const [course, setCourse] = useState<any>(null);

  useEffect(() => {
    // 실제로는 API에서 데이터를 가져올 것
    const data = courseData[parseInt(courseId) as keyof typeof courseData];
    setCourse(data);
  }, [courseId]);

  if (!course) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <div className="pt-16">
        <div className="relative h-96 overflow-hidden">
          <img
            src={course.heroImage}
            alt={course.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-lg opacity-90 max-w-2xl">{course.subtitle}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Course Info */}
        <div className="flex flex-wrap gap-6 mb-8 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{course.locations.length}개 장소</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>{course.views}회 조회</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-12">
          <button className="flex items-center gap-2 px-6 py-3 bg-[var(--coral-pink)] text-white rounded-lg hover:opacity-90 transition-opacity">
            <Heart className="w-5 h-5" />
            좋아요 {course.likes}
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

        {/* 3D Course Overview */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">3D 코스 미리보기</h2>
          <div className="h-80 bg-gradient-to-br from-[var(--very-light-pink)] to-[var(--light-pink)] rounded-2xl overflow-hidden">
            <Suspense fallback={<div className="flex items-center justify-center h-full">3D 뷰 로딩중...</div>}>
              <Course3D locations={course.locations} />
            </Suspense>
          </div>
          <p className="text-sm text-gray-600 mt-4 text-center">
            마우스로 드래그하여 회전하고, 스크롤로 확대/축소할 수 있습니다
          </p>
        </div>

        {/* Course Steps */}
        <div className="space-y-16">
          {course.locations.map((location: any, index: number) => (
            <div key={index} className="grid md:grid-cols-2 gap-8 items-center">
              {/* Image */}
              <div className={`${index % 2 === 1 ? 'md:order-2' : ''}`}>
                <div className="relative">
                  <img
                    src={location.image}
                    alt={location.name}
                    className="w-full h-64 object-cover rounded-2xl"
                  />
                  <div className="absolute top-4 left-4 w-10 h-10 bg-[var(--coral-pink)] text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {index + 1}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className={`${index % 2 === 1 ? 'md:order-1' : ''}`}>
                <div className="mb-4">
                  <span className="text-sm text-[var(--coral-pink)] font-medium">{location.time}</span>
                  <h3 className="text-2xl font-bold mt-1 mb-3">{location.name}</h3>
                  <p className="text-lg text-gray-600 mb-4">{location.description}</p>
                </div>
                <p className="text-gray-700 leading-relaxed">{location.detail}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive 3D Final View */}
        <div className="mt-20 mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">전체 코스 한눈에 보기</h2>
          <div className="h-96 bg-gradient-to-br from-[var(--coral-pink)]/10 to-[var(--light-pink)]/30 rounded-2xl overflow-hidden">
            <Suspense fallback={<div className="flex items-center justify-center h-full text-lg">인터랙티브 3D 뷰 로딩중...</div>}>
              <Course3D locations={course.locations} />
            </Suspense>
          </div>
        </div>

        {/* Tags */}
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

        {/* Course Info Summary */}
        <div className="bg-[var(--very-light-pink)] rounded-2xl p-8">
          <h3 className="text-xl font-bold mb-6">코스 정보</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-gray-600 mb-1">소요 시간</div>
              <div className="font-semibold">{course.duration}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">예상 비용</div>
              <div className="font-semibold">{course.budget}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">추천 계절</div>
              <div className="font-semibold">{course.season}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}