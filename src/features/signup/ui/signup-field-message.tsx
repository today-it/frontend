import { type ReactNode } from 'react';

import { cn } from '@/shared/lib';

interface SignupFieldMessageProps {
  children: ReactNode;
  className?: string;
  id?: string;
  /** 오류는 즉시 읽히도록 `alert`, 성공은 `status`로 전달합니다. 기본값은 `error`입니다. */
  tone?: 'error' | 'success';
}

/** 회원가입 입력창 아래에 표시하는 오류·성공 문구입니다. */
export function SignupFieldMessage({
  children,
  className,
  id,
  tone = 'error',
}: SignupFieldMessageProps) {
  return (
    <p
      className={cn(
        'text-caption-c1',
        tone === 'error'
          ? '[color:var(--td-color-text-error)]'
          : '[color:var(--td-color-text-success)]',
        className,
      )}
      id={id}
      role={tone === 'error' ? 'alert' : 'status'}
    >
      {children}
    </p>
  );
}
