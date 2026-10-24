import { rainyDayPlaces, recommendedPlaces, trendingPlaces } from './recommended-places';

export const placeSections = [
  {
    id: 'recommended',
    title: '당신을 위한 추천 장소',
    description: '선호 지역과 컨셉을 바탕으로 골랐어요',
    places: recommendedPlaces,
  },
  {
    id: 'trending',
    title: '지금 뜨는 성수 핫플',
    description: '이번 주 좋아요가 가장 많이 늘어난 곳이에요',
    places: trendingPlaces,
  },
  {
    id: 'rainy-day',
    title: '비 오는 날 가기 좋은 실내 데이트',
    description: '날씨 걱정 없이 둘러볼 수 있는 곳만 모았어요',
    places: rainyDayPlaces,
  },
] as const;

export type PlaceSection = (typeof placeSections)[number];

export function findPlaceSection(id: string | undefined) {
  return placeSections.find((section) => section.id === id);
}
