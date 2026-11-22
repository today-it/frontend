'use client';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import {
  placeSearchInfiniteQueryOptions,
  placesInfiniteQueryOptions,
  regionQueryOptions,
} from '@/shared/api';

import { matchesPlaceName, toPlaceSummary } from './place';
import {
  getPlaceFilterCount,
  normalizePlaceFilters,
  type PlaceFilterState,
  type PlaceSort,
  type RegionOption,
  toPlaceApiParams,
  toPlaceRegions,
  validatePlaceFilters,
} from './place-filters';

type PlacesSearchOptions = {
  query: string;
  initialFilters: PlaceFilterState;
  sort?: PlaceSort;
} & (
  | { mode: 'page'; filterParams?: Record<string, string | string[] | undefined> }
  | { mode: 'preview'; regions: readonly RegionOption[]; regionsReady: boolean }
);

export function usePlacesSearch(options: PlacesSearchOptions) {
  const { query } = options;
  const regionsQuery = useQuery({ ...regionQueryOptions, enabled: options.mode === 'page' });
  const regions =
    options.mode === 'preview'
      ? options.regions
      : regionsQuery.data
        ? toPlaceRegions(regionsQuery.data)
        : undefined;
  const regionsReady = options.mode === 'preview' ? options.regionsReady : regions !== undefined;
  const filters =
    options.mode === 'page' && options.filterParams
      ? normalizePlaceFilters(options.filterParams, regions)
      : validatePlaceFilters(options.initialFilters, regionsReady ? regions : undefined);
  const filterCount = getPlaceFilterCount(filters);
  const isSearchMode = Boolean((options.mode === 'page' ? query : query.trim()) || filterCount);
  const isNameOnlySearch = Boolean(query.trim()) && filterCount === 0;
  const shouldFetchPlaces =
    isSearchMode && (options.mode === 'page' && isNameOnlySearch ? true : regionsReady);
  const placesQuery = useInfiniteQuery({
    ...(isNameOnlySearch
      ? placeSearchInfiniteQueryOptions({ keyword: query })
      : placesInfiniteQueryOptions({
          ...toPlaceApiParams(filters, query, regions ?? []),
          sort: options.sort ?? 'POPULAR',
        })),
    enabled: shouldFetchPlaces,
  });
  const pages = placesQuery.data?.pages ?? [];
  const places = Array.from(
    new Map(
      pages.flatMap((page) =>
        page.content.map((place) => {
          const summary = toPlaceSummary(place);
          return [summary.id, summary] as const;
        }),
      ),
    ).values(),
  );
  const { fetchNextPage, hasNextPage, isFetchingNextPage, isError } = placesQuery;
  const isSearchComplete = isNameOnlySearch || !query.trim() || !hasNextPage;
  const matchedCount = places.filter((place) => matchesPlaceName(place.name, query)).length;
  const isFilteredNameSearch = Boolean(query.trim()) && !isNameOnlySearch;
  const totalCount = isFilteredNameSearch ? matchedCount : (pages[0]?.totalElements ?? 0);
  const previewCount = isFilteredNameSearch
    ? isSearchComplete
      ? matchedCount
      : undefined
    : pages[0]?.totalElements;
  const canFetchRemainingPages = options.mode === 'preview' || shouldFetchPlaces;

  useEffect(() => {
    if (
      canFetchRemainingPages &&
      !isNameOnlySearch &&
      query.trim() &&
      hasNextPage &&
      !isFetchingNextPage &&
      !isError
    ) {
      void fetchNextPage();
    }
  }, [
    canFetchRemainingPages,
    isNameOnlySearch,
    query,
    hasNextPage,
    isFetchingNextPage,
    isError,
    fetchNextPage,
  ]);

  return {
    regionsQuery,
    regions,
    filters,
    isSearchMode,
    isNameOnlySearch,
    shouldFetchPlaces,
    placesQuery,
    places,
    totalCount,
    previewCount,
    isSearchComplete,
    isPlacesError: isError,
  };
}
