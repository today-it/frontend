import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/shared/lib';

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  /** Tag에 표시할 내용 */
  children: ReactNode;
  /** Tag에 추가할 클래스 이름 */
  className?: string;
}

/**
 * 카테고리처럼 정보를 표시하는 비상호작용 Tag입니다.
 * 선택 동작이 필요한 경우 Chip을 사용하세요.
 *
 * @example
 * ```tsx
 * <Tag>카페</Tag>
 * ```
 */
export function Tag({ children, className, ...props }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-sm bg-surface-subtle px-8 py-4 text-caption-c1 leading-[normal] whitespace-nowrap text-text-secondary',
        className,
      )}
      data-slot="tag"
      {...props}
    >
      {children}
    </span>
  );
}
