import type { HTMLAttributes } from 'react';

import { cn } from '@/shared/lib';

export type SkeletonProps = HTMLAttributes<HTMLDivElement>;

/**
 * 콘텐츠를 불러오는 동안 표시하는 공용 Skeleton 컴포넌트입니다.
 *
 * @example
 * ```tsx
 * <Skeleton className="h-24 w-160 rounded-md" />
 * ```
 */
export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse bg-surface-subtle motion-reduce:animate-none', className)}
      data-slot="skeleton"
      {...props}
    />
  );
}
