import type { Metadata } from 'next';

import { TopHeader } from '@/app/_components/top-header';

import { PlaceRecommendationSection } from './_components/place-recommendation-section';
import { rainyDayPlaces, recommendedPlaces, trendingPlaces } from './_model/recommended-places';

export const metadata: Metadata = {
  title: '장소 목록 | ToDayIt',
  description: '다양한 장소를 찾아보세요.',
};

export default function PlacesPage() {
  return (
    <>
      <TopHeader activeSection="places" auth="guest" />
      <main className="mx-auto w-full max-w-[calc(var(--spacing-header-width)+48px)] px-24 pt-48 pb-96">
        <div className="flex flex-col gap-96">
          <PlaceRecommendationSection places={recommendedPlaces} />
          <PlaceRecommendationSection
            description="이번 주 좋아요가 가장 많이 늘어난 곳이에요"
            places={trendingPlaces}
            title="지금 뜨는 성수 핫플"
          />
          <PlaceRecommendationSection
            description="날씨 걱정 없이 둘러볼 수 있는 곳만 모았어요"
            places={rainyDayPlaces}
            title="비 오는 날 가기 좋은 실내 데이트"
          />
        </div>
      </main>
    </>
  );
}
