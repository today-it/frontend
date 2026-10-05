'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useId } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';

import { signupRequestErrorMessage } from '@/features/signup/model/signup-api';
import {
  getNicknameFeedback,
  SIGNUP_PASSWORD_MAX_LENGTH,
  type SignupNicknameStatus,
  signupPasswordMessages,
  type SignupPasswordServerError,
  signupProfileSchema,
  type SignupProfileValues,
} from '@/features/signup/model/signup-profile';
import { useNicknameCheckRequest } from '@/features/signup/model/use-nickname-check-request';
import { Avatar, Button, ModalTitle, PasswordInput, TextInput } from '@/shared/ui';

import { SignupFieldMessage } from './signup-field-message';

export interface SignupProfileStepProps {
  /** 닉네임의 초기값 */
  defaultNickname?: string;
  /** 비밀번호의 초기값 */
  defaultPassword?: string;
  /** 닉네임이 바뀔 때 호출되는 함수. 이전 검사 결과를 비우는 데 사용합니다. */
  onNicknameChange?: (nickname: string) => void;
  /** 입력이 멈춘 뒤 닉네임이 클라이언트 검증을 통과하면 호출되는 함수. 중복·금칙어 검사를 요청합니다. */
  onCheckNickname?: (nickname: string) => void;
  /** 서버의 닉네임 검사 상태. 요청 중이면 `checking`, 검사가 끝나면 결과입니다. */
  nicknameStatus?: SignupNicknameStatus;
  /** 비밀번호가 바뀔 때 호출되는 함수. 이전 서버 오류를 비우는 데 사용합니다. */
  onPasswordChange?: (password: string) => void;
  /** 서버 응답으로 받은 비밀번호 오류 */
  passwordError?: SignupPasswordServerError;
  /** 서버 요청이 진행 중인지 나타냅니다. 진행 중에는 회원가입 버튼이 비활성화됩니다. */
  isSubmitting?: boolean;
  /** 서버 요청이 실패했는지 나타냅니다. 닉네임을 다시 입력하거나 회원가입을 다시 눌러 재시도합니다. */
  requestError?: boolean;
  /** 닉네임이 사용 가능하고 입력이 검증을 통과했을 때 회원가입을 누르면 호출되는 함수 */
  onSubmit: (profile: SignupProfileValues) => void;
}

/**
 * 회원가입 모달의 프로필 설정 단계입니다. 닉네임은 입력할 때마다 검증하고, 통과하면 입력이 멈춘 뒤
 * `onCheckNickname`을 호출합니다. 비밀번호 길이 오류는 회원가입을 누른 뒤부터 표시합니다.
 */
export function SignupProfileStep({
  defaultNickname = '',
  defaultPassword = '',
  isSubmitting = false,
  nicknameStatus,
  onCheckNickname,
  onNicknameChange,
  onPasswordChange,
  onSubmit,
  passwordError,
  requestError = false,
}: SignupProfileStepProps) {
  const nicknameMessageId = useId();
  const passwordMessageId = useId();
  const {
    control,
    formState: { errors, isSubmitted },
    handleSubmit,
    trigger,
  } = useForm<SignupProfileValues>({
    resolver: zodResolver(signupProfileSchema),
    mode: 'onChange',
    defaultValues: { nickname: defaultNickname, password: defaultPassword },
  });
  const nickname = useWatch({ control, name: 'nickname' });
  const password = useWatch({ control, name: 'password' });

  useNicknameCheckRequest(nickname, onCheckNickname);

  // 초기값이 있으면 입력 전에도 닉네임 오류를 표시합니다.
  useEffect(() => {
    if (defaultNickname !== '') {
      void trigger('nickname');
    }
  }, [defaultNickname, trigger]);

  const nicknameClientError = nickname === '' ? undefined : errors.nickname?.message;
  const {
    isAvailable: isNicknameAvailable,
    isInvalid: isNicknameInvalid,
    message: nicknameMessage,
  } = getNicknameFeedback(nicknameClientError, nicknameStatus);

  const passwordMessage =
    (isSubmitted ? errors.password?.message : undefined) ??
    (passwordError !== undefined ? signupPasswordMessages[passwordError] : undefined);
  const isSubmitDisabled = !isNicknameAvailable || password === '';

  return (
    <>
      <ModalTitle>프로필을 설정해주세요</ModalTitle>

      <div className="flex justify-center">
        <Avatar />
      </div>

      <form
        className="contents"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();

          if (!isSubmitDisabled && !isSubmitting) {
            void handleSubmit((values) => onSubmit(values))(event);
          }
        }}
      >
        <div className="flex flex-col gap-12">
          <Controller
            control={control}
            name="nickname"
            render={({ field }) => (
              <TextInput
                aria-busy={nicknameStatus === 'checking'}
                aria-describedby={nicknameMessage ? nicknameMessageId : undefined}
                aria-invalid={isNicknameInvalid}
                aria-label="닉네임"
                autoComplete="nickname"
                className="w-full"
                name={field.name}
                onBlur={field.onBlur}
                onValueChange={(value) => {
                  field.onChange(value);
                  onNicknameChange?.(value);
                }}
                placeholder="닉네임을 입력해주세요 (2~8자)"
                ref={field.ref}
                success={isNicknameAvailable}
                value={field.value}
              />
            )}
          />
          {nicknameMessage ? (
            <SignupFieldMessage
              id={nicknameMessageId}
              tone={isNicknameInvalid ? 'error' : 'success'}
            >
              {nicknameMessage}
            </SignupFieldMessage>
          ) : null}
        </div>

        <div className="flex flex-col gap-12">
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <PasswordInput
                aria-describedby={passwordMessage ? passwordMessageId : undefined}
                aria-invalid={passwordMessage !== undefined}
                aria-label="비밀번호"
                autoComplete="new-password"
                className="w-full"
                maxLength={SIGNUP_PASSWORD_MAX_LENGTH}
                name={field.name}
                onBlur={field.onBlur}
                onValueChange={(value) => {
                  field.onChange(value);
                  onPasswordChange?.(value);
                }}
                placeholder="비밀번호를 입력해주세요"
                ref={field.ref}
                value={field.value}
              />
            )}
          />
          {passwordMessage ? (
            <SignupFieldMessage id={passwordMessageId}>{passwordMessage}</SignupFieldMessage>
          ) : null}
        </div>

        {requestError ? (
          <SignupFieldMessage className="text-center">
            {signupRequestErrorMessage}
          </SignupFieldMessage>
        ) : null}

        <Button
          aria-busy={isSubmitting}
          className="w-full"
          disabled={isSubmitDisabled || isSubmitting}
          type="submit"
        >
          회원가입
        </Button>
      </form>
    </>
  );
}
