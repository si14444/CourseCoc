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
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  ArrowLeft,
  CheckCircle,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Step =
  | "email"
  | "verification-method"
  | "verification-code"
  | "new-password"
  | "success";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>("email");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    verificationMethod: "email",
    verificationCode: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) return;
    setCurrentStep("verification-method");
  };

  const handleVerificationMethodSubmit = () => {
    setCurrentStep("verification-code");
  };

  const handleVerificationCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.verificationCode) return;
    setCurrentStep("new-password");
  };

  const handleNewPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (formData.newPassword.length < 8) {
      alert("비밀번호는 8자 이상이어야 합니다.");
      return;
    }

    setCurrentStep("success");
  };

  const goBack = () => {
    switch (currentStep) {
      case "verification-method":
        setCurrentStep("email");
        break;
      case "verification-code":
        setCurrentStep("verification-method");
        break;
      case "new-password":
        setCurrentStep("verification-code");
        break;
      default:
        break;
    }
  };

  const getStepProgress = (): number => {
    switch (currentStep) {
      case "email":
        return 25;
      case "verification-method":
        return 40;
      case "verification-code":
        return 65;
      case "new-password":
        return 85;
      case "success":
        return 100;
      default:
        return 0;
    }
  };

  const getStepTitle = (): string => {
    switch (currentStep) {
      case "email":
        return "이메일 확인";
      case "verification-method":
        return "인증 방법 선택";
      case "verification-code":
        return "인증번호 입력";
      case "new-password":
        return "새 비밀번호 설정";
      case "success":
        return "완료";
      default:
        return "";
    }
  };

  const getStepDescription = (): string => {
    switch (currentStep) {
      case "email":
        return "가입 시 사용한 이메일 주소를 입력해주세요";
      case "verification-method":
        return "비밀번호 재설정을 위한 인증 방법을 선택해주세요";
      case "verification-code":
        return "인증번호를 입력해주세요";
      case "new-password":
        return "새로운 비밀번호를 설정해주세요";
      case "success":
        return "비밀번호가 성공적으로 변경되었습니다";
      default:
        return "";
    }
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
          <p className="text-muted-foreground">비밀번호를 재설정해드릴게요</p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={getStepProgress()} className="h-2 bg-muted" />
          <p className="text-xs text-center text-muted-foreground">
            {getStepProgress()}% 완료
          </p>
        </div>

        {/* Main Card */}
        <Card className="backdrop-blur-sm bg-card/80 shadow-romantic hover:shadow-romantic transition-all duration-300 ease-in-out">
          <CardHeader className="space-y-1">
            <div className="flex items-center space-x-2">
              {currentStep !== "email" && currentStep !== "success" && (
                <button
                  onClick={goBack}
                  className="p-1 rounded-full hover:bg-accent transition-colors duration-200"
                >
                  <ArrowLeft className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
              <div className="flex-1">
                <CardTitle className="text-xl text-card-foreground">
                  {getStepTitle()}
                </CardTitle>
              </div>
            </div>
            <CardDescription className="text-muted-foreground">
              {getStepDescription()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Step 1: Email Input */}
            {currentStep === "email" && (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">이메일 주소</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="이메일을 입력하세요"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="!pl-10 !pr-3"
                      style={{ paddingLeft: "2.5rem", paddingRight: "0.75rem" }}
                      required
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full py-3 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] shadow-md hover:shadow-lg"
                >
                  다음
                </Button>
              </form>
            )}

            {/* Step 2: Verification Method */}
            {currentStep === "verification-method" && (
              <div className="space-y-4">
                <div className="space-y-3">
                  <Label>인증 방법을 선택해주세요</Label>
                  <RadioGroup
                    value={formData.verificationMethod}
                    onValueChange={(value) =>
                      handleInputChange("verificationMethod", value)
                    }
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-accent transition-colors duration-200">
                      <RadioGroupItem
                        value="email"
                        id="email-method"
                        className="border-primary text-primary"
                      />
                      <div className="flex items-center space-x-3 flex-1">
                        <Mail className="w-5 h-5 text-primary" />
                        <div>
                          <Label
                            htmlFor="email-method"
                            className="cursor-pointer"
                          >
                            이메일로 인증
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            {formData.email}로 인증번호를 보내드릴게요
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-accent transition-colors duration-200">
                      <RadioGroupItem
                        value="sms"
                        id="sms-method"
                        className="border-primary text-primary"
                      />
                      <div className="flex items-center space-x-3 flex-1">
                        <Phone className="w-5 h-5 text-primary" />
                        <div>
                          <Label
                            htmlFor="sms-method"
                            className="cursor-pointer"
                          >
                            SMS로 인증
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            휴대폰 번호로 인증번호를 보내드릴게요
                          </p>
                        </div>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
                <Button
                  onClick={handleVerificationMethodSubmit}
                  className="w-full py-3 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] shadow-md hover:shadow-lg"
                >
                  인증번호 발송
                </Button>
              </div>
            )}

            {/* Step 3: Verification Code */}
            {currentStep === "verification-code" && (
              <form
                onSubmit={handleVerificationCodeSubmit}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="verificationCode">인증번호</Label>
                  <Input
                    id="verificationCode"
                    type="text"
                    placeholder="6자리 인증번호를 입력하세요"
                    value={formData.verificationCode}
                    onChange={(e) =>
                      handleInputChange("verificationCode", e.target.value)
                    }
                    className="text-center tracking-widest"
                    maxLength={6}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.verificationMethod === "email"
                      ? formData.email
                      : "휴대폰"}
                    으로 발송된 인증번호를 입력해주세요
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 hover:bg-accent"
                  >
                    재발송
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 transition-all duration-300 ease-in-out transform hover:scale-[1.02]"
                  >
                    확인
                  </Button>
                </div>
              </form>
            )}

            {/* Step 4: New Password */}
            {currentStep === "new-password" && (
              <form onSubmit={handleNewPasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">새 비밀번호</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="새 비밀번호를 입력하세요"
                      value={formData.newPassword}
                      onChange={(e) =>
                        handleInputChange("newPassword", e.target.value)
                      }
                      className="!pl-10 !pr-12"
                      style={{ paddingLeft: "2.5rem", paddingRight: "3rem" }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors duration-200 z-10"
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    8자 이상, 영문/숫자/특수문자 조합을 권장합니다
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">새 비밀번호 확인</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="새 비밀번호를 다시 입력하세요"
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
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
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

                <Button
                  type="submit"
                  className="w-full py-3 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] shadow-md hover:shadow-lg"
                >
                  비밀번호 변경 완료
                </Button>
              </form>
            )}

            {/* Step 5: Success */}
            {currentStep === "success" && (
              <div className="text-center space-y-4 py-6">
                <div className="flex justify-center">
                  <CheckCircle className="w-16 h-16 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg text-foreground">
                    비밀번호 변경 완료!
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    새로운 비밀번호로 로그인해주세요
                  </p>
                </div>
                <Button
                  onClick={() => window.location.reload()} // 임시로 새로고침, 실제로는 로그인 페이지로 이동
                  className="w-full py-3 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] shadow-md hover:shadow-lg"
                >
                  로그인 페이지로 이동
                </Button>
              </div>
            )}

            {/* Login Link */}
            {currentStep !== "success" && (
              <div className="text-center pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  비밀번호가 기억나셨나요?{" "}
                  <button
                    onClick={() => (window.location.href = "/auth/login")}
                    className="text-primary hover:text-primary/80 transition-colors duration-200"
                  >
                    로그인
                  </button>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
