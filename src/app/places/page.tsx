import type { Metadata } from 'next';

import { TopHeader } from '@/app/_components/top-header';

import { PlaceCollectionView } from './_components/place-collection-view';
import { PlaceRecommendationSection } from './_components/place-recommendation-section';
import { findPlaceSection, placeSections } from './_model/place-sections';

export const metadata: Metadata = {
  title: '장소 목록 | ToDayIt',
  description: '다양한 장소를 찾아보세요.',
};

export default async function PlacesPage({
  searchParams,
}: {
  searchParams: Promise<{ section?: string | string[] }>;
}) {
  const { section: querySection } = await searchParams;
  const sectionId = typeof querySection === 'string' ? querySection : undefined;
  const selectedSection = findPlaceSection(sectionId);

  return (
    <>
      <TopHeader activeSection="places" auth="guest" />
      {selectedSection ? (
        <PlaceCollectionView key={selectedSection.id} section={selectedSection} />
      ) : (
        <main className="mx-auto w-full max-w-[calc(var(--spacing-header-width)+48px)] px-24 pt-48 pb-96">
          <div className="flex flex-col gap-96">
            {placeSections.map((section) => (
              <PlaceRecommendationSection
                key={section.id}
                {...section}
                moreHref={`/places?section=${section.id}`}
              />
            ))}
          </div>
        </main>
      )}
    </>
  );
}
