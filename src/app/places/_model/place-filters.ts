import type { PlaceCategory, PlacesParams, Region } from '@/shared/api';

import type { PlaceSummary } from './place';

export interface PlaceRegionSelection {
  regionId: string;
  districtIds: string[];
}

export type PlaceSort = NonNullable<PlacesParams['sort']>;

export function normalizePlaceSort(value: string | string[] | undefined): PlaceSort {
  return value === 'LATEST' ? 'LATEST' : 'POPULAR';
}

export interface PlaceFilterState {
  regions: PlaceRegionSelection[];
  conceptIds: string[];
}

/** 시/도 식별자와 표시 이름 및 평면 구/군 목록 */
export interface RegionOption {
  id: string;
  label: string;
  districts: readonly { id: string; label: string; parentId?: string; shortLabel?: string }[];
}

/** 2열 시/군/구 항목과 3열 세부 지역 하위 목록 묶음 */
export interface PlaceDistrictGroup {
  district: RegionOption['districts'][number];
  children: readonly RegionOption['districts'][number][];
}

/**
 * 시/도의 구/군 목록을 `parentId` 기준으로 2열 시/군/구와 3열 세부 지역 그룹으로 묶는다.
 * 부모가 없는 항목은 단독 그룹으로 유지하고, 자식 항목은 부모의 `children` 배열로 분류한다.
 *
 * @param region 구/군 목록이 포함된 시/도 옵션
 * @returns 2열 시/군/구 및 3열 세부 지역 계층 그룹 목록
 */
export function getPlaceDistrictGroups(region: RegionOption): PlaceDistrictGroup[] {
  const groups = region.districts.map((district) => ({
    district,
    children: [] as RegionOption['districts'][number][],
  }));
  const byId = new Map(groups.map((group) => [group.district.id, group]));
  return groups.filter((group) => {
    const parentId = group.district.parentId;
    const parent = parentId ? byId.get(parentId) : undefined;
    if (!parent || parent === group) return true;
    parent.children.push(group.district);
    return false;
  });
}

export const MAX_PLACE_FILTERS = 12;
export const MAX_PLACE_DISTRICTS = 3;

/** 서버 이름은 유지하고 좁은 시/도 탭에만 적용하는 약칭 매핑 */
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

/**
 * API 지역 응답 목록을 장소 필터에서 사용하는 시/도 및 평면 구/군 목록 구조로 변환한다.
 * 하위 `subRegions`는 부모 이름을 접두어로 붙인 전체 이름(`label`), 짧은 이름(`shortLabel`), `parentId`를 갖는 평면 항목으로 펼치고 정해진 시/도 순서로 정렬한다.
 *
 * @param regions 백엔드 지역 API 응답 목록
 * @returns 필터 선택용으로 변환 및 정렬된 지역 옵션 목록
 */
export function toPlaceRegions(regions: readonly Region[]): RegionOption[] {
  return regions
    .map((region) => ({
      id: region.sidoCode,
      label: regionLabels[region.sidoCode] ?? region.sidoName,
      districts: region.sigungus.flatMap((district) => [
        { id: district.sigunguCode, label: district.sigunguName },
        ...district.subRegions.map((sub) => ({
          id: sub.sigunguCode,
          label: `${district.sigunguName} ${sub.sigunguName}`,
          shortLabel: sub.sigunguName,
          parentId: district.sigunguCode,
        })),
      ]),
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
  { id: 'restaurant', label: '음식점', categoryTerms: ['음식점'], apiCategory: 'RESTAURANT' },
  { id: 'cafe', label: '카페·디저트', categoryTerms: ['카페'], apiCategory: 'CAFE_DESSERT' },
  {
    id: 'exhibition',
    label: '전시·박물관',
    categoryTerms: ['전시'],
    apiCategory: 'EXHIBITION_MUSEUM',
  },
  { id: 'performance', label: '공연', categoryTerms: ['공연'], apiCategory: 'PERFORMANCE' },
  { id: 'experience', label: '체험', categoryTerms: ['체험'], apiCategory: 'EXPERIENCE' },
  {
    id: 'leisure',
    label: '놀이·레저',
    categoryTerms: ['놀거리', '놀이', '레저'],
    apiCategory: 'PLAY_LEISURE',
  },
  { id: 'nature', label: '자연·산책', categoryTerms: ['자연', '산책'], apiCategory: 'NATURE_WALK' },
  { id: 'shopping', label: '쇼핑', categoryTerms: ['쇼핑'], apiCategory: 'SHOPPING' },
  {
    id: 'landmark',
    label: '명소·전망',
    categoryTerms: ['명소', '전망'],
    apiCategory: 'LANDMARK_VIEW',
  },
] as const;

/** 선택한 화면 필터를 장소 목록 API 파라미터로 변환한다. */
export function toPlaceApiParams(
  filters: PlaceFilterState,
  query = '',
  regions: readonly RegionOption[] = [],
) {
  const selectedCategories = placeConcepts.filter((concept) =>
    filters.conceptIds.includes(concept.id),
  );
  return {
    ...(filters.regions.length
      ? {
          regions: filters.regions.map(({ regionId, districtIds }) => {
            if (districtIds.length === 0) return { sidoCode: regionId, sigunguCodes: [] };
            const region = regions.find((item) => item.id === regionId);
            const groups = region ? getPlaceDistrictGroups(region) : [];
            const sigunguCodes = districtIds.flatMap((districtId) => {
              const group = groups.find(({ district }) => district.id === districtId);
              return group?.children.length
                ? [districtId, ...group.children.map((child) => child.id)]
                : [districtId];
            });
            return { sidoCode: regionId, sigunguCodes: [...new Set(sigunguCodes)] };
          }),
        }
      : {}),
    ...(selectedCategories.length
      ? { categories: selectedCategories.map((concept) => concept.apiCategory as PlaceCategory) }
      : {}),
    query,
    ...(query.trim() ? { size: 100 } : {}),
  };
}

export const emptyPlaceFilters: PlaceFilterState = {
  regions: [],
  conceptIds: [],
};

/**
 * 시/도 전체 또는 선택한 구/군 수에 카테고리 수를 더한다.
 * @param filters 현재 장소 필터 상태
 * @returns 선택된 필터의 총 개수
 */
export function getPlaceFilterCount(filters: PlaceFilterState) {
  return getPlaceRegionFilterCount(filters) + filters.conceptIds.length;
}

/** 시/도 전체는 1개, 세부 지역은 선택한 구/군 개수로 합산한다. */
export function getPlaceRegionFilterCount(filters: PlaceFilterState) {
  return filters.regions.reduce((count, region) => count + (region.districtIds.length || 1), 0);
}

/**
 * 하나의 시/도와 최대 3개 구/군을 선택하며 이전 시/도의 선택은 교체한다.
 * 지역 및 전체 필터 개수를 초과하면 원래 상태를 반환한다.
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
 * 2열 부모 시/군/구와 3열 세부 지역 계층 관계를 반영하여 구/군 선택을 전환한다.
 * 부모 선택 시 기존 자식 선택을 대체하고, 모든 자식 선택 시 부모 1개로 합치며, 최대 3개 선택 상한을 검증한다.
 *
 * @param filters 현재 장소 필터 상태
 * @param regionId 대상 시/도 ID
 * @param districtId 선택 또는 해제할 구/군 ID
 * @param region 계층 정보를 포함한 시/도 옵션
 * @returns 갱신된 장소 필터 상태
 */
export function togglePlaceGroupedDistrictSelection(
  filters: PlaceFilterState,
  regionId: string,
  districtId: string,
  region: RegionOption,
): PlaceFilterState {
  const group = getPlaceDistrictGroups(region).find(
    (option) =>
      option.district.id === districtId || option.children.some((child) => child.id === districtId),
  );
  if (!group || group.children.length === 0)
    return togglePlaceDistrictSelection(filters, regionId, districtId);
  const selected = filters.regions[0];
  const sameRegion = selected?.regionId === regionId;
  const current = sameRegion ? selected.districtIds : [];
  const isParent = group.district.id === districtId;
  const siblings = group.children.map((child) => child.id);
  const withoutGroup = current.filter((id) => id !== group.district.id && !siblings.includes(id));
  let nextIds: string[];
  if (isParent) {
    nextIds = current.includes(districtId) ? withoutGroup : [...withoutGroup, districtId];
  } else if (current.includes(group.district.id)) {
    nextIds = [...withoutGroup, districtId];
  } else if (current.includes(districtId)) {
    nextIds = current.filter((id) => id !== districtId);
  } else {
    const nextChildren = [...current.filter((id) => siblings.includes(id)), districtId];
    nextIds =
      nextChildren.length === siblings.length
        ? [...withoutGroup, group.district.id]
        : [...current, districtId];
  }
  if (nextIds.length === 0) return { ...filters, regions: [] };
  if (!current.includes(districtId) && getPlaceRegionFilterCount(filters) >= MAX_PLACE_DISTRICTS)
    return filters;
  return updatePlaceRegionSelection(filters, regionId, nextIds);
}

/**
 * 계층 구조가 없는 일반 구/군 선택을 전환한다.
 * 이미 선택된 항목은 제거하고, 미선택 항목은 최대 3개 선택 상한을 확인한 뒤 추가한다.
 *
 * @param filters 현재 장소 필터 상태
 * @param regionId 대상 시/도 ID
 * @param districtId 선택 또는 해제할 구/군 ID
 * @returns 갱신된 장소 필터 상태
 */
export function togglePlaceDistrictSelection(
  filters: PlaceFilterState,
  regionId: string,
  districtId: string,
): PlaceFilterState {
  const selected = filters.regions[0];
  const sameRegion = selected?.regionId === regionId;
  const districtIds = sameRegion ? selected.districtIds : [];
  if (sameRegion && districtIds.includes(districtId)) {
    const remaining = districtIds.filter((id) => id !== districtId);
    return { ...filters, regions: remaining.length ? [{ regionId, districtIds: remaining }] : [] };
  }
  if (getPlaceRegionFilterCount(filters) >= MAX_PLACE_DISTRICTS) return filters;
  return updatePlaceRegionSelection(filters, regionId, [...districtIds, districtId]);
}

/**
 * 시/도 전체 선택을 전환한다.
 * 이미 시/도 전체가 선택된 상태면 해제하고, 미선택 상태면 하위 구/군 선택을 비운 시/도 전체로 설정한다.
 *
 * @param filters 현재 장소 필터 상태
 * @param regionId 대상 시/도 ID
 * @returns 갱신된 장소 필터 상태
 */
export function togglePlaceRegionWhole(
  filters: PlaceFilterState,
  regionId: string,
): PlaceFilterState {
  if (filters.regions[0]?.regionId === regionId && filters.regions[0].districtIds.length === 0) {
    return { ...filters, regions: [] };
  }
  if (getPlaceRegionFilterCount(filters) >= MAX_PLACE_DISTRICTS) return filters;
  return updatePlaceRegionSelection(filters, regionId, []);
}

/**
 * 검색어와 필터 상태를 `/places` 경로의 검색 파라미터로 직렬화한다.
 * 검색어 앞뒤 공백을 제거하고, 시/도와 소속을 포함한 구/군 및 카테고리를 반복 파라미터로 추가한다.
 * @param query 검색어
 * @param filters 적용할 장소 필터 상태
 * @returns 필터와 검색어가 포함된 장소 목록 경로
 */
export function getPlaceSearchHref(
  query: string,
  filters: PlaceFilterState,
  sort: PlaceSort = 'POPULAR',
) {
  const params = new URLSearchParams();
  const normalizedQuery = query.trim();

  if (normalizedQuery) params.set('q', normalizedQuery);
  filters.regions.forEach(({ regionId, districtIds }) => {
    params.append('region', regionId);
    districtIds.forEach((districtId) => params.append('district', `${regionId}:${districtId}`));
  });
  filters.conceptIds.forEach((conceptId) => params.append('concept', conceptId));
  if (getPlaceFilterCount(filters) > 0) params.set('sort', sort);

  const queryString = params.toString();
  return queryString ? `/places?${queryString}` : '/places';
}

/**
 * URL 검색 파라미터를 유효하고 중복 없는 장소 필터 상태로 정규화한다.
 * 지역 목록을 받기 전에는 코드 형식만 검사해 URL 선택을 보존하고, 조회 후 실제 소속을 검증한다.
 * 알 수 없는 지역/구/군/카테고리를 제외하고 전체 필터 수를 최대 개수로 제한한다.
 * @param params URL 검색 파라미터
 * @param regionOptions 검증에 사용할 지역 옵션 목록
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

/** URL에서 복원한 선택과 모달의 임시 선택을 같은 지역 목록으로 검증한다. */
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
 * 검색어와 선택 필터에 모두 맞는 장소만 입력 순서대로 반환한다.
 * 검색어, 지역, 카테고리 조건은 AND로 결합하고, 여러 지역과 여러 카테고리는 각각 OR로 비교한다.
 * @param places 검색할 장소 목록
 * @param query 장소명, 분류, 지역 등에서 찾을 검색어
 * @param filters 적용할 지역/구/군/카테고리 필터
 * @param regionOptions 부모/자식 계층 매칭을 위한 지역 옵션 목록
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
          (region.districtIds.length === 0 ||
            region.districtIds.includes(place.districtId ?? '') ||
            region.districtIds.some((id) =>
              getPlaceDistrictGroups(
                regionOptions.find((option) => option.id === region.regionId) ?? {
                  id: '',
                  label: '',
                  districts: [],
                },
              ).some(
                (group) =>
                  group.district.id === id &&
                  group.children.some((child) => child.id === place.districtId),
              ),
            )),
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
 * 지역 ID에 해당하는 표시 이름을 반환한다.
 * @param id 조회할 지역 ID (`null`인 경우 빈 문자열 반환)
 * @param regionOptions 지역 옵션 목록
 * @returns 지역 표시 이름 또는 빈 문자열
 */
export function getRegionLabel(id: string | null, regionOptions: readonly RegionOption[]) {
  return regionOptions.find((region) => region.id === id)?.label ?? '';
}

/**
 * 지역과 구/군 ID에 해당하는 구/군 표시 이름을 반환한다.
 * @param regionId 구/군이 속한 지역 ID
 * @param districtId 조회할 구/군 ID
 * @param regionOptions 지역 옵션 목록
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
