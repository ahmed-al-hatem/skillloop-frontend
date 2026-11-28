import { Link } from 'react-router';
import { EmptyState } from '@/shared/components/EmptyState';
import { ROUTES } from '@/shared/constants/routes';

/** Any unknown `/admin/*` URL. */
export function AdminNotFound() {
  return (
    <div className="mx-auto max-w-3xl p-6">
      <EmptyState
        title="الصفحة غير موجودة"
        description="404"
        action={
          <Link
            to={ROUTES.admin.root}
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            العودة إلى لوحة الإدارة
          </Link>
        }
      />
    </div>
  );
}
