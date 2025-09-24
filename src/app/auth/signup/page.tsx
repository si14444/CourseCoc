"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "../../../components/Header";
import { Eye, EyeOff, Mail, Lock, User, Heart, Calendar } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    nickname: "",
    birthYear: "",
    gender: "",
    agreeTerms: false,
    agreePrivacy: false,
    agreeMarketing: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const currentYear = new Date().getFullYear();
  const birthYears = Array.from({ length: 80 }, (_, i) => currentYear - i - 15);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // 입력 시 에러 제거
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // 이메일 검증
    if (!formData.email) {
      newErrors.email = "이메일을 입력해주세요";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다";
    }

    // 비밀번호 검증
    if (!formData.password) {
      newErrors.password = "비밀번호를 입력해주세요";
    } else if (formData.password.length < 8) {
      newErrors.password = "비밀번호는 8자 이상이어야 합니다";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "영문 대소문자, 숫자를 포함해야 합니다";
    }

    // 비밀번호 확인
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "비밀번호 확인을 입력해주세요";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다";
    }

    // 닉네임 검증
    if (!formData.nickname) {
      newErrors.nickname = "닉네임을 입력해주세요";
    } else if (formData.nickname.length < 2) {
      newErrors.nickname = "닉네임은 2자 이상이어야 합니다";
    } else if (formData.nickname.length > 10) {
      newErrors.nickname = "닉네임은 10자 이하여야 합니다";
    }

    // 출생연도 검증
    if (!formData.birthYear) {
      newErrors.birthYear = "출생연도를 선택해주세요";
    }

    // 성별 검증
    if (!formData.gender) {
      newErrors.gender = "성별을 선택해주세요";
    }

    // 필수 약관 동의 검증
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "이용약관에 동의해주세요";
    }

    if (!formData.agreePrivacy) {
      newErrors.agreePrivacy = "개인정보처리방침에 동의해주세요";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // 여기에 실제 회원가입 API 호출 로직 추가
      await new Promise(resolve => setTimeout(resolve, 1500)); // 임시 지연

      console.log("회원가입 시도:", formData);
      // 성공 시 로그인 페이지로 리다이렉트
      window.location.href = "/auth/login?signup=success";
    } catch (error) {
      console.error("회원가입 오류:", error);
      setErrors({ general: "회원가입에 실패했습니다. 다시 시도해주세요." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAllAgreements = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      agreeTerms: checked,
      agreePrivacy: checked,
      agreeMarketing: checked
    }));
  };

  const allRequiredAgreed = formData.agreeTerms && formData.agreePrivacy;
  const allAgreed = allRequiredAgreed && formData.agreeMarketing;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--very-light-pink)] to-[var(--light-pink)]">
      <Header />

      <div className="pt-16 py-12 px-4">
        <div className="max-w-md mx-auto">
          {/* 로고 및 제목 */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--coral-pink)] rounded-full mb-4 shadow-romantic">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
              환영합니다!
            </h1>
            <p className="text-[var(--text-secondary)]">
              로맨틱한 데이트 코스의 세계로 초대합니다
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
                    이메일 *
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
                    비밀번호 *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="영문 대소문자, 숫자 포함 8자 이상"
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

                {/* 비밀번호 확인 */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    비밀번호 확인 *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="비밀번호를 다시 입력하세요"
                      className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-[var(--coral-pink)] focus:border-transparent outline-none transition-colors ${
                        errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-[var(--color-border)] bg-[var(--very-light-pink)]'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--coral-pink)] transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* 닉네임 입력 */}
                <div>
                  <label htmlFor="nickname" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    닉네임 *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                    <input
                      type="text"
                      id="nickname"
                      name="nickname"
                      value={formData.nickname}
                      onChange={handleInputChange}
                      placeholder="2-10자 이내로 입력하세요"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[var(--coral-pink)] focus:border-transparent outline-none transition-colors ${
                        errors.nickname ? 'border-red-300 bg-red-50' : 'border-[var(--color-border)] bg-[var(--very-light-pink)]'
                      }`}
                    />
                  </div>
                  {errors.nickname && (
                    <p className="mt-1 text-sm text-red-600">{errors.nickname}</p>
                  )}
                </div>

                {/* 출생연도와 성별 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="birthYear" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      출생연도 *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                      <select
                        id="birthYear"
                        name="birthYear"
                        value={formData.birthYear}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[var(--coral-pink)] focus:border-transparent outline-none transition-colors appearance-none ${
                          errors.birthYear ? 'border-red-300 bg-red-50' : 'border-[var(--color-border)] bg-[var(--very-light-pink)]'
                        }`}
                      >
                        <option value="">선택하세요</option>
                        {birthYears.map(year => (
                          <option key={year} value={year}>{year}년</option>
                        ))}
                      </select>
                    </div>
                    {errors.birthYear && (
                      <p className="mt-1 text-sm text-red-600">{errors.birthYear}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      성별 *
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[var(--coral-pink)] focus:border-transparent outline-none transition-colors appearance-none ${
                        errors.gender ? 'border-red-300 bg-red-50' : 'border-[var(--color-border)] bg-[var(--very-light-pink)]'
                      }`}
                    >
                      <option value="">선택하세요</option>
                      <option value="male">남성</option>
                      <option value="female">여성</option>
                      <option value="other">기타</option>
                    </select>
                    {errors.gender && (
                      <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
                    )}
                  </div>
                </div>

                {/* 약관 동의 */}
                <div className="space-y-4">
                  <div className="border-t border-[var(--color-border)] pt-4">
                    <div className="flex items-center mb-3">
                      <input
                        type="checkbox"
                        id="agreeAll"
                        checked={allAgreed}
                        onChange={(e) => handleSelectAllAgreements(e.target.checked)}
                        className="w-4 h-4 text-[var(--coral-pink)] bg-[var(--very-light-pink)] border-[var(--color-border)] rounded focus:ring-[var(--coral-pink)]"
                      />
                      <label htmlFor="agreeAll" className="ml-2 text-sm font-medium text-[var(--text-primary)]">
                        전체 동의
                      </label>
                    </div>

                    <div className="space-y-2 pl-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="agreeTerms"
                            name="agreeTerms"
                            checked={formData.agreeTerms}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-[var(--coral-pink)] bg-[var(--very-light-pink)] border-[var(--color-border)] rounded focus:ring-[var(--coral-pink)]"
                          />
                          <label htmlFor="agreeTerms" className="ml-2 text-sm text-[var(--text-secondary)]">
                            이용약관 동의 (필수)
                          </label>
                        </div>
                        <Link href="/terms" className="text-xs text-[var(--coral-pink)] hover:underline">
                          보기
                        </Link>
                      </div>
                      {errors.agreeTerms && (
                        <p className="text-sm text-red-600">{errors.agreeTerms}</p>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="agreePrivacy"
                            name="agreePrivacy"
                            checked={formData.agreePrivacy}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-[var(--coral-pink)] bg-[var(--very-light-pink)] border-[var(--color-border)] rounded focus:ring-[var(--coral-pink)]"
                          />
                          <label htmlFor="agreePrivacy" className="ml-2 text-sm text-[var(--text-secondary)]">
                            개인정보처리방침 동의 (필수)
                          </label>
                        </div>
                        <Link href="/privacy" className="text-xs text-[var(--coral-pink)] hover:underline">
                          보기
                        </Link>
                      </div>
                      {errors.agreePrivacy && (
                        <p className="text-sm text-red-600">{errors.agreePrivacy}</p>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="agreeMarketing"
                            name="agreeMarketing"
                            checked={formData.agreeMarketing}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-[var(--coral-pink)] bg-[var(--very-light-pink)] border-[var(--color-border)] rounded focus:ring-[var(--coral-pink)]"
                          />
                          <label htmlFor="agreeMarketing" className="ml-2 text-sm text-[var(--text-secondary)]">
                            마케팅 정보 수신 동의 (선택)
                          </label>
                        </div>
                        <Link href="/marketing" className="text-xs text-[var(--coral-pink)] hover:underline">
                          보기
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 회원가입 버튼 */}
                <Button
                  type="submit"
                  disabled={isLoading || !allRequiredAgreed}
                  className="w-full btn-primary py-3 text-base font-medium"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      회원가입 중...
                    </div>
                  ) : (
                    "회원가입"
                  )}
                </Button>
              </form>

              {/* 로그인 링크 */}
              <div className="mt-8 text-center">
                <p className="text-[var(--text-secondary)]">
                  이미 계정이 있으신가요?{" "}
                  <Link
                    href="/auth/login"
                    className="text-[var(--coral-pink)] font-medium hover:underline"
                  >
                    로그인하기
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