'use client';

import { type ReactNode, useEffect, useState } from 'react';

import { cn } from '@/shared/lib';
import { Divider, SearchBar } from '@/shared/ui';

export interface ScrollSearchAreaProps {
  /** 검색 영역에 렌더링할 요소 */
  children?: ReactNode;
  /** 검색 영역 아래에 필터 탭 바가 포함되는지 여부 (기본값: `false`) */
  hasFilters?: boolean;
}

/** 아래로 스크롤하면 숨고, 위로 스크롤하면 고정 상단 바 아래에 나타납니다. */
export function ScrollSearchArea({ children, hasFilters = false }: ScrollSearchAreaProps) {
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
      <div aria-hidden="true" className="flex flex-col">
        <div className="flex flex-col py-18">
          <div className="h-search-bar-height" />
          {hasFilters ? (
            <>
              <div className="h-12" />
              <div className="h-filter-tab-height" />
            </>
          ) : null}
        </div>
        <div className="h-divider" />
      </div>
      <div className="pointer-events-none fixed inset-x-0 top-header-height z-40 overflow-hidden">
        <div
          aria-hidden={!isVisible}
          inert={!isVisible}
          className={cn(
            'flex w-full flex-col bg-surface-default transition-transform duration-300 ease-out motion-reduce:transition-none',
            isVisible ? 'pointer-events-auto translate-y-0' : '-translate-y-full',
          )}
        >
          <div className="mx-auto flex w-full max-w-[1920px] justify-center px-16 py-18 lg:px-48">
            {children ?? <SearchBar className="w-full" placeholder="검색어를 입력해주세요" />}
          </div>
          <Divider />
        </div>
      </div>
    </>
  );
}
