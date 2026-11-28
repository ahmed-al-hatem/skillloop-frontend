import { RelativeTime } from '@/shared/components/ui/RelativeTime';
import { cn } from '@/shared/lib/cn';
import { getResponseState } from '../lib/responseState';
import type { AdminDispute } from '../schemas/dispute.schema';
import { EvidenceGallery } from './EvidenceGallery';
import { PartyHeading } from './PartyHeading';

export type ProviderReplyCardProps = {
  dispute: AdminDispute;
  /** When the dispute was fetched (ms). */
  now: number;
};

/** The provider's reply and images, or where the 48 h reply window stands. */
export function ProviderReplyCard({ dispute, now }: ProviderReplyCardProps) {
  const respondedAt = dispute.providerRespondedAt;

  return (
    <section
      aria-labelledby="reply-title"
      className="flex min-w-0 flex-col gap-3.5 rounded-xl border bg-surface p-5"
    >
      <PartyHeading
        titleId="reply-title"
        title="رد مقدم الخدمة"
        person={dispute.provider}
        role="provider"
        meta={respondedAt ? <RelativeTime value={respondedAt} /> : 'بانتظار الرد'}
      />
      {respondedAt ? (
        <>
          <p className="text-sm leading-[1.9] whitespace-pre-line">{dispute.providerResponse}</p>
          <EvidenceGallery images={dispute.providerImages} owner="مقدم الخدمة" />
        </>
      ) : (
        <NoReply dispute={dispute} now={now} />
      )}
    </section>
  );
}

/** Dashed box instead of the reply. The due date is shown only when the backend sends it (🟡). */
function NoReply({ dispute, now }: ProviderReplyCardProps) {
  const isOpen = dispute.status === 'OPEN';
  const due = dispute.providerResponseDueAt;
  const isOverdue = getResponseState(dispute, now) === 'overdue';

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-xl border-[1.5px] border-dashed bg-muted/40 p-6 text-center">
      <p className="text-sm font-semibold text-muted-foreground">
        {isOpen ? 'لم يرد بعد' : 'لم يرد مقدم الخدمة'}
      </p>
      {/* Plan 3.6 adds the live countdown and the resolve lock here. */}
      {isOpen && due && (
        <p
          className={cn(
            'text-xs',
            isOverdue ? 'font-semibold text-danger' : 'text-muted-foreground',
          )}
        >
          {isOverdue ? 'انتهت مهلة الرد' : 'تنتهي مهلة الرد'} <RelativeTime value={due} />
        </p>
      )}
    </div>
  );
}
