import { useCallback, useEffect, useState } from 'react';

/**
 * 만료 시각 기준으로 줄어드는 카운트다운입니다. 매번 현재 시각과의 차이로 계산해서 탭이 비활성이어도 밀리지 않습니다.
 * `start`는 처음부터 다시 시작하고, `reset`은 멈추고 처음 상태로 돌립니다.
 */
export function useCountdown(initialSeconds: number) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);

  useEffect(() => {
    if (expiresAt === null) {
      return;
    }

    let timeoutId: number;

    const tick = () => {
      const remainingMs = expiresAt - Date.now();
      const remainingSeconds = Math.max(0, Math.ceil(remainingMs / 1000));

      setSecondsLeft(remainingSeconds);

      if (remainingSeconds > 0) {
        // 다음 초가 바뀌는 시점에 맞춰 갱신합니다.
        timeoutId = window.setTimeout(tick, remainingMs % 1000 || 1000);
      }
    };

    timeoutId = window.setTimeout(tick, (expiresAt - Date.now()) % 1000 || 1000);

    return () => window.clearTimeout(timeoutId);
  }, [expiresAt]);

  const start = useCallback(() => {
    setSecondsLeft(initialSeconds);
    setExpiresAt(Date.now() + initialSeconds * 1000);
  }, [initialSeconds]);

  const reset = useCallback(() => {
    setSecondsLeft(initialSeconds);
    setExpiresAt(null);
  }, [initialSeconds]);

  return { secondsLeft, isExpired: expiresAt !== null && secondsLeft <= 0, start, reset };
}
