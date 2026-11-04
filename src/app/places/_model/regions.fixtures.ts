import type { Region } from '@/shared/api';

import { toPlaceRegions } from './place-filters';

/** 지역 API를 호출하지 않는 스토리/테스트 전용 응답입니다. */
export const regionFixtures: Region[] = [
  {
    sidoCode: '11',
    sidoName: '서울특별시',
    sigungus: [
      { sigunguCode: '110', sigunguName: '종로구' },
      { sigunguCode: '140', sigunguName: '중구' },
      { sigunguCode: '170', sigunguName: '용산구' },
      { sigunguCode: '200', sigunguName: '성동구' },
    ],
  },
  {
    sidoCode: '26',
    sidoName: '부산광역시',
    sigungus: [{ sigunguCode: '110', sigunguName: '중구' }],
  },
  { sidoCode: '36', sidoName: '세종특별자치시', sigungus: [] },
  {
    sidoCode: '41',
    sidoName: '경기도',
    sigungus: [
      { sigunguCode: '110', sigunguName: '수원시' },
      { sigunguCode: '280', sigunguName: '고양시' },
    ],
  },
];

export const placeRegionFixtures = toPlaceRegions(regionFixtures);
