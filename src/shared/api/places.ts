import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { apiRequest } from './api-client';

export const placeCategorySchema = z.enum([
  'RESTAURANT',
  'CAFE_DESSERT',
  'EXHIBITION_MUSEUM',
  'PERFORMANCE',
  'EXPERIENCE',
  'PLAY_LEISURE',
  'NATURE_WALK',
  'SHOPPING',
  'LANDMARK_VIEW',
]);

export const placeRegionFilterSchema = z.object({
  sidoCode: z.string().regex(/^\d{2}$/),
  sigunguCodes: z.array(z.string().regex(/^\d{3}$/)),
});

export const placeSchema = z.object({
  placeId: z.number().int(),
  name: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  address: z.string(),
  category: placeCategorySchema,
  viewCount: z.number().int().nonnegative(),
  liked: z.boolean(),
  imageUrls: z.array(z.string()),
});

export const placesPageSchema = z.object({
  content: z.array(placeSchema),
  page: z.number().int().nonnegative(),
  size: z.number().int().min(1).max(100),
  totalElements: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
});

const placesParamsSchema = z.object({
  regions: z.array(placeRegionFilterSchema).optional(),
  categories: z.array(placeCategorySchema).optional(),
  page: z.number().int().nonnegative().default(0),
  size: z.number().int().min(1).max(100).default(20),
  sort: z.literal('LATEST').default('LATEST'),
});

export type PlaceCategory = z.infer<typeof placeCategorySchema>;
export type PlaceRegionFilter = z.infer<typeof placeRegionFilterSchema>;
export type Place = z.infer<typeof placeSchema>;
export type PlacesPage = z.infer<typeof placesPageSchema>;
export type PlacesParams = Omit<z.input<typeof placesParamsSchema>, 'page'> & { query?: string };
export type PlacesPageParams = PlacesParams & { page?: number };

type RequestOptions = { signal?: AbortSignal };

export function serializePlacesParams(params: PlacesPageParams = {}) {
  const { regions, categories, page, size, sort } = placesParamsSchema.parse(params);
  return {
    page,
    size,
    sort,
    ...(regions?.length ? { regions: JSON.stringify(regions) } : {}),
    ...(categories?.length ? { categories: categories.join(',') } : {}),
  };
}

export async function getPlaces(
  params: PlacesPageParams = {},
  { signal }: RequestOptions = {},
): Promise<PlacesPage> {
  const data = await apiRequest<unknown>('/api/v1/places', {
    query: serializePlacesParams(params),
    signal,
  });
  return placesPageSchema.parse(data);
}

export async function getAllPlaces(
  params: PlacesParams = {},
  options: RequestOptions = {},
): Promise<Place[]> {
  const firstPage = await getPlaces({ ...params, page: 0 }, options);
  const places = [...firstPage.content];
  for (let page = 1; page < firstPage.totalPages; page += 1) {
    const nextPage = await getPlaces({ ...params, page }, options);
    places.push(...nextPage.content);
  }
  return places;
}

export function placesInfiniteQueryOptions(params: PlacesParams = {}) {
  const request = serializePlacesParams(params);
  return infiniteQueryOptions({
    queryKey: ['places', 'infinite', request, params.query ?? ''],
    initialPageParam: 0,
    queryFn: ({ pageParam, signal }) => getPlaces({ ...params, page: pageParam }, { signal }),
    getNextPageParam: (lastPage) =>
      lastPage.page + 1 < lastPage.totalPages ? lastPage.page + 1 : undefined,
  });
}

export function usePlacesInfiniteQuery(params: PlacesParams = {}) {
  return useInfiniteQuery(placesInfiniteQueryOptions(params));
}
