import type { HTMLAttributes } from 'react';

import { cn } from '@/shared/lib';

/**
 * 관련 콘텐츠를 하나로 묶고 영역을 시각적으로 구분하는 공용 Card 컴포넌트입니다.
 *
 * @example
 * ```tsx
 * <Card>
 *   <CardContent>콘텐츠</CardContent>
 * </Card>
 * ```
 */
export function Card({
  as: Component = 'div',
  className,
  ...props
}: HTMLAttributes<HTMLElement> & { as?: 'div' | 'article' | 'aside' }) {
  return (
    <Component
      className={cn(
        'flex min-w-0 flex-col gap-24 rounded-2xl border border-border-default bg-surface-default p-24 text-text-primary',
        className,
      )}
      data-slot="card"
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex min-w-0 flex-col gap-8', className)}
      data-slot="card-content"
      {...props}
    />
  );
}
