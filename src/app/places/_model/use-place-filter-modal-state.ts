'use client';

import { useState } from 'react';

import {
  emptyPlaceFilters,
  getPlaceDistrictGroups,
  getPlaceFilterCount,
  getPlaceRegionFilterCount,
  MAX_PLACE_DISTRICTS,
  MAX_PLACE_FILTERS,
  type PlaceFilterState,
  type RegionOption,
  togglePlaceGroupedDistrictSelection,
  togglePlaceRegionWhole,
  validatePlaceFilters,
} from './place-filters';

interface UsePlaceFilterModalStateOptions {
  initialFilters: PlaceFilterState;
  regions: readonly RegionOption[];
  regionsReady: boolean;
}

export function usePlaceFilterModalState({
  initialFilters,
  regions,
  regionsReady,
}: UsePlaceFilterModalStateOptions) {
  const [draft, setDraft] = useState<PlaceFilterState | null>(null);
  const draftFilters = validatePlaceFilters(
    draft ?? initialFilters,
    regionsReady ? regions : undefined,
  );
  const selectedCount = getPlaceFilterCount(draftFilters);
  const regionSelection = draftFilters.regions[0];
  const [viewRegionId, setViewRegionId] = useState<string | null>(
    regionSelection?.regionId ?? regions[0]?.id ?? null,
  );
  const activeRegionId = regions.some((region) => region.id === viewRegionId)
    ? viewRegionId
    : (regions[0]?.id ?? null);
  const selectedRegion = regions.find((region) => region.id === activeRegionId);
  const districtIds =
    regionSelection?.regionId === activeRegionId ? regionSelection.districtIds : [];
  const districtGroups = selectedRegion ? getPlaceDistrictGroups(selectedRegion) : [];
  const [viewDistrictId, setViewDistrictId] = useState<string | null>(null);
  const activeDistrictId = districtGroups.some((group) => group.district.id === viewDistrictId)
    ? viewDistrictId
    : (districtGroups.find((group) =>
        group.children.some((child) => districtIds.includes(child.id)),
      )?.district.id ?? null);
  const activeDistrict = districtGroups.find((group) => group.district.id === activeDistrictId);

  function setDraftFilters(next: PlaceFilterState) {
    setViewDistrictId(activeDistrictId);
    setDraft(next);
  }

  function selectRegion(regionId: string) {
    setViewRegionId(regionId);
    setViewDistrictId(null);
  }

  function toggleDistrict(districtId: string) {
    if (!activeRegionId) return;
    if (selectedRegion)
      setDraftFilters(
        togglePlaceGroupedDistrictSelection(
          draftFilters,
          activeRegionId,
          districtId,
          selectedRegion,
        ),
      );
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

  /** 모든 임시 필터를 초기화한다. */
  function resetFilters() {
    setDraftFilters(emptyPlaceFilters);
  }

  const regionFilterCount = getPlaceRegionFilterCount(draftFilters);
  const isWholeRegionSelected =
    regionSelection?.regionId === activeRegionId && districtIds.length === 0;
  const isWholeRegionDisabled =
    Boolean(selectedRegion) &&
    (regionFilterCount >= MAX_PLACE_DISTRICTS ||
      togglePlaceRegionWhole(draftFilters, activeRegionId!) === draftFilters) &&
    !isWholeRegionSelected;

  function isDistrictDisabled(districtId: string) {
    return (
      !districtIds.includes(districtId) &&
      togglePlaceGroupedDistrictSelection(
        draftFilters,
        activeRegionId!,
        districtId,
        selectedRegion!,
      ) === draftFilters
    );
  }

  function toggleWholeRegion() {
    setDraftFilters(togglePlaceRegionWhole(draftFilters, activeRegionId!));
  }

  function clearConcepts() {
    setDraftFilters({ ...draftFilters, conceptIds: [] });
  }

  return {
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
    selectDistrict: setViewDistrictId,
    toggleWholeRegion,
    toggleDistrict,
    toggleConcept,
    clearConcepts,
    resetFilters,
  };
}
