import { PointsAmount } from '@/shared/components/ui/PointsAmount';
import { cn } from '@/shared/lib/cn';
import { previewSplit } from '../lib/resolvePreview';
import type { AdminDispute } from '../schemas/dispute.schema';

export type ResolvePreviewProps = {
  dispute: AdminDispute;
  /** Receiver's share for the picked decision, or `undefined` before one is picked. */
  receiverPercent: number | undefined;
};

/** Who gets how many of the held points. A preview only: the backend's response is the truth. */
export function ResolvePreview({ dispute, receiverPercent }: ResolvePreviewProps) {
  const split =
    receiverPercent === undefined
      ? undefined
      : previewSplit(dispute.booking.pricePoints, receiverPercent);

  return (
    <div aria-live="polite" className="flex flex-col gap-3 rounded-xl bg-background p-4">
      <p className="text-xs text-muted-foreground">
        معاينة تقريبية · الأرقام النهائية يحسبها النظام عند الحل
      </p>
      {split ? (
        <>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(13.75rem,1fr))] gap-3">
            <PreviewAmount
              label={`المستلم (${dispute.receiver.fullName}) يحصل على`}
              points={split.receiver}
              className="text-info"
            />
            <PreviewAmount
              label={`مقدم الخدمة (${dispute.provider.fullName}) يحصل على`}
              points={split.provider}
              className="text-accent-foreground"
            />
          </div>
          {/* Receiver's share from the start side; SVG attributes, so no inline style. */}
          <svg
            aria-hidden="true"
            className="h-2.5 w-full overflow-hidden rounded-full rtl:-scale-x-100"
          >
            <rect width="100%" height="100%" className="fill-primary" />
            <rect width={`${receiverPercent}%`} height="100%" className="fill-info" />
          </svg>
        </>
      ) : (
        <p className="text-sm text-muted-foreground">اختر القرار لعرض توزيع النقاط.</p>
      )}
    </div>
  );
}

type PreviewAmountProps = { label: string; points: number; className: string };

function PreviewAmount({ label, points, className }: PreviewAmountProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-muted-foreground">{label}</span>
      <PointsAmount
        value={points}
        size="md"
        className={cn('text-[1.625rem] font-bold', className)}
      />
    </div>
  );
}
