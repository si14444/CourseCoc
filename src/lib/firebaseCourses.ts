import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  orderBy,
  limit,
  where,
  updateDoc,
  increment,
  QueryDocumentSnapshot,
  DocumentData
} from 'firebase/firestore';
import { db } from './firebase';

// Course 타입 정의 (기존과 호환)
export interface Course {
  id: string;
  title: string;
  description: string;
  tags: string[];
  duration: string;
  budget: string;
  season: string;
  heroImage?: string;
  locations: Location[];
  content: string;
  isDraft: boolean;
  createdAt: any;
  updatedAt: any;
  likes: number;
  views: number;
  bookmarks: number;
  // 디스플레이용 추가 필드들 (기존 샘플 데이터와 호환)
  placeCount?: number;
  steps?: string[];
  imageUrl?: string;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  time: string;
  description: string;
  detail: string;
  image?: string;
  position?: {
    lat: number;
    lng: number;
  };
}

// Firebase 문서를 Course 객체로 변환
const convertFirestoreDocToCourse = (doc: QueryDocumentSnapshot<DocumentData>): Course => {
  const data = doc.data();

  return {
    id: doc.id,
    title: data.title || '',
    description: data.description || '',
    tags: data.tags || [],
    duration: data.duration || '',
    budget: data.budget || '',
    season: data.season || '',
    heroImage: data.heroImage,
    locations: data.locations || [],
    content: data.content || '',
    isDraft: data.isDraft || false,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    likes: data.likes || 0,
    views: data.views || 0,
    bookmarks: data.bookmarks || 0,
    // 디스플레이용 필드들 변환
    placeCount: data.locations?.length || 0,
    steps: data.locations?.map((loc: Location) => loc.name).filter(Boolean) || [],
    imageUrl: data.heroImage || data.locations?.find((loc: Location) => loc.image)?.image
  };
};

// 모든 발행된 코스 가져오기 (isDraft: false)
export const getPublishedCourses = async (): Promise<Course[]> => {
  try {
    const coursesRef = collection(db, 'courses');
    const q = query(
      coursesRef,
      where('isDraft', '==', false),
      orderBy('createdAt', 'desc'),
      limit(50) // 성능을 위해 최대 50개 제한
    );

    const snapshot = await getDocs(q);
    const courses = snapshot.docs.map(convertFirestoreDocToCourse);

    console.log(`${courses.length}개의 발행된 코스를 가져왔습니다.`);
    return courses;
  } catch (error) {
    console.error('코스 목록을 가져오는 중 오류 발생:', error);
    throw error;
  }
};

// 특정 코스 가져오기 (상세 페이지용)
export const getCourseById = async (courseId: string): Promise<Course | null> => {
  try {
    console.log('코스 ID로 데이터 가져오기:', courseId);
    const docRef = doc(db, 'courses', courseId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log('코스 데이터 발견:', docSnap.data());
      const course = convertFirestoreDocToCourse(docSnap as QueryDocumentSnapshot<DocumentData>);

      // 조회수 증가 기능 임시 제거 (권한 문제로 인해)
      // TODO: Firebase 보안 규칙 수정 후 활성화
      // try {
      //   await updateDoc(docRef, {
      //     views: increment(1)
      //   });
      // } catch (viewsError) {
      //   console.warn('조회수 증가 실패 (권한 문제):', viewsError);
      // }

      console.log('변환된 코스 데이터:', course);
      return course;
    } else {
      console.log('해당 코스를 찾을 수 없습니다. ID:', courseId);
      return null;
    }
  } catch (error) {
    console.error('코스를 가져오는 중 오류 발생:', error);
    throw error;
  }
};

// 태그로 코스 검색
export const getCoursesByTag = async (tag: string): Promise<Course[]> => {
  try {
    const coursesRef = collection(db, 'courses');
    const q = query(
      coursesRef,
      where('isDraft', '==', false),
      where('tags', 'array-contains', tag),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(convertFirestoreDocToCourse);
  } catch (error) {
    console.error('태그로 코스 검색 중 오류 발생:', error);
    throw error;
  }
};

// 좋아요 수 업데이트
export const updateCourseLikes = async (courseId: string, increment_value: number = 1): Promise<void> => {
  try {
    const docRef = doc(db, 'courses', courseId);
    await updateDoc(docRef, {
      likes: increment(increment_value)
    });
  } catch (error) {
    console.error('좋아요 업데이트 중 오류 발생:', error);
    throw error;
  }
};

// 북마크 수 업데이트
export const updateCourseBookmarks = async (courseId: string, increment_value: number = 1): Promise<void> => {
  try {
    const docRef = doc(db, 'courses', courseId);
    await updateDoc(docRef, {
      bookmarks: increment(increment_value)
    });
  } catch (error) {
    console.error('북마크 업데이트 중 오류 발생:', error);
    throw error;
  }
};