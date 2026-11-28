import {
  BOOKING_STATUS_LABELS,
  BOOKING_STATUS_VARIANTS,
  useBookings,
} from '@/admin-features/bookings';
import { serviceStatusBadge, useServices } from '@/admin-features/services';
import { Ltr } from '@/shared/components/ui/Ltr';
import { PointsAmount } from '@/shared/components/ui/PointsAmount';
import { StatusBadge } from '@/shared/components/ui/StatusBadge';
import { Tabs, type TabItem } from '@/shared/components/ui/Tabs';
import { ROUTES } from '@/shared/constants/routes';
import { useTabParam } from '@/shared/hooks/useTabParam';
import { ActivityList } from './ActivityList';
import { ActivityRow } from './ActivityRow';

const TABS = ['bookings', 'services'] as const;
type Tab = (typeof TABS)[number] | 'reviews';
const PAGE = { page: 1, pageSize: 10 };

export type MemberActivityTabsProps = { memberId: string };

/** `?tab=bookings|services`: the member's bookings (either side) and their services. */
export function MemberActivityTabs({ memberId }: MemberActivityTabsProps) {
  const [tab, setTab] = useTabParam(TABS);
  const bookings = useBookings({ ...PAGE, userId: memberId });
  const services = useServices({ ...PAGE, q: '', providerId: memberId });

  const items: TabItem<Tab>[] = [
    { value: 'bookings', label: 'الحجوزات', count: bookings.data?.meta.total },
    { value: 'services', label: 'الخدمات', count: services.data?.meta.total },
    // P2: reviews moderation is not in the contract yet.
    { value: 'reviews', label: 'التقييمات · لاحقاً', disabled: true },
  ];

  const bookingRows = (bookings.data?.data ?? []).map((b) => {
    const other = b.receiver.id === memberId ? b.provider : b.receiver;
    return (
      <ActivityRow
        key={b.id}
        to={ROUTES.admin.booking(b.id)}
        badge={
          <StatusBadge variant={BOOKING_STATUS_VARIANTS[b.status]}>
            {BOOKING_STATUS_LABELS[b.status]}
          </StatusBadge>
        }
      >
        {b.code && (
          <>
            <Ltr className="font-semibold">#{b.code}</Ltr>
            {' · '}
          </>
        )}
        <bdi>{b.serviceTitle}</bdi> · مع <bdi>{other.fullName}</bdi>
      </ActivityRow>
    );
  });

  const serviceRows = (services.data?.data ?? []).map((s) => {
    const status = serviceStatusBadge[s.status];
    return (
      <ActivityRow
        key={s.id}
        to={`${ROUTES.admin.services}?q=${encodeURIComponent(s.title)}`}
        badge={<StatusBadge variant={status.variant}>{status.label}</StatusBadge>}
      >
        <bdi>{s.title}</bdi> · <PointsAmount value={s.pricePoints} />
      </ActivityRow>
    );
  });

  const hasMore = (q: typeof bookings | typeof services) =>
    (q.data?.meta.total ?? 0) > (q.data?.data.length ?? 0);

  return (
    <section aria-label="نشاط العضو" className="rounded-2xl border bg-surface px-5 pb-5">
      <Tabs
        items={items}
        label="نشاط العضو"
        value={tab}
        onValueChange={(v) => v !== 'reviews' && setTab(v)}
      >
        {tab === 'bookings' ? (
          <ActivityList
            query={bookings}
            rows={bookingRows}
            emptyTitle="لا توجد حجوزات لهذا العضو"
            viewAll={
              hasMore(bookings)
                ? { to: `${ROUTES.admin.bookings}?userId=${memberId}`, label: 'عرض كل الحجوزات' }
                : undefined
            }
          />
        ) : (
          <ActivityList
            query={services}
            rows={serviceRows}
            emptyTitle="لا توجد خدمات لهذا العضو"
            viewAll={
              hasMore(services)
                ? { to: `${ROUTES.admin.services}?providerId=${memberId}`, label: 'عرض كل الخدمات' }
                : undefined
            }
          />
        )}
      </Tabs>
    </section>
  );
}
