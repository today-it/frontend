import type { Place } from '@/shared/api';

import { placeConcepts } from './place-filters';

function getPlaceImageSrc(imageUrl?: string) {
  if (!imageUrl) return undefined;
  try {
    const url = new URL(imageUrl);
    return url.protocol === 'https:' &&
      url.hostname === 'placehold.co' &&
      url.pathname === '/1200x800'
      ? url.href
      : undefined;
  } catch {
    return undefined;
  }
}

export interface PlaceSummary {
  id: string;
  name: string;
  category: string;
  neighborhood: string;
  address?: string;
  regionId?: string;
  districtId?: string;
  imageSrc?: string;
  rating?: number;
  reviewCount?: number;
  viewCount?: number;
  likeCount?: number;
  liked?: boolean;
}

/** 장소 목록 API 응답을 카드와 검색 제안에서 사용하는 요약 정보로 변환한다. */
export function toPlaceSummary(place: Place): PlaceSummary {
  return {
    id: String(place.placeId),
    name: place.name,
    category:
      placeConcepts.find((concept) => concept.apiCategory === place.category)?.label ??
      place.category,
    neighborhood: place.address,
    address: place.address,
    imageSrc: getPlaceImageSrc(place.imageUrls[0]),
    viewCount: place.viewCount,
    liked: place.liked,
  };
}

export function matchesPlaceName(name: string, query: string): boolean {
  const normalizedName = name.toLocaleLowerCase();
  return query
    .trim()
    .toLocaleLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => normalizedName.includes(term));
}
