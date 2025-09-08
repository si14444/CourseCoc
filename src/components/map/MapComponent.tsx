'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader } from '@googlemaps/js-api-loader'
import { useCourseStore } from '@/store/useCourseStore'
import { Place } from '@/types'
import { MapPin, Plus } from 'lucide-react'
import ClientOnly from '@/components/ui/ClientOnly'

interface MapComponentProps {
  onPlaceSelect?: (place: Place) => void
  showAddButton?: boolean
  className?: string
}

export default function MapComponent({ 
  onPlaceSelect, 
  showAddButton = true, 
  className = '' 
}: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<google.maps.LatLng | null>(null)
  
  const { mapCenter, mapZoom, setMapCenter, setMapZoom, courses } = useCourseStore()

  // Google Maps 초기화
  useEffect(() => {
    const initMap = async () => {
      try {
        // API 키 체크
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
        if (!apiKey || apiKey === 'your-api-key-here') {
          console.warn('Google Maps API 키가 설정되지 않았습니다.')
          setIsLoaded(false)
          return
        }

        const loader = new Loader({
          apiKey,
          version: 'weekly',
          libraries: ['places', 'geometry']
        })

        const { Map } = await loader.importLibrary('maps')
        const { AdvancedMarkerElement } = await loader.importLibrary('marker')

        if (mapRef.current) {
          const mapInstance = new Map(mapRef.current, {
            center: mapCenter,
            zoom: mapZoom,
            mapId: 'coursecoc-map',
            styles: [
              {
                featureType: 'poi',
                stylers: [{ visibility: 'simplified' }]
              }
            ]
          })

          setMap(mapInstance)
          setIsLoaded(true)

          // 맵 클릭 이벤트
          mapInstance.addListener('click', (e: google.maps.MapMouseEvent) => {
            if (e.latLng) {
              setSelectedLocation(e.latLng)
            }
          })

          // 맵 센터/줌 변경 이벤트
          mapInstance.addListener('center_changed', () => {
            const center = mapInstance.getCenter()
            if (center) {
              setMapCenter({
                lat: center.lat(),
                lng: center.lng()
              })
            }
          })

          mapInstance.addListener('zoom_changed', () => {
            setMapZoom(mapInstance.getZoom() || 13)
          })
        }
      } catch (error) {
        console.error('맵 초기화 실패:', error)
      }
    }

    initMap()
  }, [])

  // 코스 마커 표시
  useEffect(() => {
    if (!map || !isLoaded) return

    // 기존 마커들 제거 (실제 구현에서는 마커 관리가 필요)
    
    // 모든 코스의 장소들을 마커로 표시
    courses.forEach(course => {
      course.places.forEach((place, index) => {
        const marker = new google.maps.Marker({
          position: place.coordinates,
          map: map,
          title: place.name,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: 'var(--primary-color)',
            fillOpacity: 1,
            strokeColor: '#fff',
            strokeWeight: 2
          }
        })

        // 마커 클릭 이벤트
        marker.addListener('click', () => {
          if (onPlaceSelect) {
            onPlaceSelect(place)
          }
        })
      })
    })
  }, [map, isLoaded, courses, onPlaceSelect])

  // 장소 추가 함수
  const handleAddPlace = async () => {
    if (!selectedLocation || !map) return

    try {
      const geocoder = new google.maps.Geocoder()
      const result = await geocoder.geocode({
        location: selectedLocation
      })

      if (result.results[0]) {
        const place: Place = {
          id: `place_${Date.now()}`,
          name: result.results[0].formatted_address,
          address: result.results[0].formatted_address,
          coordinates: {
            lat: selectedLocation.lat(),
            lng: selectedLocation.lng()
          },
          createdAt: new Date(),
          updatedAt: new Date()
        }

        if (onPlaceSelect) {
          onPlaceSelect(place)
        }
        
        setSelectedLocation(null)
      }
    } catch (error) {
      console.error('장소 정보 가져오기 실패:', error)
    }
  }

  return (
    <div className={`relative bg-surface rounded-lg overflow-hidden ${className}`}>
      <div ref={mapRef} className="w-full h-full min-h-[400px]" />
      
      {!isLoaded && (
        <div className="absolute inset-0 bg-surface flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-8 h-8 mx-auto mb-2 text-primary animate-pulse" />
            <p className="text-muted">지도를 로딩 중...</p>
          </div>
        </div>
      )}

      {/* 선택된 위치에 장소 추가 버튼 */}
      {selectedLocation && showAddButton && (
        <div className="absolute top-4 right-4">
          <button
            onClick={handleAddPlace}
            className="btn-primary shadow-romantic"
          >
            <Plus className="w-4 h-4" />
            장소 추가
          </button>
        </div>
      )}
      
      {/* 선택된 위치 마커 */}
      {selectedLocation && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="w-4 h-4 bg-primary rounded-full animate-pulse shadow-lg" />
        </div>
      )}

      {/* 맵 컨트롤 */}
      <div className="absolute bottom-4 left-4 space-y-2">
        <button
          onClick={() => map?.setZoom((map.getZoom() || 13) + 1)}
          className="w-10 h-10 bg-surface border-2 border-border rounded-lg flex items-center justify-center hover:border-primary transition-colors"
        >
          +
        </button>
        <button
          onClick={() => map?.setZoom((map.getZoom() || 13) - 1)}
          className="w-10 h-10 bg-surface border-2 border-border rounded-lg flex items-center justify-center hover:border-primary transition-colors"
        >
          -
        </button>
      </div>
    </div>
  )
}