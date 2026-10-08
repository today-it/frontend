'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitEvent, useId, useRef } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';

import {
  loginErrorMessages,
  loginSchema,
  type LoginServerError,
  type LoginValues,
} from '@/app/_model/login';
import {
  Button,
  Divider,
  ModalTitle,
  PasswordInput,
  SocialLoginButton,
  TextInput,
} from '@/shared/ui';

export interface LoginStepProps {
  /** 소셜 로그인 버튼을 눌렀을 때 호출합니다. */
  onSocialLogin?: (provider: 'google' | 'kakao') => void;
  /** 회원가입으로 전환할 때 호출합니다. */
  onSignup: () => void;
  /** 비밀번호 재설정으로 전환할 때 호출합니다. */
  onPasswordReset: () => void;
  /** 검증을 통과한 입력값으로 로그인을 요청합니다. */
  onSubmit: (values: LoginValues) => void | Promise<void>;
  /** 외부 로그인 결과로 받은 오류 */
  loginError?: LoginServerError;
  /** 외부에서 전달한 로그인 실패 횟수 */
  failureCount?: number;
  /** 실패 횟수 표시의 분모. 제출 제한 정책을 적용하지 않습니다. */
  failureCountTotal?: number;
}

/**
 * 로그인 모달의 입력 화면입니다. `Modal` 안에서 사용합니다.
 *
 * 빈 입력은 제출을 막고, 이메일 형식을 검증한 뒤 `onSubmit`을 호출합니다.
 * 로그인 불일치 오류와 실패 횟수는 외부에서 전달받아 표시합니다.
 * 모달 열기·닫기와 성공 후 처리는 부모 컴포넌트에서 담당합니다.
 *
 * @example
 * ```tsx
 * <Modal open={open} onOpenChange={setOpen}>
 *   <LoginStep
 *     onPasswordReset={handlePasswordReset}
 *     onSignup={handleSignup}
 *     onSubmit={handleLogin}
 *   />
 * </Modal>
 * ```
 */
export function LoginStep({
  failureCount,
  failureCountTotal,
  loginError,
  onPasswordReset,
  onSignup,
  onSocialLogin,
  onSubmit,
}: LoginStepProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [email, password] = useWatch({
    control,
    name: ['email', 'password'],
  });

  const isSubmitDisabled = isSubmitting || email.trim() === '' || password === '';

  const emailErrorId = useId();
  const loginErrorId = useId();
  const loginErrorMessage = loginError ? loginErrorMessages[loginError] : undefined;

  const failureCountText =
    failureCount !== undefined && failureCountTotal !== undefined
      ? ` (${failureCount}/${failureCountTotal})`
      : '';

  const submitLockRef = useRef(false);

  async function handleFormSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitDisabled || submitLockRef.current) {
      return;
    }

    submitLockRef.current = true;

    try {
      await handleSubmit(onSubmit)(event);
    } finally {
      submitLockRef.current = false;
    }
  }

  return (
    <>
      <ModalTitle className="sr-only">로그인</ModalTitle>
      <p className="text-center text-caption-c1 [color:var(--td-color-text-muted)]">
        오늘을 특별하게 만드는 우리다운 선택, Today It
      </p>

      {/* form은 Modal의 세로 배치를 유지하면서 Enter 키와 버튼 제출을 처리합니다. */}
      <form className="contents" noValidate onSubmit={handleFormSubmit}>
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <TextInput
              aria-label="이메일"
              autoComplete="email"
              className="w-full"
              inputMode="email"
              name={field.name}
              onBlur={field.onBlur}
              onValueChange={field.onChange}
              placeholder="이메일을 입력해주세요"
              ref={field.ref}
              type="email"
              value={field.value}
              aria-describedby={
                errors.email ? emailErrorId : loginErrorMessage ? loginErrorId : undefined
              }
              aria-invalid={Boolean(errors.email || loginErrorMessage)}
            />
          )}
        />
        {errors.email ? (
          <p
            className="text-caption-c1 [color:var(--td-color-text-error)]"
            id={emailErrorId}
            role="alert"
          >
            {errors.email.message}
          </p>
        ) : null}

        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <PasswordInput
              aria-label="비밀번호"
              autoComplete="current-password"
              className="w-full"
              name={field.name}
              onBlur={field.onBlur}
              onValueChange={field.onChange}
              placeholder="비밀번호를 입력해주세요"
              ref={field.ref}
              value={field.value}
              aria-describedby={loginErrorMessage ? loginErrorId : undefined}
              aria-invalid={Boolean(loginErrorMessage)}
            />
          )}
        />
        {loginErrorMessage ? (
          <p
            className="text-caption-c1 [color:var(--td-color-text-error)]"
            id={loginErrorId}
            role="alert"
          >
            {loginErrorMessage}
            {failureCountText}
          </p>
        ) : null}

        <div className="flex justify-end">
          <button
            className="inline-flex cursor-pointer items-start bg-transparent p-0 text-body-b2 whitespace-nowrap [color:var(--td-color-text-primary)] outline-none focus-visible:ring-2 focus-visible:ring-border-active focus-visible:ring-offset-2"
            onClick={onPasswordReset}
            type="button"
          >
            비밀번호를 잊으셨나요?
          </button>
        </div>

        <Button
          aria-busy={isSubmitting}
          className="w-full"
          disabled={isSubmitDisabled}
          type="submit"
        >
          로그인
        </Button>
      </form>

      <Divider />

      <div className="flex justify-center gap-24">
        <SocialLoginButton
          onClick={() => onSocialLogin?.('google')}
          provider="google"
          type="button"
        />
        <SocialLoginButton
          onClick={() => onSocialLogin?.('kakao')}
          provider="kakao"
          type="button"
        />
      </div>

      <p className="flex flex-wrap items-baseline justify-center gap-8">
        <span className="text-caption-c1 [color:var(--td-color-text-muted)]">
          계정이 없으신가요?
        </span>
        <button
          className="inline-flex cursor-pointer items-start bg-transparent p-0 text-body-b2 whitespace-nowrap [color:var(--td-color-text-primary)] outline-none focus-visible:ring-2 focus-visible:ring-border-active focus-visible:ring-offset-2"
          onClick={onSignup}
          type="button"
        >
          회원가입
        </button>
      </p>
    </>
  );
}
