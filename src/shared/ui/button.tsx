import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/lib';

const buttonVariants = cva(
  'inline-flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-md bg-surface-inverse [color:var(--td-color-text-inverse)] transition-colors outline-none select-none enabled:hover:bg-state-inverse-hover enabled:active:bg-state-inverse-pressed focus-visible:ring-2 focus-visible:ring-border-active focus-visible:ring-offset-2 disabled:pointer-events-none disabled:bg-state-inverse-disabled disabled:[color:var(--td-color-text-muted)]',
  {
    variants: {
      size: {
        lg: 'h-button-lg px-20 text-heading-h3',
        md: 'h-button-md px-14 text-body-b2',
        sm: 'h-button-sm px-10 text-caption-c1',
      },
    },
    defaultVariants: {
      size: 'lg',
    },
  },
);

export interface ButtonProps extends ButtonPrimitive.Props, VariantProps<typeof buttonVariants> {
  /** 버튼의 크기. 기본값은 `lg`입니다. */
  size?: VariantProps<typeof buttonVariants>['size'];
}

/**
 * 공용 Button 컴포넌트입니다.
 *
 * 버튼 동작에 사용합니다. 화면 이동에는 링크를 사용하고, 버튼 모양의 이동 링크는 `ButtonLink`를 사용합니다.
 *
 * @example
 * ```tsx
 * <Button>저장</Button>
 * <Button size="md">다음</Button>
 * <Button size="sm" disabled>삭제</Button>
 * ```
 */
export function Button({ className, size = 'lg', ...props }: ButtonProps) {
  return (
    <ButtonPrimitive
      className={cn(buttonVariants({ size, className }))}
      data-size={size}
      data-slot="button"
      {...props}
    />
  );
}

export { buttonVariants };
