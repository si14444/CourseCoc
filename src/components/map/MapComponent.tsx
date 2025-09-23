// 카카오맵으로 교체됨 - KakaoMapComponent 사용
'use client'

import KakaoMapComponent from './KakaoMapComponent'
import { Place } from '@/types'

interface MapComponentProps {
  onPlaceSelect?: (place: Place) => void
  showAddButton?: boolean
  className?: string
}

export default function MapComponent(props: MapComponentProps) {
  return <KakaoMapComponent {...props} />
}