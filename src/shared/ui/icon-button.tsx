import { Button as ButtonPrimitive } from '@base-ui/react/button';

import { cn } from '@/shared/lib';
import { Icon, type IconName } from '@/shared/ui/icon';

export interface IconButtonProps extends ButtonPrimitive.Props {
  /** 버튼에 표시할 아이콘 */
  icon: IconName;
  /** 버튼의 접근성 이름 */
  label: string;
  /** 버튼의 모양 (기본값: `default`, `round`는 48px 원형) */
  variant?: 'default' | 'round';
  /** 추가 클래스 이름 */
  className?: string;
  children?: never;
}

/**
 * 아이콘만 표시하는 공용 IconButton 컴포넌트입니다.
 *
 * @example
 * ```tsx
 * <IconButton icon="close" label="닫기" />
 * ```
 */
export function IconButton({
  className,
  icon,
  label,
  variant = 'default',
  ...props
}: IconButtonProps) {
  return (
    <ButtonPrimitive
      aria-label={label}
      className={cn(
        'inline-flex shrink-0 cursor-pointer items-center justify-center p-0 text-icon-default transition-colors outline-none select-none focus-visible:ring-2 focus-visible:ring-border-active focus-visible:ring-offset-2 enabled:hover:bg-state-hover enabled:active:bg-state-pressed disabled:pointer-events-none disabled:cursor-default',
        variant === 'round'
          ? 'size-48 rounded-full border border-border-default bg-surface-default'
          : 'size-icon-button rounded-lg bg-surface-default',
        className,
      )}
      data-slot="icon-button"
      data-variant={variant}
      {...props}
    >
      <Icon name={icon} size={24} tone="inherit" />
    </ButtonPrimitive>
  );
}
