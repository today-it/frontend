import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';

import { cn } from '@/shared/lib';

export interface TabProps extends Omit<ComponentProps<typeof Link>, 'aria-current' | 'children'> {
  /** 현재 페이지에 해당하는 탭인지 여부 */
  active?: boolean;
  /** 탭에 표시할 내용 */
  children: ReactNode;
  /** Tab에 추가할 클래스 이름 */
  className?: string;
}

/**
 * 페이지 사이를 이동하는 내비게이션 Tab입니다.
 *
 * @example
 * ```tsx
 * <Tab href="/places" active>장소</Tab>
 * <Tab href="/courses">코스</Tab>
 * ```
 */
export function Tab({ active = false, children, className, ...props }: TabProps) {
  return (
    <Link
      aria-current={active ? 'page' : undefined}
      className={cn(
        'inline-flex h-tab-height min-w-tab-width shrink-0 items-center justify-center border-b-4 px-16 whitespace-nowrap no-underline transition-colors outline-none focus-visible:ring-2 focus-visible:ring-border-active focus-visible:ring-offset-2',
        active
          ? 'border-border-active text-text-primary'
          : 'border-transparent text-text-muted hover:text-text-secondary',
        className,
      )}
      data-active={active || undefined}
      data-slot="tab"
      {...props}
    >
      <span className="text-heading-h2">{children}</span>
    </Link>
  );
}
