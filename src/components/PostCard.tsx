"use client";

import Link from "next/link";
import Image from "next/image";
import { MessageCircle, Eye, Heart, Clock } from "lucide-react";
import { Post } from "../lib/firebasePosts";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "방금 전";
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;
    return date.toLocaleDateString("ko-KR");
  };

  // HTML content에서 텍스트만 추출
  const getPlainText = (html: string) => {
    const temp = document.createElement("div");
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || "";
  };

  const contentPreview =
    typeof window !== "undefined"
      ? getPlainText(post.content).slice(0, 150)
      : post.content.replace(/<[^>]*>/g, "").slice(0, 150);

  return (
    <Link href={`/community/${post.id}`}>
      <article className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md hover:border-gray-200 transition-all duration-200 cursor-pointer group">
        <div className="flex items-start space-x-4">
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-medium text-gray-900">
                {post.author.nickname}
              </span>
              <span className="text-gray-400">·</span>
              <span className="text-sm text-gray-500 flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {formatDate(post.createdAt)}
              </span>
            </div>

            <h2 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors line-clamp-1">
              {post.title}
            </h2>

            {/* Stats */}
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center space-x-1 hover:text-pink-500 transition-colors">
                <Heart className="w-4 h-4" />
                <span>{post.likes}</span>
              </span>
              <span className="flex items-center space-x-1 hover:text-blue-500 transition-colors">
                <MessageCircle className="w-4 h-4" />
                <span>{post.commentCount}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{post.views}</span>
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
