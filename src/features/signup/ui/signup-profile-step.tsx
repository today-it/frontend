'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useId, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';

import { AvatarUploader, Button, ModalTitle, PasswordInput, TextInput } from '@/shared/ui';

import { signupRequestErrorMessage } from '../model/signup-api';
import {
  getNicknameFeedback,
  SIGNUP_PASSWORD_MAX_LENGTH,
  type SignupNicknameStatus,
  signupPasswordMessages,
  type SignupPasswordServerError,
  signupProfileSchema,
  type SignupProfileValues,
  signupSocialProfileSchema,
} from '../model/signup-profile';
import { useNicknameCheckRequest } from '../model/use-nickname-check-request';
import { SignupFieldMessage, SignupFieldMessageSlot } from './signup-field-message';

export interface SignupProfileStepProps {
  /** 프로필 이미지 수집·이용에 동의하지 않았을 때 이미지 선택을 막습니다. */
  isAvatarDisabled?: boolean;
  /** 프로필 이미지를 선택하면 호출되는 함수. 선택한 이미지 파일을 받습니다. */
  onAvatarChange?: (file: File) => void;
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
  /** 비밀번호를 입력받을지 여부. 소셜 가입은 비밀번호가 없으므로 끕니다. */
  hasPassword?: boolean;
  /** 요청 실패 문구 대신 표시할 가입 오류 문구 */
  submitErrorMessage?: string;
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
  hasPassword = true,
  isAvatarDisabled = false,
  isSubmitting = false,
  nicknameStatus,
  onAvatarChange,
  onCheckNickname,
  onNicknameChange,
  onPasswordChange,
  onSubmit,
  passwordError,
  requestError = false,
  submitErrorMessage,
}: SignupProfileStepProps) {
  const nicknameMessageId = useId();
  const passwordMessageId = useId();
  const [avatarSrc, setAvatarSrc] = useState<string>();
  const {
    control,
    formState: { errors, isSubmitted },
    handleSubmit,
    trigger,
  } = useForm<SignupProfileValues>({
    resolver: zodResolver(hasPassword ? signupProfileSchema : signupSocialProfileSchema),
    mode: 'onChange',
    defaultValues: { nickname: defaultNickname, password: defaultPassword },
  });
  const nickname = useWatch({ control, name: 'nickname' });
  const password = useWatch({ control, name: 'password' });

  useNicknameCheckRequest(nickname, onCheckNickname);

  // 선택한 이미지의 미리보기 주소는 교체하거나 화면을 벗어날 때 해제합니다.
  useEffect(
    () => () => {
      if (avatarSrc) {
        URL.revokeObjectURL(avatarSrc);
      }
    },
    [avatarSrc],
  );

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
  const isSubmitDisabled = !isNicknameAvailable || (hasPassword && password === '');
  const errorMessage = submitErrorMessage ?? (requestError ? signupRequestErrorMessage : undefined);

  return (
    <>
      <ModalTitle>프로필을 설정해주세요</ModalTitle>

      <div className="flex justify-center">
        <AvatarUploader
          alt={avatarSrc ? '선택한 프로필 이미지' : undefined}
          disabled={isAvatarDisabled}
          onFileSelect={(file) => {
            if (isAvatarDisabled || !file.type.startsWith('image/')) {
              return;
            }

            setAvatarSrc(URL.createObjectURL(file));
            onAvatarChange?.(file);
          }}
          src={avatarSrc}
        />
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
          <SignupFieldMessageSlot>
            {nicknameMessage ? (
              <SignupFieldMessage
                id={nicknameMessageId}
                tone={isNicknameInvalid ? 'error' : 'success'}
              >
                {nicknameMessage}
              </SignupFieldMessage>
            ) : null}
          </SignupFieldMessageSlot>
        </div>

        {hasPassword ? (
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
            <SignupFieldMessageSlot>
              {passwordMessage ? (
                <SignupFieldMessage id={passwordMessageId}>{passwordMessage}</SignupFieldMessage>
              ) : null}
            </SignupFieldMessageSlot>
          </div>
        ) : null}

        {errorMessage ? (
          <SignupFieldMessage className="text-center">{errorMessage}</SignupFieldMessage>
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
