import { Toggle as TogglePrimitive } from '@base-ui/react/toggle';

import { cn } from '@/shared/lib';
import { Icon } from '@/shared/ui/icon';

export interface FilterTabProps extends Omit<TogglePrimitive.Props, 'children'> {
  /** Filter Tab에 표시할 필터 이름 */
  label: string;
  /** 선택된 값을 표시하는 상태인지 여부 */
  filled?: boolean;
  /** Filter Tab에 추가할 클래스 이름 */
  className?: string;
}

/**
 * 지역이나 카테고리 같은 필터 패널을 여닫는 토글입니다.
 *
 * @example
 * ```tsx
 * <FilterTab label="지역" />
 * <FilterTab defaultPressed label="분류" />
 * ```
 */
export function FilterTab({ className, filled = false, label, ...props }: FilterTabProps) {
  return (
    <TogglePrimitive
      className={cn(
        'group inline-flex h-filter-tab-height min-w-0 flex-1 cursor-pointer items-center justify-between gap-16 rounded-full bg-transparent px-32 text-body-b1 transition-colors outline-none select-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-border-active focus-visible:ring-offset-2 data-pressed:bg-surface-inverse data-disabled:pointer-events-none data-disabled:cursor-default',
        className,
      )}
      data-slot="filter-tab"
      {...props}
    >
      <span
        className={cn(
          'min-w-0 truncate text-text-tertiary group-data-pressed:text-text-inverse group-data-disabled:text-text-disabled',
          filled && 'text-text-primary',
        )}
      >
        {label}
      </span>
      <span className="relative flex size-icon-2xl shrink-0 items-center justify-center">
        <Icon
          className="group-data-pressed:hidden group-data-pressed:text-icon-inverse group-data-disabled:text-icon-disabled"
          name="chevron-down"
          tone="default"
        />
        <Icon
          className="absolute hidden group-data-pressed:inline-block group-data-pressed:text-icon-inverse group-data-disabled:text-icon-disabled"
          name="chevron-up"
          tone="default"
        />
      </span>
    </TogglePrimitive>
  );
}
