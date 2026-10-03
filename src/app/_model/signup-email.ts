import { z } from 'zod';

/** 클라이언트에서 확인하는 이메일 오류 */
type SignupEmailClientError = 'format';
/** 서버 응답으로 표시하는 이메일 오류. `registered`는 이미 가입, `social`은 소셜 로그인으로 가입된 이메일입니다. */
export type SignupEmailServerError = 'registered' | 'social';
/** 서버 응답으로 표시하는 인증코드 오류. `invalid`는 불일치, `expired`는 시간 만료입니다. */
export type SignupCodeError = 'invalid' | 'expired';

export const signupEmailErrorMessages = {
  format: '이메일 형식이 올바르지 않아요.',
  registered: '이미 가입된 이메일이에요.',
  social: '소셜 로그인으로 가입된 이메일이에요.',
} as const satisfies Record<SignupEmailClientError | SignupEmailServerError, string>;

export const signupCodeErrorMessages = {
  invalid: '올바르지 않은 인증코드예요.',
  expired: '인증코드가 만료되었어요. 재전송 후 다시 입력해주세요.',
} as const satisfies Record<SignupCodeError, string>;

const emailSchema = z.email();

/** 인증코드의 숫자 자릿수 */
const SIGNUP_CODE_LENGTH = 6;

/**
 * 이메일 형식이 올바른지 확인합니다. 앞뒤 공백은 무시합니다.
 *
 * @param value 확인할 이메일
 */
export function isValidEmail(value: string) {
  return emailSchema.safeParse(value.trim()).success;
}

/**
 * 인증코드 6자리를 모두 입력했는지 확인합니다. `000 - 000` 형식의 구분자는 무시합니다.
 *
 * @param value 확인할 인증코드
 */
export function isCodeComplete(value: string) {
  return value.replace(/\D/g, '').length === SIGNUP_CODE_LENGTH;
}
