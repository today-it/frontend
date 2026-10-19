import { z } from 'zod';

import { type LoginSubmitResult, type LoginValues } from '../model/login';

const loginResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
    expiresIn: z.number(),
    member: z.object({
      memberId: z.string(),
      roles: z.array(z.string()),
    }),
  }),
});

const loginFailureSchema = z.object({
  code: z.literal('LOGIN_FAILED'),
  failureCount: z.number().int().nonnegative().nullable(),
  maxFailureCount: z.number().int().positive(),
});

/** 로그인 성공과 확인된 불일치 응답을 반환합니다. 그 외 요청 실패는 reject합니다. */
export async function login(values: LoginValues): Promise<LoginSubmitResult> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new Error('API 서버 주소가 설정되지 않았습니다.');
  }

  const response = await fetch(`${baseUrl}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  });

  if (response.ok) {
    const data = loginResponseSchema.parse(await response.json());
    return { status: 'success', accessToken: data.data.accessToken };
  }

  if (response.status === 401) {
    const failure = loginFailureSchema.safeParse(await response.json());

    if (failure.success) {
      return {
        status: 'invalid',
        failureCount: failure.data.failureCount ?? undefined,
        failureCountTotal: failure.data.maxFailureCount,
      };
    }
  }

  throw new Error('로그인 요청에 실패했습니다.');
}
