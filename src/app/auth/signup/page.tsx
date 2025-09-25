"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Calendar, Eye, EyeOff, Heart, Lock, Mail, User } from "lucide-react";
import { useState } from "react";

export function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    nickname: "",
    birthYear: "",
    gender: "",
    agreeTerms: false,
    agreePrivacy: false,
    agreeMarketing: false,
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!formData.agreeTerms || !formData.agreePrivacy) {
      alert("필수 약관에 동의해주세요.");
      return;
    }

    // Handle signup logic here
    console.log("Signup attempt:", formData);
  };

  const handleSocialSignup = (provider: "google" | "kakao") => {
    // Handle social signup logic here
    console.log(`${provider} signup attempt`);
  };

  const currentYear = new Date().getFullYear();
  const birthYears = Array.from({ length: 60 }, (_, i) => currentYear - 15 - i);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--very-light-pink)] to-[var(--warm-white)] flex items-center justify-center p-4">
      {/* Background Hearts */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-6 h-6 text-[var(--coral-pink)] opacity-10 animate-pulse">
          ❤️
        </div>
        <div
          className="absolute top-3/4 right-1/3 w-4 h-4 text-[var(--light-pink)] opacity-15 animate-pulse"
          style={{ animationDelay: "2s" }}
        >
          💖
        </div>
        <div
          className="absolute top-1/2 right-1/4 w-3 h-3 text-[var(--coral-pink)] opacity-8 animate-pulse"
          style={{ animationDelay: "4s" }}
        >
          💕
        </div>
        <div
          className="absolute top-1/3 right-1/2 w-5 h-5 text-[var(--light-pink)] opacity-12 animate-pulse"
          style={{ animationDelay: "1s" }}
        >
          💗
        </div>
        <div
          className="absolute top-1/6 left-1/2 w-4 h-4 text-[var(--coral-pink)] opacity-9 animate-pulse"
          style={{ animationDelay: "3s" }}
        >
          💞
        </div>
      </div>

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Logo and Brand */}
        <div className="text-center space-y-4">
          <div className="flex justify-center items-center space-x-2 mb-2">
            <Heart className="w-8 h-8 text-[var(--coral-pink)] fill-current" />
            <h1 className="text-3xl text-[var(--coral-pink)] tracking-tight">
              CourseCoc
            </h1>
          </div>
          <p className="text-[var(--text-secondary)]">
            새로운 사랑의 시작, 함께 해요
          </p>
        </div>

        {/* Signup Form */}
        <Card className="backdrop-blur-sm bg-white/80 border-[var(--border)] shadow-lg shadow-[var(--pink-shadow)] hover:shadow-xl hover:shadow-[var(--pink-shadow-hover)] transition-all duration-300 ease-in-out">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-[var(--text-primary)]">
              회원가입
            </CardTitle>
            <CardDescription className="text-center text-[var(--text-secondary)]">
              특별한 데이트 코스를 만들고 공유하세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email">이메일 *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="이메일을 입력하세요"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="pl-10 bg-[var(--input-background)] border-[var(--border)] focus:border-[var(--coral-pink)] focus:ring-[var(--coral-pink)] transition-all duration-200"
                    required
                  />
                </div>
              </div>

              {/* Nickname Input */}
              <div className="space-y-2">
                <Label htmlFor="nickname">닉네임 *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                  <Input
                    id="nickname"
                    type="text"
                    placeholder="사용할 닉네임을 입력하세요"
                    value={formData.nickname}
                    onChange={(e) =>
                      handleInputChange("nickname", e.target.value)
                    }
                    className="pl-10 bg-[var(--input-background)] border-[var(--border)] focus:border-[var(--coral-pink)] focus:ring-[var(--coral-pink)] transition-all duration-200"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password">비밀번호 *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="비밀번호를 입력하세요"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className="pl-10 pr-10 bg-[var(--input-background)] border-[var(--border)] focus:border-[var(--coral-pink)] focus:ring-[var(--coral-pink)] transition-all duration-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--coral-pink)] transition-colors duration-200"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">비밀번호 확인 *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="비밀번호를 다시 입력하세요"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    className="pl-10 pr-10 bg-[var(--input-background)] border-[var(--border)] focus:border-[var(--coral-pink)] focus:ring-[var(--coral-pink)] transition-all duration-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--coral-pink)] transition-colors duration-200"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Birth Year and Gender */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="birthYear">출생년도</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] z-10" />
                    <Select
                      value={formData.birthYear}
                      onValueChange={(value) =>
                        handleInputChange("birthYear", value)
                      }
                    >
                      <SelectTrigger className="pl-10 bg-[var(--input-background)] border-[var(--border)] focus:border-[var(--coral-pink)] focus:ring-[var(--coral-pink)]">
                        <SelectValue placeholder="연도 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {birthYears.map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}년
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>성별</Label>
                  <RadioGroup
                    value={formData.gender}
                    onValueChange={(value) =>
                      handleInputChange("gender", value)
                    }
                    className="flex space-x-4 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="male"
                        id="male"
                        className="border-[var(--coral-pink)] text-[var(--coral-pink)]"
                      />
                      <Label htmlFor="male" className="text-sm">
                        남성
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="female"
                        id="female"
                        className="border-[var(--coral-pink)] text-[var(--coral-pink)]"
                      />
                      <Label htmlFor="female" className="text-sm">
                        여성
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="agreeTerms"
                    checked={formData.agreeTerms}
                    onCheckedChange={(checked) =>
                      handleInputChange("agreeTerms", checked)
                    }
                    className="border-[var(--coral-pink)] data-[state=checked]:bg-[var(--coral-pink)] data-[state=checked]:text-white mt-1"
                  />
                  <Label htmlFor="agreeTerms" className="text-sm leading-5">
                    <span className="text-[var(--coral-pink)]">[필수]</span>{" "}
                    이용약관에 동의합니다
                  </Label>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="agreePrivacy"
                    checked={formData.agreePrivacy}
                    onCheckedChange={(checked) =>
                      handleInputChange("agreePrivacy", checked)
                    }
                    className="border-[var(--coral-pink)] data-[state=checked]:bg-[var(--coral-pink)] data-[state=checked]:text-white mt-1"
                  />
                  <Label htmlFor="agreePrivacy" className="text-sm leading-5">
                    <span className="text-[var(--coral-pink)]">[필수]</span>{" "}
                    개인정보보호정책에 동의합니다
                  </Label>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="agreeMarketing"
                    checked={formData.agreeMarketing}
                    onCheckedChange={(checked) =>
                      handleInputChange("agreeMarketing", checked)
                    }
                    className="border-[var(--coral-pink)] data-[state=checked]:bg-[var(--coral-pink)] data-[state=checked]:text-white mt-1"
                  />
                  <Label htmlFor="agreeMarketing" className="text-sm leading-5">
                    <span className="text-[var(--text-secondary)]">[선택]</span>{" "}
                    마케팅 정보 수신에 동의합니다
                  </Label>
                </div>
              </div>

              {/* Signup Button */}
              <Button
                type="submit"
                className="w-full bg-[var(--coral-pink)] hover:bg-[var(--coral-pink)]/90 text-white py-3 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] shadow-md hover:shadow-lg"
              >
                회원가입
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <Separator className="bg-[var(--border)]" />
              <div className="absolute inset-0 flex justify-center">
                <span className="bg-white px-2 text-sm text-[var(--text-secondary)]">
                  또는
                </span>
              </div>
            </div>

            {/* Social Signup Buttons */}
            <div className="space-y-3">
              {/* Google Signup */}
              <Button
                type="button"
                variant="outline"
                className="w-full border-[var(--border)] hover:bg-[var(--very-light-pink)] transition-all duration-300 ease-in-out transform hover:scale-[1.02]"
                onClick={() => handleSocialSignup("google")}
              >
                <div className="flex items-center justify-center space-x-3">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>Google로 가입하기</span>
                </div>
              </Button>

              {/* Kakao Signup */}
              <Button
                type="button"
                className="w-full bg-[#FEE500] hover:bg-[#FEE500]/90 text-black border-0 transition-all duration-300 ease-in-out transform hover:scale-[1.02]"
                onClick={() => handleSocialSignup("kakao")}
              >
                <div className="flex items-center justify-center space-x-3">
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3Z" />
                  </svg>
                  <span>카카오로 가입하기</span>
                </div>
              </Button>
            </div>

            {/* Login Link */}
            <div className="text-center pt-4 border-t border-[var(--border)]">
              <p className="text-sm text-[var(--text-secondary)]">
                이미 계정이 있으신가요?{" "}
                <button
                  onClick={() => window.location.reload()} // 임시로 새로고침, 실제로는 라우팅 처리
                  className="text-[var(--coral-pink)] hover:text-[var(--coral-pink)]/80 transition-colors duration-200"
                >
                  로그인
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
