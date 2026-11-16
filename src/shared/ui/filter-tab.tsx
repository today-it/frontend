import { Toggle as TogglePrimitive } from '@base-ui/react/toggle';

import { cn } from '@/shared/lib';
import { Icon } from '@/shared/ui/icon';

export interface FilterTabProps extends Omit<TogglePrimitive.Props, 'children'> {
  /** FilterTab에 표시할 필터 이름 */
  label: string;
  /** 선택된 값을 표시하는 상태인지 여부 */
  filled?: boolean;
  /** 라벨 옆에 표시할 선택된 필터 개수 */
  count?: number;
  /** FilterTab에 추가할 클래스 이름 */
  className?: string;
}

/**
 * 필터 패널을 여닫는 공용 FilterTab 컴포넌트입니다.
 *
 * @example
 * ```tsx
 * <FilterTab label="지역" />
 * <FilterTab defaultPressed label="분류" />
 * <FilterTab count={2} label="지역" />
 * ```
 */
export function FilterTab({ className, count, filled = false, label, ...props }: FilterTabProps) {
  return (
    <TogglePrimitive
      className={cn(
        'group inline-flex h-filter-tab-height min-w-0 flex-1 cursor-pointer items-center justify-between gap-8 rounded-full bg-transparent px-16 transition-colors outline-none select-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-border-active focus-visible:ring-offset-2 data-pressed:bg-surface-subtle sm:gap-16 sm:px-32 data-disabled:pointer-events-none data-disabled:cursor-default',
        className,
      )}
      data-slot="filter-tab"
      {...props}
    >
      <span className="flex min-w-0 items-baseline gap-6">
        <span
          className={cn(
            'min-w-0 truncate text-body-b2 text-text-tertiary group-data-pressed:text-text-primary group-data-disabled:text-text-disabled',
            filled && 'text-text-primary',
          )}
        >
          {label}
        </span>
        {count !== undefined ? (
          <span
            className="shrink-0 text-body-b3 text-text-brand group-data-disabled:text-text-disabled"
            data-slot="filter-tab-count"
          >
            {count}
          </span>
        ) : null}
      </span>
      <Icon
        className="shrink-0 group-data-pressed:rotate-180 group-data-disabled:text-icon-disabled"
        name="chevron-down"
        size={24}
        tone="default"
      />
    </TogglePrimitive>
  );
}
