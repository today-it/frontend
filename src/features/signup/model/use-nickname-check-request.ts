import { useEffect, useRef } from 'react';

import { isValidNickname } from './signup-profile';

const NICKNAME_CHECK_DELAY_MS = 600;

/** 닉네임 입력이 멈추면 검사를 요청합니다. 클라이언트 검증을 통과한 닉네임만 요청합니다. */
export function useNicknameCheckRequest(nickname: string, onCheck?: (nickname: string) => void) {
  const onCheckRef = useRef(onCheck);

  useEffect(() => {
    onCheckRef.current = onCheck;
  });

  useEffect(() => {
    if (nickname.trim() === '' || !isValidNickname(nickname)) {
      return;
    }

    const timeoutId = setTimeout(() => {
      onCheckRef.current?.(nickname.trim());
    }, NICKNAME_CHECK_DELAY_MS);

    return () => clearTimeout(timeoutId);
  }, [nickname]);
}
