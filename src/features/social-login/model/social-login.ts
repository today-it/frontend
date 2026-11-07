/** 지원하는 소셜 로그인 제공자 */
export type SocialProvider = 'google' | 'kakao';

/** 인가 화면으로 이동하기 전에 저장하고, 콜백에서 확인하는 값 */
export interface SocialLoginRequest {
  provider: SocialProvider;
  /** 요청마다 새로 만드는 일회용 값. 콜백에서 같은 값이 돌아왔는지 확인합니다. */
  state: string;
  /** 소셜 버튼을 누르기 전에 동의한 약관. 로그인 모달에서 시작하면 비어 있습니다. */
  agreedIds: string[];
}

/** 소셜 인증은 마쳤지만 아직 가입하지 않은 사용자의 정보. 가입 모달을 열 때 전달합니다. */
export interface SocialSignupRequest {
  provider: SocialProvider;
  /** 소셜 로그인 응답으로 받은 가입용 임시 토큰 */
  signupToken: string;
  agreedIds: string[];
}

const LOGIN_REQUEST_KEY = 'socialLoginRequest';

interface ProviderConfig {
  authorizeUrl: string;
  clientId: string;
  redirectUri: string;
  /** 구글은 요청할 정보 범위를 함께 보내야 합니다. */
  scope?: string;
}

function getProviderConfig(provider: SocialProvider): ProviderConfig {
  // NEXT_PUBLIC_ 값은 빌드할 때 치환되므로 변수로 조합하지 않고 그대로 참조합니다.
  const [clientId, redirectUri] =
    provider === 'google'
      ? [process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID, process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI]
      : [process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID, process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI];

  if (!clientId || !redirectUri) {
    throw new Error('소셜 로그인 설정이 없습니다.');
  }

  return provider === 'google'
    ? {
        authorizeUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
        clientId,
        redirectUri,
        scope: 'openid email profile',
      }
    : { authorizeUrl: 'https://kauth.kakao.com/oauth/authorize', clientId, redirectUri };
}

/** 콜백에서 서버에 전달할 Redirect URI입니다. 인가 요청에 사용한 값과 같아야 합니다. */
export function getSocialRedirectUri(provider: SocialProvider) {
  return getProviderConfig(provider).redirectUri;
}

/**
 * 제공자의 인가 화면으로 이동합니다.
 * 돌아왔을 때 확인할 `state`와 동의한 약관을 저장합니다.
 */
export function startSocialLogin(provider: SocialProvider, agreedIds: readonly string[] = []) {
  const config = getProviderConfig(provider);
  const state = crypto.randomUUID();
  const request: SocialLoginRequest = { provider, state, agreedIds: [...agreedIds] };

  sessionStorage.setItem(LOGIN_REQUEST_KEY, JSON.stringify(request));

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: 'code',
    state,
  });

  if (config.scope) {
    params.set('scope', config.scope);
  }

  // 제공자의 인가 화면은 외부 주소라 Next.js 라우터를 쓰지 않습니다.
  window.location.assign(`${config.authorizeUrl}?${params.toString()}`);
}

/** 인가 요청에 저장해둔 값을 꺼내고 지웁니다. `state`는 한 번만 쓸 수 있습니다. */
export function takeSocialLoginRequest() {
  const stored = sessionStorage.getItem(LOGIN_REQUEST_KEY);

  sessionStorage.removeItem(LOGIN_REQUEST_KEY);

  if (stored === null) {
    return undefined;
  }

  try {
    return JSON.parse(stored) as SocialLoginRequest;
  } catch {
    return undefined;
  }
}
