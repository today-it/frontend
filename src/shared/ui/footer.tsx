import type { HTMLAttributes } from 'react';

import { cn } from '@/shared/lib';

import { Logo } from './logo';
import { TextLink } from './text-link';

export interface FooterProps extends HTMLAttributes<HTMLElement> {
  termsHref: string;
  privacyHref: string;
  contactHref: string;
}

/** 사이트 하단의 브랜드 안내, 정책 링크와 저작권 문구입니다. */
export function Footer({ className, termsHref, privacyHref, contactHref, ...props }: FooterProps) {
  return (
    <footer
      className={cn(
        'flex w-full flex-col gap-32 border-t border-border-default bg-surface-brand-subtle px-24 py-48 xl:px-[240px]',
        className,
      )}
      data-slot="footer"
      {...props}
    >
      <div className="flex flex-col items-start justify-between gap-24 md:flex-row md:items-center">
        <div className="flex min-w-0 flex-col gap-8">
          <Logo />
          <p className="text-body-b3 text-text-secondary">오늘을 특별하게 만드는 우리다운 선택</p>
        </div>
        <nav aria-label="서비스 안내" className="flex flex-wrap gap-24">
          <TextLink href={termsHref}>이용약관</TextLink>
          <TextLink href={privacyHref}>개인정보처리방침</TextLink>
          <TextLink href={contactHref}>문의하기</TextLink>
        </nav>
      </div>
      <p className="text-caption-c2 text-text-tertiary">© 2026 ToDayIt. All rights reserved.</p>
    </footer>
  );
}
