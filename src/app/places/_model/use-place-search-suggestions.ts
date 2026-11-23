'use client';

import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';

import { placeSearchInfiniteQueryOptions } from '@/shared/api';

import { toPlaceSummary } from './place';

export function usePlaceSearchSuggestions(query: string) {
  const normalizedQuery = query.trim();
  const [debouncedQuery, setDebouncedQuery] = useState(normalizedQuery);
  useEffect(() => {
    if (normalizedQuery === debouncedQuery) return;
    const timeout = window.setTimeout(() => setDebouncedQuery(normalizedQuery), 250);
    return () => window.clearTimeout(timeout);
  }, [normalizedQuery, debouncedQuery]);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null);
  const placesQuery = useInfiniteQuery({
    ...placeSearchInfiniteQueryOptions({ keyword: debouncedQuery }),
    enabled: Boolean(normalizedQuery) && normalizedQuery === debouncedQuery,
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });
  const isUpdating =
    Boolean(normalizedQuery) &&
    (normalizedQuery !== debouncedQuery || placesQuery.isPlaceholderData);
  const canUseResults = Boolean(normalizedQuery) && !isUpdating;
  const allPlaces = Array.from(
    new Map(
      (placesQuery.data?.pages.flatMap((page) => page.content) ?? []).map((place) => {
        const summary = toPlaceSummary(place);
        return [summary.id, summary] as const;
      }),
    ).values(),
  );
  const suggestions = normalizedQuery ? allPlaces : [];
  const { fetchNextPage, hasNextPage, isFetchNextPageError, isFetchingNextPage } = placesQuery;

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [debouncedQuery]);

  useEffect(() => {
    const root = scrollContainerRef.current;
    const target = loadMoreTriggerRef.current;

    if (
      !root ||
      !target ||
      !canUseResults ||
      !hasNextPage ||
      isFetchingNextPage ||
      isFetchNextPageError
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          void fetchNextPage();
        }
      },
      {
        root,
        rootMargin: '0px 0px 80px 0px',
      },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [
    fetchNextPage,
    hasNextPage,
    isFetchNextPageError,
    isFetchingNextPage,
    canUseResults,
    suggestions.length,
  ]);

  return {
    normalizedQuery,
    suggestions,
    scrollContainerRef,
    loadMoreTriggerRef,
    isUpdating,
    isError: canUseResults && placesQuery.isError,
    isLoading:
      Boolean(normalizedQuery) && (placesQuery.isLoading || (isUpdating && !suggestions.length)),
    refetch: placesQuery.refetch,
    fetchNextPage,
    hasNextPage: canUseResults && hasNextPage,
    isFetchNextPageError: canUseResults && isFetchNextPageError,
    isFetchingNextPage: canUseResults && isFetchingNextPage,
  };
}
