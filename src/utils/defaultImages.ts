// 기본 배너 이미지 유틸리티

// 카테고리별 기본 이미지 맵핑 (기존 샘플 데이터에서 사용하던 이미지들)
const DEFAULT_BANNER_IMAGES = {
  romantic: "https://images.unsplash.com/photo-1621596016740-c831e613dc49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", // 로맨틱
  nature: "https://images.unsplash.com/photo-1724216605131-c8b0d4974458?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", // 자연
  culture: "https://images.unsplash.com/photo-1696238378039-821fc376ebd4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", // 문화
  food: "https://images.unsplash.com/photo-1621596016740-c831e613dc49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", // 카페/음식
  activity: "https://images.unsplash.com/photo-1724216605131-c8b0d4974458?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", // 액티브
  night: "https://images.unsplash.com/photo-1621596016740-c831e613dc49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", // 야경
  shopping: "https://images.unsplash.com/photo-1696238378039-821fc376ebd4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", // 쇼핑
  healing: "https://images.unsplash.com/photo-1724216605131-c8b0d4974458?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", // 힐링
  default: "https://images.unsplash.com/photo-1621596016740-c831e613dc49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080" // 기본 이미지
};

// 태그에 따른 카테고리 맵핑
const TAG_TO_CATEGORY_MAP: Record<string, keyof typeof DEFAULT_BANNER_IMAGES> = {
  "로맨틱": "romantic",
  "데이트": "romantic",
  "자연": "nature",
  "산책": "nature",
  "문화": "culture",
  "예술": "culture",
  "카페": "food",
  "맛집": "food",
  "액티브": "activity",
  "야경": "night",
  "쇼핑": "shopping",
  "힐링": "healing"
};

/**
 * 코스의 태그를 기반으로 적절한 기본 배너 이미지를 반환
 */
export function getDefaultBannerImage(tags: string[] = []): string {
  // 태그가 있는 경우 첫 번째 매칭되는 카테고리 이미지 사용
  for (const tag of tags) {
    const category = TAG_TO_CATEGORY_MAP[tag];
    if (category && DEFAULT_BANNER_IMAGES[category]) {
      return DEFAULT_BANNER_IMAGES[category];
    }
  }

  // 매칭되는 태그가 없으면 기본 이미지 반환
  return DEFAULT_BANNER_IMAGES.default;
}

/**
 * 코스의 이미지 URL을 반환 (대표 이미지 또는 기본 이미지)
 */
export function getCourseImageUrl(
  heroImage?: string,
  locationImages?: string[],
  tags: string[] = []
): string {
  // 1. 대표 이미지가 있으면 사용
  if (heroImage) {
    return heroImage;
  }

  // 2. 장소 이미지 중 첫 번째가 있으면 사용
  if (locationImages && locationImages.length > 0) {
    const firstImage = locationImages.find(img => img && img.trim());
    if (firstImage) {
      return firstImage;
    }
  }

  // 3. 둘 다 없으면 태그 기반 기본 이미지 반환
  return getDefaultBannerImage(tags);
}

/**
 * 이미지 로드 실패 시 이미지를 숨기고 기본 핑크 하트 배너 표시
 */
export function handleImageError(
  event: React.SyntheticEvent<HTMLImageElement>
): void {
  const imgElement = event.currentTarget;
  // 이미지를 숨김 (부모 컨테이너의 핑크 하트 배너가 보이도록)
  imgElement.style.display = 'none';
  imgElement.onerror = null; // 무한 루프 방지
}