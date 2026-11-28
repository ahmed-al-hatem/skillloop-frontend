import { useEffect, useRef, useState } from 'react';

const TICK_MS = 1000;

/**
 * Milliseconds left until `dueAt` (never below 0), updated every second; `null` without a date.
 * `onExpire` runs once when it reaches 0 while mounted (e.g. refetch so `canResolve` updates).
 */
export function useCountdown(dueAt: string | undefined, onExpire?: () => void): number | null {
  const [now, setNow] = useState(() => Date.now());
  const due = dueAt === undefined ? null : Date.parse(dueAt);
  const remaining = due === null ? null : Math.max(0, due - now);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  });

  useEffect(() => {
    if (due === null || due <= Date.now()) return;
    const id = window.setInterval(() => {
      const current = Date.now();
      setNow(current);
      if (current >= due) {
        window.clearInterval(id);
        onExpireRef.current?.();
      }
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [due]);

  return remaining;
}

/** `HH:MM:SS` for a countdown (hours may go past 24). */
export function formatCountdown(ms: number): string {
  const total = Math.floor(ms / 1000);
  const parts = [Math.floor(total / 3600), Math.floor((total % 3600) / 60), total % 60];
  return parts.map((part) => String(part).padStart(2, '0')).join(':');
}
