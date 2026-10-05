'use client';

import { useState } from 'react';

import { type SignupApi } from '@/features/signup/model/signup-api';
import { createMockSignupApi } from '@/features/signup/model/signup-mock-api';
import { useSignupSteps } from '@/features/signup/model/use-signup-steps';
import { Logo, Modal } from '@/shared/ui';

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
  /** 가입 과정에서 호출하는 서버 요청. 생략하면 임시 응답을 사용합니다. */
  api?: SignupApi;
  /** 선호 지역·컨셉을 저장하거나 건너뛰어 가입이 끝났을 때 호출되는 함수 */
  onComplete?: () => void;
}

/**
 * 회원가입 모달입니다. 약관 동의, 이메일 인증, 프로필 설정, 선호 지역·컨셉 순서로 진행합니다.
 * 닫으면 닫힘 애니메이션이 끝난 뒤 처음 단계로 돌아가고, 가입이 끝나면 `onComplete`를 호출하고 닫습니다.
 *
 * @example
 * ```tsx
 * <SignupModal loginHref="/login" onOpenChange={setOpen} open={open} />
 * ```
 */
export function SignupModal({ api, loginHref, onComplete, onOpenChange, open }: SignupModalProps) {
  // api를 생략했을 때 렌더마다 새로 만들지 않도록 한 번만 만듭니다.
  const [mockApi] = useState(() => createMockSignupApi());
  const flow = useSignupSteps({
    api: api ?? mockApi,
    onComplete: () => {
      onOpenChange(false);
      onComplete?.();
    },
  });

  return (
    <Modal
      logo={<Logo />}
      onOpenChange={onOpenChange}
      onOpenChangeComplete={(nextOpen) => {
        if (!nextOpen) {
          flow.reset();
        }
      }}
      open={open}
    >
      {flow.step === 'terms' ? (
        <SignupTermsStep
          defaultAgreedIds={flow.agreedIds}
          loginHref={loginHref}
          onNext={flow.agreeTerms}
        />
      ) : null}

      {flow.step === 'email' ? (
        <SignupEmailStep
          codeError={flow.codeError}
          defaultEmail={flow.email}
          emailError={flow.emailError}
          isSubmitting={flow.isSubmitting}
          loginHref={loginHref}
          onCodeChange={flow.changeCode}
          onEmailChange={flow.changeEmail}
          onRequestCode={flow.requestCode}
          onResendCode={flow.resendCode}
          onVerifyCode={flow.verifyCode}
          phase={flow.phase}
          requestError={flow.requestFailed}
          timerSeconds={flow.timerSeconds}
        />
      ) : null}

      {flow.step === 'profile' ? (
        <SignupProfileStep
          isSubmitting={flow.isSubmitting}
          nicknameStatus={flow.nicknameStatus}
          onCheckNickname={flow.checkNickname}
          onNicknameChange={flow.changeNickname}
          onPasswordChange={flow.changePassword}
          onSubmit={flow.submitProfile}
          passwordError={flow.passwordError}
          requestError={flow.requestFailed}
        />
      ) : null}

      {flow.step === 'preference' ? (
        <SignupPreferenceStep
          isSubmitting={flow.isSubmitting}
          onSkip={flow.skipPreference}
          onSubmit={flow.submitPreference}
          requestError={flow.requestFailed}
        />
      ) : null}
    </Modal>
  );
}
