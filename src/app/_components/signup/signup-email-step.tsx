'use client';

import { type FormEvent, type ReactNode, useId, useState } from 'react';

import {
  isCodeComplete,
  isValidEmail,
  type SignupCodeError,
  signupCodeErrorMessages,
  signupEmailErrorMessages,
  type SignupEmailServerError,
} from '@/app/_model/signup-email';
import { cn } from '@/shared/lib';
import { Button, CodeInput, Divider, ModalTitle, SocialLoginButton, TextInput } from '@/shared/ui';

import { SignupLoginLink } from './signup-login-link';

export type SignupEmailPhase = 'email' | 'code';
export type SignupSocialProvider = 'google' | 'kakao';

export interface SignupEmailStepProps {
  /** 이메일 입력 단계인지, 인증코드 입력 단계인지 나타냅니다. */
  phase: SignupEmailPhase;
  /** 입력한 이메일 */
  email: string;
  /** 이메일이 바뀔 때 호출되는 함수 */
  onEmailChange: (email: string) => void;
  /** 입력한 인증코드 */
  code: string;
  /** 인증코드가 바뀔 때 호출되는 함수 */
  onCodeChange: (code: string) => void;
  /** 인증코드의 남은 시간(초) */
  timerSeconds?: number;
  /** 서버 응답으로 받은 이메일 오류 */
  emailError?: SignupEmailServerError;
  /** 서버 응답으로 받은 인증코드 오류 */
  codeError?: SignupCodeError;
  /** 올바른 이메일로 다음 버튼을 눌렀을 때 호출되는 함수 */
  onRequestCode: () => void;
  /** 인증코드 6자리를 입력하고 다음 버튼을 눌렀을 때 호출되는 함수 */
  onVerifyCode: () => void;
  /** 인증코드 재전송을 눌렀을 때 호출되는 함수 */
  onResendCode: () => void;
  /** 소셜 로그인 버튼을 눌렀을 때 호출되는 함수 */
  onSocialLogin?: (provider: SignupSocialProvider) => void;
  /** 이미 계정이 있는 사용자가 이동할 로그인 경로 */
  loginHref: string;
}

function FieldError({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <p
      className={cn('text-caption-c1 [color:var(--td-color-text-error)]', className)}
      id={id}
      role="alert"
    >
      {children}
    </p>
  );
}

/**
 * 회원가입 모달의 이메일 인증 단계입니다. `Modal` 안에서 사용합니다.
 *
 * 이메일을 입력하는 `email` 단계와, 이메일이 잠긴 채 인증코드를 입력하는 `code` 단계를 한 화면에서 보여줍니다.
 * 이메일 형식은 이 컴포넌트가 다음 버튼을 눌렀을 때 확인하고, 그 외 오류는 서버 응답을 props로 받아 표시합니다.
 *
 * @example
 * ```tsx
 * <Modal open={open} onOpenChange={setOpen}>
 *   <SignupEmailStep
 *     code={code}
 *     email={email}
 *     loginHref="/login"
 *     onCodeChange={setCode}
 *     onEmailChange={setEmail}
 *     onRequestCode={requestCode}
 *     onResendCode={requestCode}
 *     onVerifyCode={verifyCode}
 *     phase="email"
 *   />
 * </Modal>
 * ```
 */
export function SignupEmailStep({
  code,
  codeError,
  email,
  emailError,
  loginHref,
  onCodeChange,
  onEmailChange,
  onRequestCode,
  onResendCode,
  onSocialLogin,
  onVerifyCode,
  phase,
  timerSeconds,
}: SignupEmailStepProps) {
  const emailErrorId = useId();
  const codeErrorId = useId();
  const [showFormatError, setShowFormatError] = useState(false);
  const isCodePhase = phase === 'code';

  const emailErrorMessage = showFormatError
    ? signupEmailErrorMessages.format
    : emailError === 'registered'
      ? signupEmailErrorMessages.registered
      : undefined;
  const socialErrorMessage = emailError === 'social' ? signupEmailErrorMessages.social : undefined;
  const codeErrorMessage = codeError ? signupCodeErrorMessages[codeError] : undefined;
  const isNextDisabled = isCodePhase ? !isCodeComplete(code) : email.trim() === '';

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isNextDisabled) {
      return;
    }

    if (isCodePhase) {
      onVerifyCode();
      return;
    }

    if (!isValidEmail(email)) {
      setShowFormatError(true);
      return;
    }

    onRequestCode();
  }

  return (
    <>
      <ModalTitle>이메일로 회원가입</ModalTitle>

      <p className="text-center text-caption-c1 [color:var(--td-color-text-tertiary)]">
        입력해주신 이메일로 인증코드를 보내드려요.
      </p>

      {/* form은 레이아웃에 영향을 주지 않고, Enter 키 제출만 담당합니다. */}
      <form className="contents" noValidate onSubmit={handleSubmit}>
        <TextInput
          aria-describedby={emailErrorMessage ? emailErrorId : undefined}
          aria-invalid={emailErrorMessage !== undefined}
          aria-label="이메일"
          autoComplete="email"
          className="w-full"
          disabled={isCodePhase}
          inputMode="email"
          onValueChange={(value) => {
            setShowFormatError(false);
            onEmailChange(value);
          }}
          placeholder="이메일을 입력해주세요"
          type="email"
          value={email}
        />

        {emailErrorMessage ? <FieldError id={emailErrorId}>{emailErrorMessage}</FieldError> : null}

        {isCodePhase ? (
          <>
            <CodeInput
              aria-describedby={codeErrorMessage ? codeErrorId : undefined}
              aria-invalid={codeErrorMessage !== undefined}
              aria-label="인증코드"
              autoFocus
              className="w-full"
              onValueChange={onCodeChange}
              timerSeconds={timerSeconds}
              value={code}
            />

            {codeErrorMessage ? <FieldError id={codeErrorId}>{codeErrorMessage}</FieldError> : null}

            <p className="flex items-baseline justify-center gap-8">
              <span className="text-caption-c1 [color:var(--td-color-text-tertiary)]">
                인증코드를 못 받으셨나요?
              </span>
              <button
                className="inline-flex cursor-pointer items-start bg-transparent p-0 text-body-b2 whitespace-nowrap [color:var(--td-color-text-primary)] outline-none focus-visible:ring-2 focus-visible:ring-border-active focus-visible:ring-offset-2"
                onClick={onResendCode}
                type="button"
              >
                재전송
              </button>
            </p>
          </>
        ) : null}

        <Button className="w-full" disabled={isNextDisabled} type="submit">
          다음
        </Button>
      </form>

      <Divider className="w-full" type="label" />

      <div className="flex justify-center gap-20">
        <SocialLoginButton onClick={() => onSocialLogin?.('google')} provider="google" />
        <SocialLoginButton onClick={() => onSocialLogin?.('kakao')} provider="kakao" />
      </div>

      {socialErrorMessage ? (
        <FieldError className="text-center">{socialErrorMessage}</FieldError>
      ) : null}

      <SignupLoginLink href={loginHref} />
    </>
  );
}
