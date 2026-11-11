import { Button as ButtonPrimitive } from '@base-ui/react/button';
import type { VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/lib';

import { type ButtonSize, buttonVariants } from './button-variants';
import { Icon, type IconName } from './icon';

export interface ButtonProps
  extends
    Omit<ButtonPrimitive.Props, 'render' | 'nativeButton'>,
    VariantProps<typeof buttonVariants> {
  /** 버튼 크기 (기본값: `lg`) */
  size?: ButtonSize;
  /** 버튼 스타일 유형 (기본값: `primary`, 주요 CTA는 `cta`) */
  variant?: 'primary' | 'cta';
  /** 텍스트 앞에 표시할 아이콘 */
  icon?: IconName;
}

/**
 * 클릭 동작을 처리하는 공용 Button 컴포넌트입니다. 화면 이동에는 Link 또는 ButtonLink를 사용합니다.
 *
 * @example
 * ```tsx
 * <Button>저장</Button>
 * ```
 */
export function Button({
  children,
  className,
  icon,
  size = 'lg',
  variant = 'primary',
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      className={cn('group/button', buttonVariants({ size, variant, className }))}
      data-variant={variant}
      data-size={size}
      data-slot="button"
      {...props}
    >
      {icon && (
        <Icon
          name={icon}
          size={size === 'sm' ? 16 : 20}
          tone="inherit"
          className={cn('text-icon-inverse', 'group-disabled/button:text-text-muted')}
        />
      )}
      {children}
    </ButtonPrimitive>
  );
}

export { buttonVariants };
