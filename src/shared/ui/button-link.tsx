'use client';

import Link from 'next/link';
import type { ComponentProps, MouseEvent } from 'react';

import { cn } from '@/shared/lib';

import { buttonLinkVariants, type ButtonSize } from './button-variants';
import { Icon, type IconName } from './icon';

export interface ButtonLinkProps extends ComponentProps<typeof Link> {
  /** 버튼의 크기. 기본값은 `lg`입니다. */
  size?: ButtonSize;
  /** 링크를 비활성화합니다. */
  disabled?: boolean;
  /** 텍스트 앞에 표시할 장식용 아이콘. */
  icon?: IconName;
}

/**
 * 버튼 모양의 공용 링크 컴포넌트입니다.
 *
 * 화면 이동에 사용하며, 버튼 동작에는 `Button`을 사용합니다.
 *
 * @example
 * ```tsx
 * <ButtonLink href="/signup">회원가입</ButtonLink>
 * <ButtonLink href="/login" size="md">로그인</ButtonLink>
 * <ButtonLink href="/settings" disabled>설정</ButtonLink>
 * <ButtonLink href="/signup" icon="check">가입 완료</ButtonLink>
 * ```
 */
export function ButtonLink({
  children,
  className,
  disabled = false,
  icon,
  onClick,
  prefetch,
  size = 'lg',
  tabIndex,
  ...props
}: ButtonLinkProps) {
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
      className={cn(buttonLinkVariants({ size }), className)}
      data-size={size}
      data-slot="button-link"
      onClick={handleClick}
      prefetch={disabled ? false : prefetch}
      tabIndex={disabled ? -1 : tabIndex}
      {...props}
    >
      {icon && <Icon name={icon} size={size === 'sm' ? 16 : 20} tone="inherit" />}
      {children}
    </Link>
  );
}
