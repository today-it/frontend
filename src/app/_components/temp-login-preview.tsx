'use client';

import { useRef, useState } from 'react';

import { type LoginSubmitResult, type LoginValues } from '@/app/_model/login';
import { Button, Logo, Modal } from '@/shared/ui';

import { LoginStep, type LoginStepProps } from './login/login-step';

interface TempLoginPreviewProps {
  onComplete?: () => void;
  onPasswordReset?: LoginStepProps['onPasswordReset'];
  onSignup?: LoginStepProps['onSignup'];
  onSocialLogin?: LoginStepProps['onSocialLogin'];
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

export function TempLoginPreview({
  onComplete,
  onPasswordReset,
  onSignup,
  onSocialLogin,
}: TempLoginPreviewProps) {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState<LoginSubmitResult>();
  const openCycleRef = useRef(0);

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
      setOpen(false);
      onComplete?.();
    }
  }

  return (
    <>
      <Button
        onClick={() => {
          openCycleRef.current += 1;
          setResult(undefined);
          setOpen(true);
        }}
        size="md"
      >
        로그인
      </Button>

      <Modal logo={<Logo />} onOpenChange={setOpen} open={open}>
        <LoginStep
          failureCount={result?.status === 'invalid' ? result.failureCount : undefined}
          failureCountTotal={result?.status === 'invalid' ? result.failureCountTotal : undefined}
          loginError={result?.status === 'invalid' ? 'invalid' : undefined}
          onPasswordReset={() => onPasswordReset?.()}
          onSignup={() => onSignup?.()}
          onSocialLogin={onSocialLogin}
          onSubmit={handleSubmit}
        />
      </Modal>
    </>
  );
}
