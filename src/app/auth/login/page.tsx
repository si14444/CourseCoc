"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "../../../components/Header";
import { Eye, EyeOff, Mail, Lock, Heart } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // 입력 시 에러 제거
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) {
      newErrors.email = "이메일을 입력해주세요";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다";
    }

    if (!formData.password) {
      newErrors.password = "비밀번호를 입력해주세요";
    } else if (formData.password.length < 6) {
      newErrors.password = "비밀번호는 6자 이상이어야 합니다";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // 여기에 실제 로그인 API 호출 로직 추가
      await new Promise(resolve => setTimeout(resolve, 1000)); // 임시 지연

      console.log("로그인 시도:", formData);
      // 성공 시 메인 페이지로 리다이렉트
      window.location.href = "/";
    } catch (error) {
      console.error("로그인 오류:", error);
      setErrors({ general: "로그인에 실패했습니다. 다시 시도해주세요." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--very-light-pink)] to-[var(--light-pink)]">
      <Header />

      <div className="pt-16 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md">
          {/* 로고 및 제목 */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--coral-pink)] rounded-full mb-4 shadow-romantic">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
              다시 만나서 반가워요!
            </h1>
            <p className="text-[var(--text-secondary)]">
              로맨틱한 데이트 코스를 탐험해보세요
            </p>
          </div>

          <Card className="shadow-romantic">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 전체 에러 메시지 */}
                {errors.general && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {errors.general}
                  </div>
                )}

                {/* 이메일 입력 */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    이메일
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="example@email.com"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[var(--coral-pink)] focus:border-transparent outline-none transition-colors ${
                        errors.email ? 'border-red-300 bg-red-50' : 'border-[var(--color-border)] bg-[var(--very-light-pink)]'
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* 비밀번호 입력 */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    비밀번호
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="비밀번호를 입력하세요"
                      className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-[var(--coral-pink)] focus:border-transparent outline-none transition-colors ${
                        errors.password ? 'border-red-300 bg-red-50' : 'border-[var(--color-border)] bg-[var(--very-light-pink)]'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--coral-pink)] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>

                {/* 비밀번호 찾기 링크 */}
                <div className="flex justify-end">
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-[var(--coral-pink)] hover:underline"
                  >
                    비밀번호를 잊으셨나요?
                  </Link>
                </div>

                {/* 로그인 버튼 */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary py-3 text-base font-medium"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      로그인 중...
                    </div>
                  ) : (
                    "로그인"
                  )}
                </Button>
              </form>

              {/* 구분선 */}
              <div className="my-6 flex items-center">
                <div className="flex-1 border-t border-[var(--color-border)]"></div>
                <span className="px-4 text-sm text-[var(--text-secondary)]">또는</span>
                <div className="flex-1 border-t border-[var(--color-border)]"></div>
              </div>

              {/* 소셜 로그인 버튼들 */}
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center px-4 py-3 border border-[var(--color-border)] rounded-lg hover:bg-[var(--very-light-pink)] transition-colors">
                  <div className="w-5 h-5 mr-3 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold">K</span>
                  </div>
                  카카오로 로그인
                </button>

                <button className="w-full flex items-center justify-center px-4 py-3 border border-[var(--color-border)] rounded-lg hover:bg-[var(--very-light-pink)] transition-colors">
                  <div className="w-5 h-5 mr-3 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">N</span>
                  </div>
                  네이버로 로그인
                </button>

                <button className="w-full flex items-center justify-center px-4 py-3 border border-[var(--color-border)] rounded-lg hover:bg-[var(--very-light-pink)] transition-colors">
                  <div className="w-5 h-5 mr-3 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">G</span>
                  </div>
                  Google로 로그인
                </button>
              </div>

              {/* 회원가입 링크 */}
              <div className="mt-8 text-center">
                <p className="text-[var(--text-secondary)]">
                  아직 계정이 없으신가요?{" "}
                  <Link
                    href="/auth/signup"
                    className="text-[var(--coral-pink)] font-medium hover:underline"
                  >
                    회원가입하기
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}