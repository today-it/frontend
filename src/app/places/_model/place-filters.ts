import type { PlaceSummary } from './place';

export interface PlaceFilterState {
  regionId: string | null;
  districtIds: string[];
  conceptIds: string[];
}

export interface RegionOption {
  id: string;
  label: string;
  districts: readonly { id: string; label: string }[];
}

export const MAX_PLACE_FILTERS = 7;

const seoulDistricts = [
  ['jongno', '종로구'],
  ['jung', '중구'],
  ['yongsan', '용산구'],
  ['seongdong', '성동구'],
  ['gwangjin', '광진구'],
  ['dongdaemun', '동대문구'],
  ['jungnang', '중랑구'],
  ['seongbuk', '성북구'],
  ['gangbuk', '강북구'],
  ['dobong', '도봉구'],
  ['nowon', '노원구'],
  ['eunpyeong', '은평구'],
  ['seodaemun', '서대문구'],
  ['mapo', '마포구'],
  ['yangcheon', '양천구'],
  ['gangseo', '강서구'],
  ['guro', '구로구'],
  ['geumcheon', '금천구'],
  ['yeongdeungpo', '영등포구'],
  ['dongjak', '동작구'],
  ['gwanak', '관악구'],
  ['seocho', '서초구'],
  ['gangnam', '강남구'],
  ['songpa', '송파구'],
  ['gangdong', '강동구'],
] as const satisfies readonly (readonly [string, string])[];

const gyeonggiDistricts = [
  ['gapyeong', '가평군'],
  ['goyang', '고양시'],
  ['gwacheon', '과천시'],
  ['gwangmyeong', '광명시'],
  ['gwangju', '광주시'],
  ['guri', '구리시'],
  ['gunpo', '군포시'],
  ['gimpo', '김포시'],
  ['namyangju', '남양주시'],
  ['dongducheon', '동두천시'],
  ['bucheon', '부천시'],
  ['seongnam', '성남시'],
  ['suwon', '수원시'],
  ['siheung', '시흥시'],
  ['ansan', '안산시'],
  ['anseong', '안성시'],
  ['anyang', '안양시'],
  ['yangju', '양주시'],
  ['yangpyeong', '양평군'],
  ['yeoju', '여주시'],
  ['yeoncheon', '연천군'],
  ['osan', '오산시'],
  ['yongin', '용인시'],
  ['uiwang', '의왕시'],
  ['uijeongbu', '의정부시'],
  ['icheon', '이천시'],
  ['paju', '파주시'],
  ['pyeongtaek', '평택시'],
  ['pocheon', '포천시'],
  ['hanam', '하남시'],
  ['hwaseong', '화성시'],
] as const satisfies readonly (readonly [string, string])[];

/**
 * ID와 이름 쌍으로 정의된 구/군 항목을 옵션 객체로 변환합니다.
 * @param entries 구/군 ID와 표시 이름의 순서가 보존된 쌍 목록
 * @returns ID와 이름을 가진 구/군 옵션 목록
 */
function toDistrictOptions(entries: readonly (readonly [string, string])[]) {
  return entries.map(([id, label]) => ({ id, label }));
}

export const placeRegions: readonly RegionOption[] = [
  { id: 'seoul', label: '서울', districts: toDistrictOptions(seoulDistricts) },
  { id: 'busan', label: '부산', districts: [] },
  { id: 'daegu', label: '대구', districts: [] },
  { id: 'incheon', label: '인천', districts: [] },
  { id: 'daejeon', label: '대전', districts: [] },
  { id: 'ulsan', label: '울산', districts: [] },
  { id: 'sejong', label: '세종', districts: [] },
  { id: 'gyeonggi', label: '경기', districts: toDistrictOptions(gyeonggiDistricts) },
  { id: 'gangwon', label: '강원', districts: [] },
  { id: 'chungbuk', label: '충북', districts: [] },
  { id: 'chungnam', label: '충남', districts: [] },
  { id: 'gyeongbuk', label: '경북', districts: [] },
  { id: 'gyeongnam', label: '경남', districts: [] },
  { id: 'jeonbuk', label: '전북', districts: [] },
  { id: 'jeonnam-gwangju', label: '전남광주', districts: [] },
  { id: 'jeju', label: '제주', districts: [] },
];

export const placeConcepts = [
  { id: 'restaurant', label: '음식점', categoryTerms: ['음식점'] },
  { id: 'cafe', label: '카페·디저트', categoryTerms: ['카페'] },
  { id: 'exhibition', label: '전시·박물관', categoryTerms: ['전시'] },
  { id: 'performance', label: '공연', categoryTerms: ['공연'] },
  { id: 'experience', label: '체험', categoryTerms: ['체험'] },
  { id: 'leisure', label: '놀거리·레저', categoryTerms: ['놀거리', '레저'] },
  { id: 'nature', label: '자연·산책', categoryTerms: ['자연', '산책'] },
  { id: 'shopping', label: '쇼핑', categoryTerms: ['쇼핑'] },
] as const;

export const emptyPlaceFilters: PlaceFilterState = {
  regionId: null,
  districtIds: [],
  conceptIds: [],
};

/**
 * 지역, 구/군, 카테고리에 선택된 필터 수를 계산합니다.
 * @param filters 현재 장소 필터 상태
 * @returns 선택된 필터의 총 개수
 */
export function getPlaceFilterCount(filters: PlaceFilterState) {
  return (filters.regionId ? 1 : 0) + filters.districtIds.length + filters.conceptIds.length;
}

/**
 * 검색어와 필터 상태를 `/places` 경로의 검색 파라미터로 직렬화합니다.
 * 검색어 앞뒤 공백은 제거하고, 구/군과 카테고리는 각각 반복 파라미터로 추가합니다.
 * @param query 검색어
 * @param filters 적용할 장소 필터 상태
 * @returns 필터와 검색어가 포함된 장소 목록 경로
 */
export function getPlaceSearchHref(query: string, filters: PlaceFilterState) {
  const params = new URLSearchParams();
  const normalizedQuery = query.trim();

  if (normalizedQuery) params.set('q', normalizedQuery);
  if (filters.regionId) params.set('region', filters.regionId);
  filters.districtIds.forEach((districtId) => params.append('district', districtId));
  filters.conceptIds.forEach((conceptId) => params.append('concept', conceptId));

  const queryString = params.toString();
  return queryString ? `/places?${queryString}` : '/places';
}

/**
 * URL 검색 파라미터를 유효하고 중복 없는 장소 필터 상태로 정규화합니다.
 * 알 수 없는 지역/구군/카테고리를 제외하고 전체 필터 수를 최대 개수로 제한합니다.
 * @param params URL 검색 파라미터
 * @returns 검증 및 정규화된 장소 필터 상태
 */
export function normalizePlaceFilters(
  params: Record<string, string | string[] | undefined>,
): PlaceFilterState {
  const rawRegion = params.region;
  const regionId = typeof rawRegion === 'string' ? rawRegion : undefined;
  const region = placeRegions.find((option) => option.id === regionId);
  const rawDistricts = Array.isArray(params.district)
    ? params.district
    : typeof params.district === 'string'
      ? [params.district]
      : [];
  const rawConcepts = Array.isArray(params.concept)
    ? params.concept
    : typeof params.concept === 'string'
      ? [params.concept]
      : [];
  const districtIds = region
    ? [
        ...new Set(
          rawDistricts.filter((id) => region.districts.some((district) => district.id === id)),
        ),
      ].slice(0, MAX_PLACE_FILTERS - 1)
    : [];

  return {
    regionId: region?.id ?? null,
    districtIds,
    conceptIds: [
      ...new Set(rawConcepts.filter((id) => placeConcepts.some((concept) => concept.id === id))),
    ].slice(0, MAX_PLACE_FILTERS - (region ? 1 : 0) - districtIds.length),
  };
}

/**
 * 검색어와 선택 필터에 모두 맞는 장소만 입력 순서대로 반환합니다.
 * 검색어의 모든 항목과 지역/구군 필터는 AND 조건이며, 여러 카테고리는 OR 조건으로 비교합니다.
 * @param places 검색할 장소 목록
 * @param query 장소명, 분류, 지역 등에서 찾을 검색어
 * @param filters 적용할 지역/구군/카테고리 필터
 * @returns 검색 및 필터 조건을 만족하는 장소 목록
 */
export function filterPlaces(
  places: readonly PlaceSummary[],
  query: string,
  filters: PlaceFilterState,
) {
  const queryTerms = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  const region = placeRegions.find((option) => option.id === filters.regionId);
  const selectedConcepts = placeConcepts.filter((concept) =>
    filters.conceptIds.includes(concept.id),
  );

  return places.filter((place) => {
    const searchableText = [place.name, place.category, place.neighborhood]
      .concat([
        getRegionLabel(place.regionId ?? null),
        getDistrictLabel(place.regionId ?? null, place.districtId ?? ''),
      ])
      .filter(Boolean)
      .join(' ')
      .toLocaleLowerCase();
    const matchesQuery = queryTerms.every((term) => searchableText.includes(term));
    const matchesRegion = !region || place.regionId === region.id;
    const matchesDistrict =
      filters.districtIds.length === 0 || filters.districtIds.includes(place.districtId ?? '');
    const matchesConcept =
      selectedConcepts.length === 0 ||
      selectedConcepts.some((concept) =>
        concept.categoryTerms.some((term) => place.category.includes(term)),
      );

    return matchesQuery && matchesRegion && matchesDistrict && matchesConcept;
  });
}

/**
 * 지역 ID에 해당하는 표시 이름을 반환합니다.
 * @param id 조회할 지역 ID. `null`이면 빈 문자열을 반환합니다.
 * @returns 지역 표시 이름 또는 빈 문자열
 */
export function getRegionLabel(id: string | null) {
  return placeRegions.find((region) => region.id === id)?.label ?? '';
}

/**
 * 지역과 구/군 ID에 해당하는 구/군 표시 이름을 반환합니다.
 * @param regionId 구/군이 속한 지역 ID
 * @param districtId 조회할 구/군 ID
 * @returns 구/군 표시 이름 또는 빈 문자열
 */
export function getDistrictLabel(regionId: string | null, districtId: string) {
  return (
    placeRegions
      .find((region) => region.id === regionId)
      ?.districts.find((district) => district.id === districtId)?.label ?? ''
  );
}
