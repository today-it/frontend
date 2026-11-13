'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { MouseEventHandler } from 'react';

import { cn } from '@/shared/lib';
import { Icon, Tag } from '@/shared/ui';

import type { PlaceSummary } from '../_model/place';

const compactCount = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
});
const count = new Intl.NumberFormat('en-US');

export type PlaceCardSize = 'md' | 'lg';

export interface PlaceCardProps {
  place: PlaceSummary;
  eager?: boolean;
  size?: PlaceCardSize;
  liked?: boolean;
  /** 좋아요 버튼 클릭 핸들러 (인증 검사와 상태 갱신은 호출부에서 처리) */
  onLikeClick: MouseEventHandler<HTMLButtonElement>;
}

/**
 * 장소 사진과 기본 정보를 보여주고 상세 이동과 좋아요 기능을 제공하는 PlaceCard 컴포넌트입니다.
 *
 * 카드 본문을 누르면 장소 상세로 이동하며, 좋아요 버튼을 누르면 onLikeClick을 호출합니다.
 */
export function PlaceCard({
  place,
  eager = false,
  size = 'md',
  liked = false,
  onLikeClick,
}: PlaceCardProps) {
  const imageSrc = place.imageSrc;
  const likeClassName =
    'relative z-10 inline-flex cursor-pointer items-center gap-4 rounded-full bg-surface-default py-8 pr-12 pl-10 text-caption-c1 text-text-secondary shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-border-active focus-visible:ring-offset-2';
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
    <article className="relative w-place-card-width max-w-full min-w-0 overflow-hidden rounded-xl bg-surface-default shadow-md">
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
        <h3 className="w-full text-heading-h3 text-text-primary" title={place.name}>
          <Link
            className="outline-none after:absolute after:inset-0 after:rounded-xl focus-visible:after:ring-2 focus-visible:after:ring-border-active focus-visible:after:ring-inset"
            href={`/places/${encodeURIComponent(place.id)}`}
          >
            <span className="block truncate">{place.name}</span>
          </Link>
        </h3>
        <p className="w-full truncate text-body-b3 text-text-secondary">
          {place.neighborhood} ·{' '}
          {`★ ${place.rating.toFixed(1)} · 리뷰 ${count.format(place.reviewCount)}`}
        </p>
      </div>
    </article>
  );
}
