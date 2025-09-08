'use client'

import { useState, useEffect } from 'react'
import { useCourseStore } from '@/store/useCourseStore'
import { Course, Place } from '@/types'
import PlaceCard from './PlaceCard'
import MapComponent from '../map/MapComponent'
import ClientOnly from '@/components/ui/ClientOnly'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { 
  Save, 
  Share2, 
  Eye, 
  EyeOff, 
  Plus, 
  ArrowLeft,
  Route,
  Clock,
  MapPin as MapPinIcon 
} from 'lucide-react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'

interface CourseEditorProps {
  courseId?: string
  onSave?: (course: Course) => void
  onCancel?: () => void
}

export default function CourseEditor({ courseId, onSave, onCancel }: CourseEditorProps) {
  const {
    currentCourse,
    setCurrentCourse,
    createCourse,
    addPlaceToCourse,
    removePlaceFromCourse,
    reorderCourse,
    saveCourse,
    generateShareLink
  } = useCourseStore()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [showMap, setShowMap] = useState(true)

  // 코스 로드
  useEffect(() => {
    if (courseId) {
      // 기존 코스 편집
      const course = useCourseStore.getState().courses.find(c => c.id === courseId)
      if (course) {
        setCurrentCourse(course)
        setTitle(course.title)
        setDescription(course.description || '')
        setIsPublic(course.isPublic)
      }
    } else {
      // 새 코스 생성
      if (!currentCourse) {
        const newCourse = createCourse('새로운 데이트 코스', '멋진 데이트 코스를 만들어보세요!')
        setTitle(newCourse.title)
        setDescription(newCourse.description || '')
      }
    }
  }, [courseId])

  // 장소 추가
  const handlePlaceSelect = (place: Place) => {
    if (currentCourse) {
      addPlaceToCourse(currentCourse.id, place)
    }
  }

  // 장소 삭제
  const handleRemovePlace = (placeId: string) => {
    if (currentCourse) {
      removePlaceFromCourse(currentCourse.id, placeId)
    }
  }

  // 드래그 앤 드롭으로 순서 변경
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !currentCourse) return

    reorderCourse(
      currentCourse.id, 
      result.source.index, 
      result.destination.index
    )
  }

  // 코스 저장
  const handleSave = () => {
    if (!currentCourse) return

    const updatedCourse: Course = {
      ...currentCourse,
      title,
      description,
      isPublic,
      updatedAt: new Date()
    }

    saveCourse(updatedCourse)
    onSave?.(updatedCourse)
  }

  // 공유 링크 생성
  const handleShare = () => {
    if (currentCourse) {
      const shareLink = generateShareLink(currentCourse.id)
      navigator.clipboard.writeText(shareLink)
      // TODO: 토스트 메시지 표시
      alert('공유 링크가 복사되었습니다!')
    }
  }

  if (!currentCourse) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <MapPinIcon className="w-12 h-12 mx-auto mb-4 text-muted" />
          <p className="text-muted">코스 정보를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {onCancel && (
            <button
              onClick={onCancel}
              className="p-2 text-muted hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <h1 className="text-2xl font-bold text-primary">코스 편집</h1>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowMap(!showMap)}
            className="btn-outline"
          >
            {showMap ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showMap ? '지도 숨기기' : '지도 보기'}
          </button>
          
          <button
            onClick={handleShare}
            className="btn-secondary"
          >
            <Share2 className="w-4 h-4" />
            공유
          </button>
          
          <button
            onClick={handleSave}
            className="btn-primary"
          >
            <Save className="w-4 h-4" />
            저장
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 왼쪽: 코스 정보 및 장소 목록 */}
        <div className="space-y-6">
          {/* 코스 기본 정보 */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-4 text-primary">기본 정보</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">코스 제목</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="멋진 데이트 코스 제목을 입력하세요"
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">설명</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="코스에 대한 설명을 입력하세요"
                  rows={3}
                  className="w-full"
                />
              </div>
              
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="w-4 h-4 text-primary"
                />
                <label htmlFor="isPublic" className="text-sm">
                  커뮤니티에 공개하기
                </label>
              </div>
            </div>
          </div>

          {/* 장소 목록 */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-primary">
                장소 목록 ({currentCourse.places.length})
              </h2>
              
              <div className="flex items-center gap-2 text-sm text-muted">
                <Route className="w-4 h-4" />
                <span>드래그로 순서 변경</span>
              </div>
            </div>

            {currentCourse.places.length === 0 ? (
              <div className="text-center py-8 text-muted">
                <MapPinIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="mb-2">아직 추가된 장소가 없습니다</p>
                <p className="text-sm">지도에서 장소를 클릭하여 추가해보세요!</p>
              </div>
            ) : (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="places">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-3"
                    >
                      {currentCourse.places.map((place, index) => (
                        <Draggable
                          key={place.id}
                          draggableId={place.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <PlaceCard
                                place={place}
                                index={index + 1}
                                onRemove={() => handleRemovePlace(place.id)}
                                showIndex={true}
                                showRemove={true}
                                draggable={true}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </div>
        </div>

        {/* 오른쪽: 지도 */}
        {showMap && (
          <div className="lg:sticky lg:top-6">
            <div className="card p-0 h-[600px]">
              <MapComponent
                onPlaceSelect={handlePlaceSelect}
                showAddButton={true}
                className="h-full"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}