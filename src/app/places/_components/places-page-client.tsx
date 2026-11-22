'use client';

import { useRouter } from 'next/navigation';
import { type ReactNode, useRef, useState } from 'react';

import { TopHeader } from '@/app/_components/top-header';
import { useSessionStore } from '@/app/_model/session-store';
import { Button, SearchBar } from '@/shared/ui';

import {
  getPlaceRegionFilterCount,
  getPlaceSearchHref,
  type PlaceFilterState,
  type PlaceSort,
} from '../_model/place-filters';
import { usePlacesSearch } from '../_model/use-places-search';
import { PlaceFilterBar, type PlaceFilterTab } from './place-filter-bar';
import { PlaceSearchModal } from './place-search-modal';
import { PlaceSearchResults } from './place-search-results';
import { PlaceSearchSuggestionPopup } from './place-search-suggestion-popup';

interface PlacesPageClientProps {
  children: ReactNode;
  initialFilters: PlaceFilterState;
  filterParams?: Record<string, string | string[] | undefined>;
  initialQuery: string;
  sort: PlaceSort;
}

export function PlacesPageClient({
  children,
  initialFilters,
  filterParams,
  initialQuery,
  sort,
}: PlacesPageClientProps) {
  const member = useSessionStore((state) => state.member);
  const router = useRouter();
  const {
    regionsQuery,
    regions,
    filters,
    isSearchMode,
    isNameOnlySearch,
    shouldFetchPlaces,
    placesQuery,
    places,
    totalCount,
    isSearchComplete,
  } = usePlacesSearch({ mode: 'page', initialFilters, filterParams, query: initialQuery, sort });
  const fetchNextPlacesPage = placesQuery.fetchNextPage;
  const hasNextPlacesPage = placesQuery.hasNextPage;
  const isFetchingNextPlacesPage = placesQuery.isFetchingNextPage;
  const isPlacesError = placesQuery.isError;
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
  const [openPanel, setOpenPanel] = useState<'search' | PlaceFilterTab | null>(null);
  const lastTriggerRef = useRef<'search' | 'region' | 'category'>('search');
  const searchTriggerRef = useRef<HTMLDivElement>(null);
  const regionTabTriggerRef = useRef<HTMLButtonElement>(null);
  const categoryTabTriggerRef = useRef<HTMLButtonElement>(null);
  const ignoreRestoredFocus = useRef(false);

  /**
   * 검색어와 필터를 장소 목록 URL로 직렬화해 이동한다.
   * @param query 이동할 때 적용할 검색어
   * @param filters 이동할 때 적용할 지역 및 카테고리 필터
   */
  function navigateWithFilters(query: string, filters: PlaceFilterState) {
    router.push(getPlaceSearchHref(query, filters, sort));
  }

  /**
   * 트리거(검색창 또는 필터 탭)에 맞춰 검색 제안 팝업 또는 필터 팝업을 연다.
   * @param source 팝업을 연 트리거 (`search` / `region` / `category`)
   */
  function openSearch(source: 'search' | 'region' | 'category') {
    if (ignoreRestoredFocus.current) {
      ignoreRestoredFocus.current = false;
      return;
    }
    lastTriggerRef.current = source;
    setOpenPanel(source);
  }

  /**
   * 열린 팝업을 닫고 `returnTab`이 전달되면 해당 탭으로, 없으면 팝업을 열었던 트리거로 포커스를 복귀한다.
   * @param returnTab 활성 필터 탭 재클릭으로 닫힐 때 포커스를 돌려줄 탭
   */
  function closeSearch(returnTab?: PlaceFilterTab) {
    const target = returnTab ?? lastTriggerRef.current;
    ignoreRestoredFocus.current = true;
    setOpenPanel(null);
    requestAnimationFrame(() => {
      if (target === 'category') {
        categoryTabTriggerRef.current?.focus();
      } else if (target === 'region') {
        regionTabTriggerRef.current?.focus();
      } else {
        searchTriggerRef.current?.querySelector('input')?.focus();
      }
      ignoreRestoredFocus.current = false;
    });
  }

  /**
   * 현재 검색어와 필터를 적용한 뒤 결과 화면으로 이동한다.
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
        auth={member ? 'member' : 'guest'}
        nickname={member?.nickname}
        searchContent={
          <div className="flex w-full max-w-search-bar-width flex-col gap-12">
            <div
              className="w-full"
              ref={searchTriggerRef}
              onFocus={(event) => {
                if (event.target instanceof HTMLInputElement) openSearch('search');
              }}
              onClick={(event) => {
                if (event.target instanceof HTMLInputElement) openSearch('search');
              }}
            >
              <SearchBar
                className="w-full"
                searchDisabled={!queryDraft.trim()}
                onSearch={() => submitSearch(queryDraft, filters)}
                onValueChange={setQueryDraft}
                placeholder="검색어를 입력해주세요"
                value={queryDraft}
              />
            </div>
            <PlaceFilterBar
              categoryCount={filters.conceptIds.length}
              categoryTabRef={categoryTabTriggerRef}
              onTabClick={(tab) => openSearch(tab)}
              regionCount={getPlaceRegionFilterCount(filters)}
              regionTabRef={regionTabTriggerRef}
            />
          </div>
        }
      />

      {isSearchMode ? (
        !regions && !isNameOnlySearch ? (
          <main className="mx-auto w-full max-w-search-bar-width px-24 py-48">{regionNotice}</main>
        ) : (
          <PlaceSearchResults
            regions={regions ?? []}
            places={places}
            totalCount={totalCount}
            isLoading={shouldFetchPlaces && placesQuery.isPending}
            isError={isPlacesError}
            isSearchComplete={isSearchComplete}
            isFetchingNextPage={isFetchingNextPlacesPage}
            hasNextPage={Boolean(hasNextPlacesPage)}
            onRetry={() => void placesQuery.refetch()}
            onLoadMore={() => {
              if (hasNextPlacesPage && !isFetchingNextPlacesPage) {
                void fetchNextPlacesPage();
              }
            }}
            filters={filters}
            onSearch={navigateWithFilters}
            query={initialQuery}
            sort={sort}
            onSortChange={(nextSort) => {
              router.push(getPlaceSearchHref(initialQuery, filters, nextSort));
            }}
          />
        )
      ) : (
        children
      )}

      {openPanel === 'search' ? (
        <PlaceSearchSuggestionPopup
          onClose={closeSearch}
          onQueryChange={setQueryDraft}
          onSearch={() => submitSearch(queryDraft, filters)}
          onSelect={(place) => {
            closeSearch();
            router.push(`/places/${encodeURIComponent(place.id)}`);
          }}
          query={queryDraft}
        />
      ) : openPanel ? (
        <PlaceSearchModal
          initialFilters={filters}
          initialTab={openPanel}
          onClose={closeSearch}
          onSubmit={submitSearch}
          query={queryDraft}
          regionNotice={regionNotice}
          regions={regions ?? []}
          regionsReady={regions !== undefined}
        />
      ) : null}
    </>
  );
}
