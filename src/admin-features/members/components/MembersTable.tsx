import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { DataTable, type DataTableColumn } from '@/shared/components/DataTable';
import { Avatar } from '@/shared/components/ui/Avatar';
import { Ltr } from '@/shared/components/ui/Ltr';
import { PointsAmount } from '@/shared/components/ui/PointsAmount';
import { StatusBadge } from '@/shared/components/ui/StatusBadge';
import { ROUTES } from '@/shared/constants/routes';
import { formatDate, formatPoints } from '@/shared/lib/format';
import { memberStatusBadge } from '../constants';
import type { AdminUserListItem } from '../schemas/member.schema';

export type MembersTableProps = {
  data: AdminUserListItem[] | undefined;
  isLoading: boolean;
  isFiltered: boolean;
  onClearFilters: () => void;
  footer?: ReactNode;
};

const none = <span className="text-muted-foreground">—</span>;

const columns: DataTableColumn<AdminUserListItem>[] = [
  {
    id: 'member',
    header: 'العضو',
    cell: (m) => (
      <div className="flex min-w-0 items-center gap-2.5">
        <Avatar name={m.fullName} src={m.photoUrl} decorative />
        <div className="flex min-w-0 flex-col">
          <span className="truncate font-semibold">{m.fullName}</span>
          <Ltr className="truncate text-start text-xs font-normal text-muted-foreground">
            {m.email}
          </Ltr>
        </div>
      </div>
    ),
  },
  {
    id: 'phone',
    header: 'الهاتف',
    cell: (m) => (m.phone ? <Ltr className="text-[13px] whitespace-nowrap">{m.phone}</Ltr> : none),
  },
  {
    id: 'status',
    header: 'الحالة',
    cell: (m) => (
      <StatusBadge variant={memberStatusBadge[m.status].variant}>
        {memberStatusBadge[m.status].label}
      </StatusBadge>
    ),
  },
  {
    id: 'balance',
    header: 'الرصيد (متاح / محجوز)',
    cell: (m) => (
      <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
        <PointsAmount value={m.pointsAvailable} className="font-semibold" />
        <span className="text-muted-foreground" aria-hidden="true">
          /
        </span>
        <span className="sr-only">، المحجوز</span>
        <Ltr className="text-[13px] text-muted-foreground tabular-nums">
          {formatPoints(m.pointsHeld)}
        </Ltr>
      </span>
    ),
  },
  {
    id: 'rating',
    header: 'التقييم',
    cell: (m) =>
      m.ratingCount === 0 ? (
        none
      ) : (
        <Ltr className="text-[13px] font-semibold tabular-nums">{m.ratingAvg.toFixed(1)}</Ltr>
      ),
  },
  {
    id: 'joined',
    header: 'انضم',
    cell: (m) => (
      <span className="text-[13px] whitespace-nowrap text-muted-foreground">
        {formatDate(m.createdAt)}
      </span>
    ),
  },
  {
    id: 'action',
    header: 'إجراء',
    headerHidden: true,
    align: 'end',
    cell: (m) => (
      <Link
        to={ROUTES.admin.member(m.id)}
        aria-label={`عرض ${m.fullName}`}
        className="inline-flex h-9 items-center rounded-lg border border-input px-3.5 text-[13px] font-semibold text-foreground hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none pointer-coarse:h-11"
      >
        عرض
      </Link>
    ),
  },
];

/** Members list. Loading / empty / filtered-empty states come from `DataTable`. */
export function MembersTable({
  data,
  isLoading,
  isFiltered,
  onClearFilters,
  footer,
}: MembersTableProps) {
  return (
    <DataTable
      label="قائمة الأعضاء"
      columns={columns}
      data={data}
      getRowId={(m) => m.id}
      getRowHref={(m) => ROUTES.admin.member(m.id)}
      isLoading={isLoading}
      emptyTitle="لا يوجد أعضاء بعد."
      emptyDescription="سيظهر الأعضاء هنا عند تسجيلهم."
      isFiltered={isFiltered}
      filteredTitle="لا يوجد أعضاء يطابقون البحث"
      filteredDescription="جرّب كلمة أخرى أو امسح الفلاتر."
      onClearFilters={onClearFilters}
      footer={footer}
    />
  );
}
