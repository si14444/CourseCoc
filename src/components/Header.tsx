"use client";

import { BookOpen, Map, Menu, Plus, Users, X } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/90 border-b border-pink-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <Link href="/map" className="flex items-center space-x-2 text-gray-600 hover:text-pink-500 font-medium transition-colors duration-200">
              <Map className="w-5 h-5" />
              <span>지도</span>
            </Link>
            <Link href="/courses" className="flex items-center space-x-2 text-gray-600 hover:text-pink-500 font-medium transition-colors duration-200">
              <BookOpen className="w-5 h-5" />
              <span>내 코스</span>
            </Link>
            <Link href="/community" className="flex items-center space-x-2 text-gray-600 hover:text-pink-500 font-medium transition-colors duration-200">
              <Users className="w-5 h-5" />
              <span>커뮤니티</span>
            </Link>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link href="/community/write">
              <Button className="bg-gradient-to-r from-[var(--very-light-pink)] via-[var(--light-pink)] to-[var(--coral-pink)] text-white hover:shadow-xl hover:shadow-[var(--pink-shadow)] transition-all duration-300 transform hover:-translate-y-1 hover:scale-105">
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
              <Link href="/map" className="flex items-center space-x-2 text-gray-600 hover:text-pink-500 font-medium py-2">
                <Map className="w-5 h-5" />
                <span>지도</span>
              </Link>
              <Link href="/courses" className="flex items-center space-x-2 text-gray-600 hover:text-pink-500 font-medium py-2">
                <BookOpen className="w-5 h-5" />
                <span>내 코스</span>
              </Link>
              <Link href="/community" className="flex items-center space-x-2 text-gray-600 hover:text-pink-500 font-medium py-2">
                <Users className="w-5 h-5" />
                <span>커뮤니티</span>
              </Link>
              <Link href="/community/write">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-[var(--very-light-pink)] via-[var(--light-pink)] to-[var(--coral-pink)] text-white mt-2 hover:shadow-lg hover:shadow-[var(--pink-shadow)] transition-all duration-300"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  코스 만들기
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
