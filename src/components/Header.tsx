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