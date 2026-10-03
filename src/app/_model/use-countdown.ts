import { useCallback, useEffect, useState } from 'react';

/**
 * 만료 시각을 기준으로 줄어드는 카운트다운입니다. `start`를 호출하면 처음부터 다시 시작합니다.
 *
 * 비활성 탭이나 실행 지연으로 타이머가 늦게 실행돼도, 매번 현재 시각과 만료 시각의 차이로
 * 남은 시간을 계산하므로 시간이 밀리지 않습니다.
 *
 * @param initialSeconds 시작할 남은 시간(초)
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

  return { secondsLeft, isExpired: expiresAt !== null && secondsLeft <= 0, start };
}
