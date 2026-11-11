'use client';

import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { useEffect, useState } from 'react';

import { cn } from '@/shared/lib';
import { Icon } from '@/shared/ui/icon';

export interface ScrollTopButtonProps extends Omit<ButtonPrimitive.Props, 'children'> {
  /** 최상단 이동 버튼의 접근성 이름 (기본값: `맨 위로 이동`) */
  label?: string;
  /** 추가 클래스 이름 */
  className?: string;
  /** 세로 스크롤이 있을 때만 표시할지 여부 (기본값: `false`) */
  hideWhenNotScrollable?: boolean;
  children?: never;
}

type ScrollTopButtonClickEvent = Parameters<NonNullable<ButtonPrimitive.Props['onClick']>>[0];

/**
 * 클릭 시 페이지 최상단으로 스크롤을 이동시키는 공용 ScrollTopButton 컴포넌트입니다.
 *
 * @example
 * ```tsx
 * <ScrollTopButton />
 * ```
 */
export function ScrollTopButton({
  className,
  label = '맨 위로 이동',
  hideWhenNotScrollable = false,
  onClick,
  ...props
}: ScrollTopButtonProps) {
  const [scrollable, setScrollable] = useState(false);

  useEffect(() => {
    if (!hideWhenNotScrollable) return;

    function updateScrollable() {
      setScrollable(document.documentElement.scrollHeight > document.documentElement.clientHeight);
    }

    updateScrollable();
    const observer = new ResizeObserver(updateScrollable);
    observer.observe(document.documentElement);
    observer.observe(document.body);
    window.addEventListener('resize', updateScrollable);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateScrollable);
    };
  }, [hideWhenNotScrollable]);

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

  if (hideWhenNotScrollable && !scrollable) return null;

  return (
    <ButtonPrimitive
      aria-label={label}
      className={cn(
        'group/scroll-top fixed right-24 bottom-24 z-50 inline-flex size-button-scroll-top shrink-0 cursor-pointer flex-col items-center justify-center gap-2 rounded-full bg-surface-inverse p-0 text-text-inverse shadow-md transition-colors transition-shadow outline-none select-none focus-visible:ring-2 focus-visible:ring-border-active focus-visible:ring-offset-2 enabled:hover:bg-state-inverse-hover enabled:hover:shadow-lg enabled:active:bg-state-inverse-pressed enabled:active:shadow-sm disabled:pointer-events-none disabled:cursor-default disabled:bg-state-disabled disabled:text-text-disabled disabled:shadow-none',
        className,
      )}
      data-slot="scroll-top-button"
      onClick={handleClick}
      {...props}
    >
      <Icon
        name="chevron-up"
        size={24}
        tone="inherit"
        className="text-icon-inverse group-disabled/scroll-top:text-text-disabled"
      />
      <span className="text-caption-c1 leading-[normal]">TOP</span>
    </ButtonPrimitive>
  );
}
