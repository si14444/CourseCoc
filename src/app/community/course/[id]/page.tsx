"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Header } from "../../../../components/Header";
import { Heart, MapPin, Clock, Users, Share2, Bookmark } from "lucide-react";
import { Map, MapMarker, Polyline } from "react-kakao-maps-sdk";

declare global {
  interface Window {
    kakao: any;
  }
}

// Kakao Map Component
function CourseMap({ locations }: { locations: any[] }) {
  const [map, setMap] = useState<any>(null);

  // 지도 중심 좌표 계산 (모든 위치의 중점)
  const center = {
    lat: locations.reduce((sum, loc) => sum + loc.position.lat, 0) / locations.length,
    lng: locations.reduce((sum, loc) => sum + loc.position.lng, 0) / locations.length,
  };



  return (
    <Map
      center={center}
      style={{
        width: "100%",
        height: "100%",
      }}
      level={6}
      onCreate={setMap}
    >
      {/* 위치 마커들 */}
      {locations.map((location, index) => (
        <MapMarker
          key={index}
          position={location.position}
          image={{
            src: '/pin.png',
            size: { width: 40, height: 40 },
            options: { offset: { x: 20, y: 40 } }
          }}
          title={`${index + 1}. ${location.name} (${location.time})`}
        />
      ))}

      {/* 경로 표시 */}
      <Polyline
        path={locations.map(location => location.position)}
        strokeWeight={5}
        strokeColor={"#ff6b6b"}
        strokeOpacity={0.9}
        strokeStyle={"solid"}
      />

    </Map>
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
        detail: "도시의 스카이라인이 한눈에 보이는 루프탑 카페에서 따뜻한 커피와 함께 하루의 시작을 알립니다. 창가 자리에서 바라보는 노을은 두 사람만의 특별한 순간을 만들어줄 거예요.",
        position: { lat: 37.5013068, lng: 127.0396597 } // 강남 스카이라운지
      },
      {
        name: "미술관",
        description: "예술과 문화가 어우러진 감성적 공간",
        time: "18:30 - 19:30",
        image: "https://images.unsplash.com/photo-1577720643271-d4b6e5c8b03a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        detail: "현대적인 작품들이 전시된 갤러리를 천천히 둘러보며 서로의 감성을 나누어보세요. 각자 다른 관점으로 바라보는 작품에 대한 이야기는 더욱 깊은 대화를 이끌어낼 것입니다.",
        position: { lat: 37.4979462, lng: 127.0276368 } // 코엑스 아티움
      },
      {
        name: "저녁식사",
        description: "촛불이 있는 로맨틱한 디너",
        time: "19:30 - 21:00",
        image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        detail: "은은한 조명과 촛불이 있는 레스토랑에서 정성스럽게 준비된 코스 요리를 즐기세요. 와인 한 잔과 함께하는 식사는 하루의 하이라이트가 될 것입니다.",
        position: { lat: 37.5172363, lng: 127.0286804 } // 청담동 레스토랑
      },
      {
        name: "야경 산책",
        description: "도시의 불빛 아래 로맨틱한 산책",
        time: "21:00 - 22:00",
        image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        detail: "반짝이는 도시의 불빛을 바라보며 천천히 걸어보세요. 시원한 밤바람과 함께하는 산책은 하루를 마무리하는 완벽한 방법입니다.",
        position: { lat: 37.5276123, lng: 127.0374374 } // 한강공원 반포
      },
      {
        name: "디저트 바",
        description: "달콤한 마무리",
        time: "22:00 - 23:00",
        image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        detail: "아늑한 디저트 바에서 달콤한 케이크와 음료로 완벽한 하루를 마무리하세요. 조용한 분위기에서 오늘 하루를 돌아보며 특별한 추억을 만들어보세요.",
        position: { lat: 37.5054746, lng: 127.0516782 } // 압구정 디저트 카페
      }
    ]
  }
};

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.id as string;
  const [course, setCourse] = useState<any>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    // 카카오맵 API 스크립트 로드
    const script = document.createElement("script");
    script.async = true;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAPS_API_KEY}&autoload=false`;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        setIsMapLoaded(true);
      });
    };

    // 실제로는 API에서 데이터를 가져올 것
    const data = courseData[parseInt(courseId) as keyof typeof courseData];
    setCourse(data);

    return () => {
      document.head.removeChild(script);
    };
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

      <div className="max-w-6xl mx-auto px-6 py-12">
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

        {/* Kakao Map Course Overview */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">코스 지도 미리보기</h2>
          <div className="h-[500px] bg-gradient-to-br from-[var(--very-light-pink)] to-[var(--light-pink)] rounded-2xl overflow-hidden">
            {isMapLoaded ? (
              <CourseMap locations={course.locations} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--coral-pink)] mx-auto mb-4"></div>
                  <p className="text-gray-600">지도 로딩중...</p>
                </div>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-4 text-center">
            지도를 드래그하여 이동하고, 스크롤로 확대/축소할 수 있습니다. 핀을 클릭하면 장소 정보를 확인할 수 있어요!
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

        {/* Interactive Kakao Map Final View */}
        <div className="mt-20 mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">전체 코스 한눈에 보기</h2>
          <div className="h-[600px] bg-gradient-to-br from-[var(--coral-pink)]/10 to-[var(--light-pink)]/30 rounded-2xl overflow-hidden">
            {isMapLoaded ? (
              <CourseMap locations={course.locations} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--coral-pink)] mx-auto mb-4"></div>
                  <p className="text-lg text-gray-600">데이트 코스 지도 로딩중...</p>
                </div>
              </div>
            )}
          </div>
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              🗺️ 총 {course.locations.length}개 장소를 연결하는 로맨틱한 데이트 코스
            </p>
            <p className="text-xs text-gray-500 mt-1">
              빨간 선은 추천 이동 경로입니다
            </p>
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