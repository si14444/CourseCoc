"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Heart,
  Eye,
  MoreVertical,
  Edit3,
  Trash2,
  MessageCircle,
  Send,
  Reply,
  Clock,
} from "lucide-react";
import { Header } from "../../../components/Header";
import { useAuth } from "../../../contexts/AuthContext";
import { useHydration } from "../../../hooks/useHydration";
import {
  getPostById,
  deletePost,
  incrementPostViews,
  Post,
} from "../../../lib/firebasePosts";
import {
  Comment,
  updateComment,
  deleteComment,
} from "../../../lib/firebaseComments";
import { CONTAINER_CLASSES } from "@/utils/layouts";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db } from "../../../lib/firebase";

interface PostDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function PostDetailPage({ params }: PostDetailPageProps) {
  const { id: postId } = use(params);
  const router = useRouter();
  const { user, userProfile } = useAuth();
  const isHydrated = useHydration();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [commentDropdown, setCommentDropdown] = useState<string | null>(null);

  // 게시글용 댓글 조회
  const loadPostComments = useCallback(async () => {
    if (!db) return;
    try {
      const q = query(
        collection(db, "comments"),
        where("postId", "==", postId)
      );
      const querySnapshot = await getDocs(q);
      const commentsData: Comment[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        commentsData.push({
          id: doc.id,
          courseId: data.courseId || "",
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

      // 계층 구조 빌드
      const topLevelComments = commentsData.filter((c) => !c.parentId);
      const replyComments = commentsData.filter((c) => c.parentId);

      topLevelComments.forEach((comment) => {
        comment.replies = replyComments
          .filter((reply) => reply.parentId === comment.id)
          .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      });

      setComments(
        topLevelComments.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        )
      );
    } catch (error) {
      console.error("Error loading comments:", error);
    }
  }, [postId]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);

        const postData = await getPostById(postId);
        if (postData) {
          setPost(postData);
          await incrementPostViews(postId);
          await loadPostComments();
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isHydrated) {
      fetchPost();
    }
  }, [postId, isHydrated, loadPostComments]);

  const handleDeletePost = async () => {
    if (!user || !post) return;
    if (!confirm("정말로 이 게시글을 삭제하시겠습니까?")) return;

    try {
      const result = await deletePost(postId, user.uid);
      if (result.success) {
        router.push("/community");
      } else {
        alert(result.error || "게시글 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("게시글 삭제 중 오류가 발생했습니다.");
    }
  };

  // 게시글용 댓글 추가
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim() || !db) return;

    setSubmitting(true);
    const displayName =
      userProfile?.nickname ||
      user.displayName ||
      user.email?.split("@")[0] ||
      "사용자";

    try {
      const newCommentData = {
        postId,
        authorId: user.uid,
        content: newComment.trim(),
        author: {
          nickname: displayName,
          ...(userProfile?.profileImageUrl && {
            profileImageUrl: userProfile.profileImageUrl,
          }),
        },
        createdAt: Timestamp.now(),
        likes: 0,
        isEdited: false,
        replyCount: 0,
      };

      const { addDoc } = await import("firebase/firestore");
      await addDoc(collection(db, "comments"), newCommentData);

      // 게시글 댓글 수 업데이트
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, { commentCount: increment(1) });

      setNewComment("");
      await loadPostComments();
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("댓글 작성 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  // 답글 추가
  const handleSubmitReply = async (e: React.FormEvent, parentId: string) => {
    e.preventDefault();
    if (!user || !replyContent.trim() || !db) return;

    setSubmitting(true);
    const displayName =
      userProfile?.nickname ||
      user.displayName ||
      user.email?.split("@")[0] ||
      "사용자";

    try {
      const replyData = {
        postId,
        parentId,
        authorId: user.uid,
        content: replyContent.trim(),
        author: {
          nickname: displayName,
          ...(userProfile?.profileImageUrl && {
            profileImageUrl: userProfile.profileImageUrl,
          }),
        },
        createdAt: Timestamp.now(),
        likes: 0,
        isEdited: false,
        replyCount: 0,
      };

      const { addDoc } = await import("firebase/firestore");
      await addDoc(collection(db, "comments"), replyData);

      // 부모 댓글 답글 수 업데이트
      const parentRef = doc(db, "comments", parentId);
      await updateDoc(parentRef, { replyCount: increment(1) });

      // 게시글 댓글 수 업데이트
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, { commentCount: increment(1) });

      setReplyContent("");
      setReplyingTo(null);
      await loadPostComments();
    } catch (error) {
      console.error("Error adding reply:", error);
      alert("답글 작성 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditComment = async (commentId: string) => {
    if (!user || !editContent.trim()) return;

    try {
      const result = await updateComment(commentId, user.uid, editContent);
      if (result.success) {
        setEditingId(null);
        setEditContent("");
        await loadPostComments();
      } else {
        alert(result.error || "댓글 수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error editing comment:", error);
      alert("댓글 수정 중 오류가 발생했습니다.");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!user) return;
    if (!confirm("정말로 이 댓글을 삭제하시겠습니까?")) return;

    try {
      const result = await deleteComment(commentId, user.uid);
      if (result.success) {
        // 게시글 댓글 수 감소
        if (db) {
          const postRef = doc(db, "posts", postId);
          await updateDoc(postRef, { commentCount: increment(-1) });
        }
        await loadPostComments();
      } else {
        alert(result.error || "댓글 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("댓글 삭제 중 오류가 발생했습니다.");
    }
  };

  const formatDate = (date: Date) => {
    if (!isHydrated) return date.toLocaleDateString("ko-KR");

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "방금 전";
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;
    return date.toLocaleDateString("ko-KR");
  };

  if (!isHydrated || loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-20">
          <div className={CONTAINER_CLASSES}>
            <div className="animate-pulse py-12">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-20">
          <div className={CONTAINER_CLASSES}>
            <div className="text-center py-16">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                게시글을 찾을 수 없습니다
              </h2>
              <p className="text-gray-600 mb-6">
                삭제되었거나 존재하지 않는 게시글입니다.
              </p>
              <Link
                href="/community"
                className="inline-flex items-center px-6 py-3 bg-pink-500 text-white rounded-xl font-medium hover:bg-pink-600 transition-colors"
              >
                커뮤니티로 돌아가기
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <Header />

      <main className="pt-20 pb-8">
        <div className={CONTAINER_CLASSES}>
          {/* Back Button */}
          <Link
            href="/community"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-pink-500 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>커뮤니티로 돌아가기</span>
          </Link>

          {/* Post Content */}
          <article className="bg-white rounded-2xl shadow-lg border border-pink-100 p-8 mb-8">
            {/* Author Info */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                {post.author.profileImageUrl ? (
                  <Image
                    src={post.author.profileImageUrl}
                    alt={post.author.nickname}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-pink-100"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center ring-2 ring-pink-100">
                    <span className="text-white font-bold text-lg">
                      {post.author.nickname[0].toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <h4 className="font-medium text-gray-900">
                    {post.author.nickname}
                  </h4>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              {user && user.uid === post.authorId && (
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <MoreVertical className="w-5 h-5 text-gray-500" />
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                      <Link
                        href={`/community/post/edit?id=${post.id}`}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <Edit3 className="w-4 h-4" />
                        <span>수정</span>
                      </Link>
                      <button
                        onClick={handleDeletePost}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2 text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>삭제</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>

            {/* Content */}
            <div
              className="prose max-w-none text-gray-700 mb-6"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Stats */}
            <div className="flex items-center space-x-6 pt-6 border-t border-gray-100 text-sm text-gray-500">
              <span className="flex items-center space-x-2">
                <Heart className="w-5 h-5" />
                <span>{post.likes}</span>
              </span>
              <span className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5" />
                <span>{comments.length}</span>
              </span>
              <span className="flex items-center space-x-2">
                <Eye className="w-5 h-5" />
                <span>{post.views}</span>
              </span>
            </div>
          </article>

          {/* Comments Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-pink-100 p-8">
            <div className="flex items-center space-x-2 mb-6">
              <MessageCircle className="w-5 h-5 text-pink-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                댓글 ({comments.length})
              </h3>
            </div>

            {/* Comment Form */}
            {user ? (
              <form onSubmit={handleSubmitComment} className="mb-6">
                <div className="flex space-x-3">
                  <div className="flex-shrink-0">
                    {userProfile?.profileImageUrl ? (
                      <Image
                        src={userProfile.profileImageUrl}
                        alt={userProfile.nickname || "프로필"}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                          {(userProfile?.nickname ||
                            user.displayName ||
                            "U")[0].toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="댓글을 작성해주세요..."
                      className="w-full p-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                      rows={3}
                      maxLength={500}
                    />
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-gray-500">
                        {newComment.length}/500
                      </span>
                      <button
                        type="submit"
                        disabled={submitting || !newComment.trim()}
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-pink-500 text-white rounded-lg font-medium hover:bg-pink-600 transition-colors disabled:opacity-50"
                      >
                        <Send className="w-4 h-4" />
                        <span>{submitting ? "작성 중..." : "댓글 작성"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <div className="mb-6 p-6 bg-gradient-to-r from-pink-50 to-red-50 border border-pink-200 rounded-xl text-center">
                <MessageCircle className="w-8 h-8 text-pink-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  댓글 작성하기
                </h3>
                <p className="text-gray-600 mb-4">
                  댓글을 작성하려면 로그인이 필요합니다.
                </p>
                <Link
                  href="/auth/login"
                  className="inline-flex items-center px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors font-medium"
                >
                  로그인하기
                </Link>
              </div>
            )}

            {/* Comments List */}
            {comments.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 mb-2">아직 댓글이 없습니다</p>
                <p className="text-sm text-gray-400">
                  첫 번째 댓글을 작성해보세요!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="border-b border-gray-100 pb-4 last:border-b-0"
                  >
                    <div className="flex space-x-3">
                      <div className="flex-shrink-0">
                        {comment.author.profileImageUrl ? (
                          <Image
                            src={comment.author.profileImageUrl}
                            alt={comment.author.nickname}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium">
                              {comment.author.nickname[0].toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-gray-900">
                              {comment.author.nickname}
                            </h4>
                            <span className="text-sm text-gray-500">
                              {formatDate(comment.createdAt)}
                            </span>
                            {comment.isEdited && (
                              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                                편집됨
                              </span>
                            )}
                          </div>

                          {user && user.uid === comment.authorId && (
                            <div className="relative">
                              <button
                                onClick={() =>
                                  setCommentDropdown(
                                    commentDropdown === comment.id
                                      ? null
                                      : comment.id
                                  )
                                }
                                className="p-1 hover:bg-gray-100 rounded transition-colors"
                              >
                                <MoreVertical className="w-4 h-4 text-gray-500" />
                              </button>

                              {commentDropdown === comment.id && (
                                <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                  <button
                                    onClick={() => {
                                      setEditingId(comment.id);
                                      setEditContent(comment.content);
                                      setCommentDropdown(null);
                                    }}
                                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2"
                                  >
                                    <Edit3 className="w-3 h-3" />
                                    <span>수정</span>
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteComment(comment.id)
                                    }
                                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2 text-red-600"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    <span>삭제</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {editingId === comment.id ? (
                          <div className="mt-2">
                            <textarea
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              className="w-full p-2 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-pink-400"
                              rows={2}
                              maxLength={500}
                            />
                            <div className="flex justify-end space-x-2 mt-2">
                              <button
                                onClick={() => {
                                  setEditingId(null);
                                  setEditContent("");
                                }}
                                className="px-3 py-1 text-sm border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                              >
                                취소
                              </button>
                              <button
                                onClick={() => handleEditComment(comment.id)}
                                className="px-3 py-1 text-sm bg-pink-500 text-white rounded hover:bg-pink-600 transition-colors"
                              >
                                저장
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="mt-1 text-gray-700 whitespace-pre-wrap">
                            {comment.content}
                          </p>
                        )}

                        {/* Reply Button */}
                        <div className="flex items-center mt-3">
                          {user ? (
                            <button
                              onClick={() => setReplyingTo(comment.id)}
                              className="flex items-center space-x-1 text-sm text-gray-600 hover:text-pink-500 px-3 py-2 rounded-md hover:bg-pink-50 transition-colors font-medium"
                            >
                              <Reply className="w-4 h-4" />
                              <span>답글</span>
                              {comment.replyCount && comment.replyCount > 0 && (
                                <span className="bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full text-xs font-medium">
                                  {comment.replyCount}
                                </span>
                              )}
                            </button>
                          ) : (
                            <div className="flex items-center space-x-1 text-sm text-gray-400 px-3 py-2">
                              <Reply className="w-4 h-4" />
                              <span>답글 (로그인 필요)</span>
                            </div>
                          )}
                        </div>

                        {/* Reply Form */}
                        {replyingTo === comment.id && user && (
                          <form
                            onSubmit={(e) => handleSubmitReply(e, comment.id)}
                            className="mt-4 ml-8 p-4 bg-pink-50 border border-pink-200 rounded-lg"
                          >
                            <div className="flex space-x-3">
                              <div className="flex-shrink-0">
                                {userProfile?.profileImageUrl ? (
                                  <Image
                                    src={userProfile.profileImageUrl}
                                    alt={userProfile.nickname || "프로필"}
                                    width={32}
                                    height={32}
                                    className="w-8 h-8 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center">
                                    <span className="text-white font-medium text-sm">
                                      {(userProfile?.nickname ||
                                        user.displayName ||
                                        "U")[0].toUpperCase()}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">
                                <textarea
                                  value={replyContent}
                                  onChange={(e) =>
                                    setReplyContent(e.target.value)
                                  }
                                  placeholder="답글을 작성해보세요..."
                                  className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm"
                                  rows={3}
                                  maxLength={500}
                                />
                                <div className="flex justify-between items-center mt-2">
                                  <span className="text-xs text-gray-500">
                                    {replyContent.length}/500
                                  </span>
                                  <div className="flex space-x-2">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setReplyingTo(null);
                                        setReplyContent("");
                                      }}
                                      className="px-3 py-1 text-sm border border-gray-300 text-gray-600 bg-white rounded-md hover:bg-gray-50 transition-colors font-medium"
                                    >
                                      취소
                                    </button>
                                    <button
                                      type="submit"
                                      disabled={
                                        submitting || !replyContent.trim()
                                      }
                                      className="px-3 py-1 text-sm bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors disabled:opacity-50 font-medium"
                                    >
                                      {submitting ? "작성 중..." : "답글 작성"}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </form>
                        )}

                        {/* Replies Display */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="mt-4 ml-8 space-y-3">
                            {comment.replies.map((reply) => (
                              <div
                                key={reply.id}
                                className="flex space-x-3 p-3 bg-gray-50 rounded-lg"
                              >
                                <div className="flex-shrink-0">
                                  {reply.author.profileImageUrl ? (
                                    <Image
                                      src={reply.author.profileImageUrl}
                                      alt={reply.author.nickname}
                                      width={32}
                                      height={32}
                                      className="w-8 h-8 rounded-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center">
                                      <span className="text-white font-medium text-sm">
                                        {reply.author.nickname[0].toUpperCase()}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                      <h5 className="font-medium text-gray-900 text-sm">
                                        {reply.author.nickname}
                                      </h5>
                                      <span className="text-xs text-gray-500">
                                        {formatDate(reply.createdAt)}
                                      </span>
                                      {reply.isEdited && (
                                        <span className="text-xs text-gray-400 bg-gray-100 px-1 py-0.5 rounded">
                                          편집됨
                                        </span>
                                      )}
                                    </div>

                                    {user && user.uid === reply.authorId && (
                                      <div className="relative">
                                        <button
                                          onClick={() =>
                                            setCommentDropdown(
                                              commentDropdown === reply.id
                                                ? null
                                                : reply.id
                                            )
                                          }
                                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                                        >
                                          <MoreVertical className="w-3 h-3 text-gray-500" />
                                        </button>

                                        {commentDropdown === reply.id && (
                                          <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                            <button
                                              onClick={() => {
                                                setEditingId(reply.id);
                                                setEditContent(reply.content);
                                                setCommentDropdown(null);
                                              }}
                                              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2"
                                            >
                                              <Edit3 className="w-3 h-3" />
                                              <span>수정</span>
                                            </button>
                                            <button
                                              onClick={() =>
                                                handleDeleteComment(reply.id)
                                              }
                                              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2 text-red-600"
                                            >
                                              <Trash2 className="w-3 h-3" />
                                              <span>삭제</span>
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>

                                  {editingId === reply.id ? (
                                    <div className="mt-2">
                                      <textarea
                                        value={editContent}
                                        onChange={(e) =>
                                          setEditContent(e.target.value)
                                        }
                                        className="w-full p-2 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm"
                                        rows={2}
                                        maxLength={500}
                                      />
                                      <div className="flex justify-end space-x-2 mt-2">
                                        <button
                                          onClick={() => {
                                            setEditingId(null);
                                            setEditContent("");
                                          }}
                                          className="px-3 py-1 text-sm border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                                        >
                                          취소
                                        </button>
                                        <button
                                          onClick={() =>
                                            handleEditComment(reply.id)
                                          }
                                          className="px-3 py-1 text-sm bg-pink-500 text-white rounded hover:bg-pink-600 transition-colors"
                                        >
                                          저장
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <p className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">
                                      {reply.content}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
