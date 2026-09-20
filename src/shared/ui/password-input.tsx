'use client';

import { Input as InputPrimitive } from '@base-ui/react/input';
import { Toggle as TogglePrimitive } from '@base-ui/react/toggle';
import { useState } from 'react';

import { cn } from '@/shared/lib';
import { Icon } from '@/shared/ui/icon';

export interface PasswordInputProps extends Omit<InputPrimitive.Props, 'type'> {
  /** 비밀번호 표시 여부의 초기값. 기본값은 `false`입니다. */
  defaultVisible?: boolean;
  /** 비밀번호 표시 여부 */
  visible?: boolean;
  /** 비밀번호 표시 여부가 변경될 때 호출되는 함수 */
  onVisibleChange?: (visible: boolean) => void;
  /** PasswordInput에 추가할 클래스 이름 */
  className?: string;
}

/**
 * 비밀번호 입력 컴포넌트입니다.
 *
 * @example
 * ```tsx
 * <PasswordInput placeholder="비밀번호를 입력해주세요" />
 * <PasswordInput aria-invalid defaultValue="password" />
 * <PasswordInput disabled placeholder="비밀번호를 입력해주세요" />
 * ```
 */
export function PasswordInput({
  'aria-invalid': ariaInvalid,
  className,
  defaultVisible = false,
  disabled,
  onVisibleChange,
  visible,
  ...props
}: PasswordInputProps) {
  const [uncontrolledVisible, setUncontrolledVisible] = useState(defaultVisible);
  const isVisible = visible ?? uncontrolledVisible;
  const isInvalid = ariaInvalid !== undefined && ariaInvalid !== false && ariaInvalid !== 'false';

  const handleVisibleChange = (nextVisible: boolean) => {
    if (visible === undefined) {
      setUncontrolledVisible(nextVisible);
    }

    onVisibleChange?.(nextVisible);
  };

  return (
    <div
      className={cn(
        'flex h-input w-form-width max-w-full items-center gap-4 rounded-full border-(length:--td-border-width-sm) bg-surface-default px-12 transition-colors',
        isInvalid
          ? 'border-system-error focus-within:border-system-error'
          : 'border-border-default focus-within:border-border-active',
        disabled &&
          'cursor-not-allowed border-border-default bg-surface-disabled focus-within:border-border-default',
        className,
      )}
      data-disabled={disabled ? '' : undefined}
      data-invalid={isInvalid ? '' : undefined}
      data-slot="password-input"
      data-visible={isVisible ? '' : undefined}
    >
      <InputPrimitive
        aria-invalid={ariaInvalid}
        className="min-w-0 flex-1 bg-transparent text-caption-c1 [color:var(--td-color-text-primary)] outline-none placeholder:[color:var(--td-color-text-muted)] disabled:cursor-not-allowed disabled:[color:var(--td-color-text-muted)] disabled:opacity-100"
        data-slot="password-input-control"
        disabled={disabled}
        type={isVisible ? 'text' : 'password'}
        {...props}
      />
      <TogglePrimitive
        aria-label={isVisible ? '비밀번호 숨기기' : '비밀번호 보기'}
        className="inline-flex size-12 shrink-0 cursor-pointer items-center justify-center p-0 text-icon-default outline-none focus-visible:ring-2 focus-visible:ring-border-active focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-default"
        data-slot="password-input-toggle"
        disabled={disabled}
        onPressedChange={handleVisibleChange}
        pressed={isVisible}
      >
        <Icon name={isVisible ? 'visibility' : 'visibility-off'} size={24} tone="inherit" />
      </TogglePrimitive>
    </div>
  );
}
