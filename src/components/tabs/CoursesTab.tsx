'use client'

import { useState } from 'react'
import { useCourseStore } from '@/store/useCourseStore'
import { 
  Plus, 
  Heart, 
  Share2, 
  Search, 
  Filter,
  MapPin,
  Route,
  Users,
  Sparkles
} from 'lucide-react'

interface CoursesTabProps {
  onCreateCourse: () => void
  onEditCourse: (courseId: string) => void
}

export default function CoursesTab({ onCreateCourse, onEditCourse }: CoursesTabProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const { courses } = useCourseStore()

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-primary mb-2">내가 만든 코스</h2>
          <p className="text-muted text-sm sm:text-base">총 {courses.length}개의 코스</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="코스 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full sm:w-64 text-sm sm:text-base"
            />
          </div>
          <button className="btn-outline text-sm sm:text-base px-3 py-2">
            <Filter className="w-4 h-4" />
            필터
          </button>
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-24 h-24 mx-auto mb-6 bg-accent rounded-full flex items-center justify-center">
            <Route className="w-12 h-12 text-primary opacity-50" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-foreground">아직 코스가 없습니다</h3>
          <p className="text-muted mb-6">첫 번째 데이트 코스를 만들어보세요!</p>
          <button
            onClick={onCreateCourse}
            className="btn-primary"
          >
            <Plus className="w-4 h-4" />
            첫 코스 만들기
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {courses
            .filter(course => 
              course.title.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((course) => (
              <div key={course.id} className="card hover:shadow-romantic transition-all group">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-lg text-foreground line-clamp-2">
                    {course.title}
                  </h3>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEditCourse(course.id)}
                      className="p-1 text-muted hover:text-primary"
                      title="편집"
                    >
                      ✏️
                    </button>
                    <button className="p-1 text-muted hover:text-primary" title="공유">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {course.description && (
                  <p className="text-muted text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>
                )}

                <div className="flex items-center gap-4 text-sm text-muted mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{course.places.length}곳</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    <span>{course.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{course.views}</span>
                  </div>
                </div>

                {course.places.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {course.places.slice(0, 2).map((place, index) => (
                      <div key={place.id} className="flex items-center gap-2 text-sm">
                        <span className="w-5 h-5 bg-primary text-white rounded-full text-xs flex items-center justify-center">
                          {index + 1}
                        </span>
                        <span className="text-foreground truncate">{place.name}</span>
                      </div>
                    ))}
                    {course.places.length > 2 && (
                      <div className="text-xs text-muted pl-7">
                        외 {course.places.length - 2}곳 더
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-2 pt-3 border-t border-border">
                  <button
                    onClick={() => onEditCourse(course.id)}
                    className="flex-1 btn-outline text-sm"
                  >
                    편집
                  </button>
                  <button className="flex-1 btn-primary text-sm">
                    <Sparkles className="w-3 h-3" />
                    3D 보기
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}