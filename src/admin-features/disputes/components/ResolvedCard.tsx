import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { PointsAmount } from '@/shared/components/ui/PointsAmount';
import { RelativeTime } from '@/shared/components/ui/RelativeTime';
import { ROUTES } from '@/shared/constants/routes';
import { RESOLVE_DECISION_OPTIONS } from '../constants';
import { previewSplit } from '../lib/resolvePreview';
import type { AdminDispute } from '../schemas/dispute.schema';

export type ResolvedCardProps = {
  /** A RESOLVED dispute: `decision` and `receiverPercent` are the backend's final values. */
  dispute: AdminDispute;
};

/** Read-only outcome in place of the resolve form: decision, each side's points and the note. */
export function ResolvedCard({ dispute }: ResolvedCardProps) {
  const { decision, receiverPercent, resolvedAt, adminNote } = dispute;
  if (!decision || receiverPercent === null) return null;

  // The contract returns the percent, not the points: shown with the same rounding as the preview.
  const split = previewSplit(dispute.booking.pricePoints, receiverPercent);
  const decisionLabel =
    decision === 'SPLIT' ? (
      <>
        تقسيم{' '}
        <bdi dir="ltr" className="font-latin">
          {receiverPercent}% / {100 - receiverPercent}%
        </bdi>
      </>
    ) : (
      RESOLVE_DECISION_OPTIONS[decision].label
    );

  return (
    <section
      aria-labelledby="resolved-title"
      className="flex flex-col gap-4 rounded-2xl border border-success/40 bg-surface p-5 md:p-6"
    >
      <div className="flex items-center gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-lime text-brand-charcoal">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m5 12 5 5 9-10" />
          </svg>
        </span>
        <div>
          <h2 id="resolved-title" className="text-lg font-bold">
            تم حل النزاع
          </h2>
          <p className="text-sm text-muted-foreground">
            القرار نهائي وأُرسل للطرفين مع الملاحظة
            {resolvedAt && (
              <>
                {' · '}
                <RelativeTime value={resolvedAt} />
              </>
            )}
            {dispute.resolvedBy && <> · بواسطة {dispute.resolvedBy.fullName}</>}
          </p>
        </div>
      </div>

      <dl className="grid grid-cols-[repeat(auto-fit,minmax(12.5rem,1fr))] gap-3">
        <Outcome label="القرار">
          <span className="text-[15px] font-bold">{decisionLabel}</span>
        </Outcome>
        <Outcome label={`المستلم (${dispute.receiver.fullName})`}>
          <PointsAmount value={split.receiver} className="text-xl font-bold text-info" />
        </Outcome>
        <Outcome label={`مقدم الخدمة (${dispute.provider.fullName})`}>
          <PointsAmount
            value={split.provider}
            className="text-xl font-bold text-accent-foreground"
          />
        </Outcome>
      </dl>

      {adminNote && (
        <blockquote className="rounded-lg bg-background px-3.5 py-3 text-[13px] leading-[1.8] whitespace-pre-line">
          «{adminNote}»
        </blockquote>
      )}

      <Link
        to={ROUTES.admin.disputes}
        className="inline-flex h-11 items-center self-start rounded-lg bg-foreground px-4 text-sm font-bold text-background hover:bg-foreground/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        العودة إلى النزاعات
      </Link>
    </section>
  );
}

type OutcomeProps = { label: string; children: ReactNode };

function Outcome({ label, children }: OutcomeProps) {
  return (
    <div className="rounded-xl border bg-background p-3.5">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1">{children}</dd>
    </div>
  );
}
