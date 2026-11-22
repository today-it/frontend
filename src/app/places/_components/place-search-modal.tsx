'use client';

import { Dialog } from '@base-ui/react/dialog';
import { type ReactNode, useRef, useState } from 'react';

import { cn } from '@/shared/lib';
import { Button, Chip, Icon, ModalBackdrop, ModalTitle, RegionRow } from '@/shared/ui';

import {
  MAX_PLACE_FILTERS,
  placeConcepts,
  type PlaceFilterState,
  type RegionOption,
} from '../_model/place-filters';
import { usePlaceFilterModalState } from '../_model/use-place-filter-modal-state';
import { usePlacesSearch } from '../_model/use-places-search';
import { PlaceFilterBar, type PlaceFilterTab } from './place-filter-bar';
import { PlaceFilterChips } from './place-filter-chips';

export type { PlaceFilterTab };

export interface PlaceSearchModalProps {
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
  const {
    draftFilters,
    selectedCount,
    regionFilterCount,
    activeRegionId,
    selectedRegion,
    districtIds,
    districtGroups,
    activeDistrictId,
    activeDistrict,
    isWholeRegionSelected,
    isWholeRegionDisabled,
    isDistrictDisabled,
    setDraftFilters,
    selectRegion,
    selectDistrict,
    toggleWholeRegion,
    toggleDistrict,
    toggleConcept,
    clearConcepts,
    resetFilters,
  } = usePlaceFilterModalState({ initialFilters, regions, regionsReady });
  const hasSearchConditions = Boolean(query.trim() || selectedCount);
  const canSubmit = hasSearchConditions && regionsReady;
  const { placesQuery: previewQuery, isPlacesError: isPreviewError } = usePlacesSearch({
    mode: 'preview',
    initialFilters: draftFilters,
    query,
    regions,
    regionsReady,
  });
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
            regionCount={regionFilterCount}
          />

          <div
            className={cn(
              'flex min-h-0 w-full flex-col overflow-hidden rounded-3xl bg-surface-default',
              activeTab === 'region' && 'sm:h-[634px]',
            )}
          >
            <div
              aria-label={activeTab === 'region' ? '지역 선택 목록' : '카테고리 선택 목록'}
              className="min-h-0 flex-1 overflow-y-auto px-24 pt-28 outline-none focus-visible:ring-2 focus-visible:ring-border-active focus-visible:ring-inset sm:px-32"
              role="region"
              tabIndex={0}
            >
              {activeTab === 'region' ? (
                <div className="flex flex-col gap-20">
                  {regionNotice}
                  <div
                    className="grid min-h-0 grid-cols-1 overflow-hidden rounded-2xl border border-border-default sm:h-[330px] sm:grid-cols-3"
                    data-slot="region-columns"
                  >
                    <div className="flex h-[180px] min-h-0 min-w-0 flex-col border-b border-border-default sm:h-auto sm:border-r sm:border-b-0">
                      <p className="flex h-40 shrink-0 items-center px-16 text-caption-c1 text-text-tertiary">
                        시/도
                      </p>
                      <div className="min-h-0 overflow-y-auto">
                        {regions.map((region) => (
                          <button
                            className={cn(
                              'flex h-48 w-full shrink-0 cursor-pointer items-center px-16 text-left text-body-b2 text-text-primary outline-none focus-visible:ring-2 focus-visible:ring-border-active focus-visible:ring-inset',
                              activeRegionId === region.id && 'bg-surface-subtle',
                            )}
                            aria-current={activeRegionId === region.id ? 'true' : undefined}
                            key={region.id}
                            onClick={() => selectRegion(region.id)}
                            type="button"
                          >
                            <span className="truncate">{region.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex h-[220px] min-h-0 min-w-0 flex-col border-b border-border-default sm:h-auto sm:border-r sm:border-b-0">
                      <div className="flex h-40 shrink-0 items-center gap-8 px-16 text-text-tertiary">
                        <span className="shrink-0 text-caption-c1">시/군/구</span>
                        <span className="min-w-0 truncate text-caption-c2">최대 3개 선택</span>
                      </div>
                      <div className="min-h-0 overflow-y-auto">
                        {selectedRegion ? (
                          <>
                            <RegionRow
                              label="전체"
                              checked={isWholeRegionSelected}
                              checkDisabled={isWholeRegionDisabled}
                              onCheckedChange={toggleWholeRegion}
                            />
                            {districtGroups.length === 0 ? (
                              <p className="px-16 py-12 text-caption-c2 text-text-tertiary">
                                선택할 시/군/구가 없어요. 시/도 전체로 검색할 수 있어요.
                              </p>
                            ) : null}
                            {districtGroups.map(({ district, children }) => {
                              const checked = districtIds.includes(district.id);
                              return (
                                <RegionRow
                                  key={district.id}
                                  label={district.label}
                                  checked={checked}
                                  checkDisabled={isDistrictDisabled(district.id)}
                                  onCheckedChange={() => toggleDistrict(district.id)}
                                  onNavigate={
                                    children.length ? () => selectDistrict(district.id) : undefined
                                  }
                                  selected={activeDistrictId === district.id}
                                />
                              );
                            })}
                          </>
                        ) : null}
                      </div>
                    </div>
                    <div className="flex h-[120px] min-h-0 min-w-0 flex-col sm:h-auto">
                      <p className="flex h-40 shrink-0 items-center px-16 text-caption-c1 text-text-tertiary">
                        세부 지역
                      </p>
                      <div className="min-h-0 overflow-y-auto">
                        {activeDistrict?.children.length ? (
                          activeDistrict.children.map((child) => {
                            const checked = districtIds.includes(child.id);
                            return (
                              <RegionRow
                                key={child.id}
                                label={child.shortLabel ?? child.label}
                                checked={checked}
                                checkDisabled={isDistrictDisabled(child.id)}
                                onCheckedChange={() => toggleDistrict(child.id)}
                              />
                            );
                          })
                        ) : (
                          <p className="px-16 py-12 text-caption-c2 text-text-tertiary">
                            세부 지역 정보가 제공되지 않아요
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <FilterGroup label="카테고리">
                  <Chip
                    aria-label="카테고리 전체 선택 해제"
                    onPressedChange={clearConcepts}
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
                    장소 보기
                  </Button>
                  {hasSearchConditions && isPreviewError ? (
                    <button
                      className="text-caption-c2 text-text-secondary underline"
                      onClick={() => void previewQuery.refetch()}
                      type="button"
                    >
                      장소 수 다시 확인
                    </button>
                  ) : null}
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
