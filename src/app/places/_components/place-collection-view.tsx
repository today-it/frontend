'use client';

import { useId, useState } from 'react';

import { useLoginModalStore } from '@/app/_model/login-modal-store';
import { Icon, LoadMoreButton, ScrollTopButton, TextLink } from '@/shared/ui';

import type { PlaceSection } from '../_model/place-sections';
import { PlaceCard } from './place-card';

const PAGE_SIZE = 8;

interface PlaceCollectionViewProps {
  section: PlaceSection;
}

/** 한 추천 섹션의 장소를 목록 페이지로 표시합니다. */
export function PlaceCollectionView({ section }: PlaceCollectionViewProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const openLogin = useLoginModalStore((state) => state.openLogin);
  const titleId = useId();
  const visiblePlaces = section.places.slice(0, visibleCount);

  return (
    <>
      <main className="mx-auto flex w-full max-w-[calc(var(--spacing-header-width)+48px)] flex-col gap-48 px-24 pt-48 pb-96">
        <TextLink className="items-center gap-4 self-start" href="/places">
          <Icon name="chevron-left" size={20} />
          <span>이전으로</span>
        </TextLink>

        <section aria-labelledby={titleId} className="flex flex-col gap-48">
          <div className="flex flex-col items-start gap-8">
            <h1 className="text-heading-h1 text-text-primary" id={titleId}>
              {section.title}
            </h1>
            <p className="text-body-b2 text-text-secondary">{section.description}</p>
          </div>

          <h2 className="sr-only">장소 목록</h2>
          <div
            className="grid grid-cols-1 gap-x-32 gap-y-48 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
            role="list"
          >
            {visiblePlaces.map((place, index) => (
              <div key={place.id} role="listitem">
                <PlaceCard eager={index < 4} place={place} onLikeClick={openLogin} />
              </div>
            ))}
          </div>

          {visibleCount < section.places.length && (
            <LoadMoreButton
              className="self-center"
              count={`${visiblePlaces.length} / ${section.places.length}`}
              onClick={() =>
                setVisibleCount((count) => Math.min(count + PAGE_SIZE, section.places.length))
              }
            />
          )}
        </section>
      </main>
      <ScrollTopButton />
    </>
  );
}
