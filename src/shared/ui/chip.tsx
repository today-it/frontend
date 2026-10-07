import { Toggle as TogglePrimitive } from '@base-ui/react/toggle';
import type { ReactNode } from 'react';

import { cn } from '@/shared/lib';

export interface ChipProps extends TogglePrimitive.Props {
  /** Chip에 표시할 내용 */
  children: ReactNode;
  /** Chip에 추가할 클래스 이름 */
  className?: string;
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
export function Chip({ children, className, ...props }: ChipProps) {
  return (
    <TogglePrimitive
      className={cn(
        'inline-flex h-36 shrink-0 cursor-pointer items-center justify-center rounded-full border-(length:--td-border-width-sm) border-border-default bg-surface-default px-20 py-10 text-caption-c1 leading-[normal] whitespace-nowrap [color:var(--td-color-text-primary)] transition-colors outline-none select-none focus-visible:ring-2 focus-visible:ring-border-active focus-visible:ring-offset-2 enabled:hover:not-data-pressed:bg-state-hover enabled:hover:not-data-pressed:[color:var(--td-color-text-primary)] data-pressed:border-border-primary-subtle-selected data-pressed:bg-surface-brand-light data-pressed:[color:var(--td-color-text-brand)] data-disabled:pointer-events-none data-disabled:cursor-default data-disabled:border-transparent data-disabled:bg-state-disabled data-disabled:[color:var(--td-color-text-disabled)]',
        className,
      )}
      data-slot="chip"
      {...props}
    >
      {children}
    </TogglePrimitive>
  );
}
