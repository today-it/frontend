import { apiRequest } from '@/shared/api';

import { type SocialProvider } from '../model/social-login';

/**
 * 소셜 로그인 결과입니다.
 * 이미 가입한 회원은 액세스 토큰을, 아직 가입하지 않은 사용자는 가입용 토큰을 받습니다.
 */
export type SocialLoginResult =
  { status: 'success'; accessToken: string } | { status: 'signupRequired'; signupToken: string };

interface SocialLoginResponse {
  isNewMember: boolean;
  accessToken?: string;
  signupToken?: string;
}

/** 제공자에게 받은 인가 코드로 소셜 로그인합니다. 요청이 실패하면 reject합니다. */
export async function socialLogin(
  provider: SocialProvider,
  authorizationCode: string,
  redirectUri: string,
): Promise<SocialLoginResult> {
  const data = await apiRequest<SocialLoginResponse>(`/api/v1/auth/oauth/${provider}`, {
    method: 'POST',
    body: { authorizationCode, redirectUri },
  });

  if (data.isNewMember) {
    if (!data.signupToken) {
      throw new Error('가입용 토큰을 받지 못했습니다.');
    }

    return { status: 'signupRequired', signupToken: data.signupToken };
  }

  if (!data.accessToken) {
    throw new Error('액세스 토큰을 받지 못했습니다.');
  }

  return { status: 'success', accessToken: data.accessToken };
}
