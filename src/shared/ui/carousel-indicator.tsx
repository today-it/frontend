import type { HTMLAttributes } from 'react';

import { cn } from '@/shared/lib';

export interface CarouselIndicatorProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** 현재 사진 위치. 첫 번째 사진은 `1`입니다. */
  current: number;
  /** 전체 사진 장수 */
  total: number;
}

/** 사진 캐러셀의 현재 위치와 전체 장수를 표시합니다. */
export function CarouselIndicator({ className, current, total, ...props }: CarouselIndicatorProps) {
  return (
    <span
      className={cn(
        'inline-flex h-36 min-w-[60px] items-center justify-center rounded-full bg-overlay-scrim px-16 text-caption-c2 whitespace-nowrap [color:var(--td-color-text-inverse)]',
        className,
      )}
      data-slot="carousel-indicator"
      {...props}
    >
      {current} / {total}
    </span>
  );
}
