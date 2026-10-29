import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createHttpSignupApi, toAgreements } from './signup-http-api';

function mockFetch(...responses: { status?: number; body: unknown }[]) {
  const fetchMock = vi.fn();

  for (const { status = 200, body } of responses) {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
  }

  vi.stubGlobal('fetch', fetchMock);

  return fetchMock;
}

const ok = (data: unknown, status = 200) => ({ status, body: { success: true, data } });
const fail = (status: number, code: string) => ({
  status,
  body: { success: false, code, message: code },
});

const BASE_URL = 'https://api.example.com';

beforeEach(() => {
  vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', BASE_URL);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe('toAgreements', () => {
  it('동의한 약관만 true로 서버 약관 코드에 대응시킨다', () => {
    expect(toAgreements(['service', 'privacy', 'preference'])).toEqual({
      TOS: true,
      ACCOUNT_PRIVACY: true,
      PREFERENCE: true,
      PROFILE_IMAGE: false,
    });
  });
});

describe('createHttpSignupApi.requestCode', () => {
  it('가입된 이메일이면 인증코드를 보내지 않고 registered를 반환한다', async () => {
    const fetchMock = mockFetch(ok({ email: 'a@b.com', available: false }));

    await expect(createHttpSignupApi().requestCode('a@b.com')).resolves.toBe('registered');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toBe(`${BASE_URL}/api/v1/auth/emails/check?email=a%40b.com`);
  });

  it('사용 가능한 이메일이면 SIGNUP 목적으로 발송하고 sent를 반환한다', async () => {
    const fetchMock = mockFetch(
      ok({ email: 'a@b.com', available: true }),
      ok({ email: 'a@b.com', purpose: 'SIGNUP', expiresIn: 1800, resendAvailableIn: 60 }),
    );

    await expect(createHttpSignupApi().requestCode('a@b.com')).resolves.toBe('sent');

    const [url, init] = fetchMock.mock.calls[1];

    expect(url).toBe(`${BASE_URL}/api/v1/auth/email-verifications`);
    expect(JSON.parse(init.body)).toEqual({ email: 'a@b.com', purpose: 'SIGNUP' });
  });

  it('재전송이면 이메일 중복 확인 없이 바로 발송한다', async () => {
    const fetchMock = mockFetch(ok({ email: 'a@b.com', purpose: 'SIGNUP' }));

    await expect(createHttpSignupApi().requestCode('a@b.com', { resend: true })).resolves.toBe(
      'sent',
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toBe(`${BASE_URL}/api/v1/auth/email-verifications`);
  });

  it('재전송 대기 중이면 tooSoon을 반환한다', async () => {
    mockFetch(ok({ available: true }), fail(400, 'EMAIL_VERIFICATION_RESEND_TOO_SOON'));

    await expect(createHttpSignupApi().requestCode('a@b.com')).resolves.toBe('tooSoon');
  });

  it('발송 횟수 제한에 걸리면 limitExceeded를 반환한다', async () => {
    mockFetch(ok({ available: true }), fail(400, 'EMAIL_VERIFICATION_SEND_LIMIT_EXCEEDED'));

    await expect(createHttpSignupApi().requestCode('a@b.com')).resolves.toBe('limitExceeded');
  });

  it('그 밖의 서버 오류는 던진다', async () => {
    mockFetch(ok({ available: true }), fail(500, 'EMAIL_DELIVERY_FAILED'));

    await expect(createHttpSignupApi().requestCode('a@b.com')).rejects.toMatchObject({
      status: 500,
    });
  });

  it('네트워크 오류는 던진다', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));

    await expect(createHttpSignupApi().requestCode('a@b.com')).rejects.toThrow('Failed to fetch');
  });
});

describe('서버 주소 설정', () => {
  it('NEXT_PUBLIC_API_BASE_URL이 없으면 요청 전에 오류를 던진다', async () => {
    vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', '');

    const fetchMock = mockFetch();

    await expect(createHttpSignupApi().requestCode('a@b.com')).rejects.toThrow(
      'API 서버 주소가 설정되지 않았습니다.',
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('createHttpSignupApi.verifyCode', () => {
  it('구분자를 뺀 문자열 코드로 확인하고 인증 토큰을 반환한다', async () => {
    const fetchMock = mockFetch(ok({ verificationToken: 'token-1', expiresIn: 1800 }));

    await expect(createHttpSignupApi().verifyCode('a@b.com', '012 - 345')).resolves.toEqual({
      verificationToken: 'token-1',
    });
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({
      email: 'a@b.com',
      verificationCode: '012345',
      purpose: 'SIGNUP',
    });
  });

  it('코드가 틀리면 invalid를 반환한다', async () => {
    mockFetch(fail(400, 'EMAIL_VERIFICATION_CODE_INVALID'));

    await expect(createHttpSignupApi().verifyCode('a@b.com', '111111')).resolves.toBe('invalid');
  });

  it('실패 횟수가 최대에 못 미치면 invalid, 도달하면 reissued를 반환한다', async () => {
    const invalid = (failureCount: number) => ({
      status: 400,
      body: {
        success: false,
        code: 'EMAIL_VERIFICATION_CODE_INVALID',
        message: '인증번호가 올바르지 않습니다.',
        failureCount,
        maxFailureCount: 3,
      },
    });

    mockFetch(invalid(1), invalid(2), invalid(3));

    const api = createHttpSignupApi();

    await expect(api.verifyCode('a@b.com', '111111')).resolves.toBe('invalid');
    await expect(api.verifyCode('a@b.com', '111111')).resolves.toBe('invalid');
    await expect(api.verifyCode('a@b.com', '111111')).resolves.toBe('reissued');
  });

  it('만료된 코드는 expired를 반환한다', async () => {
    mockFetch(fail(400, 'EMAIL_VERIFICATION_CODE_EXPIRED'));

    await expect(createHttpSignupApi().verifyCode('a@b.com', '123456')).resolves.toBe('expired');
  });

  it('3회 실패 후 발송 횟수 제한에 걸리면 limitExceeded를 반환한다', async () => {
    mockFetch(fail(400, 'EMAIL_VERIFICATION_SEND_LIMIT_EXCEEDED'));

    await expect(createHttpSignupApi().verifyCode('a@b.com', '123456')).resolves.toBe(
      'limitExceeded',
    );
  });

  it('명세에 없는 400 코드는 던진다', async () => {
    mockFetch(fail(400, 'SOMETHING_ELSE'));

    await expect(createHttpSignupApi().verifyCode('a@b.com', '111111')).rejects.toMatchObject({
      code: 'SOMETHING_ELSE',
    });
  });
});

describe('createHttpSignupApi.checkNickname', () => {
  it('사용 가능 여부를 available·duplicated로 바꾼다', async () => {
    mockFetch(ok({ available: true }), ok({ available: false }));

    const api = createHttpSignupApi();

    await expect(api.checkNickname('닉네임')).resolves.toBe('available');
    await expect(api.checkNickname('닉네임')).resolves.toBe('duplicated');
  });

  it('INVALID_REQUEST는 forbidden으로 바꾼다', async () => {
    mockFetch(fail(400, 'INVALID_REQUEST'));

    await expect(createHttpSignupApi().checkNickname('금칙어')).resolves.toBe('forbidden');
  });

  it('서버 오류는 던진다', async () => {
    mockFetch(fail(500, 'INTERNAL'));

    await expect(createHttpSignupApi().checkNickname('닉네임')).rejects.toMatchObject({
      status: 500,
    });
  });
});

describe('createHttpSignupApi.signup', () => {
  const request = {
    email: 'a@b.com',
    nickname: '유저',
    password: 'Password123!',
    verificationToken: 'token-1',
    agreedIds: ['service', 'privacy'],
  } as const;

  it('LOCAL 가입 본문을 만들어 보내고 created를 반환한다', async () => {
    const fetchMock = mockFetch(ok({ memberId: 'id' }, 201));

    await expect(createHttpSignupApi().signup(request)).resolves.toBe('created');
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({
      provider: 'LOCAL',
      email: 'a@b.com',
      emailVerificationToken: 'token-1',
      password: 'Password123!',
      nickname: '유저',
      agreements: { TOS: true, ACCOUNT_PRIVACY: true, PREFERENCE: false, PROFILE_IMAGE: false },
    });
  });

  it.each([
    [400, 'EMAIL_VERIFICATION_TOKEN_INVALID', 'verificationExpired'],
    [409, 'EMAIL_ALREADY_EXISTS', 'emailRegistered'],
    [409, 'NICKNAME_ALREADY_EXISTS', 'nicknameDuplicated'],
  ])('%i %s는 %s를 반환한다', async (status, code, expected) => {
    mockFetch(fail(status, code));

    await expect(createHttpSignupApi().signup(request)).resolves.toBe(expected);
  });

  it('명세에 없는 서버 오류는 던진다', async () => {
    mockFetch(fail(409, 'GOOGLE_ACCOUNT_ALREADY_EXISTS'));

    await expect(createHttpSignupApi().signup(request)).rejects.toMatchObject({
      status: 409,
      code: 'GOOGLE_ACCOUNT_ALREADY_EXISTS',
    });
  });
});
