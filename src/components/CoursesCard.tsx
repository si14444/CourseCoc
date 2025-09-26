"use client";

import { Edit, Eye, Heart, MapPin, Palette } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

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
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={`/community/course/${id}`}>
      <Card
        className="bg-white rounded-2xl shadow-[0_4px_20px_var(--pink-shadow)] hover:shadow-[0_8px_30px_var(--pink-shadow-hover)] transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group cursor-pointer min-w-[320px]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
      {/* Image Header */}
      <div className="h-52 bg-gradient-to-br from-[var(--very-light-pink)] to-[var(--light-pink)] relative overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[var(--coral-pink)]/20 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">💕</span>
              </div>
              <p className="text-sm text-[var(--coral-pink)] font-medium">로맨틱 데이트 코스</p>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      <CardContent className="p-7">
        {/* Title and Description */}
        <div className="mb-4">
          <h3 className="font-bold text-[var(--text-primary)] mb-2 line-clamp-1">
            {title}
          </h3>
          <p className="text-[var(--text-secondary)] text-sm line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Meta Information */}
        <div className="flex items-center space-x-4 mb-4 text-sm text-[var(--text-secondary)]">
          <div className="flex items-center space-x-1">
            <MapPin className="w-4 h-4 text-[var(--coral-pink)]" />
            <span>{placeCount}개 장소</span>
          </div>
          <div className="flex items-center space-x-1">
            <Heart className="w-4 h-4 text-[var(--coral-pink)]" />
            <span>{likes}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Eye className="w-4 h-4 text-[var(--coral-pink)]" />
            <span>{views}</span>
          </div>
        </div>

        {/* Course Steps Preview */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xs font-medium text-[var(--text-secondary)]">
              코스 미리보기:
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
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
