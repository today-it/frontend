import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/shared/lib';

export interface DividerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** 구분선 가운데 표시할 내용 */
  label?: ReactNode;
}

/**
 * 가운데 라벨이 있는 구분선입니다.
 *
 * @example
 * ```tsx
 * <Divider />
 * <Divider label="계속하기" />
 * ```
 */
export function Divider({
  'aria-label': ariaLabel,
  className,
  label = '또는',
  ...props
}: DividerProps) {
  const accessibleLabel = ariaLabel ?? (typeof label === 'string' ? label : undefined);

  return (
    <div
      aria-label={accessibleLabel}
      aria-orientation="horizontal"
      className={cn(
        'flex h-divider-label w-divider-label-width max-w-full items-center gap-6',
        className,
      )}
      data-slot="divider"
      role="separator"
      {...props}
    >
      <span aria-hidden className="h-divider min-w-px flex-1 bg-border-default" />
      <span className="shrink-0 text-caption-c1 whitespace-nowrap [color:var(--td-color-text-muted)]">
        {label}
      </span>
      <span aria-hidden className="h-divider min-w-px flex-1 bg-border-default" />
    </div>
  );
}
