'use client';

import Link from 'next/link';
import type { ComponentProps, MouseEvent } from 'react';

import { cn } from '@/shared/lib';

export interface TextLinkProps extends ComponentProps<typeof Link> {
  /** 링크를 비활성화합니다. */
  disabled?: boolean;
  /** 텍스트 링크에 추가할 클래스 이름 */
  className?: string;
}

/**
 * 공용 TextLink 컴포넌트입니다.
 *
 * @example
 * ```tsx
 * <TextLink href="/login">로그인</TextLink>
 * <TextLink href="/signup" disabled>회원가입</TextLink>
 * ```
 */
export function TextLink({
  className,
  disabled = false,
  onClick,
  prefetch,
  tabIndex,
  ...props
}: TextLinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (disabled) {
      event.preventDefault();
      return;
    }

    onClick?.(event);
  }

  return (
    <Link
      aria-disabled={disabled || undefined}
      className={cn(
        'inline-flex items-start text-body-b2 whitespace-nowrap [color:var(--td-color-text-primary)] no-underline outline-none focus-visible:ring-2 focus-visible:ring-border-active focus-visible:ring-offset-2 aria-disabled:pointer-events-none aria-disabled:cursor-default aria-disabled:[color:var(--td-color-text-disabled)]',
        className,
      )}
      data-slot="text-link"
      onClick={handleClick}
      prefetch={disabled ? false : prefetch}
      tabIndex={disabled ? -1 : tabIndex}
      {...props}
    />
  );
}
