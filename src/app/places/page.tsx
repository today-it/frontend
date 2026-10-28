import type { Metadata } from 'next';

import { PlaceCollectionView } from './_components/place-collection-view';
import { PlaceListEmptyState } from './_components/place-list-empty-state';
import { PlaceRecommendationSection } from './_components/place-recommendation-section';
import { PlacesPageClient } from './_components/places-page-client';
import { normalizePlaceFilters } from './_model/place-filters';
import { findPlaceSection, placeSections } from './_model/place-sections';
import { allPlaces } from './_model/recommended-places';

export const metadata: Metadata = {
  title: '장소 목록 | ToDayIt',
  description: '다양한 장소를 찾아보세요.',
};

export default async function PlacesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const { section: querySection } = params;
  const sectionId = typeof querySection === 'string' ? querySection : undefined;
  const selectedSection = findPlaceSection(sectionId);
  const queryParam = params.q;
  const query = typeof queryParam === 'string' ? queryParam.trim() : '';
  const filters = normalizePlaceFilters(params);
  const hasFilters = Boolean(
    filters.regionId || filters.districtIds.length || filters.conceptIds.length,
  );
  const isSearchMode = Boolean(query || hasFilters);
  const routeKey = [query, filters.regionId, ...filters.districtIds, ...filters.conceptIds].join(
    '|',
  );
  const hasPlaces = selectedSection
    ? selectedSection.places.length > 0
    : placeSections.some((section) => section.places.length > 0);

  return (
    <PlacesPageClient
      key={routeKey}
      allPlaces={allPlaces}
      initialFilters={filters}
      initialQuery={query}
    >
      {selectedSection && !isSearchMode ? (
        <PlaceCollectionView key={selectedSection.id} section={selectedSection} />
      ) : hasPlaces ? (
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
      ) : (
        <PlaceListEmptyState />
      )}
    </PlacesPageClient>
  );
}
