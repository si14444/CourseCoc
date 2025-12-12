"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, FileText } from "lucide-react";
import { Header } from "../../components/Header";
import { PostCard } from "../../components/PostCard";
import { getPosts, Post } from "../../lib/firebasePosts";
import { useAuth } from "../../contexts/AuthContext";
import { AdSpot } from "../../components/AdSpot";
import { CommunitySearch } from "../../components/CommunitySearch";
import { DocumentSnapshot } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

  // Pagination State
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | undefined>(
    undefined
  );
  const [pageHistory, setPageHistory] = useState<DocumentSnapshot[]>([]); // To track start points for "Previous"
  const [isLastPage, setIsLastPage] = useState(false);
  const POSTS_PER_PAGE = 10; // 페이지당 게시글 수

  const fetchPosts = async (
    direction: "next" | "prev" | "initial" = "initial"
  ) => {
    try {
      setLoading(true);
      setError(null);

      let cursor: DocumentSnapshot | undefined;

      if (direction === "next" && lastDoc) {
        cursor = lastDoc;
      } else if (direction === "prev" && pageHistory.length > 0) {
        // "Previous" logic:
        // Current history: [docA, docB, docC]
        // If we are on page 3 (docC was start), we need docB to be valid?
        // Actually, basic firestore paging usually uses 'startAfter'.
        // To go back, we essentially re-fetch from the previous start point.
        // Let's simplify: manage a stack of "startAfter" docs.
        // Stack: [undefined (page1), docA (page2), docB (page3)]
        // If on page 3 and want prev (page 2), pop docB, use docA.
        const newHistory = [...pageHistory];
        newHistory.pop(); // Remove current page start
        cursor = newHistory[newHistory.length - 1]; // items for PREV page start
        setPageHistory(newHistory);
      }

      if (direction === "next" && lastDoc) {
        setPageHistory((prev) => [...prev, lastDoc]);
      } else if (direction === "initial") {
        setPageHistory([]);
      }

      const { posts: fetchedPosts, lastDoc: newLastDoc } = await getPosts(
        POSTS_PER_PAGE,
        cursor
      );

      // 실제 데이터가 없으면 더미 데이터 사용 (초기 로드 시에만)
      if (direction === "initial" && fetchedPosts.length === 0) {
        setPosts(DUMMY_POSTS);
        setIsLastPage(true);
      } else {
        setPosts(fetchedPosts);
        setLastDoc(newLastDoc);
        // If we got fewer posts than requested, it's the last page
        setIsLastPage(fetchedPosts.length < POSTS_PER_PAGE);
      }
    } catch (err: unknown) {
      console.error("게시글 로딩 실패:", err);
      if (direction === "initial") {
        setPosts(DUMMY_POSTS);
      }
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts("initial");
  }, []);

  const handleNextPage = () => fetchPosts("next");
  const handlePrevPage = () => fetchPosts("prev"); // Logic needs refactoring slightly for 'prev' to update history inside fetchPosts strictly or pass cursor directly.

  // Re-implementing 'prev' strictly:
  // We need to pass the *target* cursor for the previous page.
  // Ideally, fetchPosts shouldn't mutate history *before* fetching, but let's stick to a simpler flow:
  // We'll manage history outside for clarity.

  const loadPage = async (targetCursor: DocumentSnapshot | undefined) => {
    try {
      setLoading(true);
      const { posts: fetchedPosts, lastDoc: newLastDoc } = await getPosts(
        POSTS_PER_PAGE,
        targetCursor
      );
      setPosts(fetchedPosts);
      setLastDoc(newLastDoc);
      setIsLastPage(fetchedPosts.length < POSTS_PER_PAGE);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const onNext = () => {
    if (!lastDoc) return;
    setPageHistory([...pageHistory, lastDoc]); // Save current end as next start
    loadPage(lastDoc);
  };

  const onPrev = () => {
    if (pageHistory.length === 0) return;
    const newHistory = [...pageHistory];
    newHistory.pop(); // Remove current page's start cursor
    const prevCursor =
      newHistory.length > 0 ? newHistory[newHistory.length - 1] : undefined;
    setPageHistory(newHistory);
    loadPage(prevCursor);
  };

  return (
    <div
      className="min-h-screen bg-[var(--background)]"
      suppressHydrationWarning
    >
      <Header />

      <main className="pt-20 pb-8">
        <div className="max-w-[1600px] mx-auto px-6">
          <div className="flex gap-8 justify-center mt-6">
            {/* Left Ad Spot - Added margin-top */}
            <div className="mt-20">
              <AdSpot position="left" />
            </div>

            {/* Main Content */}
            <div className="flex-1 max-w-4xl">
              {/* Search - Moved inside for alignment */}
              <div className="mb-6">
                <CommunitySearch />
              </div>

              {/* Simple Header */}
              <div className="flex items-center justify-end mb-6">
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

              {/* Pagination Controls */}
              {!loading && !error && posts.length > 0 && (
                <div className="flex justify-center items-center space-x-4 mt-8">
                  <Button
                    variant="outline"
                    onClick={onPrev}
                    disabled={pageHistory.length === 0}
                    className="flex items-center"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    이전
                  </Button>
                  <span className="text-sm text-gray-500">
                    페이지 {pageHistory.length + 1}
                  </span>
                  <Button
                    variant="outline"
                    onClick={onNext}
                    disabled={isLastPage}
                    className="flex items-center"
                  >
                    다음
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              )}
            </div>

            {/* Right Ad Spot - Added margin-top */}
            <div className="mt-20">
              <AdSpot position="right" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
