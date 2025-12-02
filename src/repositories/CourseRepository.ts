import { db } from "@/lib/firebase";
import { Course } from "@/lib/firebaseCourses";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  orderBy,
  query,
  QueryDocumentSnapshot,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

/**
 * Course Repository Interface
 * 데이터 접근 로직을 추상화합니다.
 */
export interface ICourseRepository {
  /**
   * 새로운 코스를 생성합니다.
   * @param course - 생성할 코스 데이터
   * @returns 생성된 코스의 ID
   */
  create(course: Omit<Course, "id">): Promise<string>;

  /**
   * ID로 코스를 조회합니다.
   * @param id - 코스 ID
   * @returns 코스 데이터 또는 null
   */
  findById(id: string): Promise<Course | null>;

  /**
   * 모든 발행된 코스를 조회합니다.
   * @returns 코스 배열
   */
  findAll(): Promise<Course[]>;

  /**
   * 사용자의 코스를 조회합니다.
   * @param userId - 사용자 ID
   * @returns 코스 배열
   */
  findByUserId(userId: string): Promise<Course[]>;

  /**
   * 태그로 코스를 검색합니다.
   * @param tag - 검색할 태그
   * @returns 코스 배열
   */
  findByTag(tag: string): Promise<Course[]>;

  /**
   * 코스를 업데이트합니다.
   * @param id - 코스 ID
   * @param data - 업데이트할 데이터
   */
  update(id: string, data: Partial<Course>): Promise<void>;

  /**
   * 코스를 삭제합니다.
   * @param id - 코스 ID
   */
  delete(id: string): Promise<void>;
}

/**
 * Firebase Firestore를 사용하는 Course Repository 구현
 */
export class FirebaseCourseRepository implements ICourseRepository {
  private collectionName = "courses";

  /**
   * Firestore 문서를 Course 객체로 변환
   */
  private convertDocToCourse(doc: QueryDocumentSnapshot<DocumentData>): Course {
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

  async create(course: Omit<Course, "id">): Promise<string> {
    if (!db) {
      throw new Error("Firestore가 초기화되지 않았습니다.");
    }

    const docRef = await addDoc(collection(db, this.collectionName), {
      ...course,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  }

  async findById(id: string): Promise<Course | null> {
    if (!db) {
      throw new Error("Firestore가 초기화되지 않았습니다.");
    }

    const docRef = doc(db, this.collectionName, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return this.convertDocToCourse(
      docSnap as QueryDocumentSnapshot<DocumentData>
    );
  }

  async findAll(): Promise<Course[]> {
    if (!db) {
      throw new Error("Firestore가 초기화되지 않았습니다.");
    }

    const q = query(
      collection(db, this.collectionName),
      where("isDraft", "==", false),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => this.convertDocToCourse(doc));
  }

  async findByUserId(userId: string): Promise<Course[]> {
    if (!db) {
      throw new Error("Firestore가 초기화되지 않았습니다.");
    }

    const q = query(
      collection(db, this.collectionName),
      where("authorId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => this.convertDocToCourse(doc));
  }

  async findByTag(tag: string): Promise<Course[]> {
    if (!db) {
      throw new Error("Firestore가 초기화되지 않았습니다.");
    }

    const q = query(
      collection(db, this.collectionName),
      where("tags", "array-contains", tag),
      where("isDraft", "==", false)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => this.convertDocToCourse(doc));
  }

  async update(id: string, data: Partial<Course>): Promise<void> {
    if (!db) {
      throw new Error("Firestore가 초기화되지 않았습니다.");
    }

    const docRef = doc(db, this.collectionName, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  }

  async delete(id: string): Promise<void> {
    if (!db) {
      throw new Error("Firestore가 초기화되지 않았습니다.");
    }

    const docRef = doc(db, this.collectionName, id);
    await deleteDoc(docRef);
  }
}

// 싱글톤 인스턴스 export
export const courseRepository = new FirebaseCourseRepository();
