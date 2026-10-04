import { z } from 'zod';

/** 외부 로그인 결과로 표시하는 이메일·비밀번호 불일치 오류 */
export type LoginServerError = 'invalid';

export const loginErrorMessages = {
  emailRequired: '이메일을 입력해주세요.',
  emailFormat: '이메일 형식이 올바르지 않아요.',
  passwordRequired: '비밀번호를 입력해주세요.',
  invalid: '이메일 또는 비밀번호가 일치하지 않아요.',
} as const;

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, loginErrorMessages.emailRequired)
    .pipe(z.email(loginErrorMessages.emailFormat)),
  password: z.string().min(1, loginErrorMessages.passwordRequired),
});

export type LoginValues = z.infer<typeof loginSchema>;
