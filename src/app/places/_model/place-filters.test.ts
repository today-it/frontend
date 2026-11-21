import { describe, expect, it } from 'vitest';

import {
  emptyPlaceFilters,
  filterPlaces,
  getPlaceDistrictGroups,
  normalizePlaceFilters,
  togglePlaceDistrictSelection,
  togglePlaceGroupedDistrictSelection,
  togglePlaceRegionWhole,
  toPlaceRegions,
} from './place-filters';
import { allPlaces } from './recommended-places';
import { placeRegionFixtures, regionFixtures } from './regions.fixtures';

describe('지역 선택', () => {
  it('다른 시도의 첫 항목 선택에서 지역만 교체한다', () => {
    const first = togglePlaceDistrictSelection(emptyPlaceFilters, '41', '110');
    expect(first.regions).toEqual([{ regionId: '41', districtIds: ['110'] }]);
    const replaced = togglePlaceDistrictSelection({ ...first, conceptIds: ['cafe'] }, '11', '200');
    expect(replaced.regions).toEqual([{ regionId: '11', districtIds: ['200'] }]);
    expect(replaced.conceptIds).toEqual(['cafe']);
    const two = togglePlaceDistrictSelection(first, '41', '280');
    expect(togglePlaceDistrictSelection(two, '11', '200').regions).toEqual([
      { regionId: '11', districtIds: ['200'] },
    ]);
  });

  it('세 지역 상한을 다른 시도 선택으로 우회하지 못한다', () => {
    const filters = {
      ...emptyPlaceFilters,
      regions: [{ regionId: '41', districtIds: ['110', '280', '300'] }],
    };
    expect(togglePlaceDistrictSelection(filters, '11', '200')).toBe(filters);
    expect(togglePlaceRegionWhole(filters, '11')).toBe(filters);
    expect(togglePlaceDistrictSelection(filters, '41', '400')).toBe(filters);
    expect(togglePlaceDistrictSelection(filters, '41', '300').regions[0].districtIds).toEqual([
      '110',
      '280',
    ]);
  });

  it('마지막 세부 지역을 해제하면 전체가 아닌 선택 없음으로 남는다', () => {
    const selected = togglePlaceDistrictSelection(emptyPlaceFilters, '41', '110');
    expect(togglePlaceDistrictSelection(selected, '41', '110').regions).toEqual([]);
  });

  it('시도 전체를 다시 누르면 선택이 해제된다', () => {
    const selected = togglePlaceRegionWhole(emptyPlaceFilters, '41');
    expect(togglePlaceRegionWhole(selected, '41').regions).toEqual([]);
    expect(togglePlaceDistrictSelection(selected, '41', '110').regions).toEqual([
      { regionId: '41', districtIds: ['110'] },
    ]);
  });

  it('전체 필터 12개 상한을 지킨다', () => {
    const filters = {
      ...emptyPlaceFilters,
      conceptIds: Array.from({ length: 11 }, (_, index) => `concept-${index}`),
    };
    const first = togglePlaceDistrictSelection(filters, '41', '110');
    expect(togglePlaceDistrictSelection(first, '41', '280')).toBe(first);
  });

  it('기존 단일/접두어 구군 코드를 읽고 로드 후 실제 소속을 검증한다', () => {
    const options = [{ id: '41', label: '경기', districts: [{ id: '110', label: '수원' }] }];
    for (const district of ['110', '41:110']) {
      const params = { region: '41', district };
      expect(normalizePlaceFilters(params).regions[0].districtIds).toEqual(['110']);
      expect(normalizePlaceFilters(params, options).regions[0].districtIds).toEqual(['110']);
    }
    expect(normalizePlaceFilters({ region: '41', district: '280' }, options).regions).toEqual([
      { regionId: '41', districtIds: [] },
    ]);
  });

  it('복수 시도가 들어오면 마지막 유효 시도를 유지한다', () => {
    expect(
      normalizePlaceFilters({ region: ['41', '11'], district: ['41:110', '11:200'] }).regions,
    ).toEqual([{ regionId: '11', districtIds: ['200'] }]);
  });
});

const groupedRegion = {
  id: '41',
  label: '경기',
  districts: [
    { id: '135', label: '성남시 분당구', parentId: '130' },
    { id: '130', label: '성남시' },
    { id: '131', label: '성남시 수정구', parentId: '130' },
    { id: '133', label: '성남시 중원구', parentId: '130' },
    { id: '110', label: '수원시' },
    { id: '111', label: '수원시 장안구', parentId: '110' },
    { id: '999', label: '없는시 독립구', parentId: '998' },
  ],
};

describe('parentId 기반 지역 그룹', () => {
  it('자식이 먼저 와도 정확한 부모에 연결하고 부모 없는 항목은 평면 유지한다', () => {
    const groups = getPlaceDistrictGroups(groupedRegion);
    expect(groups.map((group) => group.district.id)).toEqual(['130', '110', '999']);
    expect(groups[0].children.map((child) => child.id)).toEqual(['135', '131', '133']);
    expect(
      getPlaceDistrictGroups({
        id: '11',
        label: '서울',
        districts: [
          { id: '130', label: '성남시' },
          { id: '135', label: '성남시 분당구' },
          { id: '999', label: '자기 참조', parentId: '999' },
          { id: '998', label: '타 시도 부모', parentId: '110' },
        ],
      }).map((group) => group.district.id),
    ).toEqual(['130', '135', '999', '998']);
  });

  it('부모 선택과 자식 선택을 대체하고 자식 전부 선택을 부모로 합친다', () => {
    const toggle = (filters: typeof emptyPlaceFilters, id: string) =>
      togglePlaceGroupedDistrictSelection(filters, '41', id, groupedRegion);
    const parent = toggle(emptyPlaceFilters, '130');
    expect(toggle(parent, '135').regions[0].districtIds).toEqual(['135']);
    const first = toggle(emptyPlaceFilters, '135');
    const second = toggle(first, '131');
    expect(toggle(second, '133').regions[0].districtIds).toEqual(['130']);
    expect(toggle(first, '135').regions).toEqual([]);
    expect(toggle(first, '111').regions[0].districtIds).toEqual(['135', '110']);
  });

  it('3개 도달 후 새 자식은 합침 가능해도 선택할 수 없다', () => {
    const filters = {
      ...emptyPlaceFilters,
      regions: [{ regionId: '41', districtIds: ['135', '131', '110'] }],
    };
    expect(togglePlaceGroupedDistrictSelection(filters, '41', '133', groupedRegion)).toBe(filters);
    expect(togglePlaceGroupedDistrictSelection(filters, '41', '111', groupedRegion)).toBe(filters);
    const threeParents = {
      ...emptyPlaceFilters,
      regions: [{ regionId: '41', districtIds: ['110', '130', '999'] }],
    };
    expect(togglePlaceGroupedDistrictSelection(threeParents, '41', '135', groupedRegion)).toBe(
      threeParents,
    );
    expect(
      togglePlaceGroupedDistrictSelection(filters, '41', '135', groupedRegion).regions[0]
        .districtIds,
    ).toEqual(['131', '110']);
  });

  it('다른 부모 선택을 유지하고 4개 자식의 네 번째 추가를 막는다', () => {
    const four = {
      ...groupedRegion,
      districts: [
        ...groupedRegion.districts,
        { id: '137', label: '성남시 추가구', parentId: '130' },
      ],
    };
    const toggle = (filters: typeof emptyPlaceFilters, id: string) =>
      togglePlaceGroupedDistrictSelection(filters, '41', id, four);
    const first = toggle(emptyPlaceFilters, '135');
    const second = toggle(first, '131');
    const third = toggle(second, '133');
    expect(toggle(third, '137')).toBe(third);
    expect(toggle(first, '111').regions[0].districtIds).toEqual(['135', '110']);
  });

  it('클라이언트 결과에서 부모 선택에 자식을 포함하고 다른 시도 동일 코드를 제외한다', () => {
    const parent = togglePlaceGroupedDistrictSelection(
      emptyPlaceFilters,
      '41',
      '130',
      groupedRegion,
    );
    const base = allPlaces[0];
    const places = [
      { ...base, id: 'child', regionId: '41', districtId: '135' },
      { ...base, id: 'other-region', regionId: '11', districtId: '135' },
      { ...base, id: 'sibling-parent', regionId: '41', districtId: '110' },
    ];
    expect(filterPlaces(places, '', parent, [groupedRegion]).map((place) => place.id)).toEqual([
      'child',
    ]);
  });

  it('URL에서 자식 코드를 복원해 평면 항목으로 검증한다', () => {
    expect(
      normalizePlaceFilters({ region: '41', district: '41:135' }, placeRegionFixtures).regions[0]
        .districtIds,
    ).toEqual(['135']);
  });
});

describe('지역 API 변환', () => {
  it('하위 지역을 부모 다음에 평면화하고 전체 이름과 짧은 이름을 보존한다', () => {
    const region = toPlaceRegions(regionFixtures).find((region) => region.id === '41')!;
    expect(region.districts.slice(0, 5).map((district) => district.id)).toEqual([
      '110',
      '111',
      '113',
      '115',
      '117',
    ]);
    expect(region.districts.find((district) => district.id === '135')).toEqual({
      id: '135',
      label: '성남시 분당구',
      shortLabel: '분당구',
      parentId: '130',
    });
    expect(getPlaceDistrictGroups(region).map((group) => group.children.length)).toEqual([4, 3, 0]);
  });
});
