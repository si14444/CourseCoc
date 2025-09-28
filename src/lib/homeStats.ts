import { collection, getCountFromServer, query, where } from 'firebase/firestore';
import { db } from './firebase';

export interface HomeStats {
  totalCourses: number;
  publishedCourses: number;
  beta: boolean;
}

export async function getHomeStats(): Promise<HomeStats> {
  try {
    if (!db) {
      // Firebase가 초기화되지 않은 경우 기본값 반환
      return {
        totalCourses: 0,
        publishedCourses: 0,
        beta: true
      };
    }

    // 전체 코스 수
    const totalCoursesRef = collection(db, 'courses');
    const totalSnapshot = await getCountFromServer(totalCoursesRef);

    // 발행된 코스 수
    const publishedCoursesRef = query(
      collection(db, 'courses'),
      where('isDraft', '==', false)
    );
    const publishedSnapshot = await getCountFromServer(publishedCoursesRef);

    return {
      totalCourses: totalSnapshot.data().count,
      publishedCourses: publishedSnapshot.data().count,
      beta: true // 베타 상태 유지
    };
  } catch (error) {
    console.error('홈 통계 가져오기 실패:', error);
    // 에러 발생 시 기본값 반환
    return {
      totalCourses: 0,
      publishedCourses: 0,
      beta: true
    };
  }
}