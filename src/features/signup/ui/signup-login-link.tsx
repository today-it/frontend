'use client';

import { TextLink } from '@/shared/ui';

interface SignupLoginLinkProps {
  /** 로그인 경로 */
  href: string;
  /** 로그인 모달로 전환할 때 호출합니다. */
  onLogin?: () => void;
}

/** 회원가입 모달 하단의 로그인 안내입니다. */
export function SignupLoginLink({ href, onLogin }: SignupLoginLinkProps) {
  return (
    <p className="flex items-baseline justify-center gap-8">
      <span className="text-caption-c1 [color:var(--td-color-text-tertiary)]">
        이미 계정이 있으신가요?
      </span>
      <TextLink
        href={href}
        onClick={(event) => {
          if (!onLogin) {
            return;
          }

          event.preventDefault();
          onLogin();
        }}
        prefetch={onLogin ? false : undefined}
      >
        로그인
      </TextLink>
    </p>
  );
}
