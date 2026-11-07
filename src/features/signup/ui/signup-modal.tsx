'use client';

import { useState } from 'react';

import { Logo, Modal } from '@/shared/ui';

import { type SignupApi } from '../model/signup-api';
import { createHttpSignupApi } from '../model/signup-http-api';
import { type SignupTermId } from '../model/signup-terms';
import { type SignupSocialSession, useSignupSteps } from '../model/use-signup-steps';
import { SignupCompleteStep } from './signup-complete-step';
import { SignupEmailStep } from './signup-email-step';
import { SignupPreferenceStep } from './signup-preference-step';
import { SignupProfileStep } from './signup-profile-step';
import { SignupTermsStep } from './signup-terms-step';

export interface SignupModalProps {
  /** 모달이 열려 있는지 여부 */
  open: boolean;
  /** 열림 상태가 바뀔 때 호출되는 함수. 가입이 끝나면 `false`로 호출됩니다. */
  onOpenChange: (open: boolean) => void;
  /** 이미 계정이 있는 사용자가 이동할 로그인 경로 */
  loginHref: string;
  /** 로그인 모달로 전환할 때 호출합니다. */
  onLogin?: () => void;
  /** 닫힘 애니메이션과 단계 초기화가 끝나면 호출합니다. */
  onCloseComplete?: () => void;
  /** 가입 과정에서 호출하는 서버 요청. 생략하면 실제 서버에 요청합니다. 스토리는 스토리 전용 응답을 넘깁니다. */
  api?: SignupApi;
  /** 가입 완료 안내에서 나중에 설정하거나, 선호 지역·컨셉을 저장하거나 건너뛰어 가입이 끝났을 때 호출되는 함수 */
  onComplete?: () => void;
  /** 소셜 인증을 마치고 가입만 남았을 때의 정보. 주면 이메일 인증 없이 프로필 단계로 진행합니다. */
  social?: SignupSocialSession;
  /** 소셜 로그인 버튼을 눌렀을 때 호출되는 함수. 그때까지 동의한 약관을 함께 넘깁니다. */
  onSocialLogin?: (provider: 'google' | 'kakao', agreedIds: readonly SignupTermId[]) => void;
}

/**
 * 회원가입 모달입니다. 약관 동의, 이메일 인증, 프로필 설정, 가입 완료 안내, 선호 지역·컨셉 순서로 진행합니다.
 * 선호 지역·컨셉은 가입 완료 안내에서 `취향 알려주기`를 눌렀을 때만 거칩니다.
 * 닫으면 닫힘 애니메이션이 끝난 뒤 처음 단계로 돌아가고, 가입이 끝나면 `onComplete`를 호출하고 닫습니다.
 *
 * @example
 * ```tsx
 * <SignupModal loginHref="/login" onOpenChange={setOpen} open={open} />
 * ```
 */
export function SignupModal({
  api,
  loginHref,
  onCloseComplete,
  onComplete,
  onLogin,
  onOpenChange,
  onSocialLogin,
  open,
  social,
}: SignupModalProps) {
  // api를 생략했을 때 렌더마다 새로 만들지 않도록 한 번만 만듭니다.
  const [defaultApi] = useState(() => createHttpSignupApi());
  const flow = useSignupSteps({
    api: api ?? defaultApi,
    onComplete: () => {
      onOpenChange(false);
      onComplete?.();
    },
    social,
  });

  return (
    <Modal
      logo={<Logo />}
      onOpenChange={onOpenChange}
      onOpenChangeComplete={(nextOpen) => {
        if (!nextOpen) {
          flow.reset();
          onCloseComplete?.();
        }
      }}
      open={open}
    >
      {flow.step === 'terms' ? (
        <SignupTermsStep
          defaultAgreedIds={flow.agreedIds}
          loginHref={loginHref}
          onLogin={onLogin}
          onNext={flow.agreeTerms}
        />
      ) : null}

      {flow.step === 'email' ? (
        <SignupEmailStep
          codeError={flow.codeError}
          defaultEmail={flow.email}
          emailError={flow.emailError}
          isResendDisabled={flow.isResendBlocked}
          isSubmitting={flow.isSubmitting}
          loginHref={loginHref}
          onCodeChange={flow.changeCode}
          onEmailChange={flow.changeEmail}
          onLogin={onLogin}
          onRequestCode={flow.requestCode}
          onResendCode={flow.resendCode}
          onSocialLogin={(provider) => onSocialLogin?.(provider, flow.agreedIds)}
          onVerifyCode={flow.verifyCode}
          phase={flow.phase}
          requestError={flow.requestFailed}
          timerSeconds={flow.timerSeconds}
        />
      ) : null}

      {flow.step === 'profile' ? (
        <SignupProfileStep
          hasPassword={!social}
          isAvatarDisabled={!flow.agreedIds.includes('profile-image')}
          isSubmitting={flow.isSubmitting}
          nicknameStatus={flow.nicknameStatus}
          onCheckNickname={flow.checkNickname}
          onNicknameChange={flow.changeNickname}
          onPasswordChange={flow.changePassword}
          onSubmit={flow.submitProfile}
          passwordError={flow.passwordError}
          requestError={flow.requestFailed}
          submitErrorMessage={flow.socialErrorMessage}
        />
      ) : null}

      {flow.step === 'complete' ? (
        <SignupCompleteStep onSkip={flow.finishSignup} onStartPreference={flow.startPreference} />
      ) : null}

      {flow.step === 'preference' ? (
        <SignupPreferenceStep
          isSubmitting={flow.isSubmitting}
          onSkip={flow.finishSignup}
          onSubmit={flow.submitPreference}
          requestError={flow.requestFailed}
        />
      ) : null}
    </Modal>
  );
}
