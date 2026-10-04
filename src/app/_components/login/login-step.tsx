'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useId } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';

import { loginSchema, type LoginValues } from '@/app/_model/login';
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
}

export function LoginStep({ onPasswordReset, onSignup, onSocialLogin, onSubmit }: LoginStepProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
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

  const isSubmitDisabled = email.trim() === '' || password === '';

  const emailErrorId = useId();
  const passwordErrorId = useId();

  return (
    <>
      <ModalTitle className="sr-only">로그인</ModalTitle>
      <p className="text-center text-caption-c1 [color:var(--td-color-text-muted)]">
        오늘을 특별하게 만드는 우리다운 선택, Today It
      </p>

      <form className="contents" noValidate onSubmit={handleSubmit(onSubmit)}>
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
              aria-describedby={errors.email ? emailErrorId : undefined}
              aria-invalid={Boolean(errors.email)}
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
              aria-describedby={errors.password ? passwordErrorId : undefined}
              aria-invalid={Boolean(errors.password)}
            />
          )}
        />
        {errors.password ? (
          <p
            className="text-caption-c1 [color:var(--td-color-text-error)]"
            id={passwordErrorId}
            role="alert"
          >
            {errors.password.message}
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

        <Button className="w-full" disabled={isSubmitDisabled} type="submit">
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
