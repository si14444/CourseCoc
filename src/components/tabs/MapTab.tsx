'use client'

import MapComponent from '@/components/map/MapComponent'

export default function MapTab() {
  return (
    <div className="h-[calc(100vh-80px)]">
      <MapComponent className="h-full" />
    </div>
  )
}