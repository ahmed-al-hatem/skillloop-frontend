import { isResolveLocked } from '../lib/responseState';
import type { AdminDispute } from '../schemas/dispute.schema';
import { BookingSummaryCard } from './BookingSummaryCard';
import { ClaimCard } from './ClaimCard';
import { DisputeHeader } from './DisputeHeader';
import { DisputeTimelineCard } from './DisputeTimelineCard';
import { PartiesRatingsCard } from './PartiesRatingsCard';
import { ProviderReplyCard } from './ProviderReplyCard';
import { ResolveForm } from './ResolveForm';

export type DisputeDetailProps = {
  dispute: AdminDispute;
  /** When the dispute was fetched (ms): the reply window is compared against it. */
  now: number;
};

/** The loaded dispute: header, then both sides' statements and evidence. */
export function DisputeDetail({ dispute, now }: DisputeDetailProps) {
  return (
    <>
      <DisputeHeader dispute={dispute} />
      <div className="grid gap-4 lg:grid-cols-2">
        <ClaimCard dispute={dispute} />
        <ProviderReplyCard dispute={dispute} now={now} />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <BookingSummaryCard dispute={dispute} />
        <DisputeTimelineCard dispute={dispute} now={now} />
        <PartiesRatingsCard dispute={dispute} />
      </div>
      {/* The read-only resolved view follows in the next PR (plan 3.6). */}
      {dispute.status === 'OPEN' && (
        <ResolveForm dispute={dispute} locked={isResolveLocked(dispute, now)} />
      )}
    </>
  );
}
