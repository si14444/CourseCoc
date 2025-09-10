'use client'

import { useState, useEffect } from 'react'
import { useCourseStore } from '@/store/useCourseStore'
import CourseEditor from '@/components/course/CourseEditor'
import MapTab from '@/components/tabs/MapTab'
import CoursesTab from '@/components/tabs/CoursesTab'
import CommunityTab from '@/components/tabs/CommunityTab'
import { Heart, Plus, Home, MapPin, BookOpen, Users, Sparkles } from 'lucide-react'

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
              <span className="hidden sm:inline">홈</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 text-sm ${
                viewMode === 'map' 
                  ? 'bg-primary text-white' 
                  : 'text-muted hover:text-primary hover:bg-accent'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">지도</span>
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
              <span className="hidden sm:inline">내 코스</span>
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
              <span className="hidden sm:inline">커뮤니티</span>
            </button>
            <button
              onClick={handleCreateCourse}
              className="btn-primary text-sm px-4 py-2"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">코스 만들기</span>
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
            <div className="max-w-4xl mx-auto px-6 py-16">
              
              {/* 히어로 섹션 */}
              <div className="text-center mb-24">
                <div className="inline-flex items-center gap-2 bg-pink-50 text-pink-600 px-4 py-2 rounded-full text-sm font-medium mb-8">
                  <Heart className="w-4 h-4" />
                  특별한 데이트 코스 만들기
                </div>
                
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
                  완벽한 <span className="text-pink-500">데이트 코스</span>를<br />
                  만들어보세요
                </h1>
                
                <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
                  지도에서 장소를 선택하고, 나만의 로맨틱한 데이트 코스를 계획해보세요.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button
                    onClick={handleCreateCourse}
                    className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <Plus className="w-5 h-5" />
                      코스 만들기
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setViewMode('map')}
                    className="bg-white border-2 border-gray-200 hover:border-pink-300 text-gray-700 hover:text-pink-600 font-semibold px-8 py-4 rounded-xl transition-all duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      지도 보기
                    </div>
                  </button>
                </div>
              </div>

              {/* 기능 소개 */}
              <div className="mb-24">
                <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    간단한 3단계로 완성
                  </h2>
                  <p className="text-lg text-gray-600">
                    누구나 쉽게 완벽한 데이트 코스를 만들 수 있어요
                  </p>
                </div>
                
                <div className="space-y-16">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <MapPin className="w-8 h-8 text-pink-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">
                      1. 장소 선택
                    </h3>
                    <p className="text-gray-600 max-w-sm mx-auto">
                      지도에서 가고 싶은 장소들을 클릭해서 선택하세요
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <BookOpen className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">
                      2. 코스 구성
                    </h3>
                    <p className="text-gray-600 max-w-sm mx-auto">
                      선택한 장소들을 순서대로 배치해서 코스를 만들어요
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Users className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">
                      3. 저장 & 공유
                    </h3>
                    <p className="text-gray-600 max-w-sm mx-auto">
                      완성된 코스를 저장하고 친구들과 공유하세요
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA 섹션 */}
              <div className="text-center bg-gray-50 rounded-2xl p-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  지금 바로 시작해보세요!
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  무료로 나만의 특별한 데이트 코스를 만들어보세요
                </p>
                <button
                  onClick={handleCreateCourse}
                  className="bg-pink-500 hover:bg-pink-600 text-white font-bold text-lg px-10 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                >
                  <div className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    첫 코스 만들기
                  </div>
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