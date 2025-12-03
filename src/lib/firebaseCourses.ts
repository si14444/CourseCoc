import { Location } from "@/types";
import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  increment,
  orderBy,
  query,
  QueryDocumentSnapshot,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

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
  createdAt: unknown;
  updatedAt: unknown;
  likes: number;
  views: number;
  bookmarks: number;
  authorId?: string;
  placeCount?: number;
  steps?: string[];
  imageUrl?: string;
  status?: "published" | "draft" | "private";
}

// Firebase 문서를 Course 객체로 변환
function convertFirestoreDocToCourse(
  doc: QueryDocumentSnapshot<DocumentData>
): Course {
  const data = doc.data();
  return {
    id: doc.id,
    title: data.title || "",
    description: data.description || "",
    tags: data.tags || [],
    duration: data.duration || "",
    budget: data.budget || "",
    season: data.season || "",
    heroImage: data.heroImage,
    locations: data.locations || [],
    content: data.content || "",
    isDraft: data.isDraft ?? false,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    likes: data.likes || 0,
    views: data.views || 0,
    bookmarks: data.bookmarks || 0,
    authorId: data.authorId,
    placeCount: data.locations?.length || 0,
    steps: data.steps,
    imageUrl: data.imageUrl || data.heroImage,
    status: data.status || (data.isDraft ? "draft" : "published"),
  };
}

// 모든 발행된 코스 가져오기 (isDraft: false)
export async function getPublishedCourses(): Promise<Course[]> {
  try {
    if (!db) {
      console.error("Firestore가 초기화되지 않았습니다.");
      return [];
    }

    const q = query(
      collection(db, "courses"),
      where("isDraft", "==", false),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(convertFirestoreDocToCourse);
  } catch (error) {
    console.error("Error getting published courses:", error);
    return [];
  }
}

// 특정 코스 가져오기 (상세 페이지용)
export async function getCourseById(courseId: string): Promise<Course | null> {
  try {
    if (!db) {
      console.error("Firestore가 초기화되지 않았습니다.");
      return null;
    }

    const docRef = doc(db, "courses", courseId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // 조회수 증가 시도 (실패해도 코스 데이터는 반환)
      try {
        await updateDoc(docRef, {
          views: increment(1),
        });
      } catch (viewError) {
        // 조회수 증가 실패 시 로그만 남기고 계속 진행
        if (process.env.NODE_ENV === "development") {
          console.warn("조회수 증가 실패 (권한 부족 가능성):", viewError);
        }
      }

      return convertFirestoreDocToCourse(
        docSnap as QueryDocumentSnapshot<DocumentData>
      );
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting course:", error);
    return null;
  }
}

// 태그로 코스 검색
export async function getCoursesByTag(tag: string): Promise<Course[]> {
  try {
    if (!db) {
      console.error("Firestore가 초기화되지 않았습니다.");
      return [];
    }

    const q = query(
      collection(db, "courses"),
      where("tags", "array-contains", tag),
      where("isDraft", "==", false)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(convertFirestoreDocToCourse);
  } catch (error) {
    console.error("Error getting courses by tag:", error);
    return [];
  }
}

// 좋아요 수 업데이트
export async function updateCourseLikes(
  courseId: string,
  increment_value: number = 1
): Promise<void> {
  try {
    if (!db) {
      console.error("Firestore가 초기화되지 않았습니다.");
      return;
    }

    const docRef = doc(db, "courses", courseId);
    await updateDoc(docRef, {
      likes: increment(increment_value),
    });
  } catch (error) {
    console.error("Error updating course likes:", error);
  }
}

// 북마크 수 업데이트
export async function updateCourseBookmarks(
  courseId: string,
  increment_value: number = 1
): Promise<void> {
  try {
    if (!db) {
      console.error("Firestore가 초기화되지 않았습니다.");
      return;
    }

    const docRef = doc(db, "courses", courseId);
    await updateDoc(docRef, {
      bookmarks: increment(increment_value),
    });
  } catch (error) {
    console.error("Error updating course bookmarks:", error);
  }
}

// 사용자의 코스 가져오기 (내 코스 페이지용)
export async function getUserCourses(userId: string): Promise<Course[]> {
  try {
    if (!db) {
      console.error("Firestore가 초기화되지 않았습니다.");
      return [];
    }

    if (!userId) {
      console.error("사용자 ID가 제공되지 않았습니다.");
      return [];
    }

    // authorId 필드로 쿼리
    const q = query(
      collection(db, "courses"),
      where("authorId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return [];
    }

    return querySnapshot.docs.map(convertFirestoreDocToCourse);
  } catch (error) {
    console.error("Error getting user courses:", error);
    return [];
  }
}

// 사용자의 특정 상태별 코스 가져오기
export async function getUserCoursesByStatus(
  userId: string,
  isDraft?: boolean
): Promise<Course[]> {
  try {
    if (!db) {
      console.error("Firestore가 초기화되지 않았습니다.");
      return [];
    }

    if (!userId) {
      console.error("사용자 ID가 제공되지 않았습니다.");
      return [];
    }

    let q;

    if (isDraft !== undefined) {
      // isDraft 상태로 필터링
      q = query(
        collection(db, "courses"),
        where("authorId", "==", userId),
        where("isDraft", "==", isDraft),
        orderBy("createdAt", "desc")
      );
    } else {
      // 모든 코스 가져오기
      q = query(
        collection(db, "courses"),
        where("authorId", "==", userId),
        orderBy("createdAt", "desc")
      );
    }

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return [];
    }

    return querySnapshot.docs.map(convertFirestoreDocToCourse);
  } catch (error) {
    console.error("Error getting user courses by status:", error);
    return [];
  }
}

// 코스 삭제
export async function deleteCourse(
  courseId: string,
  userId?: string
): Promise<void> {
  try {
    if (!db) {
      throw new Error("Firestore가 초기화되지 않았습니다.");
    }

    if (!courseId) {
      throw new Error("코스 ID가 제공되지 않았습니다.");
    }

    // 권한 확인 (userId가 제공된 경우)
    if (userId) {
      const docRef = doc(db, "courses", courseId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error("코스를 찾을 수 없습니다.");
      }

      const courseData = docSnap.data();
      if (courseData.authorId !== userId) {
        throw new Error("이 코스를 삭제할 권한이 없습니다.");
      }
    }

    // 코스 삭제
    await deleteDoc(doc(db, "courses", courseId));

    if (process.env.NODE_ENV === "development") {
      console.log(`코스 ${courseId}가 성공적으로 삭제되었습니다.`);
    }
  } catch (error) {
    console.error("Error deleting course:", error);
    throw error;
  }
}

// 코스 업데이트 (전체 문서 업데이트)
export async function updateCourse(
  courseId: string,
  courseData: Partial<Course>
): Promise<void> {
  try {
    if (!db) {
      throw new Error("Firestore가 초기화되지 않았습니다.");
    }

    const docRef = doc(db, "courses", courseId);
    await updateDoc(docRef, {
      ...courseData,
      updatedAt: serverTimestamp(),
    });

    if (process.env.NODE_ENV === "development") {
      console.log(`코스 ${courseId}가 성공적으로 업데이트되었습니다.`);
    }
  } catch (error) {
    console.error("Error updating course:", error);
    throw error;
  }
}
