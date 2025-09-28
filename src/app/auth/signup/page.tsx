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
import { signUp } from "@/lib/auth";
import { Calendar, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      setLoading(false);
      return;
    }

    if (!formData.agreeTerms || !formData.agreePrivacy) {
      setError("필수 약관에 동의해주세요.");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다.");
      setLoading(false);
      return;
    }

    const result = await signUp(formData);

    if (result.success) {
      router.push("/");
    } else {
      setError(result.error!);
    }

    setLoading(false);
  };

  const handleSocialSignup = () => {
    // Handle social signup logic here
  };

  const currentYear = new Date().getFullYear();
  const birthYears = Array.from({ length: 60 }, (_, i) => currentYear - 15 - i);

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Brand */}
        <div className="text-center space-y-4 flex flex-col items-center">
          <button
            onClick={() => router.push("/")}
            className="flex flex-col justify-center items-center mb-2 hover:opacity-80 transition-opacity text-center"
          >
            <Image
              src="/logo.png"
              alt="CourseCoc Logo"
              width={64}
              height={64}
              className="rounded-xl"
            />
            <h1 className="text-3xl text-primary tracking-tight">CourseCoc</h1>
          </button>
          <p className="text-muted-foreground">새로운 사랑의 시작, 함께 해요</p>
        </div>

        {/* Signup Form */}
        <Card className="backdrop-blur-sm bg-card/80 shadow-romantic hover:shadow-romantic transition-all duration-300 ease-in-out">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-card-foreground">
              회원가입
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              특별한 데이트 코스를 만들고 공유하세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email">이메일 *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="이메일을 입력하세요"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="!pl-10 !pr-3"
                    style={{ paddingLeft: "2.5rem", paddingRight: "0.75rem" }}
                    required
                  />
                </div>
              </div>

              {/* Nickname Input */}
              <div className="space-y-2">
                <Label htmlFor="nickname">닉네임 *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                  <Input
                    id="nickname"
                    type="text"
                    placeholder="사용할 닉네임을 입력하세요"
                    value={formData.nickname}
                    onChange={(e) =>
                      handleInputChange("nickname", e.target.value)
                    }
                    className="!pl-10 !pr-3"
                    style={{ paddingLeft: "2.5rem", paddingRight: "0.75rem" }}
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password">비밀번호 *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="비밀번호를 입력하세요"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className="!pl-10 !pr-12"
                    style={{ paddingLeft: "2.5rem", paddingRight: "3rem" }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors duration-200 z-10"
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
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="비밀번호를 다시 입력하세요"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    className="!pl-10 !pr-12"
                    style={{ paddingLeft: "2.5rem", paddingRight: "3rem" }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors duration-200 z-10"
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
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                    <Select
                      value={formData.birthYear}
                      onValueChange={(value) =>
                        handleInputChange("birthYear", value)
                      }
                    >
                      <SelectTrigger className="pl-16">
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
                        className="border-primary text-primary"
                      />
                      <Label htmlFor="male" className="text-sm">
                        남성
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="female"
                        id="female"
                        className="border-primary text-primary"
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
                    className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground mt-1"
                  />
                  <Label htmlFor="agreeTerms" className="text-sm leading-5">
                    <span className="text-primary">[필수]</span> 이용약관에
                    동의합니다
                  </Label>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="agreePrivacy"
                    checked={formData.agreePrivacy}
                    onCheckedChange={(checked) =>
                      handleInputChange("agreePrivacy", checked)
                    }
                    className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground mt-1"
                  />
                  <Label htmlFor="agreePrivacy" className="text-sm leading-5">
                    <span className="text-primary">[필수]</span>{" "}
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
                    className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground mt-1"
                  />
                  <Label htmlFor="agreeMarketing" className="text-sm leading-5">
                    <span className="text-muted-foreground">[선택]</span> 마케팅
                    정보 수신에 동의합니다
                  </Label>
                </div>
              </div>

              {/* Signup Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "가입 중..." : "회원가입"}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <Separator />
              <div className="absolute inset-0 flex justify-center">
                <span className="bg-card px-2 text-sm text-muted-foreground">
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
                className="w-full hover:bg-accent transition-all duration-300 ease-in-out transform hover:scale-[1.02]"
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
            <div className="text-center pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                이미 계정이 있으신가요?{" "}
                <button
                  onClick={() => (window.location.href = "/auth/login")}
                  className="text-primary hover:text-primary/80 transition-colors duration-200"
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
