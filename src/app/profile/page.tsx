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
import { Camera, Edit, Save, Trash2, User, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { uploadProfileImage, updateUserNickname, deleteUserAccount } from "@/lib/auth";

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, userProfile, loading, refreshProfile } = useAuth();

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [newNickname, setNewNickname] = useState("");
  const [updatingNickname, setUpdatingNickname] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (userProfile?.nickname) {
      setNewNickname(userProfile.nickname);
    }
  }, [userProfile]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("이미지 파일만 업로드 가능합니다.");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError("파일 크기는 5MB 이하여야 합니다.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const result = await uploadProfileImage(file, user.uid);
      if (result.success) {
        await refreshProfile();
        setSuccess("프로필 이미지가 업데이트되었습니다.");
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError("이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleStartEditNickname = () => {
    setIsEditingNickname(true);
    setError("");
    setSuccess("");
  };

  const handleCancelEditNickname = () => {
    setIsEditingNickname(false);
    setNewNickname(userProfile?.nickname || "");
    setError("");
  };

  const handleSaveNickname = async () => {
    if (!user || !newNickname.trim()) return;

    if (newNickname.trim() === userProfile?.nickname) {
      setIsEditingNickname(false);
      return;
    }

    if (newNickname.trim().length < 2) {
      setError("닉네임은 2자 이상이어야 합니다.");
      return;
    }

    if (newNickname.trim().length > 20) {
      setError("닉네임은 20자 이하여야 합니다.");
      return;
    }

    setUpdatingNickname(true);
    setError("");

    try {
      const result = await updateUserNickname(user.uid, newNickname.trim());
      if (result.success) {
        await refreshProfile();
        setIsEditingNickname(false);
        setSuccess("닉네임이 업데이트되었습니다.");
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError("닉네임 업데이트 중 오류가 발생했습니다.");
    } finally {
      setUpdatingNickname(false);
    }
  };

  const handleDeleteAccount = () => {
    setShowDeleteConfirm(true);
    setError("");
    setSuccess("");
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteConfirmText("");
    setError("");
  };

  const handleConfirmDelete = async () => {
    if (!user || deleteConfirmText !== "회원탈퇴") {
      setError("'회원탈퇴'를 정확히 입력해주세요.");
      return;
    }

    setDeleting(true);
    setError("");

    try {
      const result = await deleteUserAccount(user.uid);
      if (result.success) {
        router.push("/");
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError("회원탈퇴 처리 중 오류가 발생했습니다.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

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
          <p className="text-muted-foreground">프로필 관리</p>
        </div>

        {/* Profile Form */}
        <Card className="backdrop-blur-sm bg-card/80 shadow-romantic hover:shadow-romantic transition-all duration-300 ease-in-out">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-card-foreground">
              내 프로필
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              프로필 이미지와 정보를 관리하세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Success/Error Messages */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm">
                {success}
              </div>
            )}

            {/* Profile Image Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-accent flex items-center justify-center">
                  {userProfile?.profileImageUrl ? (
                    <img
                      src={userProfile.profileImageUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>
                <button
                  onClick={triggerFileInput}
                  disabled={uploading}
                  className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 shadow-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {uploading && (
                <p className="text-sm text-muted-foreground">업로드 중...</p>
              )}
            </div>

            {/* Profile Information */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nickname">닉네임</Label>
                <div className="flex space-x-2">
                  {isEditingNickname ? (
                    <>
                      <Input
                        id="nickname"
                        type="text"
                        value={newNickname}
                        onChange={(e) => setNewNickname(e.target.value)}
                        placeholder="닉네임을 입력하세요"
                        disabled={updatingNickname}
                        className="flex-1"
                      />
                      <Button
                        onClick={handleSaveNickname}
                        disabled={updatingNickname}
                        size="sm"
                        className="px-3"
                      >
                        {updatingNickname ? (
                          <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        onClick={handleCancelEditNickname}
                        disabled={updatingNickname}
                        variant="outline"
                        size="sm"
                        className="px-3"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Input
                        id="nickname"
                        type="text"
                        value={userProfile?.nickname || user.displayName || ""}
                        disabled
                        className="bg-muted flex-1"
                      />
                      <Button
                        onClick={handleStartEditNickname}
                        variant="outline"
                        size="sm"
                        className="px-3"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email || ""}
                  disabled
                  className="bg-muted"
                />
              </div>

              {userProfile?.birthYear && (
                <div className="space-y-2">
                  <Label htmlFor="birthYear">출생년도</Label>
                  <Input
                    id="birthYear"
                    type="text"
                    value={`${userProfile.birthYear}년`}
                    disabled
                    className="bg-muted"
                  />
                </div>
              )}

              {userProfile?.gender && (
                <div className="space-y-2">
                  <Label htmlFor="gender">성별</Label>
                  <Input
                    id="gender"
                    type="text"
                    value={userProfile.gender === "male" ? "남성" : "여성"}
                    disabled
                    className="bg-muted"
                  />
                </div>
              )}
            </div>

            {/* Delete Account Section */}
            {!showDeleteConfirm ? (
              <div className="pt-6 border-t border-border">
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-foreground">계정 관리</h3>
                  <p className="text-xs text-muted-foreground">
                    계정을 삭제하면 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.
                  </p>
                  <Button
                    onClick={handleDeleteAccount}
                    variant="destructive"
                    size="sm"
                    className="w-full"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    회원탈퇴
                  </Button>
                </div>
              </div>
            ) : (
              <div className="pt-6 border-t border-border">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-foreground">회원탈퇴 확인</h3>
                    <p className="text-xs text-muted-foreground">
                      정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                    </p>
                    <p className="text-xs text-red-600">
                      확인하려면 아래에 <strong>&quot;회원탈퇴&quot;</strong>를 정확히 입력하세요.
                    </p>
                  </div>
                  <Input
                    type="text"
                    placeholder="회원탈퇴"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    disabled={deleting}
                    className="text-center"
                  />
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleCancelDelete}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      disabled={deleting}
                    >
                      취소
                    </Button>
                    <Button
                      onClick={handleConfirmDelete}
                      variant="destructive"
                      size="sm"
                      className="flex-1"
                      disabled={deleting || deleteConfirmText !== "회원탈퇴"}
                    >
                      {deleting ? (
                        <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      ) : (
                        "삭제"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Back Button */}
            <Button
              onClick={() => router.push("/")}
              variant="outline"
              className="w-full py-3 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02]"
            >
              홈으로 돌아가기
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}