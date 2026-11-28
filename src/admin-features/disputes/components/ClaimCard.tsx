import { RelativeTime } from '@/shared/components/ui/RelativeTime';
import type { AdminDispute } from '../schemas/dispute.schema';
import { EvidenceGallery } from './EvidenceGallery';
import { PartyHeading } from './PartyHeading';

export type ClaimCardProps = { dispute: AdminDispute };

/** The receiver's claim and images. */
export function ClaimCard({ dispute }: ClaimCardProps) {
  return (
    <section
      aria-labelledby="claim-title"
      className="flex min-w-0 flex-col gap-3.5 rounded-xl border bg-surface p-5"
    >
      <PartyHeading
        titleId="claim-title"
        title="ادعاء المستلم"
        person={dispute.receiver}
        role="receiver"
        meta={<RelativeTime value={dispute.createdAt} />}
      />
      <p className="text-sm leading-[1.9] whitespace-pre-line">{dispute.description}</p>
      <EvidenceGallery images={dispute.receiverImages} owner="المستلم" />
    </section>
  );
}
