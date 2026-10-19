import { cn } from '@/shared/lib';

import type { PlaceCardSize } from './place-card';

interface PlaceCardSkeletonProps {
  size?: PlaceCardSize;
}

/** 장소 카드의 로딩 상태입니다. */
export function PlaceCardSkeleton({ size = 'md' }: PlaceCardSkeletonProps) {
  return (
    <div
      className="w-place-card-width max-w-full min-w-0 overflow-hidden rounded-xl bg-surface-default shadow-md"
      data-slot="place-card-skeleton"
    >
      <div
        className={cn(
          'bg-surface-subtle',
          size === 'lg' ? 'h-place-card-thumbnail-height-lg' : 'h-place-card-thumbnail-height',
        )}
      />
      <div className="flex h-place-card-body-height min-w-0 flex-col gap-12 px-20 pt-20 pb-18">
        <div className="h-[22px] w-[72px] shrink-0 rounded-lg bg-surface-subtle" />
        <div className="h-24 w-[220px] max-w-full shrink-0 rounded-lg bg-surface-subtle" />
        <div className="h-16 w-[160px] max-w-full shrink-0 rounded-lg bg-surface-subtle" />
      </div>
    </div>
  );
}
