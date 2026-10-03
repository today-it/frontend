'use client';

import { useState } from 'react';

import { type SignupCodeError, type SignupEmailServerError } from '@/app/_model/signup-email';
import { type SignupTermId } from '@/app/_model/signup-terms';
import { useCountdown } from '@/app/_model/use-countdown';
import { Button, Logo, Modal } from '@/shared/ui';

import { type SignupEmailPhase, SignupEmailStep } from './signup/signup-email-step';
import { SignupTermsStep } from './signup/signup-terms-step';

/**
 * 임시 확인용 컴포넌트입니다. 회원가입 모달 조립 시 삭제합니다.
 *
 * 테스트 입력: registered@test.com(이미 가입), social@test.com(소셜 가입),
 * 인증코드 111111(불일치), 000000(만료), 그 외 6자리는 성공
 */
export function TempTermsPreview() {
  const [open, setOpen] = useState(true);
  const [step, setStep] = useState<'terms' | 'email'>('terms');
  const [agreedIds, setAgreedIds] = useState<SignupTermId[]>([]);
  const [phase, setPhase] = useState<SignupEmailPhase>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [emailError, setEmailError] = useState<SignupEmailServerError>();
  const [codeError, setCodeError] = useState<SignupCodeError>();
  const { isExpired, secondsLeft, start } = useCountdown(300);

  function requestCode() {
    if (email.trim() === 'registered@test.com') {
      setEmailError('registered');
      return;
    }

    if (email.trim() === 'social@test.com') {
      setEmailError('social');
      return;
    }

    setPhase('code');
    setCode('');
    setCodeError(undefined);
    start();
  }

  function verifyCode() {
    const digits = code.replace(/\D/g, '');

    if (isExpired || digits === '000000') {
      setCodeError('expired');
      return;
    }

    if (digits === '111111') {
      setCodeError('invalid');
      return;
    }

    setOpen(false);
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} size="md">
        시작하기
      </Button>
      <Modal logo={<Logo />} onOpenChange={setOpen} open={open}>
        {step === 'terms' ? (
          <SignupTermsStep
            agreedIds={agreedIds}
            loginHref="/login"
            onAgreedIdsChange={setAgreedIds}
            onNext={() => setStep('email')}
          />
        ) : (
          <SignupEmailStep
            code={code}
            codeError={codeError ?? (isExpired ? 'expired' : undefined)}
            email={email}
            emailError={emailError}
            loginHref="/login"
            onCodeChange={(nextCode) => {
              setCodeError(undefined);
              setCode(nextCode);
            }}
            onEmailChange={(nextEmail) => {
              setEmailError(undefined);
              setEmail(nextEmail);
            }}
            onRequestCode={requestCode}
            onResendCode={() => {
              setCode('');
              setCodeError(undefined);
              start();
            }}
            onVerifyCode={verifyCode}
            phase={phase}
            timerSeconds={secondsLeft}
          />
        )}
      </Modal>
    </>
  );
}
