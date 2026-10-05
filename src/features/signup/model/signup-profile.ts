import { z } from 'zod';

/** `duplicated`는 중복, `forbidden`은 사용할 수 없는 닉네임입니다. */
export type SignupNicknameServerResult = 'available' | 'duplicated' | 'forbidden';
export type SignupNicknameStatus = 'checking' | SignupNicknameServerResult;
/** `blocked`는 차단된 비밀번호입니다. */
export type SignupPasswordServerError = 'blocked';

export const signupNicknameMessages = {
  length: '닉네임은 2~8자로 입력해 주세요.',
  chars: '한글, 영문, 숫자만 사용할 수 있어요.',
  space: '닉네임에는 공백을 사용할 수 없어요.',
  duplicated: '이미 사용 중인 닉네임이에요.',
  forbidden: '사용할 수 없는 닉네임이에요.',
  available: '사용 가능한 닉네임이에요.',
} as const;

export const signupPasswordMessages = {
  length: '비밀번호는 10자 이상으로 입력해주세요.',
  blocked: '다른 비밀번호를 입력해주세요.',
} as const;

const NICKNAME_MIN_LENGTH = 2;
const NICKNAME_MAX_LENGTH = 8;
const PASSWORD_MIN_LENGTH = 10;
export const SIGNUP_PASSWORD_MAX_LENGTH = 128;

// 한글은 완성형만 허용하고 앞뒤 공백은 제거합니다. 먼저 실패한 규칙의 문구를 표시합니다.
const nicknameSchema = z
  .string()
  .trim()
  .min(NICKNAME_MIN_LENGTH, signupNicknameMessages.length)
  .max(NICKNAME_MAX_LENGTH, signupNicknameMessages.length)
  .refine((value) => !/\s/.test(value), signupNicknameMessages.space)
  .refine((value) => /^[가-힣a-zA-Z0-9]*$/.test(value), signupNicknameMessages.chars);

// 길이만 확인합니다. 128자 초과는 입력창의 maxLength로 막습니다.
const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, signupPasswordMessages.length)
  .max(SIGNUP_PASSWORD_MAX_LENGTH, signupPasswordMessages.length);

export const signupProfileSchema = z.object({
  nickname: nicknameSchema,
  password: passwordSchema,
});

export type SignupProfileValues = z.infer<typeof signupProfileSchema>;

/** 닉네임이 클라이언트 규칙에 맞는지 확인합니다. */
export function isValidNickname(value: string) {
  return nicknameSchema.safeParse(value).success;
}

/**
 * 닉네임 입력창 아래에 보여줄 문구와 상태를 정합니다.
 * 클라이언트 오류가 있으면 그 문구를, 없으면 서버 검사 결과를 따릅니다. 검사 중이거나 결과가 없으면 문구가 없습니다.
 */
export function getNicknameFeedback(
  clientError: string | undefined,
  status: SignupNicknameStatus | undefined,
) {
  if (clientError !== undefined) {
    return { message: clientError, isInvalid: true, isAvailable: false };
  }

  if (status === undefined || status === 'checking') {
    return { message: undefined, isInvalid: false, isAvailable: false };
  }

  return {
    message: signupNicknameMessages[status],
    isInvalid: status !== 'available',
    isAvailable: status === 'available',
  };
}
