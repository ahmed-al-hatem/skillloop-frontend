import type { ComponentProps } from 'react';
import { cn } from '@/shared/lib/cn';

const variants = {
  default: 'bg-primary/10 text-primary',
  secondary: 'bg-secondary text-secondary-foreground',
  outline: 'border text-foreground',
  destructive: 'bg-danger-muted text-danger',
} as const;

export type BadgeProps = ComponentProps<'span'> & { variant?: keyof typeof variants };

export function Badge({ variant = 'default', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
