import type { ReactNode } from 'react';
import { Link } from 'react-router';
import pointsIconUrl from '@/shared/assets/brand/points.svg';
import { StatCard, type StatCardTone } from '@/shared/components/StatCard';
import { PointsAmount } from '@/shared/components/ui/PointsAmount';
import { ROUTES } from '@/shared/constants/routes';
import { formatNumber, formatPercent } from '@/shared/lib/format';
import type { AdminDashboard } from '../schemas/dashboard.schema';

type Stat = {
  id: string;
  label: string;
  value: number | string;
  to: string;
  sub?: ReactNode;
  tone?: StatCardTone;
  points?: boolean;
};

const pointsIcon = <img src={pointsIconUrl} alt="نقطة" />;
const gridClass = 'grid grid-cols-[repeat(auto-fit,minmax(min(100%,18rem),1fr))] gap-4';

/** Every number comes from the backend as is. 🟡 fields (not in the contract yet) show only when sent. */
function buildStats(data: AdminDashboard): Stat[] {
  const { alerts } = data;
  const stats: (Stat | false)[] = [
    {
      id: 'active',
      label: 'الأعضاء النشطون (30 يوم)',
      value: data.activeMembers30d,
      sub: 'آخر 30 يوماً',
      to: ROUTES.admin.members,
    },
    data.completionRate !== undefined && {
      id: 'completion',
      label: 'نسبة الإتمام',
      value: formatPercent(data.completionRate),
      sub: alerts?.lowCompletion ? 'تحت الحد الأدنى' : undefined,
      tone: alerts?.lowCompletion ? 'danger' : undefined,
      to: ROUTES.admin.bookings,
    },
    data.newBookings7d !== undefined && {
      id: 'new',
      label: 'الحجوزات الجديدة',
      value: data.newBookings7d,
      sub: 'آخر 7 أيام',
      to: ROUTES.admin.bookings,
    },
    {
      id: 'circulation',
      label: 'النقاط المتداولة',
      value: data.pointsInCirculation,
      points: true,
      sub: data.pointsHeldTotal !== undefined && (
        <span className="inline-flex items-center gap-1">
          منها <PointsAmount value={data.pointsHeldTotal} /> محجوزة
        </span>
      ),
      tone: alerts?.highHeldRatio ? 'warn' : undefined,
      to: ROUTES.admin.bookings,
    },
    {
      id: 'per-member',
      label: 'نقاط لكل عضو نشط',
      value: formatNumber(data.pointsPerActiveMember),
      points: true,
      sub: alerts?.inflation ? 'أعلى من حد التضخم' : 'مؤشر التضخم',
      tone: alerts?.inflation ? 'danger' : undefined,
      to: ROUTES.admin.members,
    },
    {
      id: 'disputes',
      label: 'النزاعات المفتوحة',
      value: data.openDisputes,
      sub: data.openDisputesOver48h !== undefined && (
        <>
          <span dir="ltr">{formatNumber(data.openDisputesOver48h)}</span> تجاوزت 48 ساعة
        </>
      ),
      tone: alerts?.disputes ? 'danger' : data.openDisputesOver48h ? 'warn' : 'ok',
      to: ROUTES.admin.disputes,
    },
  ];
  return stats.filter((stat): stat is Stat => stat !== false);
}

export type OverviewStatsProps = {
  data: AdminDashboard | undefined;
  isLoading: boolean;
};

/** The metric tiles. Each one links to the list behind the number. */
export function OverviewStats({ data, isLoading }: OverviewStatsProps) {
  if (isLoading || !data) {
    return (
      <div aria-busy="true" aria-label="جارٍ تحميل المؤشرات" className={gridClass}>
        {['a', 'b', 'c', 'd', 'e', 'f'].map((key) => (
          <StatCard key={key} label="" value="" sub="" isLoading />
        ))}
      </div>
    );
  }

  return (
    <section aria-label="المؤشرات" className={gridClass}>
      {buildStats(data).map(({ id, to, points, sub, ...stat }) => (
        <Link
          key={id}
          to={to}
          className="rounded-xl transition-transform duration-micro hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <StatCard
            {...stat}
            sub={sub || undefined}
            icon={points ? pointsIcon : undefined}
            className="h-full hover:border-border"
          />
        </Link>
      ))}
    </section>
  );
}
