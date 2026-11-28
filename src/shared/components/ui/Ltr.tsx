import type { ComponentProps } from 'react';
import { cn } from '@/shared/lib/cn';

export type LtrProps = ComponentProps<'bdi'>;

/**
 * Isolates left-to-right text inside the RTL UI so it keeps its order:
 * ids (#D-1051), emails, phones, percents, codes. Uses the Latin font (Inter).
 */
export function Ltr({ className, ...props }: LtrProps) {
  return <bdi dir="ltr" className={cn('font-latin', className)} {...props} />;
}
