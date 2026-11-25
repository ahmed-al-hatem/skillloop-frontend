import { EmptyState } from '@/shared/components/EmptyState';
import { PageHeader } from '@/shared/components/PageHeader';

export function ExchangesPage() {
  return (
    <>
      <PageHeader title="التبادلات" description="اتفاقيات التبادل والجلسات القادمة." />
      <EmptyState title="قيد التطوير" description="features/exchanges" />
    </>
  );
}
