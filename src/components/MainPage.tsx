'use client'

import { useState, useEffect } from 'react'
import { useCourseStore } from '@/store/useCourseStore'
import CourseEditor from '@/components/course/CourseEditor'
import MapTab from '@/components/tabs/MapTab'
import CoursesTab from '@/components/tabs/CoursesTab'
import CommunityTab from '@/components/tabs/CommunityTab'
import { Heart, Plus, Home, MapPin, BookOpen, Users } from 'lucide-react'

type ViewMode = 'home' | 'map' | 'courses' | 'community' | 'editor'

export default function MainPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('home')
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)
  
  const { 
    setCurrentCourse, 
    setIsCreatingCourse,
    initializeFromStorage
  } = useCourseStore()

  // 클라이언트에서 스토어 초기화
  useEffect(() => {
    initializeFromStorage()
  }, [initializeFromStorage])

  // 새 코스 만들기
  const handleCreateCourse = () => {
    setViewMode('editor')
    setSelectedCourseId(null)
    setIsCreatingCourse(true)
  }

  // 코스 편집
  const handleEditCourse = (courseId: string) => {
    setSelectedCourseId(courseId)
    setViewMode('editor')
  }

  // 편집 완료
  const handleEditorSave = () => {
    setViewMode('courses')
    setSelectedCourseId(null)
    setIsCreatingCourse(false)
  }

  // 편집 취소
  const handleEditorCancel = () => {
    setViewMode('home')
    setSelectedCourseId(null)
    setIsCreatingCourse(false)
    setCurrentCourse(null)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-romantic rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-primary">CourseCoc</h1>
            <span className="text-xs bg-accent px-2 py-1 rounded-full text-primary font-medium">
              Beta
            </span>
          </div>

          <nav className="hidden md:flex gap-2">
            <button
              onClick={() => setViewMode('home')}
              className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 text-sm ${
                viewMode === 'home'
                  ? 'bg-primary text-white'
                  : 'text-muted hover:text-primary hover:bg-accent'
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Map</span>
            </button>
            <button
              onClick={() => setViewMode('courses')}
              className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 text-sm ${
                viewMode === 'courses'
                  ? 'bg-primary text-white'
                  : 'text-muted hover:text-primary hover:bg-accent'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">My Courses</span>
            </button>
            <button
              onClick={() => setViewMode('community')}
              className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 text-sm ${
                viewMode === 'community'
                  ? 'bg-primary text-white'
                  : 'text-muted hover:text-primary hover:bg-accent'
              }`}
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Community</span>
            </button>
            <button
              onClick={handleCreateCourse}
              className="btn-primary text-sm px-4 py-2"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Start</span>
            </button>
          </nav>

          {/* 모바일 메뉴 */}
          <nav className="flex md:hidden gap-1">
            <button
              onClick={() => setViewMode('home')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'home' 
                  ? 'bg-primary text-white' 
                  : 'text-muted hover:text-primary hover:bg-accent'
              }`}
            >
              <Home className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'map' 
                  ? 'bg-primary text-white' 
                  : 'text-muted hover:text-primary hover:bg-accent'
              }`}
            >
              <MapPin className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('courses')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'courses' 
                  ? 'bg-primary text-white' 
                  : 'text-muted hover:text-primary hover:bg-accent'
              }`}
            >
              <BookOpen className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('community')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'community' 
                  ? 'bg-primary text-white' 
                  : 'text-muted hover:text-primary hover:bg-accent'
              }`}
            >
              <Users className="w-5 h-5" />
            </button>
            <button
              onClick={handleCreateCourse}
              className="btn-primary p-2"
            >
              <Plus className="w-5 h-5" />
            </button>
          </nav>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="pb-20">
        {/* 홈 페이지 */}
        {viewMode === 'home' && (
          <div className="bg-white min-h-screen">
            {/* 히어로 섹션 */}
            <div className="max-w-6xl mx-auto px-6 py-16">
              <div className="text-center mb-16">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Create Your Perfect <span className="text-primary">Date Course</span>
                </h1>

                <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                  Design romantic experiences and share them with others. Plan memorable dates<br />
                  with our intuitive course creator.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button
                    onClick={handleCreateCourse}
                    className="btn-primary px-8 py-4 text-lg"
                  >
                    <Plus className="w-5 h-5" />
                    Start Course
                  </button>

                  <button
                    onClick={() => setViewMode('map')}
                    className="btn-outline px-8 py-4 text-lg"
                  >
                    <MapPin className="w-5 h-5" />
                    Explore Map
                  </button>
                </div>
              </div>

              {/* 검색 및 필터 섹션 */}
              <div className="max-w-6xl mx-auto mb-12">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="relative w-full sm:w-96">
                    <input
                      type="text"
                      placeholder="Search courses…"
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-primary text-gray-700"
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>

                  <button className="btn-secondary px-6 py-3 text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                    </svg>
                    Filter
                  </button>
                </div>
              </div>

              {/* 코스 그리드 */}
              <div className="max-w-6xl mx-auto mb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {/* 코스 카드 1 */}
                  <div className="card group cursor-pointer">
                    <div className="h-48 bg-gradient-to-br from-pink-100 to-pink-200 rounded-xl mb-4 flex items-center justify-center">
                      <div className="flex space-x-1">
                        {[1,2,3,4,5].map((i) => (
                          <div key={i} className="w-3 h-3 bg-primary rounded-full"></div>
                        ))}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Romantic Seoul Night Tour</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">A perfect evening date course through Seoul&apos;s most romantic spots including Banpo Rainbow Bridge...</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>247</span>
                      <span>13m</span>
                      <span>892</span>
                    </div>
                  </div>

                  {/* 코스 카드 2 */}
                  <div className="card group cursor-pointer">
                    <div className="h-48 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl mb-4 flex items-center justify-center">
                      <div className="flex space-x-1">
                        {[1,2,3,4].map((i) => (
                          <div key={i} className="w-3 h-3 bg-orange-400 rounded-full"></div>
                        ))}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Cherry Blossom Picnic Date</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">Spring romance under blooming cherry blossoms at Yeouido Park with cozy picnic setup and flower...</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>5</span>
                      <span>18h</span>
                      <span>692</span>
                    </div>
                  </div>

                  {/* 코스 카드 3 */}
                  <div className="card group cursor-pointer">
                    <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl mb-4 flex items-center justify-center">
                      <div className="flex space-x-1">
                        {[1,2,3,4,5,6].map((i) => (
                          <div key={i} className="w-3 h-3 bg-blue-400 rounded-full"></div>
                        ))}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Hongdae Art & Culture Walk</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">Explore vibrant street art, cozy cafes, and indie galleries in Hongdae&apos;s creative district perfect for...</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>7</span>
                      <span>15m</span>
                      <span>743</span>
                    </div>
                  </div>

                  {/* 코스 카드 4 */}
                  <div className="card group cursor-pointer">
                    <div className="h-48 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl mb-4 flex items-center justify-center">
                      <div className="flex space-x-1">
                        {[1,2,3,4,5].map((i) => (
                          <div key={i} className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        ))}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Busan Beach Sunset Romance</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">Seaside romance at Haeundae Beach with golden sunset views, beachside dining and ocean walks...</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>4</span>
                      <span>21d</span>
                      <span>2194</span>
                    </div>
                  </div>

                  {/* 코스 카드 5 */}
                  <div className="card group cursor-pointer">
                    <div className="h-48 bg-gradient-to-br from-green-100 to-green-200 rounded-xl mb-4 flex items-center justify-center">
                      <div className="flex space-x-1">
                        {[1,2,3,4,5,6].map((i) => (
                          <div key={i} className="w-3 h-3 bg-green-400 rounded-full"></div>
                        ))}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Jeju Island Nature Escape</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">Island adventure through Jeju&apos;s natural wonders including waterfalls, volcanic landscapes and tra...</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>8</span>
                      <span>21h</span>
                      <span>1957</span>
                    </div>
                  </div>

                  {/* 코스 카드 6 */}
                  <div className="card group cursor-pointer">
                    <div className="h-48 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl mb-4 flex items-center justify-center">
                      <div className="flex space-x-1">
                        {[1,2,3,4,5].map((i) => (
                          <div key={i} className="w-3 h-3 bg-purple-400 rounded-full"></div>
                        ))}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Traditional Hanok Village Date</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">Step back in time at Bukchon Hanok Village, experiencing traditional Korean architecture and...</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>6</span>
                      <span>20d</span>
                      <span>1134</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA 섹션 */}
              <div className="text-center bg-accent rounded-2xl p-16 max-w-4xl mx-auto">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Ready to Create Your Own Course?
                </h2>
                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                  Join thousands of couples creating unforgettable memories. Start designing your perfect date experience today.
                </p>
                <button
                  onClick={handleCreateCourse}
                  className="btn-primary px-10 py-4 text-lg"
                >
                  <Plus className="w-5 h-5" />
                  Start Creating
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 편집 모드 */}
        {viewMode === 'editor' && (
          <CourseEditor
            courseId={selectedCourseId || undefined}
            onSave={handleEditorSave}
            onCancel={handleEditorCancel}
          />
        )}

        {/* 지도 탭 */}
        {viewMode === 'map' && <MapTab />}

        {/* 내 코스 탭 */}
        {viewMode === 'courses' && (
          <CoursesTab 
            onCreateCourse={handleCreateCourse}
            onEditCourse={handleEditCourse}
          />
        )}

        {/* 커뮤니티 탭 */}
        {viewMode === 'community' && <CommunityTab />}
      </main>
    </div>
  )
}