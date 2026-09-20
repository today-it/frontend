import { Button as ButtonPrimitive } from '@base-ui/react/button';
import Image from 'next/image';

import { cn } from '@/shared/lib';

export interface SocialLoginButtonProps extends Omit<ButtonPrimitive.Props, 'children'> {
  /** 소셜 로그인 제공자 */
  provider: 'google' | 'kakao';
  /** 버튼의 접근성 이름 */
  label?: string;
  /** SocialLoginButton에 추가할 클래스 이름 */
  className?: string;
  children?: never;
}

const providerLabels = {
  google: 'Google로 로그인',
  kakao: '카카오로 로그인',
} as const;

/**
 * 소셜 로그인 아이콘 버튼입니다.
 *
 * @example
 * ```tsx
 * <SocialLoginButton provider="google" />
 * <SocialLoginButton provider="kakao" />
 * ```
 */
export function SocialLoginButton({
  className,
  label,
  provider,
  ...props
}: SocialLoginButtonProps) {
  const isKakao = provider === 'kakao';

  return (
    <ButtonPrimitive
      aria-label={label ?? providerLabels[provider]}
      className={cn(
        'inline-flex size-social-button shrink-0 cursor-pointer items-center justify-center rounded-full border-(length:--td-border-width-sm) p-0 outline-none select-none focus-visible:ring-2 focus-visible:ring-border-active focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-default',
        isKakao ? 'border-brand-kakao bg-brand-kakao' : 'border-border-default bg-surface-default',
        className,
      )}
      data-provider={provider}
      data-slot="social-login-button"
      {...props}
    >
      <Image
        alt=""
        aria-hidden
        className={
          isKakao ? 'h-[34px] w-[36px] object-contain' : 'h-[40.96px] w-social-logo object-contain'
        }
        height={isKakao ? 306 : 256}
        loading="eager"
        src={isKakao ? '/images/social/kakao.png' : '/images/social/google.png'}
        width={isKakao ? 330 : 250}
      />
    </ButtonPrimitive>
  );
}
