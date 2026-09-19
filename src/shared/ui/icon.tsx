import type { SVGProps } from 'react';

import { cn } from '@/shared/lib';

export const iconNames = [
  'visibility',
  'visibility-off',
  'close',
  'check',
  'chevron-forward',
  'chevron-backward',
  'keyboard-arrow-down',
  'keyboard-arrow-up',
  'add',
] as const;

export type IconName = (typeof iconNames)[number];
export type IconTone = 'default' | 'muted' | 'disabled' | 'inherit';

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'children' | 'height' | 'width'> {
  /** `sprite.svg`에서 표시할 아이콘의 이름 */
  name: IconName;
  /** 아이콘에 적용할 semantic color. `inherit`는 부모 또는 `className`의 색상을 사용합니다. */
  tone?: IconTone;
  /** 아이콘의 너비와 높이. 기본값은 `24`입니다. */
  size?: number | string;
  /** 아이콘의 접근성 이름. 생략하면 장식용 아이콘으로 처리됩니다. */
  label?: string;
}

const toneClassNames: Record<IconTone, string | undefined> = {
  default: 'text-icon-default',
  muted: 'text-icon-muted',
  disabled: 'text-icon-disabled',
  inherit: undefined,
};

/**
 * 디자인 시스템의 SVG sprite 아이콘을 렌더링합니다.
 *
 * `default`, `muted`, `disabled` tone은 semantic color token을 사용하므로 테마가 변경되면 아이콘 색상도 자동으로 변경됩니다.  
 *
 * 별도의 색상을 사용하려면 `tone="inherit"`와 Tailwind 색상 클래스를 함께 전달하세요.
 *
 * 상호작용 요소의 의미를 아이콘만으로 전달하는 경우 `label`을 지정해야 합니다.
 *
 * `label`을 생략하면 `aria-hidden="true"`가 적용됩니다.
 *
 * @example
 * ```tsx
 * <Icon name="check" />
 * <Icon name="visibility-off" tone="muted" size={20} />
 * <Icon name="close" label="닫기" />
 * <Icon name="check" tone="inherit" className="text-system-success" />
 * ```
 */
export function Icon({ name, tone = 'default', size = 24, label, className, ...props }: IconProps) {
  return (
    <svg
      aria-hidden={label ? undefined : true}
      aria-label={label}
      className={cn('inline-block shrink-0', toneClassNames[tone], className)}
      height={size}
      role={label ? 'img' : undefined}
      width={size}
      {...props}
    >
      <use href={`/icons/sprite.svg#${name}`} />
    </svg>
  );
}
