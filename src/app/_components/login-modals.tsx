'use client';

import { useRef, useState } from 'react';

import { LoginStep, type LoginSubmitResult, type LoginValues } from '@/features/login';
import { SignupModal } from '@/features/signup';
import { Logo, Modal } from '@/shared/ui';

interface LoginModalsProps {
  onCloseComplete: () => void;
}

async function mockLogin(values: LoginValues, failureCount: number): Promise<LoginSubmitResult> {
  await new Promise<void>((resolve) => setTimeout(resolve, 700));

  if (values.email === 'invalid@test.com') {
    return {
      status: 'invalid',
      failureCount: failureCount + 1,
      failureCountTotal: 5,
    };
  }

  return { status: 'success' };
}

export function LoginModals({ onCloseComplete }: LoginModalsProps) {
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
    const failureCount = result?.status === 'invalid' ? result.failureCount : 0;

    setResult(undefined);

    const nextResult = await mockLogin(values, failureCount);

    if (openCycle !== openCycleRef.current) {
      return;
    }

    setResult(nextResult);

    if (nextResult.status === 'success') {
      handleOpenChange(false);
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
          loginError={result?.status === 'invalid' ? 'invalid' : undefined}
          onPasswordReset={() => {
            // 비밀번호 재설정은 아직 연결하지 않았습니다.
          }}
          onSignup={() => switchModal('signup')}
          onSubmit={handleSubmit}
        />
      </Modal>
    </>
  );
}
