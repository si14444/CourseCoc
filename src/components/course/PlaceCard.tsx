'use client'

import { Place } from '@/types'
import { MapPin, Clock, Star, X, GripVertical } from 'lucide-react'

interface PlaceCardProps {
  place: Place
  index?: number
  onRemove?: () => void
  onEdit?: () => void
  showIndex?: boolean
  showRemove?: boolean
  draggable?: boolean
  className?: string
}

export default function PlaceCard({
  place,
  index,
  onRemove,
  onEdit,
  showIndex = false,
  showRemove = false,
  draggable = false,
  className = ''
}: PlaceCardProps) {
  return (
    <div className={`card hover:shadow-romantic transition-all group ${className}`}>
      <div className="flex items-start gap-3">
        {/* 드래그 핸들 */}
        {draggable && (
          <div className="cursor-move p-1 text-muted hover:text-primary transition-colors">
            <GripVertical className="w-4 h-4" />
          </div>
        )}

        {/* 순서 표시 */}
        {showIndex && (
          <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold text-sm">
            {index}
          </div>
        )}

        {/* 장소 정보 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-foreground truncate pr-2">
              {place.name}
            </h3>
            
            {/* 액션 버튼들 */}
            <div className="flex-shrink-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="p-1 text-muted hover:text-primary transition-colors"
                  title="편집"
                >
                  ✏️
                </button>
              )}
              
              {onRemove && showRemove && (
                <button
                  onClick={onRemove}
                  className="p-1 text-muted hover:text-error transition-colors"
                  title="삭제"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* 주소 */}
          <div className="flex items-center gap-2 mb-2 text-sm text-muted">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{place.address}</span>
          </div>

          {/* 설명 */}
          {place.description && (
            <p className="text-sm text-foreground-light mb-2 line-clamp-2">
              {place.description}
            </p>
          )}

          {/* 추가 정보 */}
          <div className="flex items-center gap-4 text-xs text-muted">
            {place.category && (
              <span className="px-2 py-1 bg-accent rounded-lg capitalize">
                {place.category}
              </span>
            )}
            
            {place.rating && (
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-warning text-warning" />
                <span>{place.rating.toFixed(1)}</span>
              </div>
            )}
            
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{new Date(place.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 장소 사진들 */}
      {place.photos && place.photos.length > 0 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {place.photos.slice(0, 3).map((photo, index) => (
            <img
              key={index}
              src={photo}
              alt={`${place.name} 사진 ${index + 1}`}
              className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
            />
          ))}
          {place.photos.length > 3 && (
            <div className="w-16 h-16 rounded-lg bg-accent flex items-center justify-center text-xs text-muted">
              +{place.photos.length - 3}
            </div>
          )}
        </div>
      )}
    </div>
  )
}