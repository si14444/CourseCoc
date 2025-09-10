// 코스콕 상수 정의
export const DEFAULT_MAP_CENTER = {
  lat: 37.5665, // 서울 시청
  lng: 126.9780
}

// 카카오맵 기본 설정
export const DEFAULT_KAKAO_MAP_LEVEL = 3 // 1-14 (1이 가장 확대)
export const DEFAULT_MAP_ZOOM = 13 // 호환성을 위해 유지

export const PLACE_CATEGORIES = {
  restaurant: '맛집',
  cafe: '카페',
  park: '공원',
  museum: '박물관',
  shopping: '쇼핑',
  entertainment: '오락',
  culture: '문화',
  nature: '자연',
  other: '기타'
} as const

export const MAX_PLACES_PER_COURSE = 20
export const MAX_COURSE_TITLE_LENGTH = 100
export const MAX_COURSE_DESCRIPTION_LENGTH = 500

export const SHARE_PLATFORMS = {
  kakao: '카카오톡',
  instagram: '인스타그램',
  facebook: '페이스북',
  twitter: '트위터',
  link: '링크 복사'
} as const