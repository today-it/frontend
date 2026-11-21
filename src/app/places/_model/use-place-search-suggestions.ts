'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import { placeSearchInfiniteQueryOptions } from '@/shared/api';

import { toPlaceSummary } from './place';

export function usePlaceSearchSuggestions(query: string) {
  const normalizedQuery = query.trim();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null);
  const placesQuery = useInfiniteQuery({
    ...placeSearchInfiniteQueryOptions({ keyword: normalizedQuery }),
    enabled: Boolean(normalizedQuery),
    staleTime: 5 * 60 * 1000,
  });
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
  }, [normalizedQuery]);

  useEffect(() => {
    const root = scrollContainerRef.current;
    const target = loadMoreTriggerRef.current;

    if (
      !root ||
      !target ||
      !normalizedQuery ||
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
    normalizedQuery,
    suggestions.length,
  ]);

  return {
    normalizedQuery,
    suggestions,
    scrollContainerRef,
    loadMoreTriggerRef,
    isError: placesQuery.isError,
    isLoading: placesQuery.isLoading,
    refetch: placesQuery.refetch,
    fetchNextPage,
    hasNextPage,
    isFetchNextPageError,
    isFetchingNextPage,
  };
}
