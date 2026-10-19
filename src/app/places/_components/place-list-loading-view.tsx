import { TopHeader } from '@/app/_components/top-header';

import { placeSections } from '../_model/place-sections';
import { PlaceRecommendationSectionLoading } from './place-recommendation-section-loading';

/** 장소 홈 로딩 화면입니다. Footer는 루트 레이아웃에서 표시합니다. */
export function PlaceListLoadingView() {
  return (
    <>
      <TopHeader activeSection="places" auth="guest" />
      <main className="mx-auto w-full max-w-[calc(var(--spacing-header-width)+48px)] px-24 pt-48 pb-96">
        <div className="flex flex-col gap-96">
          {placeSections.map((section) => (
            <PlaceRecommendationSectionLoading key={section.id} section={section} />
          ))}
        </div>
      </main>
    </>
  );
}
