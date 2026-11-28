import type { AdminDispute } from '../schemas/dispute.schema';
import { ClaimCard } from './ClaimCard';
import { DisputeHeader } from './DisputeHeader';
import { ProviderReplyCard } from './ProviderReplyCard';

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
      {/* Plan 3.6: the resolve form (open) or the resolved view (resolved) goes here. */}
    </>
  );
}
