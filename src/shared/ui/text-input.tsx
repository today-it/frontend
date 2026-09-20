import { Input as InputPrimitive } from '@base-ui/react/input';

import { cn } from '@/shared/lib';

export interface TextInputProps extends InputPrimitive.Props {
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
 * ```
 */
export function TextInput({ className, ...props }: TextInputProps) {
  return (
    <InputPrimitive
      className={cn(
        'h-input w-form-width max-w-full rounded-full border-(length:--td-border-width-sm) border-border-default bg-surface-default px-12 text-caption-c1 [color:var(--td-color-text-primary)] transition-colors outline-none placeholder:[color:var(--td-color-text-muted)] focus:border-border-active disabled:cursor-not-allowed disabled:border-border-default disabled:bg-surface-disabled disabled:[color:var(--td-color-text-muted)] disabled:opacity-100 aria-invalid:border-system-error aria-invalid:focus:border-system-error disabled:aria-invalid:border-border-default data-focused:border-border-active disabled:data-focused:border-border-default data-invalid:border-system-error disabled:data-invalid:border-border-default',
        className,
      )}
      data-slot="text-input"
      {...props}
    />
  );
}
