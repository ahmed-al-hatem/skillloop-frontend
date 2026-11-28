import { Link } from 'react-router';
import { Ltr } from '@/shared/components/ui/Ltr';
import { PointsAmount } from '@/shared/components/ui/PointsAmount';
import { RelativeTime } from '@/shared/components/ui/RelativeTime';
import { StatusBadge } from '@/shared/components/ui/StatusBadge';
import { ROUTES } from '@/shared/constants/routes';
import {
  DISPUTE_REASON_LABELS,
  DISPUTE_STATUS_LABELS,
  DISPUTE_STATUS_VARIANTS,
} from '../constants';
import { formatEntityRef } from '../lib/entityRef';
import type { AdminDispute } from '../schemas/dispute.schema';

export type DisputeHeaderProps = { dispute: AdminDispute };

/** Back link, service title, status, references and the booking's points. */
export function DisputeHeader({ dispute }: DisputeHeaderProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex min-w-0 flex-col gap-2">
        <Link
          to={ROUTES.admin.disputes}
          className="inline-flex w-fit items-center gap-1.5 rounded-sm text-[13px] font-semibold text-primary hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          {/* Points "back" in LTR; `rtl:-scale-x-100` mirrors it for Arabic. */}
          <svg
            aria-hidden="true"
            className="size-4 rtl:-scale-x-100"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 6-6 6 6 6" />
          </svg>
          العودة إلى النزاعات
        </Link>
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="text-2xl font-bold">{dispute.booking.serviceTitle}</h1>
          <StatusBadge variant={DISPUTE_STATUS_VARIANTS[dispute.status]}>
            {DISPUTE_STATUS_LABELS[dispute.status]}
          </StatusBadge>
        </div>
        <p className="text-[13px] text-muted-foreground">
          النزاع <Ltr className="font-semibold">{formatEntityRef(dispute)}</Ltr>
          {' · '}فُتح <RelativeTime value={dispute.createdAt} />
          {' · '}الحجز <Ltr>{formatEntityRef({ id: dispute.bookingId })}</Ltr>
          {' · '}السبب: {DISPUTE_REASON_LABELS[dispute.reason]}
        </p>
      </div>
      <div className="flex items-center gap-2.5 rounded-xl border bg-surface px-4 py-2.5">
        <span className="text-[13px] text-muted-foreground">
          {dispute.status === 'OPEN' ? 'النقاط المحجوزة' : 'نقاط الحجز'}
        </span>
        <PointsAmount
          value={dispute.booking.pricePoints}
          size="md"
          className="text-[22px] font-bold"
        />
      </div>
    </header>
  );
}
