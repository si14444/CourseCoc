"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { Header } from "../../../components/Header";
import { useAuth } from "../../../contexts/AuthContext";
import { addPost } from "../../../lib/firebasePosts";
import { CONTAINER_CLASSES } from "@/utils/layouts";

export default function WritePost() {
  const router = useRouter();
  const { user, userProfile } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (!content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const displayName =
        userProfile?.nickname ||
        user.displayName ||
        user.email?.split("@")[0] ||
        "사용자";

      const result = await addPost(
        user.uid,
        title,
        content,
        displayName,
        userProfile?.profileImageUrl
      );

      if (result.success && result.data) {
        router.push(`/community/${result.data.id}`);
      } else {
        alert(result.error || "게시글 작성에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("게시글 작성 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 로그인하지 않은 사용자
  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-20 pb-8">
          <div className={CONTAINER_CLASSES}>
            <div className="text-center py-16">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                로그인이 필요합니다
              </h3>
              <p className="text-gray-600 mb-6">
                게시글을 작성하려면 먼저 로그인해주세요.
              </p>
              <Link
                href="/auth/login"
                className="inline-flex items-center px-6 py-3 bg-pink-500 text-white rounded-xl font-medium hover:bg-pink-600 transition-colors"
              >
                로그인하기
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

          {/* Write Form */}
          <div className="bg-white rounded-2xl shadow-lg border border-pink-100 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              새 게시글 작성
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title Input */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  제목
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="제목을 입력하세요"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
                  maxLength={100}
                />
                <span className="text-xs text-gray-500 mt-1 block text-right">
                  {title.length}/100
                </span>
              </div>

              {/* Content Input */}
              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  내용
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="데이트 코스에 대한 이야기, 질문, 후기 등을 자유롭게 작성해주세요."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all resize-none"
                  rows={12}
                  maxLength={5000}
                />
                <span className="text-xs text-gray-500 mt-1 block text-right">
                  {content.length}/5000
                </span>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-3">
                <Link
                  href="/community"
                  className="px-6 py-3 text-gray-600 bg-gray-100 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  취소
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting || !title.trim() || !content.trim()}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl hover:from-pink-600 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                  <span>{isSubmitting ? "작성 중..." : "게시하기"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
