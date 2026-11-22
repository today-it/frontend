'use client';

import { Select } from '@base-ui/react/select';
import { useId, useState } from 'react';

import { useLoginModalStore } from '@/app/_model/login-modal-store';
import { Button, Icon, LoadMoreButton, ScrollTopButton } from '@/shared/ui';

import { matchesPlaceName, type PlaceSummary } from '../_model/place';
import {
  emptyPlaceFilters,
  getPlaceFilterCount,
  type PlaceFilterState,
  type PlaceSort,
  type RegionOption,
} from '../_model/place-filters';
import { PlaceCard } from './place-card';
import { PlaceCardSkeleton } from './place-card-skeleton';
import { PlaceFilterChips } from './place-filter-chips';

const PAGE_SIZE = 8;
const sortOptions = [
  { label: '인기순', value: 'POPULAR' },
  { label: '최신 등록순', value: 'LATEST' },
] satisfies { label: string; value: PlaceSort }[];

interface PlaceSearchResultsProps {
  places: readonly PlaceSummary[];
  totalCount: number;
  isLoading: boolean;
  isError: boolean;
  isSearchComplete: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  sort: PlaceSort;
  onSortChange: (sort: PlaceSort) => void;
  onRetry: () => void;
  onLoadMore: () => void;
  filters: PlaceFilterState;
  regions: readonly RegionOption[];
  query: string;
  onSearch: (query: string, filters: PlaceFilterState) => void;
}

export function PlaceSearchResults({
  regions,
  filters,
  query,
  onSearch,
  places,
  totalCount,
  isLoading,
  isError,
  isSearchComplete,
  isFetchingNextPage,
  hasNextPage: hasApiNextPage,
  onRetry,
  onLoadMore,
  sort,
  onSortChange,
}: PlaceSearchResultsProps) {
  const titleId = useId();
  const filtersId = useId();
  const [filtersExpanded, setFiltersExpanded] = useState(!query.trim());
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const openLogin = useLoginModalStore((state) => state.openLogin);
  const matchedPlaces =
    query.trim() && getPlaceFilterCount(filters) > 0
      ? places.filter((place) => matchesPlaceName(place.name, query))
      : places;
  const visiblePlaces = matchedPlaces.slice(0, visibleCount);
  const hasQuery = Boolean(query);
  const hasFilters = getPlaceFilterCount(filters) > 0;
  const heading = hasQuery ? `‘${query}’ 검색 결과` : '필터 검색 결과';
  const hasMore = visibleCount < matchedPlaces.length || hasApiNextPage;
  const resetLabel = hasQuery && hasFilters ? '전체 초기화' : '검색 초기화';

  /** 검색어와 지역/카테고리 필터를 모두 초기화합니다. */
  function resetSearch() {
    onSearch('', emptyPlaceFilters);
  }

  return (
    <>
      <main className="mx-auto flex w-full max-w-[calc(var(--spacing-header-width)+48px)] flex-1 flex-col px-24 pt-48 pb-96">
        <section aria-labelledby={titleId} className="flex flex-1 flex-col gap-28">
          <div className="flex flex-col gap-28">
            <div className="flex flex-wrap items-end justify-between gap-16">
              <div className="flex min-w-0 flex-col gap-8">
                <h1 className="text-heading-h1 text-text-primary" id={titleId}>
                  {heading}
                </h1>
                <p aria-live="polite" className="text-body-b2 text-text-secondary">
                  {isLoading || (hasQuery && !isSearchComplete)
                    ? '장소를 찾고 있어요'
                    : `${hasQuery && hasFilters ? matchedPlaces.length : totalCount}곳을 찾았어요`}
                </p>
              </div>
              <div className="flex items-center gap-24">
                {hasFilters ? (
                  <Select.Root
                    items={sortOptions}
                    value={sort}
                    onValueChange={(value) => {
                      if (value) onSortChange(value);
                    }}
                  >
                    <Select.Trigger
                      aria-label="장소 정렬"
                      className="group inline-flex min-h-40 cursor-pointer items-center gap-4 rounded-sm text-caption-c1 text-text-primary outline-none focus-visible:ring-2 focus-visible:ring-border-active"
                    >
                      <Select.Value />
                      <Select.Icon>
                        <Icon
                          name="chevron-down"
                          size={16}
                          className="group-data-popup-open:rotate-180"
                        />
                      </Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Positioner
                        align="end"
                        alignItemWithTrigger={false}
                        sideOffset={8}
                        className="z-50"
                      >
                        <Select.Popup className="w-dropdown-panel-width overflow-hidden rounded-xl border-sm border-border-default bg-surface-default py-8 shadow-dropdown outline-none">
                          <Select.List>
                            {sortOptions.map((option) => (
                              <Select.Item
                                key={option.value}
                                value={option.value}
                                className="flex h-option-row cursor-pointer items-center justify-between gap-16 px-16 text-caption-c1 text-text-secondary outline-none data-highlighted:bg-state-hover data-selected:bg-state-selected data-selected:text-text-primary"
                              >
                                <Select.ItemText>{option.label}</Select.ItemText>
                                <Select.ItemIndicator>
                                  <Icon name="check" size={24} />
                                </Select.ItemIndicator>
                              </Select.Item>
                            ))}
                          </Select.List>
                        </Select.Popup>
                      </Select.Positioner>
                    </Select.Portal>
                  </Select.Root>
                ) : null}
                <button
                  className="inline-flex shrink-0 cursor-pointer items-center gap-4 rounded-sm text-caption-c1 text-text-secondary outline-none focus-visible:ring-2 focus-visible:ring-border-active focus-visible:ring-offset-2"
                  onClick={resetSearch}
                  type="button"
                >
                  <Icon name="refresh" size={16} />
                  {resetLabel}
                </button>
              </div>
            </div>

            {hasFilters ? (
              <div className="flex flex-col gap-16">
                <button
                  type="button"
                  aria-expanded={filtersExpanded}
                  aria-controls={filtersId}
                  onClick={() => setFiltersExpanded((expanded) => !expanded)}
                  className="flex min-h-36 cursor-pointer items-center gap-6 self-start rounded-sm text-caption-c1 text-text-primary outline-none focus-visible:ring-2 focus-visible:ring-border-active"
                >
                  선택한 필터{' '}
                  <span className="text-text-brand">{getPlaceFilterCount(filters)}</span>
                  <Icon name={filtersExpanded ? 'chevron-up' : 'chevron-down'} size={20} />
                </button>
                <div id={filtersId} hidden={!filtersExpanded}>
                  <div aria-label="선택한 필터" className="flex flex-wrap gap-8">
                    <PlaceFilterChips
                      regions={regions}
                      filters={filters}
                      onChange={(next) => onSearch(query, next)}
                    />
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {isError ? (
            <section
              className="flex min-h-[376px] flex-col items-center justify-center gap-16"
              role="alert"
            >
              <h2 className="text-heading-h3 text-text-primary">장소를 불러오지 못했어요</h2>
              <p className="text-body-b2 text-text-tertiary">잠시 후 다시 시도해 주세요.</p>
              <Button onClick={onRetry} size="md">
                다시 시도
              </Button>
            </section>
          ) : isLoading || (hasQuery && !isSearchComplete) ? (
            <div
              className="grid grid-cols-1 gap-x-32 gap-y-48 sm:grid-cols-2 lg:grid-cols-4"
              aria-label="장소 불러오는 중"
            >
              {Array.from({ length: 8 }, (_, index) => (
                <PlaceCardSkeleton key={index} />
              ))}
            </div>
          ) : matchedPlaces.length === 0 && isSearchComplete ? (
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
                <p className="text-body-b2 text-text-tertiary">다른 지역이나 컨셉을 골라보세요</p>
              </div>
              <Button onClick={resetSearch} size="md">
                {resetLabel}
              </Button>
            </section>
          ) : (
            <>
              <h2 className="sr-only">검색된 장소 목록</h2>
              <div
                className="grid grid-cols-1 gap-x-32 gap-y-48 sm:grid-cols-2 lg:grid-cols-4"
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
                  count={`${visiblePlaces.length} / ${hasQuery && hasFilters ? matchedPlaces.length : totalCount}`}
                  onClick={() => {
                    if (visibleCount < matchedPlaces.length) {
                      setVisibleCount((count) => Math.min(count + PAGE_SIZE, matchedPlaces.length));
                    } else {
                      setVisibleCount((count) => count + PAGE_SIZE);
                      onLoadMore();
                    }
                  }}
                  disabled={isFetchingNextPage}
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
