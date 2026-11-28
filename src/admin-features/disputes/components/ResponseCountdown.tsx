import { useQueryClient } from '@tanstack/react-query';
import { disputeKeys } from '../api/disputes.keys';
import { formatCountdown, useCountdown } from '../hooks/useCountdown';

export type ResponseCountdownProps = {
  disputeId: string;
  /** When the dispute was opened: the start of the reply window. */
  openedAt: string;
  /** The 🟡 `providerResponseDueAt` of an open dispute with no reply yet. */
  dueAt: string;
};

/**
 * Live time left in the provider's reply window, from the backend's due date (never guessed).
 * At zero it refetches the dispute, so the backend's `canResolve` unlocks the resolve button.
 */
export function ResponseCountdown({ disputeId, openedAt, dueAt }: ResponseCountdownProps) {
  const queryClient = useQueryClient();
  const remaining = useCountdown(dueAt, () => {
    void queryClient.invalidateQueries({ queryKey: disputeKeys.detail(disputeId) });
  });
  if (remaining === null || remaining === 0) return null;

  const windowMs = Date.parse(dueAt) - Date.parse(openedAt);
  const share = windowMs > 0 ? Math.min(100, (remaining / windowMs) * 100) : 0;

  return (
    <>
      <p
        role="timer"
        aria-label="الوقت المتبقي لرد مقدم الخدمة"
        dir="ltr"
        className="font-latin text-4xl leading-none font-bold tracking-wider tabular-nums"
      >
        {formatCountdown(remaining)}
      </p>
      {/* Remaining share of the window; SVG attributes, so no inline style. */}
      <svg
        aria-hidden="true"
        className="h-1.5 w-full max-w-70 overflow-hidden rounded-full rtl:-scale-x-100"
      >
        <rect width="100%" height="100%" className="fill-muted" />
        <rect width={`${share.toFixed(2)}%`} height="100%" className="fill-warning" />
      </svg>
      <p className="text-xs text-muted-foreground">
        متبقٍ من مهلة 48 ساعة. يُفعَّل زر الحل عند الرد أو انتهاء المهلة.
      </p>
    </>
  );
}
