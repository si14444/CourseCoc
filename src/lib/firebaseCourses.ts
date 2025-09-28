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
  deleteDoc,
  serverTimestamp,
  QueryDocumentSnapshot,
  DocumentData
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { Location } from '@/types';

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
  createdAt: unknown; // Firebase Timestamp
  updatedAt: unknown; // Firebase Timestamp
  likes: number;
  views: number;
  bookmarks: number;
  authorId?: string; // 코스 작성자 ID
  // 디스플레이용 추가 필드들 (기존 샘플 데이터와 호환)
  placeCount?: number;
  steps?: string[];
  imageUrl?: string;
  status?: 'published' | 'draft' | 'private'; // 디스플레이용 상태
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
    authorId: data.authorId,
    // 디스플레이용 필드들 변환
    placeCount: data.locations?.length || 0,
    steps: data.locations?.map((loc: Location) => loc.name).filter(Boolean) || [],
    imageUrl: data.heroImage || data.locations?.find((loc: Location) => loc.image)?.image,
    status: data.isDraft ? 'draft' : 'published' // Firebase isDraft을 status로 변환
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

    return courses;
  } catch (error) {
    console.error('코스 목록을 가져오는 중 오류 발생:', error);
    throw error;
  }
};

// 특정 코스 가져오기 (상세 페이지용)
export const getCourseById = async (courseId: string): Promise<Course | null> => {
  try {
    const docRef = doc(db, 'courses', courseId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
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

      return course;
    } else {
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

// 사용자의 코스 가져오기 (내 코스 페이지용)
export const getUserCourses = async (userId: string): Promise<Course[]> => {
  try {
    const coursesRef = collection(db, 'courses');
    const q = query(
      coursesRef,
      where('authorId', '==', userId),
      limit(100) // 인덱스 문제로 orderBy 임시 제거
    );

    const snapshot = await getDocs(q);
    const courses = snapshot.docs.map(convertFirestoreDocToCourse);

    // 클라이언트에서 정렬 (임시 해결책)
    courses.sort((a, b) => {
      if (!a.updatedAt || !b.updatedAt) return 0;

      try {
        const dateA = (a.updatedAt && typeof a.updatedAt === 'object' && 'toDate' in a.updatedAt)
          ? (a.updatedAt as any).toDate()
          : new Date(a.updatedAt as string);
        const dateB = (b.updatedAt && typeof b.updatedAt === 'object' && 'toDate' in b.updatedAt)
          ? (b.updatedAt as any).toDate()
          : new Date(b.updatedAt as string);
        return dateB.getTime() - dateA.getTime(); // 최신순
      } catch {
        return 0;
      }
    });

    return courses;
  } catch (error) {
    console.error('사용자 코스 목록을 가져오는 중 오류 발생:', error);
    throw error;
  }
};

// 사용자의 특정 상태별 코스 가져오기
export const getUserCoursesByStatus = async (userId: string, isDraft?: boolean): Promise<Course[]> => {
  try {
    const coursesRef = collection(db, 'courses');
    let q;

    if (isDraft !== undefined) {
      q = query(
        coursesRef,
        where('authorId', '==', userId),
        where('isDraft', '==', isDraft),
        limit(100) // 인덱스 문제로 orderBy 임시 제거
      );
    } else {
      q = query(
        coursesRef,
        where('authorId', '==', userId),
        limit(100) // 인덱스 문제로 orderBy 임시 제거
      );
    }

    const snapshot = await getDocs(q);
    const courses = snapshot.docs.map(convertFirestoreDocToCourse);

    // 클라이언트에서 정렬 (임시 해결책)
    courses.sort((a, b) => {
      if (!a.updatedAt || !b.updatedAt) return 0;

      try {
        const dateA = (a.updatedAt && typeof a.updatedAt === 'object' && 'toDate' in a.updatedAt)
          ? (a.updatedAt as any).toDate()
          : new Date(a.updatedAt as string);
        const dateB = (b.updatedAt && typeof b.updatedAt === 'object' && 'toDate' in b.updatedAt)
          ? (b.updatedAt as any).toDate()
          : new Date(b.updatedAt as string);
        return dateB.getTime() - dateA.getTime(); // 최신순
      } catch {
        return 0;
      }
    });

    return courses;
  } catch (error) {
    console.error('사용자 코스 목록을 가져오는 중 오류 발생:', error);
    throw error;
  }
};

// 코스 삭제
export const deleteCourse = async (courseId: string, userId?: string): Promise<void> => {
  try {
    // 인증된 사용자인지 확인
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('로그인이 필요합니다.');
    }

    // 전달받은 userId와 현재 사용자가 일치하는지 확인
    const verifiedUserId = userId || currentUser.uid;
    if (currentUser.uid !== verifiedUserId) {
      throw new Error('권한이 없습니다.');
    }

    const docRef = doc(db, 'courses', courseId);

    // 삭제하기 전에 문서가 존재하고 작성자가 맞는지 확인
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      throw new Error('삭제하려는 코스를 찾을 수 없습니다.');
    }

    const courseData = docSnap.data();
    if (courseData.authorId !== verifiedUserId) {
      throw new Error('본인이 작성한 코스만 삭제할 수 있습니다.');
    }

    // 삭제 실행
    await deleteDoc(docRef);
  } catch (error: unknown) {
    console.error('코스 삭제 중 오류 발생:', error);
    const err = error as { code?: string; message?: string };

    // Firebase 에러 메시지를 사용자 친화적으로 변환
    if (err.code === 'permission-denied') {
      throw new Error('코스를 삭제할 권한이 없습니다. 본인이 작성한 코스인지 확인해주세요.');
    } else if (err.code === 'not-found') {
      throw new Error('삭제하려는 코스를 찾을 수 없습니다.');
    } else if (err.code === 'unauthenticated') {
      throw new Error('로그인 상태를 확인할 수 없습니다. 다시 로그인해주세요.');
    }

    throw error;
  }
};

// 코스 업데이트 (전체 문서 업데이트)
export const updateCourse = async (courseId: string, courseData: Partial<Course>): Promise<void> => {
  try {
    const docRef = doc(db, 'courses', courseId);
    const updateData = {
      ...courseData,
      updatedAt: serverTimestamp()
    };

    // 수정 시 제거해야 할 필드들
    delete (updateData as { id?: string }).id;
    delete (updateData as { createdAt?: unknown }).createdAt; // 생성일은 수정하지 않음

    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error('코스 업데이트 중 오류 발생:', error);
    throw error;
  }
};