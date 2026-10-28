'use client';

import { useId, useState } from 'react';

import { useLoginModalStore } from '@/app/_model/login-modal-store';
import { Button, Icon, LoadMoreButton, ScrollTopButton } from '@/shared/ui';

import type { PlaceSummary } from '../_model/place';
import {
  emptyPlaceFilters,
  filterPlaces,
  getPlaceFilterCount,
  type PlaceFilterState,
} from '../_model/place-filters';
import { PlaceCard } from './place-card';
import { PlaceFilterChips } from './place-filter-chips';

const PAGE_SIZE = 8;

interface PlaceSearchResultsProps {
  allPlaces: readonly PlaceSummary[];
  filters: PlaceFilterState;
  query: string;
  onSearch: (query: string, filters: PlaceFilterState) => void;
}

export function PlaceSearchResults({
  allPlaces,
  filters,
  query,
  onSearch,
}: PlaceSearchResultsProps) {
  const titleId = useId();
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const openLogin = useLoginModalStore((state) => state.openLogin);
  const places = filterPlaces(allPlaces, query, filters);
  const visiblePlaces = places.slice(0, visibleCount);
  const hasQuery = Boolean(query);
  const hasFilters = getPlaceFilterCount(filters) > 0;
  const heading = hasQuery ? `‘${query}’ 검색 결과` : '필터 결과';
  const hasMore = visibleCount < places.length;
  const resetLabel =
    hasQuery && hasFilters ? '전체 초기화' : hasFilters ? '필터 초기화' : '검색 초기화';

  /** 검색어와 지역/카테고리 필터를 모두 초기화합니다. */
  function resetSearch() {
    onSearch('', emptyPlaceFilters);
  }

  return (
    <>
      <main className="mx-auto flex w-full max-w-[calc(var(--spacing-header-width)+48px)] flex-1 flex-col px-24 pt-48 pb-96">
        <section aria-labelledby={titleId} className="flex flex-1 flex-col gap-28">
          <div className="flex flex-col gap-16">
            <div className="flex items-end justify-between gap-16">
              <div className="flex min-w-0 flex-col gap-8">
                <h1 className="text-heading-h1 text-text-primary" id={titleId}>
                  {heading}
                </h1>
                <p aria-live="polite" className="text-body-b2 text-text-secondary">
                  {places.length}곳을 찾았어요
                </p>
              </div>
              <button
                className="inline-flex shrink-0 cursor-pointer items-center gap-4 rounded-sm text-caption-c2 text-text-secondary outline-none focus-visible:ring-2 focus-visible:ring-border-active focus-visible:ring-offset-2"
                onClick={resetSearch}
                type="button"
              >
                <Icon name="refresh" size={16} />
                {resetLabel}
              </button>
            </div>

            {hasFilters ? (
              <div aria-label="선택한 필터" className="flex flex-wrap gap-8">
                <PlaceFilterChips filters={filters} onChange={(next) => onSearch(query, next)} />
              </div>
            ) : null}
          </div>

          {places.length === 0 ? (
            <section
              aria-labelledby={`${titleId}-empty`}
              className="flex min-h-[376px] w-full flex-1 flex-col items-center justify-center gap-24 text-center"
              data-slot="place-search-empty-state"
            >
              <Icon name="search-off" size={36} />
              <div className="flex flex-col items-center gap-8">
                <h2 className="text-heading-h3 text-text-primary" id={`${titleId}-empty`}>
                  조건에 맞는 장소가 없어요
                </h2>
                <p className="text-body-b2 text-text-muted">다른 지역이나 컨셉을 골라보세요</p>
              </div>
              <Button onClick={resetSearch} size="md">
                {resetLabel}
              </Button>
            </section>
          ) : (
            <>
              <h2 className="sr-only">검색된 장소 목록</h2>
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
              {hasMore ? (
                <LoadMoreButton
                  className="self-center"
                  count={`${visiblePlaces.length} / ${places.length}`}
                  onClick={() =>
                    setVisibleCount((count) => Math.min(count + PAGE_SIZE, places.length))
                  }
                />
              ) : null}
            </>
          )}
        </section>
      </main>
      <ScrollTopButton />
    </>
  );
}
