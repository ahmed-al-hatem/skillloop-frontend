import { Timeline, type TimelineEvent } from '@/shared/components/Timeline';
import { RelativeTime } from '@/shared/components/ui/RelativeTime';
import { ACTOR_ROLE_LABELS, BOOKING_EVENT_LABELS } from '../constants';
import { isPastResponseWindow } from '../lib/responseState';
import type { AdminDispute } from '../schemas/dispute.schema';

export type DisputeTimelineCardProps = {
  dispute: AdminDispute;
  /** When the dispute was fetched (ms). */
  now: number;
};

/**
 * Booking history (`events`), plus the provider's reply, which is a dispute field and not a booking
 * event. While an open dispute waits for the reply, a last row shows the 🟡 due date when sent.
 */
export function DisputeTimelineCard({ dispute, now }: DisputeTimelineCardProps) {
  const rows: (TimelineEvent & { at: string })[] = dispute.events.map((event) => {
    const known = BOOKING_EVENT_LABELS[event.action];
    return {
      id: event.id,
      at: event.createdAt,
      label: known?.label ?? event.action,
      tone: known?.tone,
      actorRole: ACTOR_ROLE_LABELS[event.actorRole],
      time: <RelativeTime value={event.createdAt} />,
    };
  });

  if (dispute.providerRespondedAt) {
    rows.push({
      id: 'provider-reply',
      at: dispute.providerRespondedAt,
      label: 'رد مقدم الخدمة',
      tone: 'primary',
      actorRole: ACTOR_ROLE_LABELS.PROVIDER,
      time: <RelativeTime value={dispute.providerRespondedAt} />,
    });
  }
  rows.sort((a, b) => a.at.localeCompare(b.at));

  const due = dispute.providerResponseDueAt;
  if (dispute.status === 'OPEN' && !dispute.providerRespondedAt && due) {
    rows.push({
      id: 'provider-reply-due',
      at: due,
      label: 'بانتظار رد مقدم الخدمة',
      tone: isPastResponseWindow(dispute, now) ? 'danger' : 'warning',
      time: (
        <>
          {isPastResponseWindow(dispute, now) ? 'انتهت المهلة' : 'تنتهي المهلة'}{' '}
          <RelativeTime value={due} />
        </>
      ),
    });
  }

  return (
    <section
      aria-labelledby="timeline-title"
      className="flex min-w-0 flex-col gap-3 rounded-xl border bg-surface p-5"
    >
      <h2 id="timeline-title" className="text-[15px] font-bold">
        الخط الزمني
      </h2>
      <Timeline events={rows} />
    </section>
  );
}
