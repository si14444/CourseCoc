"use client";

<<<<<<< HEAD
import { Header } from "../components/Header";
import { SearchAndFilter } from "../components/SearchAndFilter";
import { CourseCard } from "../components/CoursesCard";
import { EmptyState } from "../components/EmptyState";
import { useState } from "react";

// Mock data for demonstration
const sampleCourses = [
  {
    id: 1,
    title: "Romantic Evening in the City",
    description:
      "A perfect date night course featuring intimate dinner spots and scenic city views. Experience the magic of urban romance.",
    placeCount: 5,
    likes: 124,
    views: 856,
    steps: [
      "Sunset Café",
      "Art Gallery",
      "Dinner",
      "Night Walk",
      "Dessert Bar",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1621596016740-c831e613dc49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbnRpYyUyMGRpbm5lciUyMGRhdGUlMjByZXN0YXVyYW50fGVufDF8fHx8MTc1ODYzMTA0N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: 2,
    title: "Nature & Love Adventure",
    description:
      "Discover beautiful outdoor locations perfect for couples who love nature and adventure. Fresh air, stunning views guaranteed.",
    placeCount: 4,
    likes: 89,
    views: 623,
    steps: ["Park Walk", "Picnic Spot", "Lake View", "Sunset Point"],
    imageUrl:
      "https://images.unsplash.com/photo-1724216605131-c8b0d4974458?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3VwbGVzJTIwd2Fsa2luZyUyMHBhcmslMjBzdW5zZXR8ZW58MXx8fHwxNzU4NjMxMDQ5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: 3,
    title: "Cultural Date Experience",
    description:
      "Immerse yourselves in art, culture, and intellectual conversations. Perfect for couples who appreciate the finer things.",
    placeCount: 6,
    likes: 156,
    views: 1024,
    steps: [
      "Museum Tour",
      "Art Gallery",
      "Coffee Shop",
      "Bookstore",
      "Wine Bar",
      "Live Music",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1696238378039-821fc376ebd4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBnYWxsZXJ5JTIwbXVzZXVtJTIwZGF0ZXxlbnwxfHx8fDE3NTg2MzEwNTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
];

export default function App() {
  const [courses] = useState(sampleCourses);
  const [showEmpty, setShowEmpty] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />

      {/* Main Content */}
      <main className="pt-20 pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4">
              Create Perfect Date Courses
            </h1>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              Design romantic experiences that tell beautiful stories. Every
              step, every moment, crafted with love.
            </p>
          </div>

          <SearchAndFilter />

          {/* Toggle between empty state and courses for demo */}
          <div className="mb-6 flex justify-center">
            <button
              onClick={() => setShowEmpty(!showEmpty)}
              className="text-sm text-[var(--coral-pink)] hover:underline"
            >
              {showEmpty ? "Show Sample Courses" : "Show Empty State"}
            </button>
          </div>

          {/* Content Area */}
          {showEmpty || courses.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  title={course.title}
                  description={course.description}
                  placeCount={course.placeCount}
                  likes={course.likes}
                  views={course.views}
                  steps={course.steps}
                  imageUrl={course.imageUrl}
                />
              ))}
            </div>
          )}

          {/* Floating Hearts Animation */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-4 h-4 text-[var(--light-pink)] opacity-20 animate-pulse">
              ❤️
            </div>
            <div
              className="absolute top-3/4 right-1/3 w-3 h-3 text-[var(--coral-pink)] opacity-15 animate-pulse"
              style={{ animationDelay: "2s" }}
            >
              💖
            </div>
            <div
              className="absolute top-1/2 right-1/4 w-2 h-2 text-[var(--light-pink)] opacity-10 animate-pulse"
              style={{ animationDelay: "4s" }}
            >
              💕
            </div>
          </div>
        </div>
=======
import CourseCard from '@/components/CourseCard'
import dynamic from 'next/dynamic'

// Header를 동적으로 import하여 hydration 문제 해결
const Header = dynamic(() => import('@/components/Header'), {
  ssr: false,
  loading: () => (
    <header className="sticky top-0 z-50 h-16 md:h-20 shadow-sm border-b border-gray-100 p-4 md:p-6 m-2 md:m-4" style={{ backgroundColor: '#ffffff' }}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 h-full flex items-center justify-between p-4 md:p-6 m-2 md:m-3">
        <div className="flex items-center gap-4 md:gap-6">
          <div className="w-8 md:w-10 h-8 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center shadow-md" style={{ backgroundColor: 'var(--primary-color)' }}>
            <span className="text-white font-bold text-sm md:text-lg">C</span>
          </div>
          <span className="font-bold text-[24px] md:text-[32px] text-[#2d2d2d]">CourseCoc</span>
        </div>
      </div>
    </header>
  )
})

const courses = [
  {
    title: "Romantic Seoul Night Tour",
    description: "A perfect evening date course through Seoul's most romantic spots including Banpo Rainbow Bridge a perfect spot for romantic evening.",
    rating: 5,
    maxRating: 5,
    stats: { courses: 247, reviews: 1329, participants: 0 }
  },
  {
    title: "Cherry Blossom Picnic Date",
    description: "Spring romance under blooming cherry blossoms at Yeouido Park with cozy picnic setup and flower viewing for couples.",
    rating: 4,
    maxRating: 4,
    stats: { courses: 3, reviews: 189, participants: 893 }
  },
  {
    title: "Hongdae Art & Culture Walk",
    description: "Explore vibrant street art, cozy cafes, and indie galleries in Hongdae's creative district perfect for artistic couples.",
    rating: 6,
    maxRating: 6,
    stats: { courses: 7, reviews: 156, participants: 743 }
  },
  {
    title: "Busan Beach Sunset Romance",
    description: "Seaside romance at Haeundae Beach with golden sunset views, beachside dining and ocean walk for memorable moments.",
    rating: 5,
    maxRating: 5,
    stats: { courses: 4, reviews: 312, participants: 2168 }
  },
  {
    title: "Jeju Island Nature Escape",
    description: "Island adventure through Jeju's natural wonders including waterfalls, volcanic landscapes and live nature experiences.",
    rating: 6,
    maxRating: 6,
    stats: { courses: 8, reviews: 2716, participants: 1557 }
  },
  {
    title: "Traditional Hanok Village Date",
    description: "Step back in time at Bukchon Hanok Village, experiencing traditional Korean architecture and cultural heritage tours.",
    rating: 5,
    maxRating: 5,
    stats: { courses: 6, reviews: 305, participants: 1134 }
  }
]

export default function Home() {
  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 m-2 md:m-4 lg:m-6" style={{ backgroundColor: '#ffffff' }}>
      <Header />

      {/* Main Content - 완전 중앙 정렬 */}
      <main className="w-full flex flex-col items-center justify-center px-12 md:px-20 lg:px-28 py-8 md:py-12 lg:py-16 m-4 md:m-6 lg:m-8">
        {/* Hero Section - Figma 디자인 기반 */}
        <section className="w-full max-w-[1152px] flex flex-col gap-[32px] items-center pt-32 md:pt-40 pb-24 md:pb-32 my-16 md:my-24">
          {/* 제목과 설명 컨테이너 */}
          <div className="flex flex-col gap-[16px] items-center w-full">
            {/* 메인 제목 */}
            <div className="flex flex-col items-center w-full">
              <h1 className="text-[32px] md:text-[48px] leading-[40px] md:leading-[48px] font-bold text-center">
                <span className="text-gray-800">완벽한 </span>
                <span className="text-[#ff6b6b]">데이트 코스</span>
                <span className="text-gray-800">를 만들어보세요</span>
              </h1>
            </div>

            {/* 설명 텍스트 */}
            <div className="flex flex-col items-center max-w-[672px] w-full">
              <p className="text-[16px] md:text-[18px] leading-[24px] md:leading-[28px] text-center text-gray-600">
                로맨틱한 경험을 디자인하고 다른 사람들과 공유해보세요. 직관적인 코스 생성 도구로<br />
                기억에 남을 데이트를 계획하세요.
              </p>
            </div>
          </div>

          {/* CTA 버튼들 */}
          <div className="flex items-center justify-center gap-4 w-full">
            {/* 첫 번째 코스 만들기 버튼 */}
            <button className="bg-gradient-to-r from-[#fff2f2] via-[#ffe0e0] to-[#ff6b6b] flex items-center justify-center px-[32px] py-[16px] rounded-[8px] transition-all duration-300 hover:shadow-lg hover:scale-105">
              <div className="flex items-center gap-2">
                <span className="text-[18px] text-white font-medium">+</span>
                <span className="text-[18px] text-white font-medium">첫 번째 코스 만들기</span>
              </div>
            </button>

            {/* 지도 탐색 버튼 */}
            <button className="border border-[#ff6b6b] bg-transparent flex items-center justify-center px-[33px] py-[17px] rounded-[8px] transition-all duration-300 hover:shadow-lg hover:scale-105">
              <span className="text-[18px] text-[#ff6b6b] font-medium">지도 탐색</span>
            </button>
          </div>
        </section>

        {/* Search Section - Figma 디자인 기반 */}
        <section className="w-full max-w-[1152px] flex justify-center mb-16 md:mb-20">
          <div className="flex items-center justify-start w-full max-w-[542px]">
            {/* 검색 입력 */}
            <div className="flex flex-col items-start justify-start w-[448px]">
              <div
                className="rounded-[12px] w-full relative"
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb'
                }}
              >
                <input
                  type="text"
                  placeholder="코스 검색…"
                  className="w-full h-[51px] px-[41px] py-[15px] text-[14px] border-none outline-none rounded-[12px]"
                  style={{
                    backgroundColor: '#ffffff',
                    color: '#374151',
                    '::placeholder': { color: '#9ca3af' }
                  }}
                />
              </div>
            </div>

            {/* 필터 버튼 */}
            <div className="flex flex-col items-start justify-start pl-[16px]">
              <button
                className="rounded-[12px] h-[47px] w-[78px] flex items-center justify-center hover:shadow-sm transition-all duration-200"
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb'
                }}
              >
                <span
                  className="text-[14px] font-medium"
                  style={{ color: '#374151' }}
                >
                  필터
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* Courses Grid - Figma와 동일한 레이아웃 */}
        <section className="w-full max-w-[1152px] mb-20 md:mb-24 flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {courses.map((course, index) => (
              <div key={index} className="flex justify-center">
                <CourseCard
                  title={course.title}
                  description={course.description}
                  rating={course.rating}
                  maxRating={course.maxRating}
                  stats={course.stats}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA Section - 완전 중앙 정렬 */}
        <section
          className="w-full max-w-[1200px] text-center py-20 md:py-28 rounded-3xl mb-20 md:mb-28 shadow-sm flex flex-col items-center p-12 md:p-18 lg:p-24 m-6 md:m-10 lg:m-14"
          style={{ backgroundColor: 'var(--accent-color)' }}
        >
          <div className="w-full p-8 md:p-12 lg:p-16 m-4 md:m-6">
            <h2 className="text-[28px] md:text-[40px] leading-[36px] md:leading-[48px] font-bold mb-8 md:mb-12 max-w-[900px] text-[#2d2d2d] text-center p-6 md:p-10 lg:p-12 m-3 md:m-5">
              Ready to Create Your Own Course?
            </h2>
          </div>

          <div className="max-w-[600px] md:max-w-[700px] mb-10 md:mb-16 p-8 md:p-12 lg:p-16 m-4 md:m-6">
            <p className="text-[16px] md:text-[20px] leading-[26px] md:leading-[30px] text-[#555555] text-center p-6 md:p-10 lg:p-12 m-3 md:m-5">
              Join thousands of couples creating unforgettable memories. Start designing your
              perfect date experience today.
            </p>
          </div>

          <div className="p-6 md:p-10 lg:p-12 m-4 md:m-6">
            <button
              className="px-20 md:px-28 py-6 md:py-8 text-white font-semibold rounded-xl text-[16px] md:text-[18px] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 m-3 md:m-5"
              style={{ backgroundColor: 'var(--primary-color)' }}
            >
              Start Creating
            </button>
          </div>
        </section>
>>>>>>> 64637f0ed6fa5252b084bc1003fdada217f6f890
      </main>
    </div>
  );
}
