'use client';

import type { Ref } from 'react';

import { cn } from '@/shared/lib';
import { FilterTab } from '@/shared/ui';

export type PlaceFilterTab = 'region' | 'category';

export interface PlaceFilterBarProps {
  /** 현재 활성화된 필터 탭 (모달 열림 상태일 때) */
  activeTab?: PlaceFilterTab | null;
  /** 적용 또는 선택된 지역 필터 개수 */
  regionCount?: number;
  /** 적용 또는 선택된 카테고리 필터 개수 */
  categoryCount?: number;
  /** 필터 탭 클릭 핸들러 */
  onTabClick?: (tab: PlaceFilterTab) => void;
  /** 지역 탭 버튼 ref (포커스 복귀용) */
  regionTabRef?: Ref<HTMLButtonElement>;
  /** 카테고리 탭 버튼 ref (포커스 복귀용) */
  categoryTabRef?: Ref<HTMLButtonElement>;
  /** PlaceFilterBar에 추가할 클래스 이름 */
  className?: string;
}

/**
 * 장소 검색창 아래 또는 모달 내부에 배치되는 지역 / 카테고리 필터 탭 바입니다.
 *
 * 닫힌 상태와 모달 내부에서 필터 개수를 표시하며, 탭을 클릭하면 `onTabClick` 콜백을 호출합니다.
 */
export function PlaceFilterBar({
  activeTab,
  categoryCount,
  categoryTabRef,
  className,
  onTabClick,
  regionCount,
  regionTabRef,
}: PlaceFilterBarProps) {
  const hasRegionCount = Boolean(regionCount && regionCount > 0);
  const hasCategoryCount = Boolean(categoryCount && categoryCount > 0);

  return (
    <div
      aria-label="필터 종류"
      className={cn(
        'flex h-filter-tab-height w-full shrink-0 rounded-full bg-surface-default ring-1 ring-border-default ring-inset',
        className,
      )}
      data-slot="place-filter-bar"
    >
      <FilterTab
        aria-label="지역 필터"
        count={hasRegionCount ? regionCount : undefined}
        filled={!activeTab && hasRegionCount}
        label="지역"
        onPressedChange={() => {
          onTabClick?.('region');
        }}
        pressed={activeTab === 'region'}
        ref={regionTabRef}
      />
      <FilterTab
        aria-label="카테고리 필터"
        count={hasCategoryCount ? categoryCount : undefined}
        filled={!activeTab && hasCategoryCount}
        label="카테고리"
        onPressedChange={() => {
          onTabClick?.('category');
        }}
        pressed={activeTab === 'category'}
        ref={categoryTabRef}
      />
    </div>
  );
}
