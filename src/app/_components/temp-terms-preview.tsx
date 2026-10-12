'use client';

import { useState } from 'react';

import { SignupModal } from '@/features/signup';
import { Button } from '@/shared/ui';

/**
 * 임시 확인용 컴포넌트입니다. 헤더의 로그인 버튼이 `SignupModal`을 열게 되면 삭제합니다.
 *
 * 테스트 입력은 `createMockSignupApi`의 설명을 참고합니다.
 */
export function TempTermsPreview() {
  const [open, setOpen] = useState(true);

  return (
    <>
      <Button onClick={() => setOpen(true)} size="md">
        시작하기
      </Button>
      <SignupModal loginHref="/login" onOpenChange={setOpen} open={open} />
    </>
  );
}
