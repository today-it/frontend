import { Button as ButtonPrimitive } from '@base-ui/react/button';

import { cn } from '@/shared/lib';
import { Icon, type IconName } from '@/shared/ui/icon';

export interface IconButtonProps extends ButtonPrimitive.Props {
  /** 버튼에 표시할 아이콘 */
  icon: IconName;
  /** 버튼의 접근성 이름 */
  label: string;
  /** IconButton에 추가할 클래스 이름 */
  className?: string;
  children?: never;
}

/**
 * 공용 IconButton 컴포넌트입니다.
 *
 * @example
 * ```tsx
 * <IconButton icon="close" label="닫기" />
 * <IconButton icon="add" label="추가" />
 * ```
 */
export function IconButton({ className, icon, label, ...props }: IconButtonProps) {
  return (
    <ButtonPrimitive
      aria-label={label}
      className={cn(
        'inline-flex size-icon-button shrink-0 cursor-pointer items-center justify-center rounded-lg bg-surface-default p-0 text-icon-default transition-colors outline-none select-none focus-visible:ring-2 focus-visible:ring-border-active focus-visible:ring-offset-2 enabled:hover:bg-bg-hover enabled:active:bg-bg-pressed disabled:pointer-events-none disabled:cursor-default',
        className,
      )}
      data-slot="icon-button"
      {...props}
    >
      <Icon name={icon} size={24} tone="inherit" />
    </ButtonPrimitive>
  );
}
