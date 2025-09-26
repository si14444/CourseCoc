'use client'

import { Users } from 'lucide-react'

export default function CommunityTab() {
  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-4 sm:py-6">
      <div className="text-center py-20">
        <div className="w-24 h-24 mx-auto mb-6 bg-accent rounded-full flex items-center justify-center">
          <Users className="w-12 h-12 text-primary opacity-50" />
        </div>
        <h3 className="text-xl font-semibold mb-2 text-foreground">커뮤니티 준비 중</h3>
        <p className="text-muted">곧 다른 사용자들의 멋진 코스를 만나볼 수 있어요!</p>
      </div>
    </div>
  )
}