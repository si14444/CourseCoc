'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [activeTab, setActiveTab] = useState('Map')

  const navItems = [
    { name: 'Map', href: '/map' },
    { name: 'My Courses', href: '/my-courses' },
    { name: 'Community', href: '/community' }
  ]

  return (
    <header className="sticky top-0 z-50 h-16 md:h-20 shadow-sm border-b border-gray-100 p-4 md:p-6 m-2 md:m-4" style={{ backgroundColor: '#ffffff' }}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 h-full flex items-center justify-between p-4 md:p-6 m-2 md:m-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-4 md:gap-6 p-4 md:p-6 m-2 md:m-3">
          <div
            className="w-8 md:w-10 h-8 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center shadow-md p-2 md:p-3 m-1 md:m-2"
            style={{ backgroundColor: 'var(--primary-color)' }}
          >
            <span className="text-white font-bold text-sm md:text-lg">C</span>
          </div>
          <span className="font-bold text-[24px] md:text-[32px] ml-2 md:ml-4 mr-2 md:mr-4 text-[#2d2d2d] px-4 md:px-6 py-1 md:py-2">CourseCoc</span>
          <span
            className="text-white text-[12px] md:text-[14px] px-4 md:px-6 py-2 md:py-3 rounded-full font-medium ml-3 md:ml-4 mr-2 md:mr-3"
            style={{ backgroundColor: 'var(--primary-color)' }}
          >
            Beta
          </span>
        </Link>

        {/* Navigation - 숨김/보임 제어 */}
        <nav className="hidden md:flex items-center gap-4 md:gap-6 p-4 md:p-6 m-2 md:m-3">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-[16px] font-medium transition-all duration-300 py-5 md:py-6 px-10 md:px-12 rounded-xl m-1 md:m-2 ${
                activeTab === item.name
                  ? 'text-white shadow-md'
                  : 'hover:shadow-sm'
              }`}
              style={{
                backgroundColor: activeTab === item.name ? 'var(--primary-color)' : 'transparent',
                color: activeTab === item.name ? '#ffffff' : '#555555'
              }}
              onClick={() => setActiveTab(item.name)}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Login Button */}
        <button
          className="text-white font-semibold text-[14px] md:text-[16px] px-8 md:px-12 py-4 md:py-5 rounded-lg md:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 m-2 md:m-3"
          style={{ backgroundColor: 'var(--primary-color)' }}
        >
          Login
        </button>
      </div>
    </header>
  )
}