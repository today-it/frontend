'use client';

import { useRef, useState } from 'react';

import {
  login,
  LoginStep,
  type LoginStepProps,
  type LoginSubmitResult,
  type LoginValues,
} from '@/features/login';
import { Button, Logo, Modal } from '@/shared/ui';

import { TempTermsPreview } from './temp-terms-preview';

interface TempLoginPreviewProps {
  onComplete?: () => void;
  onPasswordReset?: LoginStepProps['onPasswordReset'];
  onSignup?: LoginStepProps['onSignup'];
  onSocialLogin?: LoginStepProps['onSocialLogin'];
}

export function TempLoginPreview({
  onComplete,
  onPasswordReset,
  onSignup,
  onSocialLogin,
}: TempLoginPreviewProps) {
  const [activeModal, setActiveModal] = useState<'login' | 'signup' | null>('signup');
  const nextModalRef = useRef<'login' | 'signup' | null>(null);
  const [result, setResult] = useState<LoginSubmitResult>();
  const openCycleRef = useRef(0);
  const triggerRef = useRef<HTMLButtonElement>(null);

  function handleOpenChange(nextOpen: boolean) {
    openCycleRef.current += 1;
    setResult(undefined);
    setActiveModal(nextOpen ? 'login' : null);
  }

  function switchModal(nextModal: 'login' | 'signup') {
    nextModalRef.current = nextModal;

    if (activeModal === 'login') {
      handleOpenChange(false);
    } else {
      setActiveModal(null);
    }
  }

  function handleCloseComplete() {
    if (nextModalRef.current) {
      setActiveModal(nextModalRef.current);
      nextModalRef.current = null;
    }
  }

  async function handleSubmit(values: LoginValues) {
    const openCycle = openCycleRef.current;
    setResult(undefined);

    try {
      const nextResult = await login(values);

      if (openCycle !== openCycleRef.current) {
        return;
      }

      if (nextResult.status === 'success') {
        localStorage.setItem('accessToken', nextResult.accessToken);
        handleOpenChange(false);
        onComplete?.();
      } else {
        setResult(nextResult);
      }
    } catch {
      // 요청·저장 오류를 이메일·비밀번호 불일치로 표시하지 않습니다.
      console.error('로그인을 처리하지 못했습니다.');
      return;
    }
  }

  return (
    <>
      <TempTermsPreview
        onCloseComplete={handleCloseComplete}
        onLogin={() => switchModal('login')}
        onOpenChange={(open) => setActiveModal(open ? 'signup' : null)}
        open={activeModal === 'signup'}
      />
      <Button onClick={() => handleOpenChange(true)} ref={triggerRef} size="md">
        로그인
      </Button>

      <Modal
        logo={<Logo />}
        onOpenChange={handleOpenChange}
        onOpenChangeComplete={(nextOpen) => {
          if (!nextOpen) {
            triggerRef.current?.focus();
            handleCloseComplete();
          }
        }}
        open={activeModal === 'login'}
      >
        <LoginStep
          failureCount={result?.status === 'invalid' ? result.failureCount : undefined}
          failureCountTotal={result?.status === 'invalid' ? result.failureCountTotal : undefined}
          loginError={result?.status === 'invalid' ? 'invalid' : undefined}
          onPasswordReset={() => onPasswordReset?.()}
          onSignup={() => {
            switchModal('signup');
            onSignup?.();
          }}
          onSocialLogin={onSocialLogin}
          onSubmit={handleSubmit}
        />
      </Modal>
    </>
  );
}
