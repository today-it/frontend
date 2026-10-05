'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useId } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';

import { signupRequestErrorMessage } from '@/features/signup/model/signup-api';
import {
  isCodeComplete,
  type SignupCodeError,
  signupCodeErrorMessages,
  signupEmailErrorMessages,
  type SignupEmailPhase,
  signupEmailSchema,
  type SignupEmailServerError,
  type SignupEmailValues,
} from '@/features/signup/model/signup-email';
import { Button, CodeInput, Divider, ModalTitle, SocialLoginButton, TextInput } from '@/shared/ui';

import { SignupFieldMessage } from './signup-field-message';
import { SignupLoginLink } from './signup-login-link';

export type { SignupEmailPhase };
type SignupSocialProvider = 'google' | 'kakao';

export interface SignupEmailStepProps {
  /** 이메일 입력 단계인지, 인증코드 입력 단계인지 나타냅니다. */
  phase: SignupEmailPhase;
  /** 이메일의 초기값 */
  defaultEmail?: string;
  /** 인증코드의 초기값 */
  defaultCode?: string;
  /** 이메일이 바뀔 때 호출되는 함수. 이전 서버 오류를 비우는 데 사용합니다. */
  onEmailChange?: (email: string) => void;
  /** 인증코드가 바뀔 때 호출되는 함수. 이전 서버 오류를 비우는 데 사용합니다. */
  onCodeChange?: (code: string) => void;
  /** 인증코드의 남은 시간(초) */
  timerSeconds?: number;
  /** 서버 응답으로 받은 이메일 오류 */
  emailError?: SignupEmailServerError;
  /** 서버 응답으로 받은 인증코드 오류 */
  codeError?: SignupCodeError;
  /** 올바른 이메일로 다음 버튼을 눌렀을 때 호출되는 함수. 앞뒤 공백을 제거한 이메일을 받습니다. */
  onRequestCode: (email: string) => void;
  /** 인증코드 6자리를 입력하고 다음 버튼을 눌렀을 때 호출되는 함수 */
  onVerifyCode: (code: string) => void;
  /** 인증코드 재전송을 눌렀을 때 호출되는 함수. 입력한 인증코드는 비워집니다. */
  onResendCode: () => void;
  /** 소셜 로그인 버튼을 눌렀을 때 호출되는 함수 */
  onSocialLogin?: (provider: SignupSocialProvider) => void;
  /** 서버 요청이 진행 중인지 나타냅니다. 진행 중에는 다음 버튼과 재전송이 비활성화됩니다. */
  isSubmitting?: boolean;
  /** 서버 요청이 실패했는지 나타냅니다. 같은 버튼을 다시 눌러 재시도합니다. */
  requestError?: boolean;
  /** 이미 계정이 있는 사용자가 이동할 로그인 경로 */
  loginHref: string;
}

/**
 * 회원가입 모달의 이메일 인증 단계입니다. 이메일을 입력하는 `email` 단계와, 이메일이 잠긴 채
 * 인증코드를 입력하는 `code` 단계를 한 화면에서 보여줍니다.
 */
export function SignupEmailStep({
  codeError,
  defaultCode = '',
  defaultEmail = '',
  emailError,
  isSubmitting = false,
  loginHref,
  onCodeChange,
  onEmailChange,
  onRequestCode,
  onResendCode,
  onSocialLogin,
  onVerifyCode,
  phase,
  requestError = false,
  timerSeconds,
}: SignupEmailStepProps) {
  const emailErrorId = useId();
  const codeErrorId = useId();
  const {
    control,
    formState: { errors, isSubmitted },
    handleSubmit,
    setValue,
  } = useForm<SignupEmailValues>({
    resolver: zodResolver(signupEmailSchema),
    defaultValues: { email: defaultEmail, code: defaultCode },
  });
  const email = useWatch({ control, name: 'email' });
  const code = useWatch({ control, name: 'code' });
  const isCodePhase = phase === 'code';

  const emailErrorMessage =
    (isSubmitted ? errors.email?.message : undefined) ??
    (emailError === 'registered' ? signupEmailErrorMessages.registered : undefined);
  const socialErrorMessage = emailError === 'social' ? signupEmailErrorMessages.social : undefined;
  const codeErrorMessage = codeError ? signupCodeErrorMessages[codeError] : undefined;
  const isNextDisabled = isCodePhase ? !isCodeComplete(code) : email.trim() === '';

  return (
    <>
      <ModalTitle>이메일로 회원가입</ModalTitle>

      <p className="text-center text-caption-c1 [color:var(--td-color-text-tertiary)]">
        입력해주신 이메일로 인증코드를 보내드려요.
      </p>

      {/* contents: form이 레이아웃에 영향을 주지 않게 합니다. */}
      <form
        className="contents"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();

          if (isNextDisabled || isSubmitting) {
            return;
          }

          void handleSubmit((values) =>
            isCodePhase ? onVerifyCode(values.code) : onRequestCode(values.email),
          )(event);
        }}
      >
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <TextInput
              aria-describedby={emailErrorMessage ? emailErrorId : undefined}
              aria-invalid={emailErrorMessage !== undefined}
              aria-label="이메일"
              autoComplete="email"
              className="w-full"
              disabled={isCodePhase}
              inputMode="email"
              name={field.name}
              onBlur={field.onBlur}
              onValueChange={(value) => {
                field.onChange(value);
                onEmailChange?.(value);
              }}
              placeholder="이메일을 입력해주세요"
              ref={field.ref}
              type="email"
              value={field.value}
            />
          )}
        />

        {emailErrorMessage ? (
          <SignupFieldMessage id={emailErrorId}>{emailErrorMessage}</SignupFieldMessage>
        ) : null}

        {isCodePhase ? (
          <>
            <Controller
              control={control}
              name="code"
              render={({ field }) => (
                <CodeInput
                  aria-describedby={codeErrorMessage ? codeErrorId : undefined}
                  aria-invalid={codeErrorMessage !== undefined}
                  aria-label="인증코드"
                  autoFocus
                  className="w-full"
                  name={field.name}
                  onBlur={field.onBlur}
                  onValueChange={(value) => {
                    field.onChange(value);
                    onCodeChange?.(value);
                  }}
                  ref={field.ref}
                  timerSeconds={timerSeconds}
                  value={field.value}
                />
              )}
            />

            {codeErrorMessage ? (
              <SignupFieldMessage id={codeErrorId}>{codeErrorMessage}</SignupFieldMessage>
            ) : null}

            <p className="flex items-baseline justify-center gap-8">
              <span className="text-caption-c1 [color:var(--td-color-text-tertiary)]">
                인증코드를 못 받으셨나요?
              </span>
              <button
                className="inline-flex cursor-pointer items-start bg-transparent p-0 text-body-b2 whitespace-nowrap [color:var(--td-color-text-primary)] outline-none focus-visible:ring-2 focus-visible:ring-border-active focus-visible:ring-offset-2 disabled:cursor-default disabled:[color:var(--td-color-text-disabled)]"
                disabled={isSubmitting}
                onClick={() => {
                  setValue('code', '');
                  onResendCode();
                }}
                type="button"
              >
                재전송
              </button>
            </p>
          </>
        ) : null}

        {requestError ? (
          <SignupFieldMessage className="text-center">
            {signupRequestErrorMessage}
          </SignupFieldMessage>
        ) : null}

        <Button
          aria-busy={isSubmitting}
          className="w-full"
          disabled={isNextDisabled || isSubmitting}
          type="submit"
        >
          다음
        </Button>
      </form>

      <Divider className="w-full" />

      <div className="flex justify-center gap-20">
        <SocialLoginButton onClick={() => onSocialLogin?.('google')} provider="google" />
        <SocialLoginButton onClick={() => onSocialLogin?.('kakao')} provider="kakao" />
      </div>

      {socialErrorMessage ? (
        <SignupFieldMessage className="text-center">{socialErrorMessage}</SignupFieldMessage>
      ) : null}

      <SignupLoginLink href={loginHref} />
    </>
  );
}
