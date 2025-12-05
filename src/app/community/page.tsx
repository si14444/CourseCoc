"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, MessageCircle, FileText } from "lucide-react";
import { Header } from "../../components/Header";
import { PostCard } from "../../components/PostCard";
import { getPosts, Post } from "../../lib/firebasePosts";
import { useAuth } from "../../contexts/AuthContext";
import { CONTAINER_CLASSES } from "@/utils/layouts";

// 더미 데이터 (테스트용)
const DUMMY_POSTS: Post[] = [
  {
    id: "dummy-1",
    authorId: "dummy-user-1",
    author: { nickname: "로맨틱커플" },
    title: "첫 데이트 코스 추천해주세요! 🌸",
    content:
      "다음 주에 여자친구랑 첫 데이트를 하는데요, 서울에서 좋은 코스 있을까요? 카페랑 맛집 위주로 추천해주시면 감사하겠습니다. 분위기 좋은 곳이면 더 좋겠어요!",
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30분 전
    likes: 15,
    views: 128,
    commentCount: 8,
  },
  {
    id: "dummy-2",
    authorId: "dummy-user-2",
    author: { nickname: "힐링여행" },
    title: "한강 야경 데이트 후기 ✨",
    content:
      "어제 여의도 한강공원에서 야경 보고 왔는데 진짜 너무 좋았어요! 치킨 시켜서 먹으면서 불꽃놀이도 하고... 강추합니다!",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2시간 전
    likes: 42,
    views: 256,
    commentCount: 12,
  },
  {
    id: "dummy-3",
    authorId: "dummy-user-3",
    author: { nickname: "커피러버" },
    title: "성수동 카페 투어 코스 공유합니다 ☕",
    content:
      "성수동 카페 투어 다녀왔어요! 오늘 갔던 곳들 정리해봅니다.\n\n1. 어니언 - 빵이 맛있어요\n2. 센터커피 - 분위기 최고\n3. 메쉬커피 - 커피 퀄리티 좋음\n\n사진은 코스에 올려놨어요!",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5시간 전
    likes: 28,
    views: 189,
    commentCount: 6,
  },
];

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
        // 실제 데이터가 없으면 더미 데이터 사용
        setPosts(fetchedPosts.length > 0 ? fetchedPosts : DUMMY_POSTS);
      } catch (err: unknown) {
        console.error("게시글 로딩 실패:", err);
        // 에러 시에도 더미 데이터 표시
        setPosts(DUMMY_POSTS);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div
      className="min-h-screen bg-[var(--background)]"
      suppressHydrationWarning
    >
      <Header />

      <main className="pt-20 pb-8">
        <div className={CONTAINER_CLASSES}>
          {/* Simple Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">
              커뮤니티
            </h1>
            {user ? (
              <Link href="/community/post">
                <button className="flex items-center space-x-2 px-4 py-2 bg-[var(--coral-pink)] text-white rounded-lg font-medium hover:shadow-lg hover:shadow-[var(--pink-shadow)] transition-all">
                  <Plus className="w-4 h-4" />
                  <span>글쓰기</span>
                </button>
              </Link>
            ) : (
              <Link href="/auth/login">
                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-[var(--text-secondary)] rounded-lg font-medium hover:bg-gray-200 transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>글쓰기</span>
                </button>
              </Link>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--coral-pink)] mx-auto mb-4"></div>
              <p className="text-[var(--text-secondary)]">
                게시글을 불러오는 중...
              </p>
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
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-[var(--very-light-pink)] rounded-full mb-4">
                    <FileText className="w-10 h-10 text-[var(--coral-pink)]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                    아직 게시글이 없습니다
                  </h3>
                  <p className="text-[var(--text-secondary)] mb-6">
                    첫 번째 게시글을 작성해보세요!
                  </p>
                  {user && (
                    <Link href="/community/post">
                      <button className="inline-flex items-center space-x-2 px-6 py-3 bg-[var(--coral-pink)] text-white rounded-xl font-medium hover:shadow-lg hover:shadow-[var(--pink-shadow)] transition-all">
                        <Plus className="w-5 h-5" />
                        <span>글쓰기</span>
                      </button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="space-y-4 max-w-4xl mx-auto">
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
