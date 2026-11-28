import type { ComponentProps } from 'react';
import { CharCounter } from '@/shared/components/ui/CharCounter';
import { Label } from '@/shared/components/ui/Label';
import { Textarea } from '@/shared/components/ui/Textarea';
import { cn } from '@/shared/lib/cn';
import type { ConfirmReasonOptions } from './confirmDialogSchema';

export type ConfirmReasonFieldProps = Omit<ComponentProps<'textarea'>, 'placeholder'> &
  Omit<ConfirmReasonOptions, 'min' | 'max'> & {
    id: string;
    min: number;
    max: number;
    /** Trimmed length of the current value. */
    length: number;
    error?: string;
  };

/** Required reason with a `{len} / {max}` counter; green once valid, red with the error after blur. */
export function ConfirmReasonField({
  id,
  label,
  note,
  min,
  max,
  length,
  error,
  ...props
}: ConfirmReasonFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className="text-[13px] font-semibold">
        {label} <span className="text-danger">*</span>
        {note && <span className="font-normal text-muted-foreground"> {note}</span>}
      </Label>
      <Textarea
        id={id}
        rows={3}
        maxLength={max}
        invalid={Boolean(error)}
        aria-required="true"
        aria-describedby={`${id}-count`}
        className={cn(!error && length >= min && 'border-success')}
        {...props}
      />
      <CharCounter
        id={`${id}-count`}
        length={length}
        min={min}
        max={max}
        hint={`من ${min} إلى ${max} حرف`}
        error={error}
      />
    </div>
  );
}
