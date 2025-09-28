import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  Timestamp,
  increment,
  getDoc
} from 'firebase/firestore';
import { db } from './firebase';

export interface Comment {
  id: string;
  courseId: string;
  authorId: string;
  author: {
    nickname: string;
    profileImageUrl?: string;
  };
  content: string;
  createdAt: Date;
  likes: number;
  isEdited?: boolean;
  parentId?: string; // null for top-level comments, commentId for replies
  replyCount?: number; // number of direct replies
  replies?: Comment[]; // nested replies (for UI display)
}

export interface CommentFormData {
  content: string;
}

export async function addComment(
  courseId: string,
  authorId: string,
  content: string,
  authorNickname: string,
  authorProfileImage?: string,
  parentId?: string // for replies
): Promise<{ success: boolean; error?: string; data?: { id: string } }> {
  try {
    const newComment = {
      courseId,
      authorId,
      content: content.trim(),
      author: {
        nickname: authorNickname,
        ...(authorProfileImage && { profileImageUrl: authorProfileImage }),
      },
      createdAt: Timestamp.now(),
      likes: 0,
      isEdited: false,
      replyCount: 0,
      ...(parentId && { parentId }),
    };

    const docRef = await addDoc(collection(db, 'comments'), newComment);

    // If this is a reply, increment parent comment's reply count
    if (parentId) {
      const parentRef = doc(db, 'comments', parentId);
      await updateDoc(parentRef, {
        replyCount: increment(1)
      });
    }

    return {
      success: true,
      data: { id: docRef.id }
    };
  } catch (error) {
    console.error('Error adding comment:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to add comment'
    };
  }
}

export async function getCourseComments(courseId: string): Promise<Comment[]> {
  try {
    // 임시: 인덱스 이슈 해결을 위해 orderBy 제거 후 클라이언트에서 정렬
    const q = query(
      collection(db, 'comments'),
      where('courseId', '==', courseId)
    );

    const querySnapshot = await getDocs(q);
    const comments: Comment[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      comments.push({
        id: doc.id,
        courseId: data.courseId,
        authorId: data.authorId,
        author: data.author,
        content: data.content,
        createdAt: data.createdAt?.toDate() || new Date(),
        likes: data.likes || 0,
        isEdited: data.isEdited || false,
        parentId: data.parentId,
        replyCount: data.replyCount || 0,
      });
    });

    // Build hierarchical comment structure
    const topLevelComments = comments.filter(comment => !comment.parentId);
    const replyComments = comments.filter(comment => comment.parentId);

    // Attach replies to their parent comments
    topLevelComments.forEach(comment => {
      comment.replies = replyComments
        .filter(reply => reply.parentId === comment.id)
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()); // replies in ascending order
    });

    // Return top-level comments sorted by creation date (newest first)
    return topLevelComments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  } catch (error) {
    console.error('Error getting comments:', error);
    return [];
  }
}

export async function updateComment(
  commentId: string,
  authorId: string,
  content: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const commentRef = doc(db, 'comments', commentId);
    const commentDoc = await getDoc(commentRef);

    if (!commentDoc.exists()) {
      return { success: false, error: 'Comment not found' };
    }

    const commentData = commentDoc.data();
    if (commentData.authorId !== authorId) {
      return { success: false, error: 'Unauthorized: You can only edit your own comments' };
    }

    await updateDoc(commentRef, {
      content: content.trim(),
      isEdited: true,
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating comment:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update comment'
    };
  }
}

export async function deleteComment(
  commentId: string,
  authorId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const commentRef = doc(db, 'comments', commentId);
    const commentDoc = await getDoc(commentRef);

    if (!commentDoc.exists()) {
      return { success: false, error: 'Comment not found' };
    }

    const commentData = commentDoc.data();
    if (commentData.authorId !== authorId) {
      return { success: false, error: 'Unauthorized: You can only delete your own comments' };
    }

    await deleteDoc(commentRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting comment:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete comment'
    };
  }
}

export async function toggleLikeComment(
  commentId: string,
  isLiked: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const commentRef = doc(db, 'comments', commentId);

    await updateDoc(commentRef, {
      likes: increment(isLiked ? -1 : 1)
    });

    return { success: true };
  } catch (error) {
    console.error('Error toggling comment like:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to toggle comment like'
    };
  }
}

// Get total comment count for a course (including replies)
export async function getCourseCommentCount(courseId: string): Promise<number> {
  try {
    const q = query(
      collection(db, 'comments'),
      where('courseId', '==', courseId)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  } catch (error) {
    console.error('Error getting comment count:', error);
    return 0;
  }
}