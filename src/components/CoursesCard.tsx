import { MapPin, Heart, Eye, Edit, Palette } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { useState } from "react";

interface CourseCardProps {
  title: string;
  description: string;
  placeCount: number;
  likes: number;
  views: number;
  steps: string[];
  imageUrl?: string;
}

export function CourseCard({
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
    <Card
      className="bg-white rounded-2xl shadow-[0_4px_20px_var(--pink-shadow)] hover:shadow-[0_8px_30px_var(--pink-shadow-hover)] transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Header */}
      {imageUrl && (
        <div className="h-48 bg-gradient-to-br from-[var(--very-light-pink)] to-[var(--light-pink)] relative overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      )}

      <CardContent className="p-6">
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

        {/* Action Buttons */}
        <div
          className={`flex space-x-2 transition-all duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <Button
            size="sm"
            variant="outline"
            className="border-[var(--coral-pink)] text-[var(--coral-pink)] hover:bg-[var(--coral-pink)] hover:text-white transition-all duration-200"
          >
            <Edit className="w-4 h-4 mr-1" />
            수정
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-[var(--coral-pink)] text-[var(--coral-pink)] hover:bg-[var(--coral-pink)] hover:text-white transition-all duration-200"
          >
            <Palette className="w-4 h-4 mr-1" />
            3D 뷰
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
