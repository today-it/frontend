import { apiRequest } from './api-client';

/** 시/도 2자리와 시/군/구 3자리 코드 */
export interface PreferredRegionCode {
  sidoCode: string;
  sigunguCode: string;
}

export type PreferredTheme =
  | 'QUIET'
  | 'ROMANTIC'
  | 'COZY'
  | 'EMOTIONAL'
  | 'LIVELY'
  | 'UNIQUE'
  | 'RELAXED'
  | 'LUXURIOUS'
  | 'RETRO'
  | 'NATURE_FRIENDLY';

/** 보내지 않은 항목은 그대로 유지되고 빈 배열은 선택을 해제합니다. */
export interface MemberProfileUpdate {
  /** 최대 1개 */
  preferredRegions?: PreferredRegionCode[];
  preferredThemes?: PreferredTheme[];
}

/** 로그인한 회원의 프로필을 수정합니다. */
export async function updateMemberProfile(update: MemberProfileUpdate): Promise<void> {
  await apiRequest('/api/v1/members/me', { method: 'PATCH', body: update });
}
