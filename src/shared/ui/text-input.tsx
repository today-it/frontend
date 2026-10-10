import { Input as InputPrimitive } from '@base-ui/react/input';

import { cn } from '@/shared/lib';

export interface TextInputProps extends InputPrimitive.Props {
  /** 검증에 성공했는지 여부 */
  success?: boolean;
  /** 텍스트 입력창에 추가할 클래스 이름 */
  className?: string;
}

/**
 * 공용 TextInput 컴포넌트입니다.
 *
 * @example
 * ```tsx
 * <TextInput placeholder="이메일을 입력해주세요" />
 * <TextInput aria-invalid placeholder="이메일을 입력해주세요" />
 * <TextInput disabled placeholder="이메일을 입력해주세요" />
 * <TextInput success defaultValue="user@example.com" />
 * ```
 */
export function TextInput({ className, success = false, ...props }: TextInputProps) {
  return (
    <InputPrimitive
      className={cn(
        'h-input w-form-width max-w-full rounded-full border-(length:--td-border-width-sm) border-border-default bg-surface-default px-24 text-body-b2 [color:var(--td-color-text-primary)] transition-colors outline-none placeholder:[color:var(--td-color-text-muted)] focus:border-border-focus disabled:cursor-not-allowed disabled:border-border-default disabled:bg-state-disabled disabled:[color:var(--td-color-text-muted)] disabled:opacity-100 aria-invalid:border-border-error aria-invalid:focus:border-border-error disabled:aria-invalid:border-border-default data-focused:border-border-focus disabled:data-focused:border-border-default data-invalid:border-border-error disabled:data-invalid:border-border-default',
        success &&
          'enabled:not-aria-invalid:not-data-invalid:border-border-success enabled:not-aria-invalid:not-data-invalid:focus:border-border-success enabled:not-aria-invalid:not-data-invalid:data-focused:border-border-success',
        className,
      )}
      data-slot="text-input"
      {...props}
    />
  );
}
