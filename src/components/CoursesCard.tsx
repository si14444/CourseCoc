"use client";

import { Eye, Heart, MapPin } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "./ui/card";
import { COURSE_CARD_CLASSES, ICON_TEXT_CLASSES, META_TEXT_CLASSES } from "@/utils/layouts";

interface CourseCardProps {
  id: string | number;
  title: string;
  description: string;
  placeCount: number;
  likes: number;
  views: number;
  steps: string[];
  imageUrl?: string;
}

export function CourseCard({
  id,
  title,
  description,
  placeCount,
  likes,
  views,
  steps,
  imageUrl,
}: CourseCardProps) {

  return (
    <Link href={`/community/course/${id}`}>
      <Card
        className={COURSE_CARD_CLASSES}
      >
      {/* Image Header */}
      <div className="h-40 sm:h-48 lg:h-52 bg-gradient-to-br from-[var(--very-light-pink)] to-[var(--light-pink)] relative overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[var(--coral-pink)]/20 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <span className="text-lg sm:text-2xl">💕</span>
              </div>
              <p className="text-xs sm:text-sm text-[var(--coral-pink)] font-medium">로맨틱 데이트 코스</p>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      <CardContent className="p-4 sm:p-6 lg:p-7">
        {/* Title and Description */}
        <div className="mb-4">
          <h3 className="font-bold text-sm sm:text-base lg:text-lg text-[var(--text-primary)] mb-1 sm:mb-2 line-clamp-1">
            {title}
          </h3>
          <p className="text-[var(--text-secondary)] text-xs sm:text-sm line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Meta Information */}
        <div className={`flex items-center space-x-2 sm:space-x-4 mb-3 sm:mb-4 ${META_TEXT_CLASSES}`}>
          <div className={ICON_TEXT_CLASSES}>
            <MapPin className="w-4 h-4 text-[var(--coral-pink)]" />
            <span className="hidden sm:inline">{placeCount}개 장소</span>
            <span className="sm:hidden">{placeCount}곳</span>
          </div>
          <div className={ICON_TEXT_CLASSES}>
            <Heart className="w-4 h-4 text-[var(--coral-pink)]" />
            <span>{likes}</span>
          </div>
          <div className={ICON_TEXT_CLASSES}>
            <Eye className="w-4 h-4 text-[var(--coral-pink)]" />
            <span>{views}</span>
          </div>
        </div>

        {/* Course Steps Preview */}
        <div className="mb-4">
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
