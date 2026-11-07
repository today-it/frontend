'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { useLoginModalStore } from '@/app/_model/login-modal-store';
import {
  getSocialRedirectUri,
  socialLogin,
  type SocialProvider,
  takeSocialLoginRequest,
} from '@/features/social-login';
import { Button } from '@/shared/ui';

interface OAuthCallbackProps {
  provider: SocialProvider;
}

/**
 * 소셜 인증을 마치고 돌아왔을 때 인가 코드를 로그인 요청으로 바꾸는 화면입니다.
 * 이미 가입한 회원은 액세스 토큰을 저장하고, 가입하지 않은 사용자는 가입 모달을 연 뒤 홈으로 돌아갑니다.
 */
export function OAuthCallback({ provider }: OAuthCallbackProps) {
  const router = useRouter();
  const openSocialSignup = useLoginModalStore((state) => state.openSocialSignup);
  const [failed, setFailed] = useState(false);
  // 인가 코드는 한 번만 쓸 수 있으므로 effect가 다시 실행돼도 요청을 한 번만 보냅니다.
  const isHandledRef = useRef(false);

  useEffect(() => {
    if (isHandledRef.current) {
      return;
    }

    isHandledRef.current = true;

    const params = new URLSearchParams(location.search);
    const request = takeSocialLoginRequest();
    const code = params.get('code');
    const state = params.get('state');

    // 인가 코드가 주소창과 기록에 남지 않게 지웁니다.
    history.replaceState(null, '', location.pathname);

    // 사용자가 취소했거나 저장해둔 요청과 맞지 않으면 홈으로 돌아갑니다.
    if (!code || !state || request?.provider !== provider || request.state !== state) {
      router.replace('/');
      return;
    }

    const { agreedIds } = request;

    void (async () => {
      try {
        const result = await socialLogin(provider, code, getSocialRedirectUri(provider));

        if (result.status === 'success') {
          localStorage.setItem('accessToken', result.accessToken);
        } else {
          openSocialSignup({ provider, signupToken: result.signupToken, agreedIds });
        }

        router.replace('/');
      } catch {
        setFailed(true);
      }
    })();
  }, [openSocialSignup, provider, router]);

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-16 p-24">
      {failed ? (
        <>
          <p className="text-center text-body-b2 text-text-secondary">
            로그인을 처리하지 못했어요. 잠시 후 다시 시도해주세요.
          </p>
          <Button onClick={() => router.replace('/')} type="button">
            홈으로 이동
          </Button>
        </>
      ) : (
        <p className="text-body-b2 text-text-secondary" role="status">
          로그인하고 있어요.
        </p>
      )}
    </main>
  );
}
