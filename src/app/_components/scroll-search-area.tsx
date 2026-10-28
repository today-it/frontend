'use client';

import { type ReactNode, useEffect, useState } from 'react';

import { cn } from '@/shared/lib';
import { Divider, SearchBar } from '@/shared/ui';

/** 아래로 스크롤하면 숨고, 위로 스크롤하면 고정 상단 바 아래에 나타납니다. */
export function ScrollSearchArea({ children }: { children?: ReactNode }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let previousScrollY = Math.max(0, window.scrollY);

    function updateVisibility() {
      const currentScrollY = Math.max(0, window.scrollY);

      if (currentScrollY !== previousScrollY) {
        setIsVisible(currentScrollY === 0 || currentScrollY < previousScrollY);
        previousScrollY = currentScrollY;
      }
    }

    window.addEventListener('scroll', updateVisibility, { passive: true });
    return () => window.removeEventListener('scroll', updateVisibility);
  }, []);

  return (
    <>
      <div aria-hidden="true" className="pt-18 pb-36">
        <div className="h-search-bar-height" />
        <div className="h-divider" />
      </div>
      <div className="pointer-events-none fixed inset-x-0 top-header-height z-40 overflow-hidden">
        <div
          aria-hidden={!isVisible}
          inert={!isVisible}
          className={cn(
            'mx-auto flex w-full max-w-header-width flex-col bg-surface-default transition-transform duration-300 ease-out motion-reduce:transition-none',
            isVisible ? 'pointer-events-auto translate-y-0' : '-translate-y-full',
          )}
        >
          <div className="flex w-full justify-center pt-18 pb-36">
            {children ?? <SearchBar className="w-full" placeholder="검색어를 입력해주세요" />}
          </div>
          <Divider />
        </div>
      </div>
    </>
  );
}
