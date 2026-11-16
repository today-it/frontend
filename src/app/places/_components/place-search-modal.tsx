'use client';

import { Dialog } from '@base-ui/react/dialog';
import { type ReactNode, useRef, useState } from 'react';

import { cn } from '@/shared/lib';
import { Button, Chip, Icon, ModalBackdrop, ModalTitle } from '@/shared/ui';

import type { PlaceSummary } from '../_model/place';
import {
  emptyPlaceFilters,
  filterPlaces,
  getPlaceFilterCount,
  getPlaceRegionFilterCount,
  MAX_PLACE_FILTERS,
  placeConcepts,
  type PlaceFilterState,
  type RegionOption,
  updatePlaceRegionSelection,
  validatePlaceFilters,
} from '../_model/place-filters';
import { PlaceFilterBar, type PlaceFilterTab } from './place-filter-bar';
import { PlaceFilterChips } from './place-filter-chips';

export type { PlaceFilterTab };

export interface PlaceSearchModalProps {
  allPlaces: readonly PlaceSummary[];
  initialFilters: PlaceFilterState;
  initialTab?: PlaceFilterTab;
  regions: readonly RegionOption[];
  regionNotice?: ReactNode;
  regionsReady?: boolean;
  query: string;
  onClose: (returnTab?: PlaceFilterTab) => void;
  onSubmit: (query: string, filters: PlaceFilterState) => void;
}

/**
 * 장소 목록에서 지역과 카테고리 조건을 선택하는 필터 전용 팝업 컴포넌트입니다.
 *
 * 검색창을 포함하지 않으며, 상단 `PlaceFilterBar`에서 활성화된 탭을 다시 클릭하면 팝업을 닫고 해당 탭으로 포커스를 돌려줍니다.
 */
export function PlaceSearchModal({
  allPlaces,
  regions,
  regionNotice,
  regionsReady = true,
  initialFilters,
  initialTab = 'region',
  query,
  onClose,
  onSubmit,
}: PlaceSearchModalProps) {
  const regionTabRef = useRef<HTMLButtonElement>(null);
  const categoryTabRef = useRef<HTMLButtonElement>(null);
  const [activeTab, setActiveTab] = useState<PlaceFilterTab>(initialTab);
  const [draft, setDraftFilters] = useState<PlaceFilterState | null>(null);
  const draftFilters = validatePlaceFilters(
    draft ?? initialFilters,
    regionsReady ? regions : undefined,
  );
  const selectedCount = getPlaceFilterCount(draftFilters);
  const hasSearchConditions = Boolean(query.trim() || selectedCount);
  const canSubmit = hasSearchConditions && regionsReady;
  const previewCount = filterPlaces(allPlaces, query, draftFilters, regions).length;
  const regionSelection = draftFilters.regions[0];
  const activeRegionId = regionSelection?.regionId ?? null;
  const selectedRegion = regions.find((region) => region.id === activeRegionId);
  const districtIds = regionSelection?.districtIds ?? [];
  const districtOptions = selectedRegion?.districts ?? [];

  /** 시/도를 바꾸면 이전 지역 선택을 교체하고 해당 시/도 칩을 추가한다. */
  function selectRegion(regionId: string) {
    if (activeRegionId === regionId) return;
    setDraftFilters(updatePlaceRegionSelection(draftFilters, regionId, []));
  }

  /** 현재 시/군/구 선택을 최대 3개까지 전환한다. */
  function toggleDistrict(districtId: string) {
    if (!activeRegionId) return;
    const nextDistrictIds = districtIds.includes(districtId)
      ? districtIds.filter((id) => id !== districtId)
      : [...districtIds, districtId];
    setDraftFilters(updatePlaceRegionSelection(draftFilters, activeRegionId, nextDistrictIds));
  }

  /**
   * 최대 필터 선택 개수를 지키며 카테고리 선택을 전환한다.
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

  /** 모든 임시 필터와 현재 시/도 패널을 초기화한다. */
  function resetFilters() {
    setDraftFilters(emptyPlaceFilters);
  }

  /** 현재 검색어 초안과 임시 필터 상태를 부모에 전달해 적용한다. */
  function submitSearch() {
    if (canSubmit) onSubmit(query, draftFilters);
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
          className="fixed top-[calc(var(--spacing-header-height)_+_var(--spacing-18)_+_var(--spacing-search-bar-height)_+_var(--spacing-12))] left-1/2 z-50 flex max-h-[calc(100dvh_-_var(--spacing-header-height)_-_var(--spacing-18)_-_var(--spacing-search-bar-height)_-_var(--spacing-12)_-_var(--spacing-24))] w-search-bar-width max-w-[calc(100vw_-_32px)] -translate-x-1/2 flex-col gap-12 overflow-hidden transition-opacity duration-150 outline-none data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none"
          data-slot="modal"
          finalFocus={false}
          initialFocus={initialTab === 'category' ? categoryTabRef : regionTabRef}
        >
          <ModalTitle className="sr-only">장소 필터</ModalTitle>
          <PlaceFilterBar
            activeTab={activeTab}
            categoryTabRef={categoryTabRef}
            regionTabRef={regionTabRef}
            categoryCount={draftFilters.conceptIds.length}
            onTabClick={(tab) => {
              if (activeTab === tab) {
                onClose(activeTab);
              } else {
                setActiveTab(tab);
              }
            }}
            regionCount={getPlaceRegionFilterCount(draftFilters)}
          />

          <div className="flex min-h-0 w-full flex-col overflow-hidden rounded-3xl bg-surface-default">
            <div
              aria-label={activeTab === 'region' ? '지역 선택 목록' : '카테고리 선택 목록'}
              className="min-h-0 flex-1 overflow-y-auto px-24 pt-28 outline-none focus-visible:ring-2 focus-visible:ring-border-active focus-visible:ring-inset sm:px-32"
              role="region"
              tabIndex={0}
            >
              {activeTab === 'region' ? (
                <div className="flex flex-col gap-20">
                  {regionNotice}
                  <FilterGroup
                    label="시/도"
                    hint="1개 선택"
                    chipsClassName="flex-nowrap gap-0 overflow-x-auto"
                  >
                    {regions.map((region) => (
                      <Chip
                        aria-label={`${region.label} 지역 선택`}
                        key={region.id}
                        onPressedChange={() => selectRegion(region.id)}
                        pressed={activeRegionId === region.id}
                        variant="radio"
                      >
                        {region.label}
                      </Chip>
                    ))}
                  </FilterGroup>

                  <FilterGroup
                    label="시/군/구"
                    hint="최대 3개 선택"
                    chipsClassName="h-[168px] content-start"
                  >
                    {selectedRegion ? (
                      <>
                        {districtOptions.length === 0 ? (
                          <p className="text-caption-c2 text-text-tertiary">
                            선택할 시/군/구가 없어요. 시/도 전체로 검색할 수 있어요.
                          </p>
                        ) : null}
                        {districtOptions.map((district) => {
                          const isSelected = districtIds.includes(district.id);

                          return (
                            <Chip
                              aria-label={`${district.label} 선택`}
                              disabled={
                                !isSelected &&
                                updatePlaceRegionSelection(draftFilters, selectedRegion.id, [
                                  ...districtIds,
                                  district.id,
                                ]) === draftFilters
                              }
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
                      <p className="flex h-full w-full items-center justify-center text-caption-c2 text-text-tertiary">
                        시/도를 먼저 선택해주세요
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
                  className="flex h-[114px] shrink-0 flex-col gap-12"
                  data-slot="selected-filter-section"
                >
                  <p
                    aria-live="polite"
                    className="flex h-[18px] shrink-0 items-center gap-8 text-caption-c1 text-text-tertiary"
                  >
                    <span>선택한 필터</span>
                    <span className="text-caption-c2 text-text-tertiary">
                      {selectedCount}/{MAX_PLACE_FILTERS}
                    </span>
                  </p>
                  <div
                    aria-label={selectedCount > 0 ? '선택한 필터 목록' : undefined}
                    className="h-[84px] shrink-0 overflow-y-auto outline-none focus-visible:ring-2 focus-visible:ring-border-active focus-visible:ring-inset"
                    data-slot="selected-filters"
                    role={selectedCount > 0 ? 'region' : undefined}
                    tabIndex={selectedCount > 0 ? 0 : undefined}
                  >
                    <div className="flex flex-wrap gap-x-8 gap-y-12">
                      {regionsReady ? (
                        <PlaceFilterChips
                          regions={regions}
                          filters={draftFilters}
                          onChange={setDraftFilters}
                        />
                      ) : (
                        <p className="text-caption-c2 text-text-tertiary">지역 정보 확인 중</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="h-divider w-full bg-border-default" />

                <div className="flex items-center justify-between gap-12">
                  <button
                    className="inline-flex cursor-pointer items-center gap-4 rounded-sm text-caption-c1 text-text-secondary outline-none focus-visible:ring-2 focus-visible:ring-border-active focus-visible:ring-offset-2 disabled:cursor-default disabled:text-text-disabled"
                    onClick={resetFilters}
                    type="button"
                  >
                    <Icon name="refresh" size={16} />
                    선택 초기화
                  </button>
                  <Button disabled={!canSubmit} onClick={submitSearch} size="sm">
                    {!regionsReady
                      ? '지역 정보 확인 중'
                      : hasSearchConditions
                        ? `장소 ${previewCount}곳 보기`
                        : '장소 보기'}
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
  hint?: string;
}

function FilterGroup({ children, label, className, chipsClassName, hint }: FilterGroupProps) {
  return (
    <div aria-label={label} className={cn('flex flex-col gap-12', className)} role="group">
      <div className="flex items-center gap-8">
        <p className="text-caption-c1 text-text-tertiary">{label}</p>
        {hint ? <p className="text-caption-c2 text-text-tertiary">{hint}</p> : null}
      </div>
      <div className={cn('flex flex-wrap gap-8', chipsClassName)}>{children}</div>
    </div>
  );
}
