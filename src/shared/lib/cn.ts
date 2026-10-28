import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const semanticSpacingTokens = [
  'avatar-sm',
  'avatar-md',
  'avatar-lg',
  'avatar-xl',
  'avatar-badge',
  'carousel-button',
  'icon-button',
  'checkbox',
  'chip',
  'input',
  'form-width',
  'button-sm',
  'button-md',
  'button-lg',
  'social-button',
  'social-logo',
  'dropdown',
  'dropdown-width',
  'dropdown-panel-width',
  'option-row',
  'icon-xs',
  'icon-sm',
  'icon-md',
  'icon-lg',
  'icon-xl',
  'icon-2xl',
  'icon-3xl',
  'place-card-body-height',
  'place-card-width',
  'place-card-thumbnail-height',
  'place-card-thumbnail-height-lg',
  'header-width',
  'header-height',
  'tab-width',
  'tab-height',
  'filter-tab-height',
  'search-bar-width',
  'search-bar-height',
  'section-header-width',
  'button-scroll-top',
  'modal-width',
  'profile-chip',
  'profile-chip-width',
  'divider',
  'divider-label',
  'divider-label-width',
  'indicator-dot',
  'indicator-active-width',
  'gallery-width',
  'gallery-height',
  'gallery-map-width',
  'gallery-map-height',
  'side-tab-width',
  'side-tab-height',
  'detail-panel-width',
  'detail-panel-height',
  'info-row-label-width',
];

const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      // Keep these semantic values in sync with --spacing-* in globals.css.
      spacing: semanticSpacingTokens,
      text: [
        'heading-h1',
        'heading-h2',
        'heading-h3',
        'body-b1',
        'body-b2',
        'body-b3',
        'caption-c1',
        'caption-c2',
      ],
    },
    classGroups: {
      shadow: [{ shadow: ['dropdown', 'toast', 'modal'] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
