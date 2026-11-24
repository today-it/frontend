import { z } from 'zod';

import { type PreferredTheme } from '@/shared/api';

interface SignupPreferenceOption {
  label: string;
  value: string;
}

interface SignupRegion extends SignupPreferenceOption {
  districts: readonly SignupPreferenceOption[];
}

/** 선호 지역으로 고를 수 있는 30곳. 구·군의 `value`는 `시/도 코드:시/군/구 코드`입니다. */
export const signupRegions: readonly SignupRegion[] = [
  {
    label: '서울',
    value: 'seoul',
    districts: [
      { label: '마포구', value: '11:440' },
      { label: '성동구', value: '11:200' },
      { label: '강남구', value: '11:680' },
      { label: '송파구', value: '11:710' },
      { label: '종로구', value: '11:110' },
      { label: '용산구', value: '11:170' },
      { label: '영등포구', value: '11:560' },
      { label: '중구', value: '11:140' },
      { label: '서초구', value: '11:650' },
      { label: '광진구', value: '11:215' },
    ],
  },
  {
    label: '경기 & 인천',
    value: 'gyeonggi-incheon',
    districts: [
      { label: '수원시 팔달구', value: '41:115' },
      { label: '성남시 분당구', value: '41:135' },
      { label: '고양시 일산동구', value: '41:285' },
      { label: '파주시', value: '41:480' },
      { label: '가평군', value: '41:820' },
      { label: '인천 연수구', value: '28:185' },
    ],
  },
  {
    label: '부산',
    value: 'busan',
    districts: [
      { label: '수영구', value: '26:500' },
      { label: '해운대구', value: '26:350' },
      { label: '부산진구', value: '26:230' },
    ],
  },
  {
    label: '강원',
    value: 'gangwon',
    districts: [
      { label: '강릉시', value: '51:150' },
      { label: '속초시', value: '51:210' },
      { label: '춘천시', value: '51:110' },
    ],
  },
  {
    label: '제주',
    value: 'jeju',
    districts: [
      { label: '제주시', value: '50:110' },
      { label: '서귀포시', value: '50:130' },
    ],
  },
  {
    label: '기타',
    value: 'etc',
    districts: [
      { label: '경주시', value: '47:130' },
      { label: '전주시 완산구', value: '52:111' },
      { label: '여수시', value: '12:130' },
      { label: '대전 중구', value: '30:140' },
      { label: '대구 중구', value: '27:110' },
      { label: '천안시 동남구', value: '44:131' },
    ],
  },
];

export const signupConcepts: readonly { label: string; value: PreferredTheme }[] = [
  { label: '조용함', value: 'QUIET' },
  { label: '로맨틱', value: 'ROMANTIC' },
  { label: '아늑함', value: 'COZY' },
  { label: '활기참', value: 'LIVELY' },
  { label: '감성적', value: 'EMOTIONAL' },
  { label: '이색적', value: 'UNIQUE' },
];

export const signupPreferenceSchema = z.object({
  city: z.string().min(1),
  district: z.string().min(1),
  concepts: z.array(z.string()).min(1),
});

export type SignupPreferenceValues = z.infer<typeof signupPreferenceSchema>;

/** 지역의 구·군 옵션을 반환합니다. 지역을 고르지 않았으면 빈 목록입니다. */
export function getDistrictOptions(city: string): readonly SignupPreferenceOption[] {
  return signupRegions.find(({ value }) => value === city)?.districts ?? [];
}

/** 컨셉 하나의 선택 여부를 바꾼 새 목록을 반환합니다. */
export function setConceptSelected(
  concepts: readonly string[],
  value: string,
  selected: boolean,
): string[] {
  const rest = concepts.filter((concept) => concept !== value);

  return selected ? [...rest, value] : rest;
}
