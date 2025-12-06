"use client";

import { Eye, Heart, MapPin, MessageCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import {
  COURSE_CARD_CLASSES,
  ICON_TEXT_CLASSES,
  META_TEXT_CLASSES,
} from "@/utils/layouts";
import { getCourseImageUrl, handleImageError } from "@/utils/defaultImages";

interface CourseCardProps {
  id: string | number;
  title: string;
  description: string;
  placeCount: number;
  likes: number;
  views: number;
  commentCount?: number;
  steps: string[];
  imageUrl?: string;
  tags?: string[];
  heroImage?: string;
  locationImages?: string[];
  compact?: boolean;
}

export function CourseCard({
  id,
  title,
  description,
  placeCount,
  likes,
  views,
  commentCount = 0,
  steps,
  imageUrl,
  tags = [],
  heroImage,
  locationImages = [],
  compact = false,
}: CourseCardProps) {
  if (compact) {
    return (
      <Link href={`/community/course/${id}`}>
        <div className="bg-white rounded-lg border border-[var(--coral-pink)]/10 overflow-hidden hover:shadow-md transition-shadow group">
          <div className="h-24 bg-gradient-to-br from-[var(--very-light-pink)] to-[var(--light-pink)] relative overflow-hidden">
            {heroImage ||
            imageUrl ||
            (locationImages && locationImages.length > 0) ? (
              <Image
                src={getCourseImageUrl(
                  heroImage || imageUrl,
                  locationImages,
                  tags
                )}
                alt={title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => handleImageError(e)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-2xl">💕</span>
              </div>
            )}
          </div>
          <div className="p-2">
            <h3 className="font-medium text-xs text-[var(--text-primary)] line-clamp-1 mb-1">
              {title}
            </h3>
            <div className="flex items-center space-x-2 text-[10px] text-[var(--text-secondary)]">
              <span className="flex items-center">
                <Heart className="w-3 h-3 mr-0.5 text-[var(--coral-pink)]" />
                {likes}
              </span>
              <span className="flex items-center">
                <MapPin className="w-3 h-3 mr-0.5 text-[var(--coral-pink)]" />
                {placeCount}
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/community/course/${id}`}>
      <Card className={`${COURSE_CARD_CLASSES} overflow-hidden`}>
        {/* Image Header - 높이 줄임 */}
        <div className="h-32 sm:h-36 lg:h-40 bg-gradient-to-br from-[var(--very-light-pink)] to-[var(--light-pink)] relative overflow-hidden">
          {heroImage ||
          imageUrl ||
          (locationImages && locationImages.length > 0) ? (
            <Image
              src={getCourseImageUrl(
                heroImage || imageUrl,
                locationImages,
                tags
              )}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => handleImageError(e)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[var(--coral-pink)]/20 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <span className="text-lg sm:text-2xl">💕</span>
                </div>
                <p className="text-xs sm:text-sm text-[var(--coral-pink)] font-medium">
                  로맨틱 데이트 코스
                </p>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        <CardContent className="p-3 sm:p-4">
          {/* Title and Description */}
          <div className="mb-2 sm:mb-3">
            <h3 className="font-bold text-sm sm:text-base text-[var(--text-primary)] mb-1 line-clamp-1">
              {title}
            </h3>
            <p className="text-[var(--text-secondary)] text-xs sm:text-sm line-clamp-2 leading-relaxed">
              {description}
            </p>
          </div>

          {/* Meta Information */}
          <div
            className={`flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3 ${META_TEXT_CLASSES}`}
          >
            <div className={ICON_TEXT_CLASSES}>
              <MapPin className="w-4 h-4 text-[var(--coral-pink)]" />
              <span>{placeCount}개 장소</span>
            </div>
            <div className={ICON_TEXT_CLASSES}>
              <Heart className="w-4 h-4 text-[var(--coral-pink)]" />
              <span>{likes}</span>
            </div>
            <div className={ICON_TEXT_CLASSES}>
              <Eye className="w-4 h-4 text-[var(--coral-pink)]" />
              <span>{views}</span>
            </div>
            <div className={ICON_TEXT_CLASSES}>
              <MessageCircle className="w-4 h-4 text-[var(--coral-pink)]" />
              <span>{commentCount}</span>
            </div>
          </div>

          {/* Course Steps Preview */}
          <div className="mb-0">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-xs font-medium text-[var(--text-secondary)] hidden sm:inline">
                코스 미리보기:
              </span>
            </div>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {steps.slice(0, 3).map((step, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--coral-pink)] text-white text-sm font-medium"
                >
                  {index + 1}
                </div>
              ))}
              {steps.length > 3 && (
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--light-pink)] text-[var(--coral-pink)] text-xs font-medium">
                  +{steps.length - 3}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
