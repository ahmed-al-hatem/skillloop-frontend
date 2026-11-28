import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { DataTable, type DataTableColumn } from '@/shared/components/DataTable';
import { Button } from '@/shared/components/ui/Button';
import { PointsAmount } from '@/shared/components/ui/PointsAmount';
import { StatusBadge } from '@/shared/components/ui/StatusBadge';
import { ROUTES } from '@/shared/constants/routes';
import { hiddenServiceBadge, serviceStatusBadge } from '../constants';
import type { Service } from '../schemas/service.schema';

export type ServicesTableProps = {
  data: Service[] | undefined;
  isLoading: boolean;
  isFiltered: boolean;
  onClearFilters: () => void;
  /** Opens the archive dialog. Archived services have no action. */
  onArchive: (service: Service) => void;
  footer?: ReactNode;
};

/** «Other» services show the provider's own category name. */
const categoryName = (s: Service) =>
  s.category.isOther && s.customCategoryName ? s.customCategoryName : s.category.nameAr;

function ServiceStatusBadge({ service }: { service: Service }) {
  // 🟡 `isHidden`: an active service of a suspended provider is not shown in the market.
  const hidden = service.isHidden && service.status === 'ACTIVE';
  const badge = hidden ? hiddenServiceBadge : serviceStatusBadge[service.status];
  return <StatusBadge variant={badge.variant}>{badge.label}</StatusBadge>;
}

function buildColumns(
  showBookings: boolean,
  onArchive: (service: Service) => void,
): DataTableColumn<Service>[] {
  return [
    {
      id: 'title',
      header: 'الخدمة',
      cell: (s) => <span className="font-semibold">{s.title}</span>,
    },
    {
      id: 'provider',
      header: 'مقدم الخدمة',
      cell: (s) => (
        <Link
          to={ROUTES.admin.member(s.provider.id)}
          className="whitespace-nowrap text-primary hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          {s.provider.fullName}
        </Link>
      ),
    },
    {
      id: 'category',
      header: 'التصنيف',
      cell: (s) => (
        <span className="whitespace-nowrap text-muted-foreground">{categoryName(s)}</span>
      ),
    },
    {
      id: 'price',
      header: 'السعر',
      cell: (s) => <PointsAmount value={s.pricePoints} className="font-semibold" />,
    },
    // 🟡 `bookingsCount` is not in the contract yet: the column shows only when the API sends it.
    ...(showBookings
      ? [
          {
            id: 'bookings',
            header: 'الحجوزات',
            cell: (s: Service) => (
              <bdi dir="ltr" className="font-latin">
                {s.bookingsCount ?? '—'}
              </bdi>
            ),
          },
        ]
      : []),
    {
      id: 'status',
      header: 'الحالة',
      cell: (s) => <ServiceStatusBadge service={s} />,
    },
    {
      id: 'actions',
      header: 'إجراءات',
      headerHidden: true,
      align: 'end',
      cell: (s) =>
        s.status !== 'ARCHIVED' && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onArchive(s)}
            aria-label={`أرشفة «${s.title}»`}
            className="h-9 border-danger/40 font-semibold text-danger hover:bg-danger-muted hover:text-danger"
          >
            أرشفة
          </Button>
        ),
    },
  ];
}

/** Services list. Loading / empty / filtered-empty states come from `DataTable`. */
export function ServicesTable({
  data,
  isLoading,
  isFiltered,
  onClearFilters,
  onArchive,
  footer,
}: ServicesTableProps) {
  const showBookings = Boolean(data?.some((s) => s.bookingsCount !== undefined));
  return (
    <DataTable
      label="الخدمات"
      columns={buildColumns(showBookings, onArchive)}
      data={data}
      getRowId={(s) => s.id}
      isLoading={isLoading}
      emptyTitle="لا توجد خدمات بعد."
      emptyDescription="ستظهر هنا الخدمات التي ينشرها الأعضاء."
      isFiltered={isFiltered}
      onClearFilters={onClearFilters}
      footer={footer}
    />
  );
}
