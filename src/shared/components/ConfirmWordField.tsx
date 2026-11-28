import type { ComponentProps, ReactNode } from 'react';
import { Label } from '@/shared/components/ui/Label';
import { cn } from '@/shared/lib/cn';

export type ConfirmWordFieldProps = Omit<ComponentProps<'input'>, 'type'> & {
  id: string;
  /** The word the user must type, e.g. "أرشفة" or the member's name. */
  word: string;
  /** Text before the word. Defaults to "للتأكيد اكتب كلمة". */
  label?: ReactNode;
  matches: boolean;
};

/** Typed confirmation for high-risk actions: a check mark appears once the word matches. */
export function ConfirmWordField({
  id,
  word,
  label = 'للتأكيد اكتب كلمة',
  matches,
  className,
  ...props
}: ConfirmWordFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className="text-[13px] font-semibold">
        {label} <span className="text-danger">«{word}»</span>
      </Label>
      <div className="relative">
        <input
          id={id}
          type="text"
          autoComplete="off"
          spellCheck={false}
          aria-required="true"
          className={cn(
            'h-11 w-full rounded-lg border border-input bg-background ps-3 pe-10 text-start',
            'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
            'disabled:cursor-not-allowed disabled:opacity-50',
            matches && 'border-success',
            className,
          )}
          {...props}
        />
        {matches && (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="absolute end-3 top-3 size-5 text-success"
          >
            <path d="m5 12 5 5 9-10" />
          </svg>
        )}
      </div>
    </div>
  );
}
