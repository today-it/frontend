import { cn } from '@/shared/lib';
import { Checkbox } from '@/shared/ui/checkbox';
import { Icon } from '@/shared/ui/icon';

export interface RegionRowProps {
  /** 지역 이름 */
  label: string;
  /** 오른쪽 열에서 탐색 중인 행인지 여부 */
  selected?: boolean;
  /** 체크 상태 (미전달 시 체크박스 없는 탐색 전용 행으로 표시) */
  checked?: boolean | 'indeterminate';
  /** 체크 비활성화 및 라벨 비활성 색상 표시 여부 (하위 지역 탐색은 허용) */
  checkDisabled?: boolean;
  /** 체크박스 선택 변경 시 호출할 콜백 */
  onCheckedChange?: (checked: boolean) => void;
  /** 하위 지역 탐색 시 호출할 콜백 (전달 시에만 chevron 아이콘 표시) */
  onNavigate?: () => void;
  /** 행에 추가할 클래스 이름 */
  className?: string;
}

/**
 * 지역 선택 열의 항목을 표시하는 공용 RegionRow 컴포넌트입니다.
 *
 * `checked`를 전달하면 체크박스와 라벨은 선택 영역으로, `onNavigate`가 있을 때만 표시되는 chevron 버튼은 하위 지역 탐색 영역으로 분리되어 동작합니다. `checkDisabled` 상태에서도 chevron 탐색은 허용하며, `checked`를 생략하면 행 전체가 탐색 버튼으로 동작합니다.
 *
 * @example
 * ```tsx
 * <RegionRow label="성남시" onNavigate={() => {}} />
 * <RegionRow checked={false} label="성남시" onCheckedChange={() => {}} onNavigate={() => {}} />
 * ```
 */
export function RegionRow({
  checkDisabled = false,
  checked,
  className,
  label,
  onCheckedChange,
  onNavigate,
  selected = false,
}: RegionRowProps) {
  const rowClassName = cn(
    'flex h-48 w-full items-center gap-12 px-16 text-body-b2',
    selected && 'bg-surface-subtle',
    className,
  );
  const chevron = onNavigate ? <Icon name="chevron-right" tone="default" /> : null;

  if (checked === undefined) {
    return (
      <div className={rowClassName} data-slot="region-row">
        <button
          aria-current={selected ? 'true' : undefined}
          className="-mx-16 flex h-full min-w-0 flex-1 cursor-pointer items-center gap-12 px-16 text-body-b2 outline-none focus-visible:ring-2 focus-visible:ring-border-active focus-visible:ring-inset"
          onClick={onNavigate}
          type="button"
        >
          <span className="min-w-0 flex-1 truncate text-left text-text-primary">{label}</span>
          {chevron}
        </button>
      </div>
    );
  }

  return (
    <div className={rowClassName} data-slot="region-row">
      <label
        className={cn(
          'flex h-full min-w-0 flex-1 items-center gap-12',
          checkDisabled ? 'cursor-default' : 'cursor-pointer',
        )}
      >
        <Checkbox
          checked={checked === true}
          disabled={checkDisabled}
          indeterminate={checked === 'indeterminate'}
          onCheckedChange={(next) => onCheckedChange?.(next)}
        />
        <span
          className={cn(
            'min-w-0 flex-1 truncate text-left',
            checkDisabled ? 'text-text-disabled' : 'text-text-primary',
          )}
        >
          {label}
        </span>
      </label>
      {onNavigate ? (
        <button
          aria-current={selected ? 'true' : undefined}
          aria-label={`${label} 하위 지역 보기`}
          className="-mr-16 flex h-full shrink-0 cursor-pointer items-center pr-16 pl-4 outline-none focus-visible:ring-2 focus-visible:ring-border-active focus-visible:ring-inset"
          onClick={onNavigate}
          type="button"
        >
          {chevron}
        </button>
      ) : null}
    </div>
  );
}
