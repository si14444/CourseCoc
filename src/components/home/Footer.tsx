import { Heart } from "lucide-react";
import { Badge } from "../ui/badge";

export function Footer() {
  return (
    <footer className="bg-[var(--text-primary)] text-white py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="w-8 h-8 text-[var(--coral-pink)] fill-current" />
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold">CourseCoc</span>
                <Badge
                  variant="secondary"
                  className="bg-[var(--coral-pink)] text-white border-[var(--coral-pink)] text-xs"
                >
                  베타
                </Badge>
              </div>
            </div>
            <p className="text-white/70 mb-6 leading-relaxed max-w-md">
              완벽한 데이트 코스를 만들고 평범한 순간을 특별한 추억으로 바꿔보세요.
              모든 사랑 이야기는 아름다운 여정을 가질 자격이 있습니다.
            </p>
            <div className="flex items-center space-x-4 text-sm text-white/60">
              <span>전 세계 커플을 위해 ❤️로 만들었습니다</span>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-white mb-4">제품</h3>
            <ul className="space-y-3 text-white/70">
              <li>
                <a
                  href="#"
                  className="hover:text-[var(--coral-pink)] transition-colors"
                >
                  기능
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-[var(--coral-pink)] transition-colors"
                >
                  가격
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-[var(--coral-pink)] transition-colors"
                >
                  템플릿
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-[var(--coral-pink)] transition-colors"
                >
                  연동
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-white mb-4">회사</h3>
            <ul className="space-y-3 text-white/70">
              <li>
                <a
                  href="#"
                  className="hover:text-[var(--coral-pink)] transition-colors"
                >
                  소개
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-[var(--coral-pink)] transition-colors"
                >
                  블로그
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-[var(--coral-pink)] transition-colors"
                >
                  채용
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-[var(--coral-pink)] transition-colors"
                >
                  문의
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-white/60 text-sm mb-4 md:mb-0">
            © 2024 CourseCoc. All rights reserved.
          </div>
          <div className="flex space-x-6 text-sm text-white/60">
            <a
              href="#"
              className="hover:text-[var(--coral-pink)] transition-colors"
            >
              개인정보처리방침
            </a>
            <a
              href="#"
              className="hover:text-[var(--coral-pink)] transition-colors"
            >
              이용약관
            </a>
            <a
              href="#"
              className="hover:text-[var(--coral-pink)] transition-colors"
            >
              쿠키 정책
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
