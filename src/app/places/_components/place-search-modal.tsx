'use client';

import { Dialog } from '@base-ui/react/dialog';
import { type ReactNode, useState } from 'react';

import { cn } from '@/shared/lib';
import { Button, Chip, FilterTab, Icon, ModalBackdrop, ModalTitle, SearchBar } from '@/shared/ui';

import type { PlaceSummary } from '../_model/place';
import {
  emptyPlaceFilters,
  filterPlaces,
  getPlaceFilterCount,
  MAX_PLACE_FILTERS,
  placeConcepts,
  type PlaceFilterState,
  placeRegions,
} from '../_model/place-filters';
import { PlaceFilterChips } from './place-filter-chips';

type PlaceFilterTab = 'region' | 'category';

interface PlaceSearchModalProps {
  allPlaces: readonly PlaceSummary[];
  initialFilters: PlaceFilterState;
  query: string;
  onQueryChange: (query: string) => void;
  onClose: () => void;
  onSubmit: (query: string, filters: PlaceFilterState) => void;
}

export function PlaceSearchModal({
  allPlaces,
  initialFilters,
  query,
  onQueryChange,
  onClose,
  onSubmit,
}: PlaceSearchModalProps) {
  const [activeTab, setActiveTab] = useState<PlaceFilterTab>('region');
  const [draftFilters, setDraftFilters] = useState(initialFilters);
  const selectedCount = getPlaceFilterCount(draftFilters);
  const previewCount = filterPlaces(allPlaces, query, draftFilters).length;
  const selectedRegion = placeRegions.find((region) => region.id === draftFilters.regionId);
  const districtOptions = selectedRegion?.districts ?? [];

  /**
   * 지역을 선택하거나 해제하고, 지역이 바뀌면 하위 지역 선택을 비웁니다.
   * @param regionId 전환할 지역 ID
   */
  function toggleRegion(regionId: string) {
    const isSelected = draftFilters.regionId === regionId;
    const selectionsWithoutArea = draftFilters.conceptIds.length;

    if (!isSelected && selectionsWithoutArea + 1 > MAX_PLACE_FILTERS) return;

    setDraftFilters({
      ...draftFilters,
      regionId: isSelected ? null : regionId,
      districtIds: [],
    });
  }

  /**
   * 최대 필터 선택 개수를 지키며 구/군 선택을 전환합니다.
   * @param districtId 전환할 구/군 ID
   */
  function toggleDistrict(districtId: string) {
    const isSelected = draftFilters.districtIds.includes(districtId);
    if (!isSelected && selectedCount >= MAX_PLACE_FILTERS) return;

    setDraftFilters({
      ...draftFilters,
      districtIds: isSelected
        ? draftFilters.districtIds.filter((id) => id !== districtId)
        : [...draftFilters.districtIds, districtId],
    });
  }

  /**
   * 최대 필터 선택 개수를 지키며 카테고리 선택을 전환합니다.
   * @param conceptId 전환할 카테고리 ID
   */
  function toggleConcept(conceptId: string) {
    const isSelected = draftFilters.conceptIds.includes(conceptId);
    if (!isSelected && selectedCount >= MAX_PLACE_FILTERS) return;

    setDraftFilters({
      ...draftFilters,
      conceptIds: isSelected
        ? draftFilters.conceptIds.filter((id) => id !== conceptId)
        : [...draftFilters.conceptIds, conceptId],
    });
  }

  /** 현재 지역에서 선택한 모든 구/군을 해제합니다. */
  function clearDistricts() {
    setDraftFilters({ ...draftFilters, districtIds: [] });
  }

  /** 모달의 검색어와 임시 필터 상태를 부모에 전달해 적용합니다. */
  function submitSearch() {
    onSubmit(query, draftFilters);
  }

  return (
    <Dialog.Root
      disablePointerDismissal={false}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
      open
    >
      <Dialog.Portal>
        <ModalBackdrop />
        <Dialog.Popup
          className="fixed top-[calc(var(--spacing-header-height)_+_var(--spacing-18))] left-1/2 z-50 flex max-h-[calc(100dvh_-_var(--spacing-header-height)_-_var(--spacing-18)_-_var(--spacing-24))] w-search-bar-width max-w-[calc(100vw_-_32px)] -translate-x-1/2 flex-col gap-12 overflow-hidden transition-opacity duration-150 outline-none data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none"
          data-slot="modal"
        >
          <ModalTitle className="sr-only">장소 검색 및 필터</ModalTitle>
          <SearchBar
            autoFocus
            className="shrink-0"
            onSearch={submitSearch}
            onValueChange={onQueryChange}
            value={query}
          />
          <div
            aria-label="필터 종류"
            className="flex w-full shrink-0 rounded-full border border-border-default bg-surface-default"
          >
            <FilterTab
              aria-label="지역 필터"
              onPressedChange={(pressed) => {
                if (pressed) setActiveTab('region');
              }}
              pressed={activeTab === 'region'}
              label="지역"
            />
            <FilterTab
              aria-label="카테고리 필터"
              onPressedChange={(pressed) => {
                if (pressed) setActiveTab('category');
              }}
              pressed={activeTab === 'category'}
              label="카테고리"
            />
          </div>

          <div className="flex min-h-0 w-full flex-col overflow-hidden rounded-3xl bg-surface-default">
            <div
              aria-label={activeTab === 'region' ? '지역 선택 목록' : '카테고리 선택 목록'}
              className="min-h-0 flex-1 overflow-y-auto px-24 pt-28 outline-none focus-visible:ring-2 focus-visible:ring-border-active focus-visible:ring-inset sm:px-32"
              role="region"
              tabIndex={0}
            >
              {activeTab === 'region' ? (
                <div className="flex flex-col gap-20">
                  <FilterGroup label="시도">
                    {placeRegions.map((region) => {
                      const isSelected = draftFilters.regionId === region.id;
                      const selectionsAfterChange =
                        draftFilters.conceptIds.length + (isSelected ? 0 : 1);

                      return (
                        <Chip
                          aria-label={`${region.label} 지역 선택`}
                          disabled={!isSelected && selectionsAfterChange > MAX_PLACE_FILTERS}
                          key={region.id}
                          onPressedChange={() => toggleRegion(region.id)}
                          pressed={isSelected}
                        >
                          {region.label}
                        </Chip>
                      );
                    })}
                  </FilterGroup>

                  <FilterGroup label="시/군/구" chipsClassName="h-[168px] content-start">
                    {selectedRegion ? (
                      <>
                        <Chip
                          aria-label={`${selectedRegion.label} 전체 지역 선택`}
                          onPressedChange={clearDistricts}
                          pressed={draftFilters.districtIds.length === 0}
                        >
                          전체
                        </Chip>
                        {districtOptions.map((district) => {
                          const isSelected = draftFilters.districtIds.includes(district.id);

                          return (
                            <Chip
                              aria-label={`${district.label} 선택`}
                              disabled={!isSelected && selectedCount >= MAX_PLACE_FILTERS}
                              key={district.id}
                              onPressedChange={() => toggleDistrict(district.id)}
                              pressed={isSelected}
                            >
                              {district.label}
                            </Chip>
                          );
                        })}
                      </>
                    ) : (
                      <p className="text-caption-c2 text-text-tertiary">
                        시도를 먼저 선택해주세요.
                      </p>
                    )}
                  </FilterGroup>
                </div>
              ) : (
                <FilterGroup label="카테고리">
                  <Chip
                    aria-label="카테고리 전체 선택 해제"
                    onPressedChange={() => setDraftFilters({ ...draftFilters, conceptIds: [] })}
                    pressed={draftFilters.conceptIds.length === 0}
                  >
                    전체
                  </Chip>
                  {placeConcepts.map((concept) => {
                    const isSelected = draftFilters.conceptIds.includes(concept.id);

                    return (
                      <Chip
                        aria-label={`${concept.label} 카테고리 선택`}
                        disabled={!isSelected && selectedCount >= MAX_PLACE_FILTERS}
                        key={concept.id}
                        onPressedChange={() => toggleConcept(concept.id)}
                        pressed={isSelected}
                      >
                        {concept.label}
                      </Chip>
                    );
                  })}
                </FilterGroup>
              )}
            </div>

            <div className="shrink-0 px-24 pt-20 pb-28 sm:px-32">
              <div className="flex flex-col gap-20">
                <div
                  className="flex h-[66px] shrink-0 flex-col gap-12"
                  data-slot="selected-filter-section"
                >
                  <p
                    aria-live="polite"
                    className="flex h-[18px] shrink-0 items-center gap-8 text-caption-c1 text-text-tertiary"
                  >
                    <span>선택한 필터</span>
                    <span>
                      {selectedCount}/{MAX_PLACE_FILTERS}
                    </span>
                  </p>
                  <div
                    aria-label={selectedCount > 0 ? '선택한 필터 목록' : undefined}
                    className="h-chip shrink-0 overflow-y-auto outline-none focus-visible:ring-2 focus-visible:ring-border-active focus-visible:ring-inset"
                    data-slot="selected-filters"
                    role={selectedCount > 0 ? 'region' : undefined}
                    tabIndex={selectedCount > 0 ? 0 : undefined}
                  >
                    <div className="flex flex-wrap gap-8">
                      <PlaceFilterChips filters={draftFilters} onChange={setDraftFilters} />
                    </div>
                  </div>
                </div>

                <div className="h-divider w-full bg-border-default" />

                <div className="flex items-center justify-between gap-12">
                  <button
                    className="inline-flex cursor-pointer items-center gap-4 rounded-sm text-caption-c1 text-text-secondary outline-none focus-visible:ring-2 focus-visible:ring-border-active focus-visible:ring-offset-2 disabled:cursor-default disabled:text-text-disabled"
                    disabled={selectedCount === 0}
                    onClick={() => setDraftFilters(emptyPlaceFilters)}
                    type="button"
                  >
                    <Icon name="refresh" size={16} />
                    선택 초기화
                  </button>
                  <Button disabled={selectedCount === 0} onClick={submitSearch} size="sm">
                    장소 {previewCount}곳 보기
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

interface FilterGroupProps {
  children: ReactNode;
  label: string;
  className?: string;
  chipsClassName?: string;
}

function FilterGroup({ children, label, className, chipsClassName }: FilterGroupProps) {
  return (
    <div aria-label={label} className={cn('flex flex-col gap-12', className)} role="group">
      <p className="text-caption-c1 text-text-tertiary">{label}</p>
      <div className={cn('flex flex-wrap gap-8', chipsClassName)}>{children}</div>
    </div>
  );
}
