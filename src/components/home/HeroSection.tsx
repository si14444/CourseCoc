"use client";

import { ArrowRight, Heart, Plus, Sparkles } from "lucide-react";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { getHomeStats, HomeStats } from "@/lib/homeStats";

export function HeroSection() {
  const [stats, setStats] = useState<HomeStats>({
    totalCourses: 0,
    publishedCourses: 0,
    beta: true
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const homeStats = await getHomeStats();
        setStats(homeStats);
      } catch (error) {
        console.error('통계 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[var(--warm-white)] via-[var(--very-light-pink)] to-[var(--light-pink)] py-20 lg:py-32">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-[var(--coral-pink)] opacity-10 blur-xl animate-pulse" />
        <div
          className="absolute top-32 right-16 w-16 h-16 rounded-full bg-[var(--light-pink)] opacity-20 blur-lg animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-20 left-1/4 w-12 h-12 rounded-full bg-[var(--coral-pink)] opacity-15 blur-md animate-pulse"
          style={{ animationDelay: "4s" }}
        />
        <div
          className="absolute top-1/2 right-1/3 w-8 h-8 rounded-full bg-[var(--light-pink)] opacity-25 blur-sm animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Floating hearts */}
      <div className="absolute inset-0 pointer-events-none">
        <Heart
          className="absolute top-16 left-1/4 w-6 h-6 text-[var(--coral-pink)] opacity-20 animate-pulse"
          style={{ animationDelay: "0s" }}
        />
        <Heart
          className="absolute top-1/3 right-1/4 w-4 h-4 text-[var(--light-pink)] opacity-30 animate-pulse"
          style={{ animationDelay: "3s" }}
        />
        <Sparkles
          className="absolute bottom-1/3 left-1/3 w-5 h-5 text-[var(--coral-pink)] opacity-25 animate-pulse"
          style={{ animationDelay: "1.5s" }}
        />
      </div>

      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Beta Badge */}
        <div className="mb-6">
          <Badge
            variant="secondary"
            className="bg-[var(--light-pink)] text-[var(--coral-pink)] border-[var(--coral-pink)] px-4 py-2"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            베타 버전
          </Badge>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-[var(--text-primary)] mb-6 leading-tight">
          완벽한
          <span className="block text-[var(--coral-pink)] relative">
            데이트 코스 만들기
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-[var(--coral-pink)] to-transparent opacity-60"></div>
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-4xl mx-auto mb-8 leading-relaxed">
          아름다운 이야기를 담은 로맨틱한 경험을 디자인해보세요. 모든 순간,
          모든 발걸음이 사랑으로 만들어집니다. 평범한 데이트를
          특별한 추억으로 바꿔보세요.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button
            size="lg"
            className="bg-gradient-to-r from-[var(--very-light-pink)] via-[var(--light-pink)] to-[var(--coral-pink)] text-white hover:shadow-xl hover:shadow-[var(--pink-shadow)] transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 px-8 py-4"
          >
            <Plus className="w-5 h-5 mr-2" />
            코스 만들기 시작
          </Button>
          <Link href="/community">
            <Button
              variant="outline"
              size="lg"
              className="border-[var(--coral-pink)] text-[var(--coral-pink)] hover:bg-[var(--coral-pink)] hover:text-white transition-all duration-300 px-8 py-4"
            >
              코스 둘러보기
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Real Stats or Launch Message */}
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="text-center">
              <div className="text-lg text-[var(--text-secondary)]">
                통계 로딩 중...
              </div>
            </div>
          ) : stats.publishedCourses > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--coral-pink)] mb-2">
                  {stats.publishedCourses}
                </div>
                <div className="text-sm text-[var(--text-secondary)]">
                  발행된 데이트 코스
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--coral-pink)] mb-2">
                  베타
                </div>
                <div className="text-sm text-[var(--text-secondary)]">
                  새로운 시작
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center bg-white/50 backdrop-blur-sm rounded-2xl p-8 border border-[var(--coral-pink)]/20">
              <div className="text-2xl font-bold text-[var(--coral-pink)] mb-4">
                🎉 곧 출시됩니다!
              </div>
              <p className="text-[var(--text-secondary)] mb-4">
                우리와 함께 첫 번째 로맨틱한 데이트 코스를 만들어보세요.<br />
                당신의 특별한 이야기가 이곳에서 시작됩니다.
              </p>
              <div className="text-sm text-[var(--text-tertiary)]">
                베타 버전으로 무료 체험 중
              </div>
            </div>
          )}</div>
      </div>
    </section>
  );
}
