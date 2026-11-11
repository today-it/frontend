export const menuCategories = ['전체', '커피', '음료', '디저트'] as const;
export type MenuCategory = (typeof menuCategories)[number];

export interface PlaceMenu {
  id: string;
  name: string;
  price: number;
  category: Exclude<MenuCategory, '전체'>;
  signature?: boolean;
  imageSrc?: string;
}

export interface PlaceDetail {
  id: string;
  name: string;
  category: string;
  address: string;
  description: string;
  photoCount: number;
  photos?: string[];
  mapImageSrc?: string;
  location: string;
  hours: string | null;
  phone: string | null;
  amenities: ('parking' | 'pets' | 'walk-in' | 'indoor')[];
  menus: PlaceMenu[];
  courses: {
    id: string;
    name: string;
    region: string;
    tags: string[];
    date: string;
    likes: number;
    imageSrc?: string;
  }[];
}

/** 장소 상세 화면 개발 및 검수용 기본 모의 데이터 */
export const placeDetailFixture: PlaceDetail = {
  id: 'blue-elephant-seongsu',
  name: '블루엘리펀트 스페이스 성수',
  category: '전시/박물관',
  address: '서울특별시 성동구 연무장길 53',
  description:
    '성수동 연무장길에 있는 약 1,000평 규모의 체험형 플래그십 스토어예요. 스피어 미디어아트와 루프탑, 3층 카페까지 한 공간에서 즐길 수 있어요.',
  photoCount: 12,
  location: '성수역 3번 출구에서 약 300m 거리',
  hours: '매일 10:00 ~ 22:00',
  phone: '1644-2624',
  amenities: ['parking', 'pets', 'walk-in', 'indoor'],
  menus: [
    { id: 'americano', name: '아메리카노', price: 4500, category: '커피', signature: true },
    { id: 'latte', name: '카페라떼', price: 5000, category: '커피' },
    { id: 'cold-brew', name: '콜드브루', price: 5500, category: '커피', signature: true },
    { id: 'lemonade', name: '레몬에이드', price: 6000, category: '음료' },
    { id: 'croissant', name: '크루아상', price: 5000, category: '디저트' },
    { id: 'tiramisu', name: '티라미슈', price: 7500, category: '디저트' },
  ],
  courses: Array.from({ length: 5 }, (_, index) => ({
    id: `seongsu-course-${index + 1}`,
    name: '성수 감성 데이트 코스',
    region: '성수',
    tags: ['3시간', '감성'],
    date: '2026.10.12',
    likes: 128,
  })),
};

export function filterPlaceMenus(menus: readonly PlaceMenu[], category: MenuCategory) {
  return category === '전체' ? menus : menus.filter((menu) => menu.category === category);
}

/** 실제 이미지 경로를 포함한 장소 상세 화면 검수용 모의 데이터 */
export const placeDetailWithImagesFixture: PlaceDetail = {
  ...placeDetailFixture,
  photos: ['/images/place-detail/hero.png'],
  mapImageSrc: '/images/place-detail/map.png',
  menus: placeDetailFixture.menus.map((menu) => ({
    ...menu,
    imageSrc: `/images/place-detail/${menu.id}.png`,
  })),
  courses: placeDetailFixture.courses.map((course, index) => ({
    ...course,
    ...(index < 4 ? { imageSrc: `/images/place-detail/course-${index + 1}.png` } : {}),
  })),
};

export function getNextPhoto(current: number, direction: -1 | 1, total: number) {
  return total > 0 ? (current + direction + total) % total : 0;
}
