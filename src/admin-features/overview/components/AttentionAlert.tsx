import { useState } from 'react';
import { Link } from 'react-router';
import { ROUTES } from '@/shared/constants/routes';
import { formatNumber, formatRelative } from '@/shared/lib/format';
import type { AdminDashboard } from '../schemas/dashboard.schema';

const iconProps = {
  'aria-hidden': true,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

export type AttentionAlertProps = { data: AdminDashboard };

/**
 * "يحتاج انتباه": shown when the backend raises `alerts.disputes` (🟡, it owns the thresholds).
 * The other flags colour their stat cards instead. The admin can dismiss it.
 */
export function AttentionAlert({ data }: AttentionAlertProps) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed || !data.alerts?.disputes) return null;
  const over48h = data.openDisputesOver48h;

  return (
    <section
      aria-label="يحتاج انتباه"
      role="status"
      className="flex items-start gap-3 rounded-xl border border-warning/40 bg-warning-muted p-3.5"
    >
      <svg {...iconProps} className="mt-0.5 size-5 flex-none text-warning">
        <path d="M12 3 2 20h20L12 3zM12 10v4M12 17h.01" />
      </svg>
      <div className="flex min-w-0 flex-1 flex-col gap-1 text-sm">
        <strong className="text-warning">يحتاج انتباه</strong>
        <p>
          {over48h !== undefined ? (
            <>
              <span dir="ltr">{formatNumber(over48h)}</span> نزاعات تجاوزت 48 ساعة
            </>
          ) : (
            'النزاعات المفتوحة تحتاج مراجعة'
          )}
          {data.oldestOpenDisputeAt && <> · الأقدم {formatRelative(data.oldestOpenDisputeAt)}</>}
        </p>
        <Link
          to={ROUTES.admin.disputes}
          className="self-start text-[13px] font-semibold text-primary hover:underline"
        >
          عرض النزاعات
        </Link>
      </div>
      <button
        type="button"
        aria-label="إغلاق التنبيه"
        onClick={() => setDismissed(true)}
        className="-m-1.5 flex size-11 flex-none items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <svg {...iconProps} className="size-4">
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      </button>
    </section>
  );
}
