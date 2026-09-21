import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox';

import { cn } from '@/shared/lib';
import { Icon } from '@/shared/ui/icon';

export interface CheckboxProps extends CheckboxPrimitive.Root.Props {
  /** 체크박스에 추가할 클래스 이름 */
  className?: string;
}

/**
 * 공용 Checkbox 컴포넌트입니다.
 *
 * @example
 * ```tsx
 * <Checkbox aria-label="선택" />
 * <Checkbox aria-label="선택" defaultChecked />
 * <Checkbox aria-label="선택" disabled />
 * ```
 */
export function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      className={cn(
        'inline-flex size-checkbox shrink-0 cursor-pointer items-center justify-center rounded-md border-(length:--td-border-width-md) border-border-default bg-transparent p-0 text-text-inverse transition-colors outline-none select-none focus-visible:ring-2 focus-visible:ring-border-active focus-visible:ring-offset-2 data-checked:border-transparent data-checked:bg-surface-inverse data-disabled:pointer-events-none data-disabled:cursor-default data-disabled:border-border-default data-disabled:bg-state-disabled',
        className,
      )}
      data-slot="checkbox"
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className="flex size-full items-center justify-center"
        data-slot="checkbox-indicator"
      >
        <Icon name="check" size={24} tone="inherit" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}
