import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  orderBy,
  Timestamp,
  increment,
  limit,
  startAfter,
  DocumentSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";

export interface Post {
  id: string;
  authorId: string;
  author: {
    nickname: string;
    profileImageUrl?: string;
  };
  title: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  likes: number;
  views: number;
  commentCount: number;
}

export interface PostFormData {
  title: string;
  content: string;
}

// 게시글 생성
export async function addPost(
  authorId: string,
  title: string,
  content: string,
  authorNickname: string,
  authorProfileImage?: string
): Promise<{ success: boolean; error?: string; data?: { id: string } }> {
  try {
    if (!db) {
      return { success: false, error: "Firestore가 초기화되지 않았습니다." };
    }

    const newPost = {
      authorId,
      title: title.trim(),
      content: content.trim(),
      author: {
        nickname: authorNickname,
        ...(authorProfileImage && { profileImageUrl: authorProfileImage }),
      },
      createdAt: Timestamp.now(),
      likes: 0,
      views: 0,
      commentCount: 0,
    };

    const docRef = await addDoc(collection(db, "posts"), newPost);

    return {
      success: true,
      data: { id: docRef.id },
    };
  } catch (error) {
    console.error("Error adding post:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to add post",
    };
  }
}

// 게시글 목록 조회 (페이지네이션 지원)
export async function getPosts(
  pageSize: number = 20,
  lastDoc?: DocumentSnapshot
): Promise<{ posts: Post[]; lastDoc?: DocumentSnapshot }> {
  try {
    if (!db) {
      console.error("Firestore가 초기화되지 않았습니다.");
      return { posts: [] };
    }

    let q = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc"),
      limit(pageSize)
    );

    if (lastDoc) {
      q = query(
        collection(db, "posts"),
        orderBy("createdAt", "desc"),
        startAfter(lastDoc),
        limit(pageSize)
      );
    }

    const querySnapshot = await getDocs(q);
    const posts: Post[] = [];
    let newLastDoc: DocumentSnapshot | undefined;

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      posts.push({
        id: doc.id,
        authorId: data.authorId,
        author: data.author,
        title: data.title,
        content: data.content,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate(),
        likes: data.likes || 0,
        views: data.views || 0,
        commentCount: data.commentCount || 0,
      });
      newLastDoc = doc;
    });

    return { posts, lastDoc: newLastDoc };
  } catch (error) {
    console.error("Error getting posts:", error);
    return { posts: [] };
  }
}

// 단일 게시글 조회
export async function getPostById(postId: string): Promise<Post | null> {
  try {
    if (!db) {
      console.error("Firestore가 초기화되지 않았습니다.");
      return null;
    }

    const postRef = doc(db, "posts", postId);
    const postDoc = await getDoc(postRef);

    if (!postDoc.exists()) {
      return null;
    }

    const data = postDoc.data();
    return {
      id: postDoc.id,
      authorId: data.authorId,
      author: data.author,
      title: data.title,
      content: data.content,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate(),
      likes: data.likes || 0,
      views: data.views || 0,
      commentCount: data.commentCount || 0,
    };
  } catch (error) {
    console.error("Error getting post:", error);
    return null;
  }
}

// 게시글 수정
export async function updatePost(
  postId: string,
  authorId: string,
  title: string,
  content: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!db) {
      return { success: false, error: "Firestore가 초기화되지 않았습니다." };
    }

    const postRef = doc(db, "posts", postId);
    const postDoc = await getDoc(postRef);

    if (!postDoc.exists()) {
      return { success: false, error: "Post not found" };
    }

    const postData = postDoc.data();
    if (postData.authorId !== authorId) {
      return {
        success: false,
        error: "Unauthorized: You can only edit your own posts",
      };
    }

    await updateDoc(postRef, {
      title: title.trim(),
      content: content.trim(),
      updatedAt: Timestamp.now(),
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating post:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update post",
    };
  }
}

// 게시글 삭제
export async function deletePost(
  postId: string,
  authorId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!db) {
      return { success: false, error: "Firestore가 초기화되지 않았습니다." };
    }

    const postRef = doc(db, "posts", postId);
    const postDoc = await getDoc(postRef);

    if (!postDoc.exists()) {
      return { success: false, error: "Post not found" };
    }

    const postData = postDoc.data();
    if (postData.authorId !== authorId) {
      return {
        success: false,
        error: "Unauthorized: You can only delete your own posts",
      };
    }

    await deleteDoc(postRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting post:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete post",
    };
  }
}

// 조회수 증가
export async function incrementPostViews(postId: string): Promise<void> {
  try {
    if (!db) return;

    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      views: increment(1),
    });
  } catch (error) {
    console.error("Error incrementing views:", error);
  }
}

// 댓글 수 증가/감소
export async function updatePostCommentCount(
  postId: string,
  delta: number
): Promise<void> {
  try {
    if (!db) return;

    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      commentCount: increment(delta),
    });
  } catch (error) {
    console.error("Error updating comment count:", error);
  }
}

// 좋아요 토글
export async function toggleLikePost(
  postId: string,
  userId: string,
  currentLikes: number
): Promise<{ success: boolean; likes: number }> {
  try {
    if (!db) return { success: false, likes: currentLikes };

    // 실제 좋아요 컬렉션을 따로 관리하는 것이 정석이지만,
    // 여기서는 간단하게 로컬 스토리지 + 문서 업데이트로 흉내만 내거나,
    // 또는 그냥 무조건 증가시키는 식으로 구현할 수도 있음.
    // 하지만 User 요구사항은 "좋아요 버튼 만들기"이므로,
    // 실제로는 userId 별 좋아요 여부를 저장하는 서브 컬렉션이 필요함.
    // 간단함을 위해 여기서는 서브컬렉션 'post_likes'를 사용.

    const likeRef = doc(db, "posts", postId, "likes", userId);
    const likeDoc = await getDoc(likeRef);
    const postRef = doc(db, "posts", postId);

    if (likeDoc.exists()) {
      // 이미 좋아요를 눌렀으면 취소
      await deleteDoc(likeRef);
      await updateDoc(postRef, { likes: increment(-1) });
      return { success: true, likes: currentLikes - 1 };
    } else {
      // 좋아요 추가
      await import("firebase/firestore").then(({ setDoc }) =>
        setDoc(likeRef, { createdAt: Timestamp.now() })
      );
      await updateDoc(postRef, { likes: increment(1) });
      return { success: true, likes: currentLikes + 1 };
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    return { success: false, likes: currentLikes };
  }
}

// 사용자가 좋아요를 눌렀는지 확인
export async function checkUserLikedPost(
  postId: string,
  userId: string
): Promise<boolean> {
  try {
    if (!db) return false;
    const likeRef = doc(db, "posts", postId, "likes", userId);
    const likeDoc = await getDoc(likeRef);
    return likeDoc.exists();
  } catch {
    return false;
  }
}
