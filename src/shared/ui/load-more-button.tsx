import { cn } from '@/shared/lib';

import type { ButtonProps } from './button';
import { Button } from './button';

export interface LoadMoreButtonProps extends Omit<
  ButtonProps,
  'children' | 'disabled' | 'icon' | 'size' | 'variant'
> {
  /** 버튼에 표시할 문구 */
  label?: string;
  /** 더 불러올 항목 수 */
  count?: string;
  /** 항목 수 표시 여부 */
  showCount?: boolean;
}

/** 항목을 추가로 불러오는 pill 형태의 버튼입니다. */
export function LoadMoreButton({
  className,
  count = '8 / 20',
  label = '더 불러오기',
  showCount = true,
  ...props
}: LoadMoreButtonProps) {
  return (
    <Button
      {...props}
      className={cn(
        'rounded-full border-(length:--td-border-width-sm) border-border-default bg-surface-default [color:var(--td-color-text-primary)] enabled:hover:bg-state-hover enabled:active:bg-state-pressed',
        className,
      )}
      size="md"
    >
      <span>{label}</span>
      {showCount && <span className="text-text-secondary">{count}</span>}
    </Button>
  );
}
