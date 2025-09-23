<<<<<<< HEAD
"use client";

import { Heart, Plus, Map, BookOpen, Users, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useState, useEffect } from "react";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[var(--header-backdrop)] border-b border-[var(--border)] shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Heart className="w-8 h-8 text-[var(--coral-pink)] fill-current" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-[var(--text-primary)]">
                CourseCoc
              </span>
              <Badge
                variant="secondary"
                className="bg-[var(--light-pink)] text-[var(--coral-pink)] border-[var(--coral-pink)] text-xs"
              >
                Beta
              </Badge>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button className="flex items-center space-x-2 text-[var(--coral-pink)] font-medium transition-colors duration-200">
              <Map className="w-5 h-5" />
              <span>Map</span>
            </button>
            <button className="flex items-center space-x-2 text-[var(--text-secondary)] hover:text-[var(--coral-pink)] font-medium transition-colors duration-200">
              <BookOpen className="w-5 h-5" />
              <span>My Courses</span>
            </button>
            <button className="flex items-center space-x-2 text-[var(--text-secondary)] hover:text-[var(--coral-pink)] font-medium transition-colors duration-200">
              <Users className="w-5 h-5" />
              <span>Community</span>
            </button>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button className="bg-gradient-to-r from-[var(--very-light-pink)] via-[var(--light-pink)] to-[var(--coral-pink)] text-white hover:shadow-lg hover:shadow-[var(--pink-shadow)] transition-all duration-300 transform hover:-translate-y-0.5">
              <Plus className="w-4 h-4 mr-2" />
              Create Course
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-[var(--text-secondary)] hover:text-[var(--coral-pink)] transition-colors duration-200"
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
          <div className="md:hidden py-4 border-t border-[var(--border)]">
            <div className="flex flex-col space-y-4">
              <button className="flex items-center space-x-2 text-[var(--coral-pink)] font-medium py-2">
                <Map className="w-5 h-5" />
                <span>Map</span>
              </button>
              <button className="flex items-center space-x-2 text-[var(--text-secondary)] font-medium py-2">
                <BookOpen className="w-5 h-5" />
                <span>My Courses</span>
              </button>
              <button className="flex items-center space-x-2 text-[var(--text-secondary)] font-medium py-2">
                <Users className="w-5 h-5" />
                <span>Community</span>
              </button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-[var(--very-light-pink)] via-[var(--light-pink)] to-[var(--coral-pink)] text-white mt-2"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Course
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
=======
'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [activeTab, setActiveTab] = useState('지도')

  const navItems = [
    { name: '지도', href: '/map' },
    { name: '내 코스', href: '/my-courses' },
    { name: '커뮤니티', href: '/community' }
  ]

  return (
    <div className="backdrop-blur-[6px] backdrop-filter bg-[rgba(255,255,255,0.8)] box-border flex flex-col items-center justify-center pb-px pt-0 relative w-full h-[65px] sticky top-0 z-50">
      <div className="absolute border-[0px_0px_1px] border-[rgba(255,224,224,0.2)] border-solid inset-0 pointer-events-none shadow-[0px_4px_20px_0px_rgba(255,107,107,0.1)]" />

      <div className="box-border flex items-center justify-between w-full max-w-[1200px] h-[64px] px-[32px] py-0 relative">
        {/* Logo Section */}
        <Link href="/" className="flex items-center justify-start relative shrink-0">
          <div className="flex items-center justify-center relative rounded-full shrink-0 w-[32px] h-[32px] overflow-hidden">
            <img
              src="/logo.png"
              alt="CourseCoc Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-gray-800 text-nowrap font-bold ml-[12px]">
            <p className="leading-[28px] whitespace-pre">CourseCoc</p>
          </div>
        </Link>

        {/* 네비게이션 - 중앙 정렬 */}
        <nav className="flex items-center justify-center gap-8 relative">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`flex items-center justify-center px-[16px] py-[8px] rounded-[10px] transition-all duration-300 ${
                activeTab === item.name
                  ? 'bg-[#fff2f2] shadow-sm text-[#ff6b6b]'
                  : 'hover:bg-[#fff8f8] text-gray-600'
              }`}
              onClick={() => setActiveTab(item.name)}
            >
              <span className="font-medium text-[14px] text-nowrap">
                {item.name}
              </span>
            </Link>
          ))}
        </nav>

        {/* 코스 만들기 버튼 */}
        <button className="bg-gradient-to-r from-[#ff6b6b] via-[#ff7979] to-[#ff8a8a] flex items-center justify-center px-[18px] py-[9px] rounded-[12px] transition-all duration-300 hover:shadow-lg hover:scale-[1.02] w-[140px] h-[38px] shadow-md">
          <div className="flex items-center justify-center gap-2">
            <span className="text-[16px] text-white font-bold">+</span>
            <span className="font-semibold text-[14px] text-white text-nowrap">
              코스 만들기
            </span>
          </div>
        </button>
      </div>
    </div>
  )
}
>>>>>>> 64637f0ed6fa5252b084bc1003fdada217f6f890
