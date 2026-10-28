'use client';

import { useRouter } from 'next/navigation';
import { type ReactNode, useRef, useState } from 'react';

import { TopHeader } from '@/app/_components/top-header';
import { SearchBar } from '@/shared/ui';

import type { PlaceSummary } from '../_model/place';
import {
  getPlaceFilterCount,
  getPlaceSearchHref,
  type PlaceFilterState,
} from '../_model/place-filters';
import { PlaceSearchModal } from './place-search-modal';
import { PlaceSearchResults } from './place-search-results';

interface PlacesPageClientProps {
  allPlaces: readonly PlaceSummary[];
  children: ReactNode;
  initialFilters: PlaceFilterState;
  initialQuery: string;
}

export function PlacesPageClient({
  allPlaces,
  children,
  initialFilters,
  initialQuery,
}: PlacesPageClientProps) {
  const router = useRouter();
  const [queryDraft, setQueryDraft] = useState(initialQuery);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchTriggerRef = useRef<HTMLDivElement>(null);
  const ignoreRestoredFocus = useRef(false);
  const isSearchMode = Boolean(initialQuery || getPlaceFilterCount(initialFilters));

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
              onSearch={() => navigateWithFilters(queryDraft, initialFilters)}
              onValueChange={setQueryDraft}
              placeholder="검색어를 입력해주세요"
              value={queryDraft}
            />
          </div>
        }
      />

      {isSearchMode ? (
        <PlaceSearchResults
          allPlaces={allPlaces}
          filters={initialFilters}
          onSearch={navigateWithFilters}
          query={initialQuery}
        />
      ) : (
        children
      )}

      {isSearchOpen ? (
        <PlaceSearchModal
          allPlaces={allPlaces}
          initialFilters={initialFilters}
          onClose={closeSearch}
          onQueryChange={setQueryDraft}
          onSubmit={submitSearch}
          query={queryDraft}
        />
      ) : null}
    </>
  );
}
