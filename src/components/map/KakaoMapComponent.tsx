'use client'

import { useState, useCallback, useRef } from 'react'
import { useCourseStore } from '@/store/useCourseStore'
import { Place } from '@/types'
import { MapPin, Plus, Minus } from 'lucide-react'
import KakaoMapLoader, { Map, MapMarker, CustomOverlayMap } from './KakaoMapLoader'
import { v4 as uuidv4 } from 'uuid'

interface KakaoMapComponentProps {
  onPlaceSelect?: (place: Place) => void
  showAddButton?: boolean
  className?: string
}

export default function KakaoMapComponent({ 
  onPlaceSelect, 
  showAddButton = true, 
  className = '' 
}: KakaoMapComponentProps) {
  const mapRef = useRef<kakao.maps.Map>(null)
  const [clickedPosition, setClickedPosition] = useState<{ lat: number; lng: number } | null>(null)
  const [level, setLevel] = useState(3) // 카카오맵 줌 레벨 (1-14, 숫자가 작을수록 더 확대)
  
  const { mapCenter, courses } = useCourseStore()

  // 지도 클릭 이벤트
  const handleMapClick = useCallback((_: any, mouseEvent: any) => {
    if (!showAddButton) return
    
    const latlng = mouseEvent.latLng
    setClickedPosition({
      lat: latlng.getLat(),
      lng: latlng.getLng()
    })
  }, [showAddButton])

  // 장소 추가
  const handleAddPlace = useCallback(async () => {
    if (!clickedPosition) return

    try {
      // 카카오맵 Geocoder로 주소 정보 가져오기
      const geocoder = new window.kakao.maps.services.Geocoder()
      
      geocoder.coord2Address(clickedPosition.lng, clickedPosition.lat, (result: any, status: any) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const address = result[0]?.address
          const roadAddress = result[0]?.road_address
          
          const place: Place = {
            id: uuidv4(),
            name: roadAddress?.building_name || address?.address_name || '새 장소',
            address: roadAddress?.address_name || address?.address_name || '주소 불명',
            coordinates: clickedPosition,
            createdAt: new Date(),
            updatedAt: new Date()
          }

          if (onPlaceSelect) {
            onPlaceSelect(place)
          }
        } else {
          // 주소를 가져올 수 없는 경우 기본값 사용
          const place: Place = {
            id: uuidv4(),
            name: '새 장소',
            address: `위도: ${clickedPosition.lat.toFixed(6)}, 경도: ${clickedPosition.lng.toFixed(6)}`,
            coordinates: clickedPosition,
            createdAt: new Date(),
            updatedAt: new Date()
          }

          if (onPlaceSelect) {
            onPlaceSelect(place)
          }
        }
        
        setClickedPosition(null)
      })
    } catch (error) {
      console.error('장소 정보 가져오기 실패:', error)
      setClickedPosition(null)
    }
  }, [clickedPosition, onPlaceSelect])

  // 줌 컨트롤
  const handleZoomIn = () => {
    if (level > 1) setLevel(level - 1)
  }

  const handleZoomOut = () => {
    if (level < 14) setLevel(level + 1)
  }

  return (
    <KakaoMapLoader>
      <div className={`relative bg-surface rounded-lg overflow-hidden ${className}`}>
        <Map
          center={{ lat: mapCenter.lat, lng: mapCenter.lng }}
          level={level}
          style={{ width: '100%', height: '100%', minHeight: '400px' }}
          onClick={handleMapClick}
          onCreate={(map) => {
            mapRef.current = map
          }}
        >
          {/* 기존 코스들의 마커 표시 */}
          {courses.map((course) =>
            course.places.map((place, index) => (
              <MapMarker
                key={`${course.id}-${place.id}`}
                position={place.coordinates}
                onClick={() => onPlaceSelect?.(place)}
              >
                <div className="relative">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-lg"
                    style={{ backgroundColor: 'var(--primary-color)' }}
                  >
                    {index + 1}
                  </div>
                </div>
              </MapMarker>
            ))
          )}

          {/* 클릭한 위치 마커 */}
          {clickedPosition && (
            <MapMarker
              position={clickedPosition}
              image={{
                src: '/marker-temp.png',
                size: { width: 32, height: 40 },
                options: { offset: { x: 16, y: 40 } }
              }}
            >
              <div className="w-6 h-6 bg-warning rounded-full animate-pulse border-2 border-white shadow-lg" />
            </MapMarker>
          )}

          {/* 장소 추가 버튼 오버레이 */}
          {clickedPosition && showAddButton && (
            <CustomOverlayMap position={clickedPosition}>
              <div className="relative -translate-x-1/2 -translate-y-full mb-2">
                <button
                  onClick={handleAddPlace}
                  className="btn-primary shadow-romantic whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  장소 추가
                </button>
                <div className="absolute left-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-primary -translate-x-1/2" />
              </div>
            </CustomOverlayMap>
          )}
        </Map>

        {/* 줌 컨트롤 */}
        <div className="absolute bottom-4 left-4 space-y-2">
          <button
            onClick={handleZoomIn}
            className="w-10 h-10 bg-surface border-2 border-border rounded-lg flex items-center justify-center hover:border-primary transition-colors shadow-soft"
            title="확대"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="w-10 h-10 bg-surface border-2 border-border rounded-lg flex items-center justify-center hover:border-primary transition-colors shadow-soft"
            title="축소"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {/* 현재 위치 버튼 */}
        <div className="absolute bottom-4 right-4">
          <button
            onClick={() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  (position) => {
                    const { latitude, longitude } = position.coords
                    if (mapRef.current) {
                      mapRef.current.setCenter(new window.kakao.maps.LatLng(latitude, longitude))
                      setLevel(3)
                    }
                  },
                  (error) => {
                    console.error('현재 위치를 가져올 수 없습니다:', error)
                  }
                )
              }
            }}
            className="w-10 h-10 bg-surface border-2 border-border rounded-lg flex items-center justify-center hover:border-primary transition-colors shadow-soft"
            title="현재 위치"
          >
            <MapPin className="w-4 h-4" />
          </button>
        </div>

        {/* 클릭 가이드 */}
        {showAddButton && !clickedPosition && (
          <div className="absolute top-4 left-4 bg-surface/90 backdrop-blur-sm rounded-lg px-3 py-2 text-sm text-muted">
            💡 지도를 클릭해서 장소를 추가하세요
          </div>
        )}
      </div>
    </KakaoMapLoader>
  )
}