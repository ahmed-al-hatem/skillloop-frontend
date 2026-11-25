import { EmptyState } from '@/shared/components/EmptyState';
import { PageHeader } from '@/shared/components/PageHeader';

export function ReviewsPage() {
  return (
    <>
      <PageHeader title="التقييمات" description="تقييماتك والشارات التي حصلت عليها." />
      <EmptyState title="قيد التطوير" description="features/reviews" />
    </>
  );
}
