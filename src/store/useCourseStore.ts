import { create } from 'zustand'
import { Course, Place, CommunityPost, AppState } from '@/types'
import { v4 as uuidv4 } from 'uuid'

interface CourseStore extends AppState {
  // 코스 관련 상태
  courses: Course[]
  communityPosts: CommunityPost[]
  
  // 액션들
  setCurrentCourse: (course: Course | null) => void
  setSelectedPlace: (place: Place | null) => void
  setIsCreatingCourse: (isCreating: boolean) => void
  setMapCenter: (center: { lat: number; lng: number }) => void
  setMapZoom: (zoom: number) => void
  
  // 코스 관리
  createCourse: (title: string, description?: string) => Course
  addPlaceToCourse: (courseId: string, place: Place) => void
  removePlaceFromCourse: (courseId: string, placeId: string) => void
  reorderCourse: (courseId: string, fromIndex: number, toIndex: number) => void
  saveCourse: (course: Course) => void
  deleteCourse: (courseId: string) => void
  
  // 커뮤니티 관리
  publishCourse: (courseId: string, content?: string) => void
  likeCourse: (courseId: string) => void
  addComment: (postId: string, content: string) => void
  
  // 공유 기능
  generateShareLink: (courseId: string) => string
}

export const useCourseStore = create<CourseStore>((set, get) => ({
  // 초기 상태
  currentCourse: null,
  selectedPlace: null,
  isCreatingCourse: false,
  mapCenter: { lat: 37.5665, lng: 126.9780 }, // 서울 시청
  mapZoom: 13,
  courses: [],
  communityPosts: [],
  
  // 기본 액션들
  setCurrentCourse: (course) => set({ currentCourse: course }),
  setSelectedPlace: (place) => set({ selectedPlace: place }),
  setIsCreatingCourse: (isCreating) => set({ isCreatingCourse: isCreating }),
  setMapCenter: (center) => set({ mapCenter: center }),
  setMapZoom: (zoom) => set({ mapZoom: zoom }),
  
  // 코스 관리 액션들
  createCourse: (title, description) => {
    const newCourse: Course = {
      id: uuidv4(),
      title,
      description,
      places: [],
      author: {
        id: 'temp-user',
        name: '사용자', // MVP용 임시 사용자
      },
      isPublic: false,
      tags: [],
      likes: 0,
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    
    set((state) => ({
      courses: [...state.courses, newCourse],
      currentCourse: newCourse,
      isCreatingCourse: true,
    }))
    
    return newCourse
  },
  
  addPlaceToCourse: (courseId, place) => {
    set((state) => {
      const updatedCourses = state.courses.map((course) =>
        course.id === courseId
          ? {
              ...course,
              places: [...course.places, place],
              updatedAt: new Date(),
            }
          : course
      )
      
      return {
        courses: updatedCourses,
        currentCourse: state.currentCourse?.id === courseId
          ? updatedCourses.find(c => c.id === courseId) || state.currentCourse
          : state.currentCourse,
      }
    })
  },
  
  removePlaceFromCourse: (courseId, placeId) => {
    set((state) => {
      const updatedCourses = state.courses.map((course) =>
        course.id === courseId
          ? {
              ...course,
              places: course.places.filter(p => p.id !== placeId),
              updatedAt: new Date(),
            }
          : course
      )
      
      return {
        courses: updatedCourses,
        currentCourse: state.currentCourse?.id === courseId
          ? updatedCourses.find(c => c.id === courseId) || state.currentCourse
          : state.currentCourse,
      }
    })
  },
  
  reorderCourse: (courseId, fromIndex, toIndex) => {
    set((state) => {
      const updatedCourses = state.courses.map((course) => {
        if (course.id === courseId) {
          const newPlaces = [...course.places]
          const [reorderedItem] = newPlaces.splice(fromIndex, 1)
          newPlaces.splice(toIndex, 0, reorderedItem)
          
          return {
            ...course,
            places: newPlaces,
            updatedAt: new Date(),
          }
        }
        return course
      })
      
      return {
        courses: updatedCourses,
        currentCourse: state.currentCourse?.id === courseId
          ? updatedCourses.find(c => c.id === courseId) || state.currentCourse
          : state.currentCourse,
      }
    })
  },
  
  saveCourse: (course) => {
    set((state) => ({
      courses: state.courses.map((c) =>
        c.id === course.id ? { ...course, updatedAt: new Date() } : c
      ),
    }))
  },
  
  deleteCourse: (courseId) => {
    set((state) => ({
      courses: state.courses.filter(c => c.id !== courseId),
      currentCourse: state.currentCourse?.id === courseId ? null : state.currentCourse,
      communityPosts: state.communityPosts.filter(p => p.courseId !== courseId),
    }))
  },
  
  // 커뮤니티 관리
  publishCourse: (courseId, content) => {
    const course = get().courses.find(c => c.id === courseId)
    if (!course) return
    
    const newPost: CommunityPost = {
      id: uuidv4(),
      courseId,
      course: { ...course, isPublic: true },
      author: course.author,
      content,
      likes: 0,
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    
    set((state) => ({
      communityPosts: [...state.communityPosts, newPost],
      courses: state.courses.map(c => 
        c.id === courseId ? { ...c, isPublic: true } : c
      ),
    }))
  },
  
  likeCourse: (courseId) => {
    set((state) => ({
      courses: state.courses.map(c => 
        c.id === courseId ? { ...c, likes: c.likes + 1 } : c
      ),
      communityPosts: state.communityPosts.map(p => 
        p.courseId === courseId 
          ? { ...p, likes: p.likes + 1, course: { ...p.course, likes: p.course.likes + 1 } }
          : p
      ),
    }))
  },
  
  addComment: (postId, content) => {
    const newComment = {
      id: uuidv4(),
      postId,
      author: {
        id: 'temp-user',
        name: '사용자',
      },
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    
    set((state) => ({
      communityPosts: state.communityPosts.map(p =>
        p.id === postId
          ? { ...p, comments: [...p.comments, newComment] }
          : p
      ),
    }))
  },
  
  // 공유 기능
  generateShareLink: (courseId) => {
    // SSR에서는 기본값 사용, 클라이언트에서만 실제 URL 사용
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
    const shareLink = baseUrl ? `${baseUrl}/course/${courseId}` : `/course/${courseId}`
    
    // 코스에 공유 링크 저장
    set((state) => ({
      courses: state.courses.map(c => 
        c.id === courseId ? { ...c, shareLink } : c
      ),
    }))
    
    return shareLink
  },
}))