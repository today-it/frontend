'use client';

import { useRef, useState } from 'react';

import {
  login,
  LoginStep,
  type LoginStepProps,
  type LoginSubmitResult,
  type LoginValues,
} from '@/features/login';
import { SignupModal } from '@/features/signup';
import { Logo, Modal } from '@/shared/ui';

interface LoginModalsProps {
  onCloseComplete: () => void;
  onComplete?: () => void;
  onPasswordReset?: LoginStepProps['onPasswordReset'];
}

export function LoginModals({ onCloseComplete, onComplete, onPasswordReset }: LoginModalsProps) {
  const [activeModal, setActiveModal] = useState<'login' | 'signup' | null>('login');
  const nextModalRef = useRef<'login' | 'signup' | null>(null);
  const [result, setResult] = useState<LoginSubmitResult>();
  const openCycleRef = useRef(0);

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
    } else {
      onCloseComplete();
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
      } else if (nextResult.status === 'locked') {
        if (onPasswordReset) {
          onPasswordReset();
        } else {
          setResult(nextResult);
        }
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
      <SignupModal
        loginHref="/login"
        onCloseComplete={handleCloseComplete}
        onLogin={() => switchModal('login')}
        onOpenChange={(open) => setActiveModal(open ? 'signup' : null)}
        open={activeModal === 'signup'}
      />
      <Modal
        logo={<Logo />}
        onOpenChange={handleOpenChange}
        onOpenChangeComplete={(nextOpen) => {
          if (!nextOpen) {
            handleCloseComplete();
          }
        }}
        open={activeModal === 'login'}
      >
        <LoginStep
          failureCount={result?.status === 'invalid' ? result.failureCount : undefined}
          failureCountTotal={result?.status === 'invalid' ? result.failureCountTotal : undefined}
          loginError={
            result?.status === 'invalid' || result?.status === 'locked' ? result.status : undefined
          }
          onPasswordReset={() => onPasswordReset?.()}
          onSignup={() => switchModal('signup')}
          onSubmit={handleSubmit}
        />
      </Modal>
    </>
  );
}
