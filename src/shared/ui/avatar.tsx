import { Avatar as AvatarPrimitive } from '@base-ui/react/avatar';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/lib';

const avatarVariants = cva(
  'inline-flex shrink-0 items-center justify-center overflow-hidden bg-surface-brand-light [color:var(--td-color-surface-brand-placeholder)] select-none',
  {
    variants: {
      size: {
        xl: 'size-avatar-xl rounded-full text-heading-h3',
        lg: 'size-avatar-lg rounded-full text-heading-h3',
        md: 'size-avatar-md rounded-3xl text-body-b2',
        sm: 'size-avatar-sm rounded-2xl text-caption-c2',
      },
    },
    defaultVariants: {
      size: 'xl',
    },
  },
);

const avatarAssetSizes = { xl: 96, lg: 64, md: 48, sm: 32 } as const;

export interface AvatarProps
  extends AvatarPrimitive.Root.Props, VariantProps<typeof avatarVariants> {
  /** 프로필 이미지의 대체 텍스트. 기본값은 `기본 프로필 이미지`입니다. */
  alt?: string;
  /** 프로필 이미지 주소 */
  src?: string;
  /** Avatar의 크기. 기본값은 `xl`입니다. */
  size?: VariantProps<typeof avatarVariants>['size'];
  /** Avatar에 추가할 클래스 이름 */
  className?: string;
  children?: never;
}

/**
 * 공용 Avatar 컴포넌트입니다.
 *
 * @example
 * ```tsx
 * <Avatar />
 * <Avatar size="md" />
 * <Avatar src="/profile.jpg" alt="김민준 프로필" />
 * ```
 */
export function Avatar({ alt, className, size = 'xl', src, ...props }: AvatarProps) {
  const resolvedSize = size ?? 'xl';
  const assetSize = avatarAssetSizes[resolvedSize];
  const accessibleAlt = alt ?? '기본 프로필 이미지';

  return (
    <AvatarPrimitive.Root
      className={cn(avatarVariants({ size, className }))}
      data-size={size}
      data-slot="avatar"
      {...props}
    >
      {src ? (
        <AvatarPrimitive.Image
          alt={accessibleAlt}
          className="size-full object-cover"
          data-slot="avatar-image"
          src={src}
        />
      ) : null}
      <AvatarPrimitive.Fallback
        className="relative flex size-full items-center justify-center"
        data-slot="avatar-fallback"
      >
        <span
          aria-hidden={!accessibleAlt || undefined}
          aria-label={accessibleAlt || undefined}
          className="absolute inset-0 block"
          role={accessibleAlt ? 'img' : undefined}
          style={{
            width: assetSize,
            height: assetSize,
            backgroundImage: `url(/images/avatar-placeholder-${resolvedSize}.svg)`,
            backgroundSize: `${assetSize}px ${assetSize}px`,
            backgroundRepeat: 'no-repeat',
          }}
        />
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
}

export { avatarVariants };
