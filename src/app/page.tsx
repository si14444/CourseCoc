'use client'

import Header from '@/components/Header'
import CourseCard from '@/components/CourseCard'
import ClientOnly from '@/components/ui/ClientOnly'

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
      <ClientOnly fallback={
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
      }>
        <Header />
      </ClientOnly>

      {/* Main Content - 완전 중앙 정렬 */}
      <main className="w-full flex flex-col items-center justify-center px-12 md:px-20 lg:px-28 py-8 md:py-12 lg:py-16 m-4 md:m-6 lg:m-8">
        {/* Hero Section - 완전 중앙 정렬 */}
        <section className="w-full max-w-[1200px] text-center pt-24 md:pt-40 pb-24 md:pb-40 flex flex-col items-center p-16 md:p-24 lg:p-32 m-6 md:m-10 lg:m-14">
          <div className="w-full p-10 md:p-16 lg:p-20 m-4 md:m-6 lg:m-8">
            <h1 className="text-[32px] md:text-[52px] lg:text-[60px] leading-[40px] md:leading-[60px] lg:leading-[70px] font-bold mb-10 md:mb-16 text-[#2d2d2d] text-center p-6 md:p-10 lg:p-12 m-3 md:m-5 lg:m-7">
              Create Your Perfect{' '}
              <span style={{ color: 'var(--primary-color)' }}>Date Course</span>
            </h1>
          </div>

          <div className="max-w-[600px] md:max-w-[700px] lg:max-w-[800px] mb-16 md:mb-20 p-8 md:p-12 lg:p-16 m-4 md:m-6 lg:m-8">
            <p className="text-[16px] md:text-[20px] lg:text-[22px] leading-[26px] md:leading-[32px] lg:leading-[36px] text-[#555555] text-center p-6 md:p-10 lg:p-12 m-3 md:m-5 lg:m-7">
              Design romantic experiences and share them with others. Plan memorable dates
              with our intuitive course creator.
            </p>
          </div>

          {/* CTA Buttons - 중앙 정렬 */}
          <div className="flex flex-col sm:flex-row gap-8 md:gap-12 lg:gap-16 items-center justify-center p-8 md:p-12 lg:p-16 m-4 md:m-6 lg:m-8">
            <button
              className="px-20 md:px-28 py-6 md:py-8 text-white font-semibold rounded-xl text-[16px] md:text-[18px] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 m-3 md:m-5 lg:m-7"
              style={{ backgroundColor: 'var(--primary-color)' }}
            >
              Start Course
            </button>
            <button
              className="px-20 md:px-28 py-6 md:py-8 font-semibold rounded-xl text-[16px] md:text-[18px] border-2 hover:shadow-lg transition-all duration-300 hover:scale-105 m-3 md:m-5 lg:m-7"
              style={{
                color: 'var(--primary-color)',
                borderColor: 'var(--primary-color)',
                backgroundColor: 'transparent'
              }}
            >
              Explore Map
            </button>
          </div>
        </section>

        {/* Search Section - 완전 중앙 정렬 */}
        <section className="w-full max-w-[1200px] mb-24 md:mb-32 flex justify-center p-12 md:p-18 lg:p-24 m-6 md:m-10 lg:m-14">
          <div className="flex flex-col sm:flex-row gap-8 md:gap-12 lg:gap-16 w-full max-w-[800px] p-8 md:p-12 lg:p-16 m-4 md:m-6 lg:m-8">
            <div className="flex-1 p-2 md:p-3 lg:p-4 m-2 md:m-3">
              <input
                type="text"
                placeholder="Search courses…"
                className="w-full h-[56px] md:h-[60px] px-10 md:px-14 py-5 md:py-6 border-2 rounded-xl text-[14px] md:text-[16px] focus:outline-none focus:ring-4 focus:ring-opacity-20 transition-all text-[#555555]"
                style={{
                  borderColor: 'var(--border)',
                  focusRingColor: 'var(--primary-color)'
                }}
              />
            </div>
            <button
              className="px-12 md:px-16 py-5 md:py-6 h-[56px] md:h-[60px] font-medium rounded-xl border-2 hover:shadow-md transition-all duration-300 text-[14px] md:text-[16px] m-2 md:m-3"
              style={{
                color: '#2d2d2d',
                backgroundColor: 'var(--secondary-color)',
                borderColor: 'var(--border)'
              }}
            >
              Filter
            </button>
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
      </main>
    </div>
  )
}
