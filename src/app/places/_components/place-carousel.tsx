'use client';

import type { MouseEventHandler } from 'react';
import { useId, useState } from 'react';

import { CarouselButton } from '@/shared/ui';

import type { PlaceSummary } from '../_model/place';
import { PlaceCard } from './place-card';

const ITEMS_PER_PAGE = 4;

interface PlaceCarouselProps {
  label: string;
  places: readonly PlaceSummary[];
  onLikeClick: MouseEventHandler<HTMLButtonElement>;
}

/** 장소 카드를 Figma 캐러셀처럼 4개 단위로 이동합니다. */
export function PlaceCarousel({ label, places, onLikeClick }: PlaceCarouselProps) {
  const [page, setPage] = useState(0);
  const viewportId = useId();
  const pages = Array.from({ length: Math.ceil(places.length / ITEMS_PER_PAGE) }, (_, index) =>
    places.slice(index * ITEMS_PER_PAGE, (index + 1) * ITEMS_PER_PAGE),
  );
  const activePage = Math.min(page, Math.max(0, pages.length - 1));

  function showPreviousPage() {
    setPage((currentPage) => Math.max(0, currentPage - 1));
  }

  function showNextPage() {
    setPage((currentPage) => Math.min(pages.length - 1, currentPage + 1));
  }

  return (
    <div
      aria-label={label}
      aria-roledescription="carousel"
      className="relative w-full"
      data-slot="place-carousel"
      onKeyDownCapture={(event) => {
        if (event.key === 'ArrowLeft' && activePage > 0) {
          event.preventDefault();
          showPreviousPage();
        }

        if (event.key === 'ArrowRight' && activePage < pages.length - 1) {
          event.preventDefault();
          showNextPage();
        }
      }}
      role="group"
    >
      <div
        className="-mx-24 -my-32 w-[calc(100%+48px)] overflow-hidden py-32"
        data-slot="place-carousel-viewport"
        id={viewportId}
      >
        <div
          className="flex w-full transition-transform duration-300 ease-out motion-reduce:transition-none"
          style={{ transform: `translate3d(-${activePage * 100}%, 0, 0)` }}
        >
          {pages.map((pagePlaces, index) => {
            const firstPlace = index * ITEMS_PER_PAGE + 1;
            const lastPlace = firstPlace + pagePlaces.length - 1;
            const isActivePage = index === activePage;

            return (
              <div
                aria-hidden={!isActivePage}
                aria-label={`장소 ${firstPlace}–${lastPlace} / ${places.length}`}
                aria-roledescription="slide"
                className="w-full shrink-0 px-24"
                data-slot="place-carousel-page"
                inert={!isActivePage}
                key={pagePlaces[0]?.id ?? index}
                role="group"
              >
                <div className="grid grid-cols-4 gap-32" role="list">
                  {pagePlaces.map((place) => (
                    <div key={place.id} role="listitem">
                      <PlaceCard eager place={place} onLikeClick={onLikeClick} />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {activePage > 0 && (
        <CarouselButton
          aria-controls={viewportId}
          className="absolute top-1/2 left-[-24px] z-10 -translate-y-1/2 bg-surface-default shadow-none drop-shadow-[0px_8px_12px_rgba(0,0,0,0.16)]"
          direction="left"
          onClick={showPreviousPage}
        />
      )}
      {activePage < pages.length - 1 && (
        <CarouselButton
          aria-controls={viewportId}
          className="absolute top-1/2 right-[-24px] z-10 -translate-y-1/2 bg-surface-default shadow-none drop-shadow-[0px_8px_12px_rgba(0,0,0,0.16)]"
          direction="right"
          onClick={showNextPage}
        />
      )}
    </div>
  );
}
