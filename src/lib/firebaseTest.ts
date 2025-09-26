// Firebase 연결 테스트 함수
import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const testFirebaseConnection = async () => {
  try {
    // 테스트 문서 추가
    const testDoc = {
      title: "테스트 게시글",
      description: "Firebase 연결 테스트입니다",
      createdAt: serverTimestamp(),
      testField: true
    };

    const docRef = await addDoc(collection(db, "test"), testDoc);
    console.log("테스트 문서가 추가되었습니다. ID:", docRef.id);
    return { success: true, docId: docRef.id };
  } catch (error) {
    console.error("Firebase 연결 테스트 실패:", error);
    return { success: false, error };
  }
};

export const validateCourseData = (courseData: any) => {
  const errors: string[] = [];

  if (!courseData.title || courseData.title.trim() === '') {
    errors.push('제목은 필수 항목입니다.');
  }

  if (!courseData.description || courseData.description.trim() === '') {
    errors.push('설명은 필수 항목입니다.');
  }

  if (!courseData.locations || courseData.locations.length === 0) {
    errors.push('최소 1개 이상의 장소가 필요합니다.');
  }

  if (!courseData.content || courseData.content.trim() === '') {
    errors.push('상세 내용은 필수 항목입니다.');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};