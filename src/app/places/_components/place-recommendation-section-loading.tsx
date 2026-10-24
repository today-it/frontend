import { useId } from 'react';

import { SectionHeader } from '@/shared/ui';

import type { PlaceSection } from '../_model/place-sections';
import { PlaceCardSkeleton } from './place-card-skeleton';

interface PlaceRecommendationSectionLoadingProps {
  section: PlaceSection;
}

/** 장소 추천 섹션의 로딩 상태입니다. */
export function PlaceRecommendationSectionLoading({
  section,
}: PlaceRecommendationSectionLoadingProps) {
  const titleId = useId();

  return (
    <section aria-busy="true" aria-labelledby={titleId} className="flex flex-col gap-28">
      <SectionHeader
        description={section.description}
        id={titleId}
        moreHref={`/places?section=${section.id}`}
        title={section.title}
        type="More"
      />
      <div
        aria-hidden="true"
        className="grid grid-cols-4 gap-32"
        data-slot="place-card-skeleton-grid"
      >
        {Array.from({ length: 4 }, (_, index) => (
          <PlaceCardSkeleton key={index} />
        ))}
      </div>
    </section>
  );
}
