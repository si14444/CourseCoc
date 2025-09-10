'use client'

import { useEffect, useState } from 'react'
import { Map, MapMarker, CustomOverlayMap } from 'react-kakao-maps-sdk'

declare global {
  interface Window {
    kakao: any
  }
}

interface KakaoMapLoaderProps {
  children: React.ReactNode
}

export default function KakaoMapLoader({ children }: KakaoMapLoaderProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const script = document.createElement('script')
    script.async = true
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAPS_API_KEY}&autoload=false&libraries=services,clusterer`
    
    script.onload = () => {
      window.kakao.maps.load(() => {
        setIsLoaded(true)
      })
    }
    
    script.onerror = () => {
      console.error('카카오맵 스크립트 로드 실패')
    }
    
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  if (!isLoaded) {
    return (
      <div className="w-full h-full bg-surface rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-2 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-muted">카카오맵을 로딩 중...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export { Map, MapMarker, CustomOverlayMap }