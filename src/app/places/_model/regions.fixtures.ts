import type { Region } from '@/shared/api';

import { toPlaceRegions } from './place-filters';

/** 지역 API를 호출하지 않는 스토리/테스트 전용 응답입니다. */
export const regionFixtures: Region[] = [
  {
    sidoCode: '11',
    sidoName: '서울특별시',
    sigungus: [
      { sigunguCode: '110', sigunguName: '종로구', subRegions: [] },
      { sigunguCode: '140', sigunguName: '중구', subRegions: [] },
      { sigunguCode: '170', sigunguName: '용산구', subRegions: [] },
      { sigunguCode: '200', sigunguName: '성동구', subRegions: [] },
    ],
  },
  {
    sidoCode: '26',
    sidoName: '부산광역시',
    sigungus: [{ sigunguCode: '110', sigunguName: '중구', subRegions: [] }],
  },
  { sidoCode: '36', sidoName: '세종특별자치시', sigungus: [] },
  {
    sidoCode: '41',
    sidoName: '경기도',
    sigungus: [
      {
        sigunguCode: '110',
        sigunguName: '수원시',
        subRegions: [
          { sigunguCode: '111', sigunguName: '장안구' },
          { sigunguCode: '113', sigunguName: '권선구' },
          { sigunguCode: '115', sigunguName: '팔달구' },
          { sigunguCode: '117', sigunguName: '영통구' },
        ],
      },
      {
        sigunguCode: '130',
        sigunguName: '성남시',
        subRegions: [
          { sigunguCode: '131', sigunguName: '수정구' },
          { sigunguCode: '133', sigunguName: '중원구' },
          { sigunguCode: '135', sigunguName: '분당구' },
        ],
      },
      { sigunguCode: '280', sigunguName: '고양시', subRegions: [] },
    ],
  },
];

export const placeRegionFixtures = toPlaceRegions(regionFixtures);
