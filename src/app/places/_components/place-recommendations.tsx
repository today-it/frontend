'use client';

import { useId } from 'react';

import { useLoginModalStore } from '@/app/_model/login-modal-store';
import { SectionHeader } from '@/shared/ui';

import type { PlaceSummary } from '../_model/place';
import { PlaceCarousel } from './place-carousel';

interface PlaceRecommendationsProps {
  places: readonly PlaceSummary[];
}

export function PlaceRecommendations({ places }: PlaceRecommendationsProps) {
  const openLogin = useLoginModalStore((state) => state.openLogin);
  const titleId = useId();

  return (
    <section aria-labelledby={titleId} className="flex flex-col gap-28">
      <SectionHeader
        description="선호 지역과 컨셉을 바탕으로 골랐어요"
        id={titleId}
        title="당신을 위한 추천 장소"
        type="More"
      />
      <PlaceCarousel label="당신을 위한 추천 장소" places={places} onLikeClick={openLogin} />
    </section>
  );
}
