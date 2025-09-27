"use client";

import { MapPin, Search } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}

interface AddressSearchResult {
  place_name: string;
  address_name: string;
  road_address_name?: string;
  x: string;
  y: string;
  place_url?: string;
  category_name?: string;
}

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (result: AddressSearchResult) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function AddressAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder = "주소 또는 장소명을 입력하세요",
  className = "",
  disabled = false,
}: AddressAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<AddressSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // API 로드 상태 확인
  const [isApiReady, setIsApiReady] = useState(false);
  const [apiError, setApiError] = useState(false);

  // Kakao Maps API 로드 확인 및 대기
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let attempts = 0;
    const maxAttempts = 50; // 최대 5초 대기 (100ms * 50)

    const checkApiReady = () => {
      if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
        setIsApiReady(true);
        return;
      }

      attempts++;
      if (attempts < maxAttempts) {
        timeoutId = setTimeout(checkApiReady, 100);
      } else {
        console.warn('Kakao Maps API 로드 시간 초과');
        setApiError(true);
      }
    };

    checkApiReady();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  // 카카오맵 검색 함수
  const searchAddress = useCallback(async (keyword: string) => {
    if (!keyword.trim()) {
      setResults([]);
      return;
    }

    // API 준비 상태 확인
    if (!isApiReady || !window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
      console.warn('Kakao Maps API가 아직 로드되지 않았습니다. 잠시 후 다시 시도해주세요.');
      setResults([]);
      return;
    }

    setIsLoading(true);

    try {
      const places = new window.kakao.maps.services.Places();

      places.keywordSearch(
        keyword,
        (data: AddressSearchResult[], status: string) => {
          setIsLoading(false);

          if (status === window.kakao.maps.services.Status.OK) {
            // 결과를 최대 5개로 제한하고 관련도 높은 순으로 정렬
            setResults(data.slice(0, 5));
          } else {
            console.warn('장소 검색 실패:', status);
            setResults([]);
          }
        },
        {
          // 검색 옵션
          location: new window.kakao.maps.LatLng(37.5665, 126.978), // 서울 중심
          radius: 20000, // 반경 20km
          sort: window.kakao.maps.services.SortBy?.ACCURACY,
        }
      );
    } catch (error) {
      console.error('주소 검색 중 오류 발생:', error);
      setIsLoading(false);
      setResults([]);
    }
  }, [isApiReady]);

  // 입력값 변경 시 자동완성 검색
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setSelectedIndex(-1);

    // 기존 타이머 클리어
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (newValue.trim()) {
      setIsOpen(true);
      // 300ms 딜레이 후 검색 실행 (API 호출 최적화)
      timeoutRef.current = setTimeout(() => {
        searchAddress(newValue);
      }, 300);
    } else {
      setIsOpen(false);
      setResults([]);
    }
  };

  // 자동완성 결과 선택
  const handleSelect = (result: AddressSearchResult) => {
    onChange(result.place_name);
    onSelect(result);
    setIsOpen(false);
    setResults([]);
    setSelectedIndex(-1);
    inputRef.current?.blur();
  };

  // 키보드 네비게이션
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleSelect(results[selectedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // 클릭 외부 영역 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      {/* 입력 필드 */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (value.trim() && results.length > 0) {
              setIsOpen(true);
            }
          }}
          placeholder={
            apiError
              ? "지도 서비스를 사용할 수 없습니다"
              : isApiReady
                ? placeholder
                : "지도 API 로딩 중..."
          }
          disabled={disabled || !isApiReady || apiError}
          className={`w-full pr-10 ${className} ${!isApiReady || apiError ? 'opacity-50' : ''}`}
        />

        {/* 검색/로딩 아이콘 */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {!isApiReady && !apiError ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-transparent" />
          ) : isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
          ) : apiError ? (
            <Search className="h-4 w-4 text-red-400" />
          ) : (
            <Search className="h-4 w-4 text-muted" />
          )}
        </div>
      </div>

      {/* 자동완성 드롭다운 */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-romantic max-h-64 overflow-y-auto"
        >
          {results.length > 0 ? (
            <div className="py-2">
              {results.map((result, index) => (
                <button
                  key={`${result.x}-${result.y}-${index}`}
                  onClick={() => handleSelect(result)}
                  className={`w-full px-4 py-3 text-left hover:bg-accent focus:bg-accent focus:outline-none transition-colors ${
                    selectedIndex === index ? "bg-accent" : ""
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-4 h-4 mt-1 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      {/* 장소명 */}
                      <div className="font-medium text-foreground truncate">
                        {result.place_name}
                      </div>

                      {/* 도로명 주소 (우선) 또는 지번 주소 */}
                      <div className="text-sm text-muted-foreground truncate mt-0.5">
                        {result.road_address_name || result.address_name}
                      </div>

                      {/* 카테고리 정보가 있는 경우 */}
                      {result.category_name && (
                        <div className="text-xs text-primary mt-0.5 truncate">
                          {result.category_name.split(" > ").pop()}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : !isLoading && value.trim() ? (
            <div className="px-4 py-8 text-center text-muted-foreground">
              <MapPin className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">검색 결과가 없습니다</p>
              <p className="text-xs mt-1">다른 키워드로 검색해보세요</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
