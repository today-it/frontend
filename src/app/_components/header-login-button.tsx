'use client';

import { useLoginModalStore } from '@/app/_model/login-modal-store';

/**
 * 헤더의 로그인 버튼 컴포넌트입니다.
 */
export function HeaderLoginButton() {
  const openLogin = useLoginModalStore((state) => state.openLogin);

  return (
    <button
      aria-haspopup="dialog"
      className="inline-flex cursor-pointer items-start text-body-b2 whitespace-nowrap [color:var(--td-color-text-primary)] outline-none focus-visible:ring-2 focus-visible:ring-border-active focus-visible:ring-offset-2"
      onClick={openLogin}
      type="button"
    >
      로그인
    </button>
  );
}
