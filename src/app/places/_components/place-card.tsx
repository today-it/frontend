'use client';

import Image from 'next/image';
import type { MouseEventHandler } from 'react';

import { cn } from '@/shared/lib';
import { Icon, Tag } from '@/shared/ui';

import type { PlaceSummary } from '../_model/place';

const compactCount = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
});
const count = new Intl.NumberFormat('en-US');

export interface PlaceCardProps {
  place: PlaceSummary;
  eager?: boolean;
  size?: 'md' | 'lg';
  liked?: boolean;
  /** 클릭 이후의 인증 확인과 좋아요 변경은 사용하는 쪽에서 처리합니다. */
  onLikeClick: MouseEventHandler<HTMLButtonElement>;
}

/** 장소 정보와 좋아요 상태를 표시하고 클릭을 알리는 카드입니다. */
export function PlaceCard({
  place,
  eager = false,
  size = 'md',
  liked = false,
  onLikeClick,
}: PlaceCardProps) {
  const imageSrc = place.imageSrc;
  const likeClassName =
    'relative inline-flex cursor-pointer items-center gap-4 rounded-full bg-surface-default py-8 pr-12 pl-10 text-caption-c1 [color:var(--td-color-text-secondary)] shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-border-active focus-visible:ring-offset-2';
  const likeContent = (
    <>
      <Icon
        name={liked ? 'favorite-filled' : 'favorite'}
        size={20}
        tone="inherit"
        className={liked ? 'text-icon-liked' : 'text-icon-default'}
      />
      <span aria-hidden="true">{compactCount.format(place.likeCount)}</span>
    </>
  );

  return (
    <article className="w-place-card-width max-w-full min-w-0 overflow-hidden rounded-xl bg-surface-default shadow-md">
      <div
        className={cn(
          'relative flex w-full shrink-0 items-start justify-end bg-surface-placeholder p-12',
          size === 'lg' ? 'h-place-card-thumbnail-height-lg' : 'h-place-card-thumbnail-height',
        )}
      >
        {imageSrc ? (
          <Image
            alt={`${place.name} 장소 사진`}
            className="object-cover"
            fill
            loading={eager ? 'eager' : 'lazy'}
            sizes="336px"
            src={imageSrc}
          />
        ) : (
          <div aria-label={`${place.name} 사진 없음`} className="absolute inset-0" role="img" />
        )}
        <button
          aria-label={`${place.name} 좋아요 ${count.format(place.likeCount)}개`}
          aria-pressed={liked}
          className={likeClassName}
          onClick={onLikeClick}
          type="button"
        >
          {likeContent}
        </button>
      </div>
      <div className="flex h-place-card-body-height min-w-0 shrink-0 flex-col items-start gap-8 px-20 pt-20 pb-24">
        <Tag type="category">{place.category}</Tag>
        <h3 className="w-full truncate text-heading-h3 text-text-primary" title={place.name}>
          {place.name}
        </h3>
        <p className="w-full truncate text-body-b3 text-text-secondary">
          {place.neighborhood} ·{' '}
          {`★ ${place.rating.toFixed(1)} · 리뷰 ${count.format(place.reviewCount)}`}
        </p>
      </div>
    </article>
  );
}
