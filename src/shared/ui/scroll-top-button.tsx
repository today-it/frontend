'use client';

import { Button as ButtonPrimitive } from '@base-ui/react/button';

import { cn } from '@/shared/lib';
import { Icon } from '@/shared/ui/icon';

export interface ScrollTopButtonProps extends Omit<ButtonPrimitive.Props, 'children'> {
  /** 스크롤을 맨 위로 이동하는 버튼의 접근성 이름 */
  label?: string;
  /** ScrollTopButton에 추가할 클래스 이름 */
  className?: string;
  children?: never;
}

type ScrollTopButtonClickEvent = Parameters<NonNullable<ButtonPrimitive.Props['onClick']>>[0];

/**
 * 페이지 상단으로 부드럽게 이동하는 고정형 버튼입니다.
 *
 * @example
 * ```tsx
 * <ScrollTopButton />
 * ```
 */
export function ScrollTopButton({
  className,
  label = '맨 위로 이동',
  onClick,
  ...props
}: ScrollTopButtonProps) {
  function handleClick(event: ScrollTopButtonClickEvent) {
    onClick?.(event);

    if (event.defaultPrevented) {
      return;
    }

    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'auto'
      : 'smooth';

    window.scrollTo({ top: 0, behavior });
  }

  return (
    <ButtonPrimitive
      aria-label={label}
      className={cn(
        'fixed right-24 bottom-24 z-50 inline-flex size-button-scroll-top shrink-0 cursor-pointer flex-col items-center justify-center gap-2 rounded-full bg-surface-inverse p-0 text-text-inverse shadow-md transition-colors transition-shadow outline-none select-none focus-visible:ring-2 focus-visible:ring-border-active focus-visible:ring-offset-2 enabled:hover:bg-state-inverse-hover enabled:hover:shadow-lg enabled:active:bg-state-inverse-pressed enabled:active:shadow-sm disabled:pointer-events-none disabled:cursor-default disabled:bg-state-disabled disabled:text-text-disabled disabled:shadow-none',
        className,
      )}
      data-slot="scroll-top-button"
      onClick={handleClick}
      {...props}
    >
      <Icon name="keyboard-arrow-up" size={24} tone="inherit" />
      <span className="text-caption-c1 leading-[normal]">TOP</span>
    </ButtonPrimitive>
  );
}
