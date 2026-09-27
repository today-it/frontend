import { Button as ButtonPrimitive } from '@base-ui/react/button';
import type { VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/lib';

import { type ButtonSize, buttonVariants } from './button-variants';

export interface ButtonProps
  extends
    Omit<ButtonPrimitive.Props, 'render' | 'nativeButton'>,
    VariantProps<typeof buttonVariants> {
  /** 버튼의 크기. 기본값은 `lg`입니다. */
  size?: ButtonSize;
}

/**
 * 공용 Button 컴포넌트입니다.
 *
 * 버튼 동작에 사용합니다. 화면 이동에는 링크를 사용하고, 버튼 모양의 이동 링크는 `ButtonLink`를 사용합니다.
 *
 * @example
 * ```tsx
 * <Button>저장</Button>
 * <Button size="md">다음</Button>
 * <Button size="sm" disabled>삭제</Button>
 * ```
 */
export function Button({ className, size = 'lg', ...props }: ButtonProps) {
  return (
    <ButtonPrimitive
      className={cn(buttonVariants({ size, className }))}
      data-size={size}
      data-slot="button"
      {...props}
    />
  );
}

export { buttonVariants };
