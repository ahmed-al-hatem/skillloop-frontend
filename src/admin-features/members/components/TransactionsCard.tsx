import { Link } from 'react-router';
import { EmptyState } from '@/shared/components/EmptyState';
import { Ltr } from '@/shared/components/ui/Ltr';
import { PointsAmount } from '@/shared/components/ui/PointsAmount';
import { Table } from '@/shared/components/ui/Table';
import { TableBody } from '@/shared/components/ui/TableBody';
import { TableCell } from '@/shared/components/ui/TableCell';
import { TableHead } from '@/shared/components/ui/TableHead';
import { TableHeader } from '@/shared/components/ui/TableHeader';
import { TableRow } from '@/shared/components/ui/TableRow';
import { ROUTES } from '@/shared/constants/routes';
import { cn } from '@/shared/lib/cn';
import { formatDateTime } from '@/shared/lib/format';
import { transactionTypeLabel } from '../constants';
import type { WalletTransaction } from '../schemas/member.schema';

const changeTone = (n: number) =>
  n > 0 ? 'text-success' : n < 0 ? 'text-danger' : 'text-muted-foreground';

export type TransactionsCardProps = {
  /** The last 20, in the order the contract returns them. */
  transactions: WalletTransaction[];
  className?: string;
};

/** Wallet movements: time, type (+ note), booking reference, available / held change. */
export function TransactionsCard({ transactions, className }: TransactionsCardProps) {
  return (
    <section
      aria-labelledby="tx-title"
      className={cn('flex min-w-0 flex-col gap-3 rounded-2xl border bg-surface p-5', className)}
    >
      <h2 id="tx-title" className="text-base font-bold">
        آخر 20 حركة
      </h2>
      {transactions.length === 0 ? (
        <EmptyState title="لا توجد حركات بعد" className="border-0 py-8" />
      ) : (
        <Table containerClassName="max-h-[420px] rounded-lg border">
          <TableHeader>
            <TableRow>
              <TableHead>الوقت</TableHead>
              <TableHead>النوع</TableHead>
              <TableHead>المرجع</TableHead>
              <TableHead align="end">القيمة</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="text-[13px] whitespace-nowrap text-muted-foreground">
                  {formatDateTime(t.createdAt)}
                </TableCell>
                <TableCell className="min-w-36">
                  <div className="font-semibold">{transactionTypeLabel[t.type]}</div>
                  {t.note && <div className="text-xs text-muted-foreground">{t.note}</div>}
                </TableCell>
                <TableCell>
                  {t.bookingId ? (
                    <Link
                      to={ROUTES.admin.booking(t.bookingId)}
                      className="rounded-sm text-primary hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    >
                      الحجز <Ltr>#{t.bookingId.slice(0, 8)}</Ltr>
                    </Link>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell align="end" className="font-semibold whitespace-nowrap">
                  {t.availableChange !== 0 && (
                    <PointsAmount
                      value={t.availableChange}
                      signed
                      className={changeTone(t.availableChange)}
                    />
                  )}
                  {t.heldChange !== 0 && (
                    <div className="text-xs text-muted-foreground">
                      محجوز <PointsAmount value={t.heldChange} signed />
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </section>
  );
}
