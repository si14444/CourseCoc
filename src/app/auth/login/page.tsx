"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { signIn } from "@/lib/auth";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn(email, password);

    if (result.success) {
      router.push("/");
    } else {
      setError(result.error || "로그인에 실패했습니다.");
    }

    setLoading(false);
  };

  const handleSocialLogin = (provider: "google" | "kakao") => {
    // Handle social login logic here
    console.log(`Login with ${provider}`);
  };

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
          <p className="text-muted-foreground">
            사랑스러운 데이트 코스를 함께 만들어요
          </p>
        </div>

        {/* Login Form */}
        <Card className="backdrop-blur-sm bg-card/80 shadow-romantic hover:shadow-romantic transition-all duration-300 ease-in-out">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-card-foreground">
              로그인
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              계정에 로그인하여 특별한 데이트 코스를 탐험해보세요
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
                <Label htmlFor="email">이메일</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="이메일을 입력하세요"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="!pl-10 !pr-3"
                    style={{ paddingLeft: "2.5rem", paddingRight: "0.75rem" }}
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="비밀번호를 입력하세요"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              {/* Forgot Password */}
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => router.push("/auth/forgotPassword")}
                  className="text-sm text-primary hover:text-primary/80 transition-colors duration-200"
                >
                  비밀번호를 잊으셨나요?
                </button>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "로그인 중..." : "로그인"}
              </Button>
            </form>

            {/* 간편가입 - 일시적으로 비활성화 */}
            {/*
            <div className="relative">
              <Separator />
              <div className="absolute inset-0 flex justify-center">
                <span className="bg-card px-2 text-sm text-muted-foreground">
                  또는
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full hover:bg-accent transition-all duration-300 ease-in-out transform hover:scale-[1.02]"
                onClick={() => handleSocialLogin("google")}
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
                  <span>Google로 로그인</span>
                </div>
              </Button>

              <Button
                type="button"
                className="w-full bg-[#FEE500] hover:bg-[#FEE500]/90 text-black border-0 transition-all duration-300 ease-in-out transform hover:scale-[1.02]"
                onClick={() => handleSocialLogin("kakao")}
              >
                <div className="flex items-center justify-center space-x-3">
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3Z" />
                  </svg>
                  <span>카카오로 로그인</span>
                </div>
              </Button>
            </div>
            */}

            {/* Sign Up Link */}
            <div className="text-center pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                계정이 없으신가요?{" "}
                <button
                  onClick={() => (window.location.href = "/auth/signup")}
                  className="text-primary hover:text-primary/80 transition-colors duration-200"
                >
                  회원가입
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Terms */}
        <p className="text-xs text-center text-muted-foreground px-4">
          로그인하면{" "}
          <button className="text-primary hover:underline">이용약관</button> 및{" "}
          <button className="text-primary hover:underline">
            개인정보보호정책
          </button>
          에 동의하는 것으로 간주됩니다.
        </p>
      </div>
    </div>
  );
}
