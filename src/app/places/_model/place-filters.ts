import type { Region } from '@/shared/api';

import type { PlaceSummary } from './place';

export interface PlaceRegionSelection {
  regionId: string;
  districtIds: string[];
}

export interface PlaceFilterState {
  regions: PlaceRegionSelection[];
  conceptIds: string[];
}

export interface RegionOption {
  id: string;
  label: string;
  districts: readonly { id: string; label: string }[];
}

export const MAX_PLACE_FILTERS = 12;
export const MAX_PLACE_DISTRICTS = 3;

/** 서버 이름은 유지하고, 좁은 시/도 탭에만 기존 약칭을 사용합니다. */
const regionLabels: Record<string, string> = {
  '11': '서울',
  '12': '전남광주',
  '26': '부산',
  '27': '대구',
  '28': '인천',
  '30': '대전',
  '31': '울산',
  '36': '세종',
  '41': '경기',
  '43': '충북',
  '44': '충남',
  '47': '경북',
  '48': '경남',
  '50': '제주',
  '51': '강원',
  '52': '전북',
};

const regionOrder = [
  '11',
  '26',
  '27',
  '28',
  '30',
  '31',
  '36',
  '41',
  '51',
  '43',
  '44',
  '47',
  '48',
  '52',
  '12',
  '50',
];

export function toPlaceRegions(regions: readonly Region[]): RegionOption[] {
  return regions
    .map((region) => ({
      id: region.sidoCode,
      label: regionLabels[region.sidoCode] ?? region.sidoName,
      districts: region.sigungus.map((district) => ({
        id: district.sigunguCode,
        label: district.sigunguName,
      })),
    }))
    .sort((a, b) => {
      const aIndex = regionOrder.indexOf(a.id);
      const bIndex = regionOrder.indexOf(b.id);
      return (
        (aIndex < 0 ? regionOrder.length : aIndex) - (bIndex < 0 ? regionOrder.length : bIndex)
      );
    });
}

export const placeConcepts = [
  { id: 'restaurant', label: '음식점', categoryTerms: ['음식점'] },
  { id: 'cafe', label: '카페·디저트', categoryTerms: ['카페'] },
  { id: 'exhibition', label: '전시·박물관', categoryTerms: ['전시'] },
  { id: 'performance', label: '공연', categoryTerms: ['공연'] },
  { id: 'experience', label: '체험', categoryTerms: ['체험'] },
  { id: 'leisure', label: '놀이·레저', categoryTerms: ['놀거리', '놀이', '레저'] },
  { id: 'nature', label: '자연·산책', categoryTerms: ['자연', '산책'] },
  { id: 'shopping', label: '쇼핑', categoryTerms: ['쇼핑'] },
  { id: 'landmark', label: '명소·전망', categoryTerms: ['명소', '전망'] },
] as const;

export const emptyPlaceFilters: PlaceFilterState = {
  regions: [],
  conceptIds: [],
};

/**
 * 시/도 전체 또는 선택한 구/군 수에 카테고리 수를 더합니다.
 * @param filters 현재 장소 필터 상태
 * @returns 선택된 필터의 총 개수
 */
export function getPlaceFilterCount(filters: PlaceFilterState) {
  return getPlaceRegionFilterCount(filters) + filters.conceptIds.length;
}

/** 시/도 전체는 1개, 세부 지역은 선택한 구/군 개수로 합산합니다. */
export function getPlaceRegionFilterCount(filters: PlaceFilterState) {
  return filters.regions.reduce((count, region) => count + (region.districtIds.length || 1), 0);
}

/**
 * 하나의 시/도와 최대 3개 구/군을 선택하며, 이전 시/도의 선택은 교체합니다.
 * 지역 및 전체 필터 개수를 넘으면 원래 상태를 반환합니다.
 */
export function updatePlaceRegionSelection(
  filters: PlaceFilterState,
  regionId: string,
  districtIds: string[],
): PlaceFilterState {
  const next = { ...filters, regions: [{ regionId, districtIds }] };
  return districtIds.length > MAX_PLACE_DISTRICTS || getPlaceFilterCount(next) > MAX_PLACE_FILTERS
    ? filters
    : next;
}

/**
 * 검색어와 필터 상태를 `/places` 경로의 검색 파라미터로 직렬화합니다.
 * 검색어 앞뒤 공백을 제거하고, 시/도와 소속을 포함한 구/군 및 카테고리를 반복 파라미터로 추가합니다.
 * @param query 검색어
 * @param filters 적용할 장소 필터 상태
 * @returns 필터와 검색어가 포함된 장소 목록 경로
 */
export function getPlaceSearchHref(query: string, filters: PlaceFilterState) {
  const params = new URLSearchParams();
  const normalizedQuery = query.trim();

  if (normalizedQuery) params.set('q', normalizedQuery);
  filters.regions.forEach(({ regionId, districtIds }) => {
    params.append('region', regionId);
    districtIds.forEach((districtId) => params.append('district', `${regionId}:${districtId}`));
  });
  filters.conceptIds.forEach((conceptId) => params.append('concept', conceptId));

  const queryString = params.toString();
  return queryString ? `/places?${queryString}` : '/places';
}

/**
 * URL 검색 파라미터를 유효하고 중복 없는 장소 필터 상태로 정규화합니다.
 * 지역 목록을 받기 전에는 코드 형식만 검사해 URL 선택을 보존하고, 조회 후 실제 소속을 검증합니다.
 * 알 수 없는 지역/구군/카테고리를 제외하고 전체 필터 수를 최대 개수로 제한합니다.
 * @param params URL 검색 파라미터
 * @returns 검증 및 정규화된 장소 필터 상태
 */
export function normalizePlaceFilters(
  params: Record<string, string | string[] | undefined>,
  regionOptions?: readonly RegionOption[],
): PlaceFilterState {
  const rawRegions = [params.region ?? []].flat();
  const rawDistricts = [params.district ?? []].flat();
  const rawConcepts = [params.concept ?? []].flat();
  let regionFilters: PlaceFilterState = emptyPlaceFilters;

  for (const regionId of new Set(rawRegions)) {
    const region = regionOptions?.find((option) => option.id === regionId);
    if (!/^\d{2}$/.test(regionId) || (regionOptions && !region)) continue;
    const validDistrictIds = [
      ...new Set(
        rawDistricts.map((id) =>
          id.startsWith(`${regionId}:`) ? id.slice(regionId.length + 1) : id,
        ),
      ),
    ].filter(
      (id) =>
        /^\d{3}$/.test(id) &&
        (!regionOptions || region?.districts.some((district) => district.id === id)),
    );
    const remainingRegions = MAX_PLACE_DISTRICTS;
    regionFilters = updatePlaceRegionSelection(
      regionFilters,
      regionId,
      validDistrictIds.slice(0, remainingRegions),
    );
  }
  const { regions } = regionFilters;

  return {
    regions,
    conceptIds: [
      ...new Set(rawConcepts.filter((id) => placeConcepts.some((concept) => concept.id === id))),
    ].slice(0, MAX_PLACE_FILTERS - getPlaceRegionFilterCount({ regions, conceptIds: [] })),
  };
}

/** URL에서 복원한 선택과 모달의 임시 선택을 같은 지역 목록으로 검증합니다. */
export function validatePlaceFilters(filters: PlaceFilterState, regions?: readonly RegionOption[]) {
  return normalizePlaceFilters(
    {
      region: filters.regions.map((region) => region.regionId),
      district: filters.regions.flatMap((region) =>
        region.districtIds.map((id) => `${region.regionId}:${id}`),
      ),
      concept: filters.conceptIds,
    },
    regions,
  );
}

/**
 * 검색어와 선택 필터에 모두 맞는 장소만 입력 순서대로 반환합니다.
 * 검색어, 지역, 카테고리 조건은 AND로 결합하고, 여러 지역과 여러 카테고리는 각각 OR로 비교합니다.
 * @param places 검색할 장소 목록
 * @param query 장소명, 분류, 지역 등에서 찾을 검색어
 * @param filters 적용할 지역/구군/카테고리 필터
 * @returns 검색 및 필터 조건을 만족하는 장소 목록
 */
export function filterPlaces(
  places: readonly PlaceSummary[],
  query: string,
  filters: PlaceFilterState,
  regionOptions: readonly RegionOption[] = [],
) {
  const queryTerms = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  const selectedConcepts = placeConcepts.filter((concept) =>
    filters.conceptIds.includes(concept.id),
  );

  return places.filter((place) => {
    const searchableText = [place.name, place.category, place.neighborhood]
      .concat([
        getRegionLabel(place.regionId ?? null, regionOptions),
        getDistrictLabel(place.regionId ?? null, place.districtId ?? '', regionOptions),
      ])
      .filter(Boolean)
      .join(' ')
      .toLocaleLowerCase();
    const matchesQuery = queryTerms.every((term) => searchableText.includes(term));
    const matchesRegion =
      filters.regions.length === 0 ||
      filters.regions.some(
        (region) =>
          place.regionId === region.regionId &&
          (region.districtIds.length === 0 || region.districtIds.includes(place.districtId ?? '')),
      );
    const matchesConcept =
      selectedConcepts.length === 0 ||
      selectedConcepts.some((concept) =>
        concept.categoryTerms.some((term) => place.category.includes(term)),
      );

    return matchesQuery && matchesRegion && matchesConcept;
  });
}

/**
 * 지역 ID에 해당하는 표시 이름을 반환합니다.
 * @param id 조회할 지역 ID. `null`이면 빈 문자열을 반환합니다.
 * @returns 지역 표시 이름 또는 빈 문자열
 */
export function getRegionLabel(id: string | null, regionOptions: readonly RegionOption[]) {
  return regionOptions.find((region) => region.id === id)?.label ?? '';
}

/**
 * 지역과 구/군 ID에 해당하는 구/군 표시 이름을 반환합니다.
 * @param regionId 구/군이 속한 지역 ID
 * @param districtId 조회할 구/군 ID
 * @returns 구/군 표시 이름 또는 빈 문자열
 */
export function getDistrictLabel(
  regionId: string | null,
  districtId: string,
  regionOptions: readonly RegionOption[],
) {
  return (
    regionOptions
      .find((region) => region.id === regionId)
      ?.districts.find((district) => district.id === districtId)?.label ?? ''
  );
}
