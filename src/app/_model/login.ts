import { z } from 'zod';

/** 외부 로그인 결과로 표시하는 이메일·비밀번호 불일치 오류 */
export type LoginServerError = 'invalid';

/** 임시 확인 화면에서 사용하는 mock 로그인 제출 결과입니다. */
export type LoginSubmitResult =
  | { status: 'success' }
  | {
      status: 'invalid';
      failureCount: number;
      failureCountTotal?: number;
    };

export const loginErrorMessages = {
  emailFormat: '이메일 형식이 올바르지 않아요.',
  invalid: '이메일 또는 비밀번호가 일치하지 않아요.',
} as const;

/**
 * 로그인 이메일은 앞뒤 공백을 제거한 뒤 형식을 확인합니다.
 * 빈 입력은 로그인 버튼 비활성화로 처리합니다.
 */
export const loginSchema = z.object({
  email: z.string().trim().pipe(z.email(loginErrorMessages.emailFormat)),
  password: z.string(),
});

export type LoginValues = z.infer<typeof loginSchema>;
