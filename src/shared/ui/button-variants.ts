import { cva, type VariantProps } from 'class-variance-authority';

const buttonBaseStyles =
  'inline-flex shrink-0 cursor-pointer items-center justify-center gap-8 whitespace-nowrap rounded-md transition-colors outline-none select-none focus-visible:ring-2 focus-visible:ring-border-active focus-visible:ring-offset-2';

const buttonSizeVariants = {
  lg: 'h-button-lg px-40 text-heading-h3',
  md: 'h-button-md px-28 text-body-b2',
  sm: 'h-button-sm px-20 text-caption-c1',
} as const;

const buttonVariantConfig = {
  variants: {
    size: buttonSizeVariants,
  },
  defaultVariants: {
    size: 'lg' as const,
  },
};

export const buttonVariants = cva(
  `${buttonBaseStyles} disabled:pointer-events-none disabled:bg-state-inverse-disabled disabled:[color:var(--td-color-text-muted)]`,
  {
    variants: {
      size: buttonSizeVariants,
      variant: {
        primary:
          'bg-surface-inverse [color:var(--td-color-text-inverse)] enabled:hover:bg-state-inverse-hover enabled:active:bg-state-inverse-pressed',
        cta: 'bg-surface-cta [color:var(--td-color-text-primary)] enabled:hover:bg-state-cta-hover enabled:hover:[color:var(--td-color-text-inverse)] enabled:active:bg-state-cta-pressed enabled:active:[color:var(--td-color-text-inverse)]',
      },
    },
    defaultVariants: { size: 'lg', variant: 'primary' },
  },
);

export const buttonLinkVariants = cva(
  `${buttonBaseStyles} bg-surface-inverse [color:var(--td-color-text-inverse)] hover:bg-state-inverse-hover active:bg-state-inverse-pressed aria-disabled:pointer-events-none aria-disabled:cursor-default aria-disabled:bg-state-inverse-disabled aria-disabled:[color:var(--td-color-text-muted)]`,
  buttonVariantConfig,
);

export type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>['size']>;
