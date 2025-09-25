import { Eye, EyeOff, Heart, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login attempt:", { email, password });
  };

  const handleSocialLogin = (provider: "google" | "kakao") => {
    // Handle social login logic here
    console.log(`${provider} login attempt`);
  };

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
            사랑스러운 데이트 코스를 함께 만들어요
          </p>
        </div>

        {/* Login Form */}
        <Card className="backdrop-blur-sm bg-white/80 border-[var(--border)] shadow-lg shadow-[var(--pink-shadow)] hover:shadow-xl hover:shadow-[var(--pink-shadow-hover)] transition-all duration-300 ease-in-out">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-[var(--text-primary)]">
              로그인
            </CardTitle>
            <CardDescription className="text-center text-[var(--text-secondary)]">
              계정에 로그인하여 특별한 데이트 코스를 탐험해보세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="이메일을 입력하세요"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-[var(--input-background)] border-[var(--border)] focus:border-[var(--coral-pink)] focus:ring-[var(--coral-pink)] transition-all duration-200"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="비밀번호를 입력하세요"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              {/* Forgot Password */}
              <div className="text-right">
                <button
                  type="button"
                  className="text-sm text-[var(--coral-pink)] hover:text-[var(--coral-pink)]/80 transition-colors duration-200"
                >
                  비밀번호를 잊으셨나요?
                </button>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full bg-[var(--coral-pink)] hover:bg-[var(--coral-pink)]/90 text-white py-3 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] shadow-md hover:shadow-lg"
              >
                로그인
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

            {/* Social Login Buttons */}
            <div className="space-y-3">
              {/* Google Login */}
              <Button
                type="button"
                variant="outline"
                className="w-full border-[var(--border)] hover:bg-[var(--very-light-pink)] transition-all duration-300 ease-in-out transform hover:scale-[1.02]"
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

              {/* Kakao Login */}
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

            {/* Sign Up Link */}
            <div className="text-center pt-4 border-t border-[var(--border)]">
              <p className="text-sm text-[var(--text-secondary)]">
                계정이 없으신가요?{" "}
                <button className="text-[var(--coral-pink)] hover:text-[var(--coral-pink)]/80 transition-colors duration-200">
                  회원가입
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Terms */}
        <p className="text-xs text-center text-[var(--text-secondary)] px-4">
          로그인하면{" "}
          <button className="text-[var(--coral-pink)] hover:underline">
            이용약관
          </button>{" "}
          및{" "}
          <button className="text-[var(--coral-pink)] hover:underline">
            개인정보보호정책
          </button>
          에 동의하는 것으로 간주됩니다.
        </p>
      </div>
    </div>
  );
}
