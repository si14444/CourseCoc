import { Search, Filter, MapPin, Clock, Heart } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useState } from "react";

export function SearchAndFilter() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const filterOptions = [
    { id: "romantic", label: "로맨틱", icon: Heart },
    { id: "outdoor", label: "야외", icon: MapPin },
    { id: "quick", label: "빠른 데이트", icon: Clock },
  ];

  const toggleFilter = (filterId: string) => {
    setActiveFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((id) => id !== filterId)
        : [...prev, filterId]
    );
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
            onClick={() => setActiveFilters([])}
            className="text-[var(--coral-pink)] hover:underline"
          >
            전체 삭제
          </button>
        </div>
      )}
    </div>
  );
}
