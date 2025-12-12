import {
  doc,
  getDoc,
  deleteDoc,
  updateDoc,
  setDoc,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

// Like functionality for courses
export async function toggleLikeCourse(
  courseId: string,
  userId: string,
  currentLikes: number
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!db) {
      return { success: false, error: "Firestore가 초기화되지 않았습니다." };
    }

    const likeRef = doc(db, "courses", courseId, "likes", userId);
    const likeDoc = await getDoc(likeRef);

    const courseRef = doc(db, "courses", courseId);

    if (likeDoc.exists()) {
      // Unlike
      await deleteDoc(likeRef);
      await updateDoc(courseRef, {
        likes: increment(-1),
      });
    } else {
      // Like
      await setDoc(likeRef, { likedAt: serverTimestamp() });
      await updateDoc(courseRef, {
        likes: increment(1),
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Error toggling course like:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to toggle like",
    };
  }
}

export async function checkUserLikedCourse(
  courseId: string,
  userId: string
): Promise<boolean> {
  try {
    if (!db) {
      return false;
    }

    const likeRef = doc(db, "courses", courseId, "likes", userId);
    const likeDoc = await getDoc(likeRef);

    return likeDoc.exists();
  } catch (error) {
    console.error("Error checking course like:", error);
    return false;
  }
}
