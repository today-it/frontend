import type { PlaceSummary } from './place';

/** API 연결 전 추천 섹션을 확인하기 위한 임시 데이터입니다. */
const placeSamples: readonly PlaceSummary[] = [
  {
    id: 'blue-elephant-seongsu',
    name: '블루엘리펀트 스페이스 성수',
    category: '전시·문화',
    neighborhood: '성수동',
    regionId: 'seoul',
    districtId: 'seongdong',
    imageSrc: '/images/places/blue-elephant-seongsu.jpg',
    rating: 4.7,
    reviewCount: 128,
    likeCount: 1200,
  },
  {
    id: 'onion-seongsu',
    name: '어니언 성수',
    category: '카페·디저트',
    neighborhood: '성수동',
    regionId: 'seoul',
    districtId: 'seongdong',
    imageSrc: '/images/places/onion-seongsu.jpg',
    rating: 4.5,
    reviewCount: 1204,
    likeCount: 3400,
  },
  {
    id: 'seoul-forest',
    name: '서울숲',
    category: '자연·산책',
    neighborhood: '성수동',
    regionId: 'seoul',
    districtId: 'seongdong',
    imageSrc: '/images/places/seoul-forest.jpg',
    rating: 4.8,
    reviewCount: 3511,
    likeCount: 8900,
  },
  {
    id: 'note-perfume',
    name: '성수 향수 공방 노트',
    category: '체험·공방',
    neighborhood: '성수동',
    regionId: 'seoul',
    districtId: 'seongdong',
    imageSrc: '/images/places/note-perfume.jpg',
    rating: 4.9,
    reviewCount: 86,
    likeCount: 642,
  },
  {
    id: 'lcdc-seoul',
    name: 'LCDC 서울',
    category: '쇼핑',
    neighborhood: '성수동',
    regionId: 'seoul',
    districtId: 'seongdong',
    rating: 4.6,
    reviewCount: 874,
    likeCount: 2600,
  },
  {
    id: 'seongsu-popup-week',
    name: '성수 팝업스토어 위크',
    category: '쇼핑',
    neighborhood: '성수동',
    regionId: 'seoul',
    districtId: 'seongdong',
    rating: 4.3,
    reviewCount: 412,
    likeCount: 5100,
  },
  {
    id: 'mildo-seongsu',
    name: '밀도 성수점',
    category: '카페·디저트',
    neighborhood: '성수동',
    regionId: 'seoul',
    districtId: 'seongdong',
    rating: 4.6,
    reviewCount: 952,
    likeCount: 4700,
  },
  {
    id: 'seongsu-rooftop-lounge',
    name: '성수 루프탑 라운지',
    category: '음식점',
    neighborhood: '성수동',
    regionId: 'seoul',
    districtId: 'seongdong',
    rating: 4.4,
    reviewCount: 237,
    likeCount: 2200,
  },
  {
    id: 'point-of-view',
    name: '포인트오브뷰',
    category: '쇼핑',
    neighborhood: '성수동',
    regionId: 'seoul',
    districtId: 'seongdong',
    rating: 4.6,
    reviewCount: 318,
    likeCount: 1900,
  },
  {
    id: 'seongsu-artnine',
    name: '성수 아트나인',
    category: '전시·문화',
    neighborhood: '성수동',
    regionId: 'seoul',
    districtId: 'seongdong',
    rating: 4.5,
    reviewCount: 164,
    likeCount: 980,
  },
  {
    id: 'red-button-seongsu',
    name: '레드버튼 성수점',
    category: '놀거리',
    neighborhood: '성수동',
    regionId: 'seoul',
    districtId: 'seongdong',
    rating: 4.4,
    reviewCount: 205,
    likeCount: 1100,
  },
  {
    id: 'daelim-changgo-gallery',
    name: '대림창고 갤러리',
    category: '전시·문화',
    neighborhood: '성수동',
    regionId: 'seoul',
    districtId: 'seongdong',
    rating: 4.6,
    reviewCount: 2087,
    likeCount: 6300,
  },
  {
    id: 'seongsu-pottery-day',
    name: '성수 도자기 원데이',
    category: '체험·공방',
    neighborhood: '성수동',
    regionId: 'seoul',
    districtId: 'seongdong',
    rating: 4.9,
    reviewCount: 73,
    likeCount: 512,
  },
];

export const recommendedPlaces: readonly PlaceSummary[] = placeSamples;

export const allPlaces: readonly PlaceSummary[] = placeSamples;

function getPlacesById(ids: readonly string[]): readonly PlaceSummary[] {
  return ids.flatMap((id) => {
    const place = placeSamples.find((sample) => sample.id === id);
    return place ? [place] : [];
  });
}

export const trendingPlaces = getPlacesById([
  'seongsu-popup-week',
  'mildo-seongsu',
  'seongsu-rooftop-lounge',
  'point-of-view',
  'lcdc-seoul',
]);

export const rainyDayPlaces = getPlacesById([
  'seongsu-artnine',
  'red-button-seongsu',
  'daelim-changgo-gallery',
  'seongsu-pottery-day',
  'onion-seongsu',
]);
