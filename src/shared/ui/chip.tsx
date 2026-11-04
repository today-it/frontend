import { Toggle as TogglePrimitive } from '@base-ui/react/toggle';
import type { ReactNode } from 'react';

import { cn } from '@/shared/lib';

export interface ChipProps extends TogglePrimitive.Props {
  /** Chip에 표시할 내용 */
  children: ReactNode;
  /** Chip에 추가할 클래스 이름 */
  className?: string;
  /** 시/도처럼 단일 선택하는 항목은 radio 형태를 사용합니다. */
  variant?: 'default' | 'radio';
}

/**
 * 선택 가능한 Chip 컴포넌트입니다.
 *
 * @example
 * ```tsx
 * <Chip>전체</Chip>
 * <Chip defaultPressed>카페</Chip>
 * <Chip disabled>맛집</Chip>
 * ```
 */
export function Chip({ children, className, variant = 'default', ...props }: ChipProps) {
  return (
    <TogglePrimitive
      className={cn(
        'inline-flex h-36 shrink-0 cursor-pointer items-center justify-center rounded-full py-10 text-caption-c1 leading-[normal] whitespace-nowrap transition-colors outline-none select-none focus-visible:ring-2 focus-visible:ring-border-active data-pressed:bg-surface-inverse data-pressed:text-text-inverse data-disabled:pointer-events-none data-disabled:cursor-default data-disabled:border-transparent data-disabled:bg-state-disabled data-disabled:text-text-disabled',
        variant === 'default'
          ? 'border-(length:--td-border-width-sm) border-border-default bg-surface-default px-20 text-text-primary focus-visible:ring-offset-2 enabled:hover:not-data-pressed:border-border-active enabled:hover:not-data-pressed:bg-surface-default enabled:hover:not-data-pressed:text-text-primary data-pressed:border-border-active'
          : 'w-[52px] gap-4 border-0 bg-transparent text-text-muted focus-visible:ring-inset enabled:hover:not-data-pressed:text-text-primary',
        className,
      )}
      data-slot="chip"
      data-variant={variant}
      {...props}
    >
      {children}
    </TogglePrimitive>
  );
}
