"use client";

import { BookOpen, Menu, Plus, Users, X, LogIn, LogOut, User } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { logOut } from "@/lib/auth";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, loading } = useAuth();

  const handleLogout = async () => {
    await logOut();
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/90 border-b border-pink-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative">
              <img
                src="/logo.png"
                alt="CourseCoc Logo"
                className="w-8 h-8 object-contain"
              />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-900">CourseCoc</span>
              <Badge
                variant="secondary"
                className="bg-pink-100 text-pink-600 border-pink-300 text-xs"
              >
                Beta
              </Badge>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/courses" className="flex items-center space-x-2 text-gray-600 hover:text-pink-500 font-medium transition-colors duration-200">
              <BookOpen className="w-5 h-5" />
              <span>내 코스</span>
            </Link>
            <Link href="/community" className="flex items-center space-x-2 text-gray-600 hover:text-pink-500 font-medium transition-colors duration-200">
              <Users className="w-5 h-5" />
              <span>커뮤니티</span>
            </Link>
          </nav>

          {/* Auth & CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <>
                <span className="text-sm text-muted-foreground">
                  <User className="w-4 h-4 inline mr-1" />
                  {user.email}
                </span>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="border-border text-foreground hover:bg-accent"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  로그아웃
                </Button>
              </>
            ) : (
              <Link href="/auth/login">
                <Button variant="outline" className="border-border text-foreground hover:bg-accent">
                  <LogIn className="w-4 h-4 mr-2" />
                  로그인
                </Button>
              </Link>
            )}
            <Link href="/community/write">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105">
                <Plus className="w-4 h-4 mr-2" />
                코스 만들기
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-pink-500 transition-colors duration-200"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-pink-200">
            <div className="flex flex-col space-y-4">
              <Link href="/courses" className="flex items-center space-x-2 text-gray-600 hover:text-pink-500 font-medium py-2">
                <BookOpen className="w-5 h-5" />
                <span>내 코스</span>
              </Link>
              <Link href="/community" className="flex items-center space-x-2 text-gray-600 hover:text-pink-500 font-medium py-2">
                <Users className="w-5 h-5" />
                <span>커뮤니티</span>
              </Link>

              {/* 구분선 */}
              <div className="border-t border-pink-200 pt-4">
                {user ? (
                  <>
                    <div className="mb-3">
                      <span className="text-sm text-muted-foreground flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {user.email}
                      </span>
                    </div>
                    <div className="mb-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleLogout}
                        className="w-full border-border text-foreground hover:bg-accent"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        로그아웃
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="mb-3">
                    <Link href="/auth/login">
                      <Button variant="outline" size="sm" className="w-full border-border text-foreground hover:bg-accent">
                        <LogIn className="w-4 h-4 mr-2" />
                        로그인
                      </Button>
                    </Link>
                  </div>
                )}
                <Link href="/community/write">
                  <Button
                    size="sm"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg transition-all duration-300"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    코스 만들기
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
