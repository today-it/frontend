import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/shared/lib';

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  /** 태그 유형 (기본값: `default`) */
  type?: 'default' | 'category';
  /** 태그에 표시할 내용 */
  children: ReactNode;
  /** 추가 클래스 이름 */
  className?: string;
}

/**
 * 카테고리나 부가 정보를 표시하는 공용 Tag 컴포넌트입니다. 선택 동작에는 Chip을 사용합니다.
 *
 * @example
 * ```tsx
 * <Tag>카페</Tag>
 * ```
 */
export function Tag({ children, className, type = 'default', ...props }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-sm px-8 py-4 leading-[normal] whitespace-nowrap',
        type === 'category'
          ? 'bg-surface-brand-light text-caption-c2 text-text-brand'
          : 'bg-surface-subtle text-caption-c2 text-text-secondary',
        className,
      )}
      data-slot="tag"
      {...props}
    >
      {children}
    </span>
  );
}
