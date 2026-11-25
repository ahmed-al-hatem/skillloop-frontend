import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

export type EmptyStateProps = {
  title: string;
  description?: string;
  /** Optional call to action, e.g. a <Button>. */
  action?: ReactNode;
  className?: string;
};

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-2 rounded-xl border border-dashed p-8 text-center',
        className,
      )}
    >
      <p className="font-medium">{title}</p>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
