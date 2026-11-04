'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { type ReactNode, useRef, useState } from 'react';

import { TopHeader } from '@/app/_components/top-header';
import { regionQueryOptions } from '@/shared/api';
import { Button, SearchBar } from '@/shared/ui';

import type { PlaceSummary } from '../_model/place';
import {
  getPlaceFilterCount,
  getPlaceSearchHref,
  normalizePlaceFilters,
  type PlaceFilterState,
  toPlaceRegions,
  validatePlaceFilters,
} from '../_model/place-filters';
import { PlaceSearchModal } from './place-search-modal';
import { PlaceSearchResults } from './place-search-results';

interface PlacesPageClientProps {
  allPlaces: readonly PlaceSummary[];
  children: ReactNode;
  initialFilters: PlaceFilterState;
  filterParams?: Record<string, string | string[] | undefined>;
  initialQuery: string;
}

export function PlacesPageClient({
  allPlaces,
  children,
  initialFilters,
  filterParams,
  initialQuery,
}: PlacesPageClientProps) {
  const router = useRouter();
  const regionsQuery = useQuery(regionQueryOptions);
  const regions = regionsQuery.data ? toPlaceRegions(regionsQuery.data) : undefined;
  const filters = filterParams
    ? normalizePlaceFilters(filterParams, regions)
    : validatePlaceFilters(initialFilters, regions);
  const regionNotice = !regions ? (
    <div
      className="flex min-h-48 flex-col items-center justify-center gap-12 py-16 text-caption-c2 text-text-tertiary"
      role={regionsQuery.isError ? 'alert' : 'status'}
    >
      <p>
        {regionsQuery.isError ? '지역 정보를 불러오지 못했어요.' : '지역 정보를 불러오고 있어요.'}
      </p>
      {regionsQuery.isError ? (
        <Button
          size="sm"
          onClick={() => {
            void regionsQuery.refetch();
          }}
        >
          다시 시도
        </Button>
      ) : null}
    </div>
  ) : regions.length === 0 ? (
    <p className="py-16 text-caption-c2 text-text-tertiary" role="status">
      등록된 지역이 없어요.
    </p>
  ) : undefined;
  const [queryDraft, setQueryDraft] = useState(initialQuery);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchTriggerRef = useRef<HTMLDivElement>(null);
  const ignoreRestoredFocus = useRef(false);
  const isSearchMode = Boolean(initialQuery || getPlaceFilterCount(filters));

  /**
   * 검색어와 필터를 장소 목록 URL로 직렬화해 이동합니다.
   * @param query 이동할 때 적용할 검색어
   * @param filters 이동할 때 적용할 지역 및 카테고리 필터
   */
  function navigateWithFilters(query: string, filters: PlaceFilterState) {
    router.push(getPlaceSearchHref(query, filters));
  }

  /** 필터 모달을 닫고 포커스를 검색창으로 되돌립니다. */
  function closeSearch() {
    ignoreRestoredFocus.current = true;
    setIsSearchOpen(false);
    requestAnimationFrame(() => {
      searchTriggerRef.current?.querySelector('input')?.focus();
      ignoreRestoredFocus.current = false;
    });
  }

  /**
   * 현재 검색어와 필터를 적용한 뒤 결과 화면으로 이동합니다.
   * @param query 적용할 검색어
   * @param filters 적용할 지역 및 카테고리 필터
   */
  function submitSearch(query: string, filters: PlaceFilterState) {
    closeSearch();
    navigateWithFilters(query, filters);
  }

  return (
    <>
      <TopHeader
        activeSection="places"
        auth="guest"
        searchContent={
          <div
            className="w-full max-w-search-bar-width"
            ref={searchTriggerRef}
            onFocus={() => {
              if (ignoreRestoredFocus.current) {
                ignoreRestoredFocus.current = false;
                return;
              }
              setIsSearchOpen(true);
            }}
            onClick={() => {
              ignoreRestoredFocus.current = false;
              setIsSearchOpen(true);
            }}
          >
            <SearchBar
              className="w-full"
              searchDisabled={!queryDraft.trim()}
              onSearch={() => navigateWithFilters(queryDraft, filters)}
              onValueChange={setQueryDraft}
              placeholder="검색어를 입력해주세요"
              value={queryDraft}
            />
          </div>
        }
      />

      {isSearchMode ? (
        !regions ? (
          <main className="mx-auto w-full max-w-search-bar-width px-24 py-48">{regionNotice}</main>
        ) : (
          <PlaceSearchResults
            regions={regions}
            allPlaces={allPlaces}
            filters={filters}
            onSearch={navigateWithFilters}
            query={initialQuery}
          />
        )
      ) : (
        children
      )}

      {isSearchOpen ? (
        <PlaceSearchModal
          allPlaces={allPlaces}
          regions={regions ?? []}
          regionNotice={regionNotice}
          regionsReady={regions !== undefined}
          initialFilters={filters}
          onClose={closeSearch}
          onQueryChange={setQueryDraft}
          onSubmit={submitSearch}
          query={queryDraft}
        />
      ) : null}
    </>
  );
}
