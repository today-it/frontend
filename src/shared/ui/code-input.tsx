'use client';

import { Input as InputPrimitive } from '@base-ui/react/input';
import { useState } from 'react';

import { cn } from '@/shared/lib';

/**
 * 인증 코드를 숫자 6자리와 `000 - 000` 형식으로 변환합니다.
 *
 * @param value 변환할 인증 코드
 * @returns 포맷팅된 인증 코드
 */
function formatCode(value = '') {
  const characters = value.replace(/\D/g, '').slice(0, 6);

  if (characters.length <= 3) {
    return characters;
  }

  return `${characters.slice(0, 3)} - ${characters.slice(3)}`;
}

/**
 * 남은 시간을 초 단위에서 `MM:SS` 형식으로 변환합니다.
 *
 * @param seconds 변환할 남은 시간(초)
 * @returns 포맷팅된 남은 시간
 */
function formatTimer(seconds: number) {
  const remainingSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(remainingSeconds / 60);
  const remainder = remainingSeconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
}

export interface CodeInputProps extends Omit<
  InputPrimitive.Props,
  'defaultValue' | 'inputMode' | 'maxLength' | 'type' | 'value'
> {
  /** 초기 인증 코드 */
  defaultValue?: string;
  /** 인증 코드 */
  value?: string;
  /** 남은 인증 시간(초) */
  timerSeconds?: number;
  /** CodeInput에 추가할 클래스 이름 */
  className?: string;
}

/**
 * 인증 코드 입력 컴포넌트입니다.
 *
 * @example
 * ```tsx
 * <CodeInput aria-label="인증 코드" />
 * <CodeInput aria-label="인증 코드" defaultValue="123456" timerSeconds={179} />
 * <CodeInput aria-invalid aria-label="인증 코드" defaultValue="123456" timerSeconds={179} />
 * ```
 */
export function CodeInput({
  'aria-invalid': ariaInvalid,
  autoComplete = 'one-time-code',
  className,
  defaultValue,
  disabled,
  onValueChange,
  placeholder = '000 - 000',
  timerSeconds,
  value,
  ...props
}: CodeInputProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(() => formatCode(defaultValue));
  const formattedValue = value === undefined ? uncontrolledValue : formatCode(value);
  const formattedTimer = timerSeconds === undefined ? undefined : formatTimer(timerSeconds);
  const isFilled = formattedValue.length > 0;
  const isInvalid = ariaInvalid !== undefined && ariaInvalid !== false && ariaInvalid !== 'false';

  return (
    <div
      className={cn(
        'relative flex h-input w-form-width max-w-full items-center rounded-full border-(length:--td-border-width-sm) bg-surface-default px-12 transition-colors',
        isInvalid
          ? 'border-system-error focus-within:border-system-error'
          : isFilled
            ? 'border-border-active'
            : 'border-border-default focus-within:border-border-active',
        disabled &&
          'cursor-not-allowed border-border-default bg-state-disabled focus-within:border-border-default',
        className,
      )}
      data-disabled={disabled ? '' : undefined}
      data-filled={isFilled ? '' : undefined}
      data-invalid={isInvalid ? '' : undefined}
      data-slot="code-input"
    >
      <InputPrimitive
        aria-invalid={ariaInvalid}
        autoComplete={autoComplete}
        className="size-full bg-transparent text-center text-body-b1 [color:var(--td-color-text-primary)] outline-none placeholder:[color:var(--td-color-text-muted)] disabled:cursor-not-allowed disabled:[color:var(--td-color-text-muted)] disabled:opacity-100"
        data-slot="code-input-control"
        disabled={disabled}
        inputMode="numeric"
        maxLength={9}
        onValueChange={(nextValue, eventDetails) => {
          const formattedNextValue = formatCode(nextValue);

          if (value === undefined) {
            setUncontrolledValue(formattedNextValue);
          }

          onValueChange?.(formattedNextValue, eventDetails);
        }}
        placeholder={placeholder}
        type="text"
        value={formattedValue}
        {...props}
      />
      {formattedTimer !== undefined ? (
        <span
          aria-label={`남은 시간 ${formattedTimer}`}
          className="absolute right-12 text-caption-c2 [color:var(--td-color-system-error)]"
          data-slot="code-input-timer"
        >
          {formattedTimer}
        </span>
      ) : null}
    </div>
  );
}
