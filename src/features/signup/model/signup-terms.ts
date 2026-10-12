import { z } from 'zod';

export const signupTerms = [
  {
    id: 'service',
    label: '서비스 이용약관 동의',
    required: true,
    content:
      '제1조(목적) 이 약관은 ToDayIt(이하 "회사")가 제공하는 데이트 코스 추천 및 예약 서비스의 이용조건과 절차, 회사와 이용자의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.\n제2조(효력 및 변경) 회사는 관련 법령을 준수하는 범위에서 약관을 변경할 수 있으며, 변경 시 서비스 내 공지합니다.',
  },
  {
    id: 'privacy',
    label: '개인정보 수집·이용 동의',
    required: true,
    content:
      '수집·이용 목적: 회원 식별, 이메일 소유 확인, 회원가입·로그인, 계정 및 비밀번호 재설정, 서비스 내 회원 구분\n수집 항목: 이메일, 비밀번호, 닉네임\n보유·이용 기간: 회원 탈퇴 시까지\n\n동의하지 않을 수 있으며, 거부 시 이메일 회원가입 및 회원 전용 기능 이용이 어렵습니다. (공개 코스·장소 등 비회원 이용 가능 기능은 계속 이용할 수 있습니다.)',
  },
  {
    id: 'profile-image',
    label: '프로필 이미지 수집·이용 동의',
    required: false,
    content:
      '목적: 회원 프로필 표시\n수집 항목: 사용자가 등록한 프로필 이미지\n보유 기간: 이미지 삭제, 동의 철회 또는 회원 탈퇴 중 먼저 발생한 때까지\n\n동의하지 않아도 회원가입과 기본 기능을 이용할 수 있습니다. 등록한 이미지 대신 기본 이미지가 표시됩니다.',
  },
  {
    id: 'preference',
    label: '맞춤 코스 추천을 위한 선호 정보 수집·이용 동의',
    required: false,
    content:
      '목적: 회원 취향에 맞는 코스 추천 및 선호 설정 저장\n수집 항목: 선호 지역, 선호 테마\n보유 기간: 해당 정보 삭제, 동의 철회 또는 회원 탈퇴 중 먼저 발생한 때까지\n\n동의하지 않아도 회원가입과 기본 탐색·코스 작성 기능을 이용할 수 있습니다. 저장한 선호 정보에 따른 개인화 추천은 제한됩니다.',
  },
] as const;

type SignupTerm = (typeof signupTerms)[number];
export type SignupTermId = SignupTerm['id'];

/** 모든 약관에 동의했는지 확인합니다. */
export function isAllTermsAgreed(agreedIds: readonly SignupTermId[]) {
  return signupTerms.every(({ id }) => agreedIds.includes(id));
}

/** 필수 약관에 모두 동의했는지 확인합니다. */
export function isRequiredTermsAgreed(agreedIds: readonly SignupTermId[]) {
  return signupTerms.every(({ id, required }) => !required || agreedIds.includes(id));
}

/** 약관 하나의 동의 여부를 바꾼 새 목록을 반환합니다. */
export function setTermAgreed(
  agreedIds: readonly SignupTermId[],
  id: SignupTermId,
  agreed: boolean,
): SignupTermId[] {
  const others = agreedIds.filter((agreedId) => agreedId !== id);

  return agreed ? [...others, id] : others;
}

/** 전체 동의 여부를 바꾼 새 목록을 반환합니다. */
export function setAllTermsAgreed(agreed: boolean): SignupTermId[] {
  return agreed ? signupTerms.map(({ id }) => id) : [];
}

export const signupTermsSchema = z.object({
  agreedIds: z
    .array(z.custom<SignupTermId>())
    .refine((agreedIds) => isRequiredTermsAgreed(agreedIds), '필수 약관에 동의해주세요.'),
});

export type SignupTermsValues = z.infer<typeof signupTermsSchema>;
