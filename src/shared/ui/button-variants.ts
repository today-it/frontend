import { cva, type VariantProps } from 'class-variance-authority';

const buttonBaseStyles =
  'inline-flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-md bg-surface-inverse [color:var(--td-color-text-inverse)] transition-colors outline-none select-none focus-visible:ring-2 focus-visible:ring-border-active focus-visible:ring-offset-2';

const buttonSizeVariants = {
  lg: 'h-button-lg px-20 text-heading-h3',
  md: 'h-button-md px-14 text-body-b2',
  sm: 'h-button-sm px-10 text-caption-c1',
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
  `${buttonBaseStyles} enabled:hover:bg-state-inverse-hover enabled:active:bg-state-inverse-pressed disabled:pointer-events-none disabled:bg-state-inverse-disabled disabled:[color:var(--td-color-text-muted)]`,
  buttonVariantConfig,
);

export const buttonLinkVariants = cva(
  `${buttonBaseStyles} hover:bg-state-inverse-hover active:bg-state-inverse-pressed aria-disabled:pointer-events-none aria-disabled:cursor-default aria-disabled:bg-state-inverse-disabled aria-disabled:[color:var(--td-color-text-muted)]`,
  buttonVariantConfig,
);

export type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>['size']>;
