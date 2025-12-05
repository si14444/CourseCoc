"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, MessageCircle, Users } from "lucide-react";
import { Header } from "../../components/Header";
import { PostCard } from "../../components/PostCard";
import { getPosts, Post } from "../../lib/firebasePosts";
import { useAuth } from "../../contexts/AuthContext";
import { CONTAINER_CLASSES } from "@/utils/layouts";

export default function Community() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const { posts: fetchedPosts } = await getPosts();
        setPosts(fetchedPosts);
      } catch (err: unknown) {
        console.error("게시글 로딩 실패:", err);
        setError(
          err instanceof Error
            ? err.message
            : "게시글을 불러오는 중 오류가 발생했습니다."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-pink-50 to-white"
      suppressHydrationWarning
    >
      <Header />

      <main className="pt-20 pb-8">
        <div className={CONTAINER_CLASSES}>
          {/* Page Header - Minimal */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-gray-900">커뮤니티</h1>
            {user ? (
              <Link href="/community/post">
                <button className="flex items-center space-x-2 px-4 py-2 bg-pink-500 text-white rounded-lg font-medium hover:bg-pink-600 transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>글쓰기</span>
                </button>
              </Link>
            ) : (
              <Link href="/auth/login">
                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>글쓰기</span>
                </button>
              </Link>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
              <p className="text-gray-600">게시글을 불러오는 중...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-2xl mx-auto">
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  오류가 발생했습니다
                </h3>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          )}

          {/* Posts List */}
          {!loading && !error && (
            <>
              {posts.length === 0 ? (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-pink-100 rounded-full mb-4">
                    <MessageCircle className="w-10 h-10 text-pink-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    아직 게시글이 없습니다
                  </h3>
                  <p className="text-gray-600 mb-6">
                    첫 번째 게시글을 작성해보세요!
                  </p>
                  {user && (
                    <Link href="/community/write">
                      <button className="inline-flex items-center space-x-2 px-6 py-3 bg-pink-500 text-white rounded-xl font-medium hover:bg-pink-600 transition-colors">
                        <Plus className="w-5 h-5" />
                        <span>글쓰기</span>
                      </button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
