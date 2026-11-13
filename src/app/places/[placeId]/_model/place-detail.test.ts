import { describe, expect, it } from 'vitest';

import { filterPlaceMenus, getNextPhoto, placeDetailFixture } from './place-detail';

describe('장소 메뉴 분류', () => {
  it('전체 메뉴의 원래 순서를 유지한다', () => {
    expect(filterPlaceMenus(placeDetailFixture.menus, '전체')).toEqual(placeDetailFixture.menus);
  });
  it('커피와 디저트를 분류하고 원본을 변경하지 않는다', () => {
    expect(filterPlaceMenus(placeDetailFixture.menus, '커피').map((menu) => menu.id)).toEqual([
      'americano',
      'latte',
      'cold-brew',
    ]);
    expect(filterPlaceMenus(placeDetailFixture.menus, '디저트').map((menu) => menu.id)).toEqual([
      'croissant',
      'tiramisu',
    ]);
    expect(placeDetailFixture.menus).toHaveLength(6);
  });
  it('메뉴가 없으면 빈 결과를 반환한다', () => {
    expect(filterPlaceMenus([], '음료')).toEqual([]);
  });
});

describe('장소 사진 이동', () => {
  it('처음과 마지막 사진에서 순환한다', () => {
    expect(getNextPhoto(0, -1, 12)).toBe(11);
    expect(getNextPhoto(11, 1, 12)).toBe(0);
  });
  it('사진 한 장 또는 사진 없음에서 범위를 벗어나지 않는다', () => {
    expect(getNextPhoto(0, 1, 1)).toBe(0);
    expect(getNextPhoto(0, -1, 0)).toBe(0);
  });
});
