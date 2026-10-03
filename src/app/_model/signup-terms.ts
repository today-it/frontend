export const signupTerms = [
  { id: 'service', label: '서비스 이용약관 동의', required: true },
  { id: 'privacy', label: '개인정보 수집·이용 동의', required: true },
  { id: 'profile-image', label: '프로필 이미지 수집·이용 동의', required: false },
  { id: 'preference', label: '맞춤 코스 추천을 위한 선호 정보 수집·이용 동의', required: false },
] as const;

export type SignupTerm = (typeof signupTerms)[number];
export type SignupTermId = SignupTerm['id'];

/**
 * 모든 약관에 동의했는지 확인합니다.
 *
 * @param agreedIds 동의한 약관 id 목록
 */
export function isAllTermsAgreed(agreedIds: readonly SignupTermId[]) {
  return signupTerms.every(({ id }) => agreedIds.includes(id));
}

/**
 * 필수 약관에 모두 동의했는지 확인합니다.
 *
 * @param agreedIds 동의한 약관 id 목록
 */
export function isRequiredTermsAgreed(agreedIds: readonly SignupTermId[]) {
  return signupTerms.every(({ id, required }) => !required || agreedIds.includes(id));
}

/**
 * 약관 하나의 동의 여부를 바꾼 새 목록을 반환합니다.
 *
 * @param agreedIds 동의한 약관 id 목록
 * @param id 변경할 약관 id
 * @param agreed 변경할 동의 여부
 */
export function setTermAgreed(
  agreedIds: readonly SignupTermId[],
  id: SignupTermId,
  agreed: boolean,
): SignupTermId[] {
  const others = agreedIds.filter((agreedId) => agreedId !== id);

  return agreed ? [...others, id] : others;
}

/**
 * 전체 동의 여부를 바꾼 새 목록을 반환합니다.
 *
 * @param agreed 변경할 전체 동의 여부
 */
export function setAllTermsAgreed(agreed: boolean): SignupTermId[] {
  return agreed ? signupTerms.map(({ id }) => id) : [];
}
