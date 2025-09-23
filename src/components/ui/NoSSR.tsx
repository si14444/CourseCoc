'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

interface NoSSRProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

// 클라이언트에서만 렌더링하는 컴포넌트
function NoSSRInner({ children, fallback }: NoSSRProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <>{fallback || null}</>
  }

  return <>{children}</>
}

// dynamic import로 SSR 완전 비활성화
const NoSSR = dynamic(() => Promise.resolve(NoSSRInner), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 mx-auto mb-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-muted">로딩 중...</p>
      </div>
    </div>
  ),
})

export default NoSSR