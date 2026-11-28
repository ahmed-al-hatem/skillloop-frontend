import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { DataTable, type DataTableColumn } from '@/shared/components/DataTable';
import { PointsAmount } from '@/shared/components/ui/PointsAmount';
import { RelativeTime } from '@/shared/components/ui/RelativeTime';
import { StatusBadge } from '@/shared/components/ui/StatusBadge';
import { ROUTES } from '@/shared/constants/routes';
import { cn } from '@/shared/lib/cn';
import {
  DISPUTE_DECISION_LABELS,
  RESPONSE_STATE_LABELS,
  RESPONSE_STATE_VARIANTS,
} from '../constants';
import { getResponseState, isPastResponseWindow } from '../lib/responseState';
import type { AdminDispute, DisputeStatus } from '../schemas/dispute.schema';

export type DisputesTableProps = {
  status: DisputeStatus;
  data: AdminDispute[] | undefined;
  isLoading: boolean;
  /** When the list was fetched (ms): the 48 h highlight compares against it. */
  now: number;
  footer?: ReactNode;
};

const EMPTY = {
  OPEN: {
    title: 'لا توجد نزاعات مفتوحة. كل شيء تحت السيطرة.',
    description: 'ستظهر النزاعات الجديدة هنا، الأقدم أولاً.',
  },
  RESOLVED: { title: 'لا توجد نزاعات محلولة بعد.', description: undefined },
} as const satisfies Record<DisputeStatus, { title: string; description?: string }>;

/** «#D-1042» from the 🟡 `code`; the start of the id until the backend sends it. */
const disputeLabel = (d: AdminDispute) => `#${d.code ?? d.id.slice(0, 8)}`;

function buildColumns(status: DisputeStatus, now: number): DataTableColumn<AdminDispute>[] {
  const isOpen = status === 'OPEN';
  return [
    {
      id: 'code',
      header: 'النزاع',
      width: 'w-28',
      cell: (d) => (
        <bdi dir="ltr" className="font-latin font-semibold whitespace-nowrap">
          {disputeLabel(d)}
        </bdi>
      ),
    },
    {
      id: 'service',
      header: 'الخدمة',
      cell: (d) => (
        <div className="flex min-w-40 flex-col gap-0.5 max-md:min-w-0">
          <span className="font-medium">{d.booking.serviceTitle}</span>
          {d.category && <span className="text-xs text-muted-foreground">{d.category.name}</span>}
        </div>
      ),
    },
    {
      id: 'parties',
      header: 'المستلم ← مقدم الخدمة',
      cell: (d) => (
        <span>
          {d.receiver.fullName}{' '}
          <span aria-label="إلى" className="text-muted-foreground">
            ←
          </span>{' '}
          {d.provider.fullName}
        </span>
      ),
    },
    {
      id: 'points',
      header: 'النقاط المحجوزة',
      cell: (d) => <PointsAmount value={d.booking.pricePoints} className="font-semibold" />,
    },
    isOpen
      ? {
          id: 'response',
          header: 'رد مقدم الخدمة',
          cell: (d) => {
            const state = getResponseState(d, now);
            return (
              <StatusBadge variant={RESPONSE_STATE_VARIANTS[state]}>
                {RESPONSE_STATE_LABELS[state]}
              </StatusBadge>
            );
          },
        }
      : {
          id: 'decision',
          header: 'القرار',
          cell: (d) =>
            d.decision ? (
              <StatusBadge variant="success">{DISPUTE_DECISION_LABELS[d.decision]}</StatusBadge>
            ) : (
              <span className="text-muted-foreground">—</span>
            ),
        },
    isOpen
      ? {
          id: 'age',
          header: 'مفتوح منذ',
          cell: (d) => {
            const late = isPastResponseWindow(d, now);
            return (
              <span className={cn(late ? 'font-bold text-danger' : 'text-muted-foreground')}>
                <RelativeTime value={d.createdAt} />
                {late && <span className="sr-only"> · تجاوز 48 ساعة</span>}
              </span>
            );
          },
        }
      : {
          id: 'resolvedAt',
          header: 'تم الحل',
          cell: (d) =>
            d.resolvedAt ? (
              <RelativeTime value={d.resolvedAt} className="text-muted-foreground" />
            ) : (
              <span className="text-muted-foreground">—</span>
            ),
        },
    {
      id: 'action',
      header: 'إجراء',
      headerHidden: true,
      align: 'end',
      cell: (d) => (
        <Link
          to={ROUTES.admin.dispute(d.id)}
          aria-label={`${isOpen ? 'مراجعة' : 'عرض'} النزاع ${disputeLabel(d)}`}
          className="font-semibold text-primary hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          {isOpen ? 'مراجعة' : 'عرض'}
        </Link>
      ),
    },
  ];
}

/** Dispute queue for one status tab. Loading / empty states come from `DataTable`. */
export function DisputesTable({ status, data, isLoading, now, footer }: DisputesTableProps) {
  return (
    <DataTable
      label={status === 'OPEN' ? 'النزاعات المفتوحة' : 'النزاعات المحلولة'}
      columns={buildColumns(status, now)}
      data={data}
      getRowId={(d) => d.id}
      getRowHref={(d) => ROUTES.admin.dispute(d.id)}
      isLoading={isLoading}
      emptyTitle={EMPTY[status].title}
      emptyDescription={EMPTY[status].description}
      footer={footer}
    />
  );
}
