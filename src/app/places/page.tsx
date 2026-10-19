import type { Metadata } from 'next';

import { TopHeader } from '@/app/_components/top-header';

import { PlaceRecommendations } from './_components/place-recommendations';
import { recommendedPlaces } from './_model/recommended-places';

export const metadata: Metadata = {
  title: '장소 목록 | ToDayIt',
  description: '다양한 장소를 찾아보세요.',
};

export default function PlacesPage() {
  return (
    <>
      <TopHeader activeSection="places" auth="guest" />
      <main className="mx-auto w-full max-w-[calc(var(--spacing-header-width)+48px)] px-24 pt-48 pb-96">
        <PlaceRecommendations places={recommendedPlaces} />
      </main>
    </>
  );
}
