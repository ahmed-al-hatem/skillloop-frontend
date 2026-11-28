import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';
import { Badge } from './Badge';

const variants = {
  success: 'bg-success-muted text-success',
  warning: 'bg-warning-muted text-warning',
  info: 'bg-info-muted text-info',
  danger: 'bg-danger-muted text-danger',
  neutral: 'bg-muted text-muted-foreground',
} as const;

export type StatusBadgeVariant = keyof typeof variants;

export type StatusBadgeProps = {
  variant: StatusBadgeVariant;
  /** The status name. Always required: the colour alone never carries the meaning. */
  children: ReactNode;
  className?: string;
};

/**
 * Status pill for enums (booking, dispute, member, service…). Each feature maps its enum values
 * to a `variant` + label in its own `constants.ts`.
 */
export function StatusBadge({ variant, children, className }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'rounded-sm border-current/30 px-2 font-semibold whitespace-nowrap',
        variants[variant],
        className,
      )}
    >
      {children}
    </Badge>
  );
}
