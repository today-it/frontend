import type { ComponentPropsWithRef } from 'react';

import { cn } from '@/shared/lib';
import { Icon } from '@/shared/ui/icon';

export interface ChipRemovableProps extends Omit<
  ComponentPropsWithRef<'button'>,
  'children' | 'onClick' | 'type'
> {
  /** 선택된 필터 이름 */
  label: string;
  /** 칩 선택 해제 시 호출할 콜백 */
  onRemove: () => void;
}

/**
 * 선택된 필터를 표시하고 해제하는 공용 ChipRemovable 컴포넌트입니다.
 *
 * @example
 * ```tsx
 * <ChipRemovable label="성남시" onRemove={() => {}} />
 * ```
 */
export function ChipRemovable({ className, label, onRemove, ...props }: ChipRemovableProps) {
  return (
    <button
      aria-label={`${label} 필터 해제`}
      className={cn(
        'inline-flex h-chip shrink-0 cursor-pointer items-center justify-center gap-6 rounded-full bg-surface-inverse px-20 py-10 text-caption-c1 leading-[normal] whitespace-nowrap text-text-inverse transition-colors outline-none select-none focus-visible:ring-2 focus-visible:ring-border-active focus-visible:ring-offset-2 enabled:hover:bg-state-inverse-hover disabled:pointer-events-none disabled:cursor-default disabled:bg-state-inverse-disabled disabled:text-text-disabled',
        className,
      )}
      data-slot="chip-removable"
      onClick={onRemove}
      type="button"
      {...props}
    >
      <span>{label}</span>
      <Icon name="close" size={16} tone="inherit" />
    </button>
  );
}
