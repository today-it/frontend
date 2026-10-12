import { z } from 'zod';

export type SignupEmailPhase = 'email' | 'code';
type SignupEmailClientError = 'format';
/** `registered`는 이미 가입, `social`은 소셜 로그인으로 가입된 이메일입니다. */
export type SignupEmailServerError = 'registered' | 'social';
/** `invalid`는 불일치, `expired`는 시간 만료입니다. */
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

// 인증코드는 값만 담고, 자릿수는 isCodeComplete로 확인합니다.
export const signupEmailSchema = z.object({
  email: z.string().trim().pipe(z.email(signupEmailErrorMessages.format)),
  code: z.string(),
});

export type SignupEmailValues = z.infer<typeof signupEmailSchema>;

const SIGNUP_CODE_LENGTH = 6;

/** 인증코드의 유효 시간(초) */
export const SIGNUP_CODE_EXPIRES_SECONDS = 300;

/** 인증코드 6자리를 모두 입력했는지 확인합니다. `000 - 000`의 구분자는 무시합니다. */
export function isCodeComplete(value: string) {
  return value.replace(/\D/g, '').length === SIGNUP_CODE_LENGTH;
}
