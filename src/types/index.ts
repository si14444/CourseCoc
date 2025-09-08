// 코스콕 MVP 타입 정의
export interface Place {
  id: string
  name: string
  description?: string
  address: string
  coordinates: {
    lat: number
    lng: number
  }
  photos?: string[]
  category?: PlaceCategory
  rating?: number
  createdAt: Date
  updatedAt: Date
}

export interface Course {
  id: string
  title: string
  description?: string
  places: Place[]
  author: {
    id: string
    name: string
    avatar?: string
  }
  isPublic: boolean
  tags?: string[]
  likes: number
  views: number
  createdAt: Date
  updatedAt: Date
  shareLink?: string
}

export interface CommunityPost {
  id: string
  courseId: string
  course: Course
  author: {
    id: string
    name: string
    avatar?: string
  }
  content?: string
  likes: number
  comments: Comment[]
  createdAt: Date
  updatedAt: Date
}

export interface Comment {
  id: string
  postId: string
  author: {
    id: string
    name: string
    avatar?: string
  }
  content: string
  createdAt: Date
  updatedAt: Date
}

export type PlaceCategory = 
  | 'restaurant' 
  | 'cafe' 
  | 'park' 
  | 'museum' 
  | 'shopping' 
  | 'entertainment' 
  | 'culture' 
  | 'nature' 
  | 'other'

export interface MapPin {
  id: string
  position: {
    lat: number
    lng: number
  }
  type: 'place' | 'course'
  data: Place | Course
}

// 3D 시각화를 위한 타입
export interface CourseVisualization {
  courseId: string
  path: {
    lat: number
    lng: number
    elevation?: number
  }[]
  markers: {
    position: {
      lat: number
      lng: number
      elevation?: number
    }
    place: Place
  }[]
}

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// 상태 관리용 타입
export interface AppState {
  currentCourse: Course | null
  selectedPlace: Place | null
  isCreatingCourse: boolean
  mapCenter: {
    lat: number
    lng: number
  }
  mapZoom: number
}