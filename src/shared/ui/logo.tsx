import type { HTMLAttributes } from 'react';

import { cn } from '@/shared/lib';

export type LogoProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'>;

/**
 * ToDayIt 서비스 로고입니다.
 *
 * @example
 * ```tsx
 * <Logo />
 * <Modal logo={<Logo />} open={open} onOpenChange={setOpen}>...</Modal>
 * ```
 */
export function Logo({ className, ...props }: LogoProps) {
  return (
    <span
      className={cn('text-heading-h1 [color:var(--td-color-text-primary)]', className)}
      data-slot="logo"
      {...props}
    >
      ToDayIt
    </span>
  );
}
