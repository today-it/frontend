'use client';

import { Dialog } from '@base-ui/react/dialog';

import { Button, Icon, ModalBackdrop, ModalTitle, SearchBar } from '@/shared/ui';

import type { PlaceSummary } from '../_model/place';
import { usePlaceSearchSuggestions } from '../_model/use-place-search-suggestions';

export interface PlaceSearchSuggestionPopupProps {
  /** 현재 검색어 입력값 */
  query: string;
  /** 검색어 입력값 변경 핸들러 */
  onQueryChange: (query: string) => void;
  /** 검색 실행 핸들러 */
  onSearch: () => void;
  /** 팝업 닫기 핸들러 */
  onClose: () => void;
  /** 추천 장소 항목 선택 핸들러 */
  onSelect: (place: PlaceSummary) => void;
}

/**
 * 장소 검색창 포커스 또는 클릭 시 열리는 검색 제안 전용 팝업 컴포넌트입니다.
 *
 * 장소 이름 검색 API의 정렬 순서대로 추천하며, `neighborhood`는 보조 문구로만 표시합니다. 추천 장소를 선택하면 `onSelect` 콜백을 호출하고, 검색을 실행하면 `onSearch` 콜백을 호출합니다.
 */
export function PlaceSearchSuggestionPopup({
  query,
  onQueryChange,
  onSearch,
  onClose,
  onSelect,
}: PlaceSearchSuggestionPopupProps) {
  const {
    normalizedQuery,
    suggestions,
    scrollContainerRef,
    loadMoreTriggerRef,
    isError,
    isLoading,
    isUpdating,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchNextPageError,
    isFetchingNextPage,
  } = usePlaceSearchSuggestions(query);

  return (
    <Dialog.Root
      disablePointerDismissal={false}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      open
    >
      <Dialog.Portal>
        <ModalBackdrop />
        <Dialog.Popup
          className="fixed top-[calc(var(--spacing-header-height)_+_var(--spacing-18))] left-1/2 z-50 flex max-h-[calc(100dvh_-_var(--spacing-header-height)_-_var(--spacing-18)_-_var(--spacing-24))] w-search-bar-width max-w-[calc(100vw_-_32px)] -translate-x-1/2 flex-col gap-12 overflow-hidden outline-none"
          data-slot="search-suggestion-popup"
          finalFocus={false}
        >
          <ModalTitle className="sr-only">장소 검색 제안</ModalTitle>
          <SearchBar
            autoFocus
            className="shrink-0"
            searchDisabled={!normalizedQuery}
            onSearch={onSearch}
            onValueChange={onQueryChange}
            value={query}
          />
          <div
            ref={scrollContainerRef}
            className="max-h-[402px] min-h-0 overflow-y-auto rounded-3xl bg-surface-default p-18"
          >
            <p className="py-12 pl-16 text-caption-c1 text-text-muted">
              {isUpdating && suggestions.length > 0 ? '장소 검색 중…' : '장소'}
            </p>
            {isError && suggestions.length === 0 ? (
              <div className="flex flex-col items-center gap-12 px-16 py-24" role="alert">
                <p className="text-body-b3 text-text-muted">검색 제안을 불러오지 못했어요.</p>
                <Button onClick={() => void refetch()} size="sm">
                  다시 시도
                </Button>
              </div>
            ) : isLoading ? (
              <p className="px-16 py-24 text-body-b3 text-text-muted" role="status">
                장소를 검색하고 있어요.
              </p>
            ) : suggestions.length > 0 ? (
              <ul>
                {suggestions.map((place) => (
                  <li key={place.id}>
                    <button
                      className="flex h-[var(--td-number-72)] w-full cursor-pointer items-center gap-16 rounded-xl px-16 text-left outline-none hover:bg-surface-subtle focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-inset"
                      disabled={isUpdating}
                      onClick={() => onSelect(place)}
                      type="button"
                    >
                      <span className="flex size-40 shrink-0 items-center justify-center rounded-full bg-surface-subtle">
                        <Icon name="search" size={24} />
                      </span>
                      <span className="flex min-w-0 flex-1 flex-col gap-4">
                        <span className="truncate text-body-b1 text-text-primary">
                          {place.name}
                        </span>
                        <span className="truncate text-body-b3 text-text-muted">
                          {place.neighborhood}
                        </span>
                      </span>
                      <span className="shrink-0 rounded-md bg-surface-brand-light px-12 py-4 text-caption-c1 text-text-brand">
                        {place.category}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-16 py-24 text-body-b3 text-text-muted" role="status">
                {normalizedQuery ? '검색한 장소가 없어요.' : '장소 이름을 입력해주세요.'}
              </p>
            )}
            {isFetchingNextPage ? (
              <p className="px-16 py-12 text-center text-body-b3 text-text-muted" role="status">
                장소를 더 불러오고 있어요.
              </p>
            ) : null}
            {isFetchNextPageError ? (
              <div className="flex flex-col items-center gap-12 px-16 py-12" role="alert">
                <p className="text-body-b3 text-text-muted">장소를 더 불러오지 못했어요.</p>
                <Button onClick={() => void fetchNextPage()} size="sm">
                  다시 시도
                </Button>
              </div>
            ) : null}
            {hasNextPage && !isFetchNextPageError ? (
              <div aria-hidden="true" className="h-1" ref={loadMoreTriggerRef} />
            ) : null}
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
