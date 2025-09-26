"use client";

import { Clock, Filter, Heart, MapPin, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface SearchAndFilterProps {
  onSearch?: (searchTerm: string) => void;
  onTagFilter?: (tags: string[]) => void;
  initialSearch?: string;
  initialTags?: string[];
}

export function SearchAndFilter({
  onSearch,
  onTagFilter,
  initialSearch = "",
  initialTags = []
}: SearchAndFilterProps) {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [activeFilters, setActiveFilters] = useState<string[]>(initialTags);

  const filterOptions = [
    { id: "로맨틱", label: "로맨틱", icon: Heart },
    { id: "액티브", label: "액티브", icon: MapPin },
    { id: "문화", label: "문화", icon: Clock },
    { id: "자연", label: "자연", icon: MapPin },
    { id: "카페", label: "카페", icon: Heart },
    { id: "맛집", label: "맛집", icon: Heart },
    { id: "야경", label: "야경", icon: MapPin },
    { id: "데이트", label: "데이트", icon: Heart },
  ];

  const toggleFilter = (filterId: string) => {
    const newFilters = activeFilters.includes(filterId)
      ? activeFilters.filter((id) => id !== filterId)
      : [...activeFilters, filterId];

    setActiveFilters(newFilters);
    onTagFilter?.(newFilters);
  };

  // 검색어 변경 시 부모 컴포넌트에 알림
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch?.(searchQuery);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, onSearch]);

  // 모든 필터 제거
  const clearAllFilters = () => {
    setActiveFilters([]);
    onTagFilter?.([]);
  };

  return (
    <div className="mb-8">
      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
          <Input
            placeholder="코스 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-xl border-[var(--border)] focus:border-[var(--coral-pink)] focus:ring-2 focus:ring-[var(--coral-pink)]/20 bg-white transition-all duration-200"
          />
        </div>

        {/* Filter Button */}
        <Button
          variant="outline"
          className="border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--coral-pink)] hover:text-[var(--coral-pink)] hover:bg-[var(--very-light-pink)] transition-all duration-200 rounded-xl"
        >
          <Filter className="w-4 h-4 mr-2" />
          필터
          {activeFilters.length > 0 && (
            <Badge
              variant="secondary"
              className="ml-2 bg-[var(--coral-pink)] text-white text-xs"
            >
              {activeFilters.length}
            </Badge>
          )}
        </Button>
      </div>

      {/* Quick Filter Tags */}
      <div className="flex flex-wrap gap-2">
        {filterOptions.map((filter) => {
          const Icon = filter.icon;
          const isActive = activeFilters.includes(filter.id);

          return (
            <Button
              key={filter.id}
              variant="outline"
              size="sm"
              onClick={() => toggleFilter(filter.id)}
              className={`rounded-full transition-all duration-200 ${
                isActive
                  ? "bg-[var(--coral-pink)] text-white border-[var(--coral-pink)] shadow-md"
                  : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--coral-pink)] hover:text-[var(--coral-pink)] hover:bg-[var(--very-light-pink)]"
              }`}
            >
              <Icon className="w-4 h-4 mr-1" />
              {filter.label}
            </Button>
          );
        })}
      </div>

      {/* Active Filters Display */}
      {activeFilters.length > 0 && (
        <div className="mt-3 flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <span>활성 필터:</span>
          {activeFilters.map((filterId) => {
            const filter = filterOptions.find((f) => f.id === filterId);
            if (!filter) return null;

            return (
              <Badge
                key={filterId}
                variant="secondary"
                className="bg-[var(--light-pink)] text-[var(--coral-pink)] border-[var(--coral-pink)]/30"
              >
                {filter.label}
              </Badge>
            );
          })}
          <button
            onClick={clearAllFilters}
            className="text-[var(--coral-pink)] hover:underline"
          >
            전체 삭제
          </button>
        </div>
      )}
    </div>
  );
}
