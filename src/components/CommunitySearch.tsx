"use client";

import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { MOBILE_PADDING } from "@/utils/layouts";

interface CommunitySearchProps {
  onSearch?: (term: string) => void;
}

export function CommunitySearch({ onSearch }: CommunitySearchProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // 검색어 변경 시 부모 컴포넌트에 알림
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch?.(searchQuery);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, onSearch]);

  return (
    <div className={`mb-6 sm:mb-8 ${MOBILE_PADDING}`}>
      {/* Search Bar */}
      <div className="relative flex-1 min-w-0">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[var(--text-secondary)]" />
        <Input
          placeholder="게시글 검색..."
          autoComplete="off"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl border-[var(--border)] focus:border-[var(--coral-pink)] focus:ring-2 focus:ring-[var(--coral-pink)]/20 bg-white transition-all duration-200"
        />
      </div>
    </div>
  );
}
