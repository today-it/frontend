import type { ComponentPropsWithRef } from 'react';

import { cn } from '@/shared/lib';
import { Icon } from '@/shared/ui/icon';

export interface FilterAccordionProps extends Omit<
  ComponentPropsWithRef<'button'>,
  'children' | 'onClick' | 'type'
> {
  /** 트리거에 표시할 이름 */
  label: string;
  /** 선택된 필터 개수 (전달 시에만 표시) */
  count?: number;
  /** 연결된 패널의 열림 여부 */
  open: boolean;
  /** 열림 상태 변경 시 호출할 콜백 */
  onOpenChange: (open: boolean) => void;
}

/**
 * 선택한 필터 목록 패널을 여닫는 공용 FilterAccordion 컴포넌트입니다.
 *
 * @example
 * ```tsx
 * <FilterAccordion
 *   aria-controls="selected-filters-panel"
 *   count={4}
 *   label="선택한 필터"
 *   onOpenChange={setOpen}
 *   open={open}
 * />
 * ```
 */
export function FilterAccordion({
  className,
  count,
  label,
  onOpenChange,
  open,
  ...props
}: FilterAccordionProps) {
  return (
    <button
      aria-expanded={open}
      className={cn(
        'group inline-flex h-36 cursor-pointer items-center gap-6 rounded-md bg-transparent p-0 text-caption-c1 whitespace-nowrap outline-none select-none focus-visible:ring-2 focus-visible:ring-border-active focus-visible:ring-offset-2 disabled:cursor-default disabled:text-text-disabled',
        className,
      )}
      data-slot="filter-accordion"
      onClick={() => onOpenChange(!open)}
      type="button"
      {...props}
    >
      <span className="text-text-primary group-disabled:text-text-disabled">{label}</span>
      {count !== undefined ? (
        <span className="text-text-brand group-disabled:text-text-disabled">{count}</span>
      ) : null}
      <Icon
        className="group-disabled:text-icon-disabled"
        name={open ? 'chevron-up' : 'chevron-down'}
        size={20}
        tone="default"
      />
    </button>
  );
}
