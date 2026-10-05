import { z } from 'zod';

interface SignupPreferenceOption {
  label: string;
  value: string;
}

interface SignupRegion extends SignupPreferenceOption {
  districts: readonly SignupPreferenceOption[];
}

const toOptions = (labels: readonly string[]): SignupPreferenceOption[] =>
  labels.map((label) => ({ label, value: label }));

// 목업 데이터입니다. 옵션 목록이 확정되면 서버 목록으로 교체합니다.
export const signupRegions: readonly SignupRegion[] = [
  { label: '서울', value: '서울', districts: toOptions(['강남구', '마포구', '성동구', '종로구']) },
  {
    label: '부산',
    value: '부산',
    districts: toOptions(['해운대구', '서면', '남포동', '광안리', '기장군']),
  },
  { label: '인천', value: '인천', districts: toOptions(['연수구', '남동구', '부평구', '중구']) },
  { label: '대구', value: '대구', districts: toOptions(['수성구', '중구', '동구', '달서구']) },
  { label: '대전', value: '대전', districts: toOptions(['유성구', '서구', '중구', '동구']) },
  { label: '광주', value: '광주', districts: toOptions(['동구', '서구', '남구', '광산구']) },
];

export const signupConcepts: readonly SignupPreferenceOption[] = toOptions([
  '조용함',
  '로맨틱',
  '아늑함',
  '활기참',
  '감성적',
  '이색적',
]);

export const signupPreferenceSchema = z.object({
  city: z.string().min(1),
  district: z.string().min(1),
  concepts: z.array(z.string()).min(1),
});

export type SignupPreferenceValues = z.infer<typeof signupPreferenceSchema>;

const signupAllDistrictsOption: SignupPreferenceOption = {
  label: '전체 선택',
  value: '전체',
};

/** 지역의 구·군 옵션을 반환합니다. 맨 앞에 전체 선택이 있고, 지역을 고르지 않았으면 빈 목록입니다. */
export function getDistrictOptions(city: string): readonly SignupPreferenceOption[] {
  const region = signupRegions.find(({ value }) => value === city);

  return region ? [signupAllDistrictsOption, ...region.districts] : [];
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
