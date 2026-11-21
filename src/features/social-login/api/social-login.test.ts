import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { socialLogin } from './social-login';

function mockFetch(body: unknown, status = 200) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(
      new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' },
      }),
    ),
  );
}

const ok = (data: unknown) => ({ success: true, data });

const member = { memberId: 'id', nickname: '유저', coupleConnected: false, roles: ['USER'] };

beforeEach(() => {
  vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'https://api.example.com');
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe('socialLogin', () => {
  it('가입한 회원이면 토큰과 회원 정보를 반환한다', async () => {
    mockFetch(
      ok({ isNewMember: false, accessToken: 'at', refreshToken: 'rt', expiresIn: 1800, member }),
    );

    await expect(socialLogin('kakao', 'code-1', 'http://localhost:3000')).resolves.toEqual({
      status: 'success',
      accessToken: 'at',
      refreshToken: 'rt',
      expiresIn: 1800,
      member,
    });
  });

  it('아직 가입하지 않았으면 가입용 토큰을 반환한다', async () => {
    mockFetch(ok({ isNewMember: true, signupToken: 'st' }));

    await expect(socialLogin('google', 'code-1', 'http://localhost:3000')).resolves.toEqual({
      status: 'signupRequired',
      signupToken: 'st',
    });
  });

  it('가입한 회원인데 응답에 값이 빠지면 던진다', async () => {
    mockFetch(ok({ isNewMember: false, accessToken: 'at' }));

    await expect(socialLogin('kakao', 'code-1', 'http://localhost:3000')).rejects.toThrow();
  });
});
