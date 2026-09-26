import { Avatar as AvatarPrimitive } from '@base-ui/react/avatar';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/lib';

const avatarVariants = cva(
  'inline-flex shrink-0 items-center justify-center overflow-hidden bg-surface-placeholder [color:var(--td-color-text-secondary)] select-none',
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

export interface AvatarProps
  extends AvatarPrimitive.Root.Props, VariantProps<typeof avatarVariants> {
  /** 프로필 이미지의 대체 텍스트. 기본값은 `initials`입니다. */
  alt?: string;
  /** 이미지가 없거나 불러오지 못했을 때 표시할 이니셜 */
  initials?: string;
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
 * <Avatar initials="TI" />
 * <Avatar size="md" initials="김민준" />
 * <Avatar src="/profile.jpg" alt="김민준 프로필" initials="김민준" />
 * ```
 */
export function Avatar({
  alt,
  className,
  initials = 'TI',
  size = 'xl',
  src,
  ...props
}: AvatarProps) {
  return (
    <AvatarPrimitive.Root
      className={cn(avatarVariants({ size, className }))}
      data-size={size}
      data-slot="avatar"
      {...props}
    >
      {src ? (
        <AvatarPrimitive.Image
          alt={alt ?? initials}
          className="size-full object-cover"
          data-slot="avatar-image"
          src={src}
        />
      ) : null}
      <AvatarPrimitive.Fallback
        className="flex size-full items-center justify-center"
        data-slot="avatar-fallback"
      >
        {initials}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
}

export { avatarVariants };
