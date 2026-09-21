'use client';

import { Select } from '@base-ui/react/select';

import { cn } from '@/shared/lib';
import { Icon } from '@/shared/ui/icon';

export interface DropdownOption {
  /** 옵션에 표시할 이름 */
  label: string;
  /** 옵션을 식별하는 값 */
  value: string;
  /** 옵션 선택 비활성화 여부 */
  disabled?: boolean;
}

export interface DropdownProps extends Omit<
  Select.Root.Props<string>,
  'children' | 'items' | 'multiple'
> {
  /** 드롭다운의 접근성 이름 */
  label: string;
  /** 드롭다운에 표시할 옵션 목록 */
  options: readonly DropdownOption[];
  /** 선택된 값이 없을 때 표시할 문구 */
  placeholder?: string;
  /** Dropdown에 추가할 클래스 이름 */
  className?: string;
}

/**
 * 단일 값을 선택하는 공용 Dropdown 컴포넌트입니다.
 *
 * @example
 * ```tsx
 * <Dropdown
 *   label="지역"
 *   options={[
 *     { label: '서울', value: 'seoul' },
 *     { label: '부산', value: 'busan' },
 *   ]}
 *   placeholder="지역을 선택해주세요"
 * />
 * ```
 */
export function Dropdown({
  className,
  label,
  options,
  placeholder = '선택해주세요',
  ...props
}: DropdownProps) {
  const items = options.map(({ label: optionLabel, value }) => ({
    label: optionLabel,
    value,
  }));

  return (
    <Select.Root items={items} {...props}>
      <Select.Trigger
        aria-label={label}
        className={cn(
          'group flex h-dropdown w-dropdown-width max-w-full cursor-pointer items-center justify-between gap-4 rounded-xl border-(length:--td-border-width-sm) border-border-default bg-surface-default px-10 py-8 text-caption-c1 [color:var(--td-color-text-primary)] outline-none select-none focus-visible:ring-2 focus-visible:ring-border-active focus-visible:ring-offset-2 data-popup-open:border-border-active data-disabled:cursor-default data-disabled:bg-state-disabled data-disabled:[color:var(--td-color-text-muted)]',
          className,
        )}
        data-slot="dropdown-trigger"
      >
        <Select.Value className="min-w-0 truncate" placeholder={placeholder} />
        <Select.Icon className="text-icon-default group-data-disabled:text-icon-muted">
          <Icon
            className="group-data-popup-open:hidden"
            name="keyboard-arrow-down"
            tone="inherit"
          />
          <Icon
            className="hidden group-data-popup-open:inline-block"
            name="keyboard-arrow-up"
            tone="inherit"
          />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Positioner
          align="start"
          alignItemWithTrigger={false}
          className="z-50 outline-none"
          sideOffset={4}
        >
          <Select.Popup
            className="w-[var(--anchor-width)] overflow-hidden rounded-xl border-(length:--td-border-width-sm) border-border-default bg-surface-default py-4 text-caption-c1 [color:var(--td-color-text-primary)] outline-none"
            data-slot="dropdown-popup"
          >
            <Select.List className="max-h-[var(--available-height)] overflow-y-auto outline-none">
              {options.map((option) => (
                <Select.Item
                  className="flex h-option-row w-full cursor-pointer items-center justify-between px-8 outline-none select-none data-highlighted:bg-state-hover data-disabled:cursor-default data-disabled:[color:var(--td-color-text-disabled)]"
                  disabled={option.disabled}
                  key={option.value}
                  value={option.value}
                >
                  <Select.ItemText className="min-w-0 truncate">{option.label}</Select.ItemText>
                  <Select.ItemIndicator className="ml-4 flex shrink-0 text-icon-default">
                    <Icon name="check" size={24} tone="inherit" />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
}
