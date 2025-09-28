"use client";

import { useState, useEffect } from "react";
import { MessageCircle, MoreVertical, Edit3, Trash2, Send, Reply } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useHydration } from "../hooks/useHydration";
import {
  Comment,
  getCourseComments,
  addComment,
  updateComment,
  deleteComment
} from "../lib/firebaseComments";

interface CommentsProps {
  courseId: string;
}

export function Comments({ courseId }: CommentsProps) {
  const { user } = useAuth();
  const isHydrated = useHydration();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  useEffect(() => {
    if (isHydrated) {
      loadComments();
    }
  }, [courseId, isHydrated]);

  const loadComments = async () => {
    try {
      const commentsData = await getCourseComments(courseId);
      setComments(commentsData);
    } catch (error) {
      console.error("Error loading comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert("댓글을 작성하려면 로그인이 필요합니다.");
      return;
    }

    if (!newComment.trim()) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }

    setSubmitting(true);

    // 사용자 닉네임이 없으면 이메일에서 추출
    const displayName = user.nickname || user.email?.split('@')[0] || "사용자";

    try {
      const result = await addComment(
        courseId,
        user.uid,
        newComment,
        displayName,
        user.profileImageUrl
      );

      if (result.success) {
        setNewComment("");
        await loadComments(); // 댓글 목록 새로고침
      } else {
        alert(result.error || "댓글 작성에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("댓글 작성 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReply = async (e: React.FormEvent, parentId: string) => {
    e.preventDefault();

    if (!user) {
      alert("답글을 작성하려면 로그인이 필요합니다.");
      return;
    }

    if (!replyContent.trim()) {
      alert("답글 내용을 입력해주세요.");
      return;
    }

    setSubmitting(true);

    // 사용자 닉네임이 없으면 이메일에서 추출
    const displayName = user.nickname || user.email?.split('@')[0] || "사용자";

    try {
      const result = await addComment(
        courseId,
        user.uid,
        replyContent,
        displayName,
        user.profileImageUrl,
        parentId
      );

      if (result.success) {
        setReplyContent("");
        setReplyingTo(null);
        await loadComments(); // 댓글 목록 새로고침
      } else {
        alert(result.error || "답글 작성에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error submitting reply:", error);
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
        await loadComments();
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

    if (confirm("정말로 이 댓글을 삭제하시겠습니까?")) {
      try {
        const result = await deleteComment(commentId, user.uid);

        if (result.success) {
          await loadComments();
        } else {
          alert(result.error || "댓글 삭제에 실패했습니다.");
        }
      } catch (error) {
        console.error("Error deleting comment:", error);
        alert("댓글 삭제 중 오류가 발생했습니다.");
      }
    }
  };


  const startEditing = (comment: Comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
    setShowDropdown(null);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditContent("");
  };

  const startReplying = (commentId: string) => {
    setReplyingTo(commentId);
    setReplyContent("");
    setShowDropdown(null);
  };

  const cancelReplying = () => {
    setReplyingTo(null);
    setReplyContent("");
  };

  const formatDate = (date: Date) => {
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
      <div className="mt-8 p-6 bg-[var(--surface)] rounded-lg">
        <div className="animate-pulse">
          <div className="h-6 bg-[var(--accent-color)] rounded w-24 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex space-x-3">
                <div className="w-10 h-10 bg-[var(--accent-color)] rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-[var(--accent-color)] rounded w-32 mb-2"></div>
                  <div className="h-4 bg-[var(--accent-color)] rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 bg-[var(--surface)] rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <MessageCircle className="w-5 h-5 text-[var(--primary-color)]" />
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">
          댓글 ({comments.length})
        </h3>
      </div>

      {/* 댓글 작성 폼 */}
      {user ? (
        <form onSubmit={handleSubmitComment} className="mb-6">
          <div className="flex space-x-3">
            <div className="flex-shrink-0">
              {user.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt={user.nickname || "프로필"}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-[var(--secondary-color)] rounded-full flex items-center justify-center">
                  <span className="text-[var(--primary-color)] font-medium">
                    {(user.nickname || "U")[0].toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="이 코스에 대한 생각을 공유해보세요..."
                className="w-full p-3 border border-[var(--border)] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                rows={3}
                maxLength={500}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-[var(--text-secondary)]">
                  {newComment.length}/500
                </span>
                <button
                  type="submit"
                  disabled={submitting || !newComment.trim()}
                  className="btn-primary inline-flex items-center space-x-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? "작성 중..." : "댓글 작성"}</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-6 p-6 bg-gradient-to-r from-pink-50 to-red-50 border border-pink-200 rounded-lg text-center">
          <div className="mb-3">
            <MessageCircle className="w-8 h-8 text-pink-500 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">댓글 작성하기</h3>
          <p className="text-gray-600 mb-4">
            다른 사용자들과 소통하려면 로그인이 필요합니다.
          </p>
          <a
            href="/auth/login"
            className="inline-flex items-center px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors font-medium"
          >
            로그인하기
          </a>
        </div>
      )}

      {/* 댓글 목록 */}
      {comments.length === 0 ? (
        <div className="text-center py-12">
          <MessageCircle className="w-12 h-12 text-[var(--text-secondary)] mx-auto mb-3 opacity-50" />
          <p className="text-[var(--text-secondary)] mb-2">아직 댓글이 없습니다</p>
          <p className="text-sm text-[var(--text-muted)]">첫 번째 댓글을 작성해보세요!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="border-b border-[var(--border)] pb-4 last:border-b-0">
              <div className="flex space-x-3">
                <div className="flex-shrink-0">
                  {comment.author.profileImageUrl ? (
                    <img
                      src={comment.author.profileImageUrl}
                      alt={comment.author.nickname}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-[var(--secondary-color)] rounded-full flex items-center justify-center">
                      <span className="text-[var(--primary-color)] font-medium">
                        {comment.author.nickname[0].toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-[var(--text-primary)]">
                        {comment.author.nickname}
                      </h4>
                      <span className="text-sm text-[var(--text-secondary)]">
                        {formatDate(comment.createdAt)}
                      </span>
                      {comment.isEdited && (
                        <span className="text-xs text-[var(--text-muted)] bg-[var(--accent-color)] px-2 py-1 rounded">
                          편집됨
                        </span>
                      )}
                    </div>

                    {user && user.uid === comment.authorId && (
                      <div className="relative">
                        <button
                          onClick={() => setShowDropdown(showDropdown === comment.id ? null : comment.id)}
                          className="p-1 hover:bg-[var(--accent-color)] rounded transition-colors"
                        >
                          <MoreVertical className="w-4 h-4 text-[var(--text-secondary)]" />
                        </button>

                        {showDropdown === comment.id && (
                          <div className="absolute right-0 mt-1 w-32 bg-[var(--surface)] border border-[var(--border)] rounded-lg shadow-lg z-10">
                            <button
                              onClick={() => startEditing(comment)}
                              className="w-full px-3 py-2 text-left text-sm hover:bg-[var(--accent-color)] flex items-center space-x-2"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>수정</span>
                            </button>
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              className="w-full px-3 py-2 text-left text-sm hover:bg-[var(--accent-color)] flex items-center space-x-2 text-[var(--error)]"
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
                        className="w-full p-2 border border-[var(--border)] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                        rows={2}
                        maxLength={500}
                      />
                      <div className="flex justify-end space-x-2 mt-2">
                        <button
                          onClick={cancelEditing}
                          className="px-3 py-1 text-sm border border-[var(--border)] rounded hover:bg-[var(--accent-color)] transition-colors"
                        >
                          취소
                        </button>
                        <button
                          onClick={() => handleEditComment(comment.id)}
                          className="px-3 py-1 text-sm bg-[var(--primary-color)] text-white rounded hover:bg-[var(--primary-hover)] transition-colors"
                        >
                          저장
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-1 text-[var(--text-primary)] whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  )}

                  {/* Reply Button Only */}
                  <div className="flex items-center mt-3">
                    {user ? (
                      <button
                        onClick={() => startReplying(comment.id)}
                        className="flex items-center space-x-1 text-sm text-gray-700 hover:text-blue-500 bg-white hover:bg-blue-50 px-3 py-2 rounded-md border transition-colors font-medium"
                      >
                        <Reply className="w-4 h-4" />
                        <span>답글</span>
                        {comment.replyCount && comment.replyCount > 0 && (
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                            {comment.replyCount}
                          </span>
                        )}
                      </button>
                    ) : (
                      <div className="flex items-center space-x-1 text-sm text-gray-400 px-3 py-2">
                        <Reply className="w-4 h-4" />
                        <span>답글 (로그인 필요)</span>
                        {comment.replyCount && comment.replyCount > 0 && (
                          <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-full text-xs">
                            {comment.replyCount}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Reply Form */}
                  {replyingTo === comment.id && user && (
                    <form onSubmit={(e) => handleSubmitReply(e, comment.id)} className="mt-4 ml-8 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                      <div className="flex space-x-3">
                        <div className="flex-shrink-0">
                          {user.profileImageUrl ? (
                            <img
                              src={user.profileImageUrl}
                              alt={user.nickname || "프로필"}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-gray-600 font-medium text-sm">
                                {(user.nickname || user.email?.split('@')[0] || "U")[0].toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="답글을 작성해보세요..."
                            className="w-full p-3 border-2 border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-sm"
                            rows={3}
                            maxLength={500}
                          />
                          <div className="flex justify-between items-center mt-3 p-2 bg-gray-50 rounded-md">
                            <span className="text-xs text-gray-500 font-medium">
                              {replyContent.length}/500
                            </span>
                            <div className="flex space-x-3">
                              <button
                                type="button"
                                onClick={cancelReplying}
                                className="px-4 py-2 text-sm border-2 border-gray-300 text-gray-700 bg-white rounded-md hover:bg-gray-50 hover:border-gray-400 transition-all font-medium shadow-sm"
                              >
                                취소
                              </button>
                              <button
                                type="submit"
                                disabled={submitting || !replyContent.trim()}
                                className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-md border-2 border-blue-500 hover:border-blue-600"
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
                        <div key={reply.id} className="flex space-x-3 p-3 bg-pink-50 rounded-lg border border-pink-200">
                          <div className="flex-shrink-0">
                            {reply.author.profileImageUrl ? (
                              <img
                                src={reply.author.profileImageUrl}
                                alt={reply.author.nickname}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                <span className="text-gray-600 font-medium text-sm">
                                  {reply.author.nickname[0].toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <h5 className="font-medium text-gray-800 text-sm">
                                {reply.author.nickname}
                              </h5>
                              <span className="text-xs text-gray-500">
                                {formatDate(reply.createdAt)}
                              </span>
                              {reply.isEdited && (
                                <span className="text-xs text-gray-500 bg-gray-200 px-1 py-0.5 rounded">
                                  편집됨
                                </span>
                              )}
                            </div>
                            <p className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">
                              {reply.content}
                            </p>
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
  );
}