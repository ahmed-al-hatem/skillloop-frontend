import { PointsAmount } from '@/shared/components/ui/PointsAmount';
import { formatNumber } from '@/shared/lib/format';
import type { AdminUserDetails } from '../schemas/member.schema';

export type WalletCardProps = { member: AdminUserDetails };

/** Available / held points and the member's counters, all as the backend sends them. */
export function WalletCard({ member }: WalletCardProps) {
  const balances = [
    { label: 'متاح', value: member.pointsAvailable },
    { label: 'محجوز', value: member.pointsHeld },
  ];
  const stats = [
    { label: 'التقييم', value: member.ratingAvg.toFixed(1), extra: member.ratingCount },
    { label: 'حجوزات مكتملة', value: formatNumber(member.completedBookingsCount) },
    { label: 'خدمات نشطة', value: formatNumber(member.activeServicesCount) },
  ];

  return (
    <section
      aria-labelledby="wallet-title"
      className="flex flex-col gap-4 rounded-2xl border bg-surface p-5"
    >
      <h2 id="wallet-title" className="text-base font-bold">
        المحفظة
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {balances.map((b) => (
          <div key={b.label} className="flex flex-col gap-1.5 rounded-xl bg-muted p-3.5">
            <span className="text-xs text-muted-foreground">{b.label}</span>
            <PointsAmount value={b.value} size="md" className="text-[22px] font-bold" />
          </div>
        ))}
      </div>
      <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] text-muted-foreground">
        {stats.map((s) => (
          <li key={s.label}>
            {s.label}{' '}
            <bdi dir="ltr" className="font-latin font-semibold text-foreground tabular-nums">
              {s.value}
            </bdi>
            {s.extra !== undefined && (
              <>
                {' '}
                (<bdi className="font-latin tabular-nums">{formatNumber(s.extra)}</bdi>)
              </>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
