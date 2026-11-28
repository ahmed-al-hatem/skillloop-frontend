import { EmptyState } from '@/shared/components/EmptyState';

/** Stands in for the overview screen until `admin-features/overview` is built. */
export function AdminHomePlaceholder() {
  return (
    <div className="mx-auto max-w-3xl p-6">
      <EmptyState title="لوحة الإدارة" description="قريباً" />
    </div>
  );
}
