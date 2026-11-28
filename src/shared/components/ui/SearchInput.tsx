import { useEffect, useId, useRef, useState, type ComponentProps } from 'react';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { cn } from '@/shared/lib/cn';

export type SearchInputProps = Omit<
  ComponentProps<'input'>,
  'type' | 'value' | 'defaultValue' | 'onChange'
> & {
  /** The committed search text (e.g. `params.q` from `useListParams`). */
  value: string;
  /** Called `delay` ms after typing stops, and right away when cleared. */
  onChange: (value: string) => void;
  /** Accessible name; visually hidden (the design shows the icon + placeholder only). */
  label: string;
  delay?: number;
};

/**
 * `type="search"` input with a search icon and a clear button.
 * Keeps its own text while typing and reports it debounced (300 ms by default),
 * so a list query runs once per pause, not once per key.
 * A new `value` from outside (e.g. "مسح الفلاتر") replaces the text.
 */
export function SearchInput({
  value,
  onChange,
  label,
  delay = 300,
  id,
  className,
  ...props
}: SearchInputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const inputRef = useRef<HTMLInputElement>(null);

  const [text, setText] = useState(value);
  const [prevValue, setPrevValue] = useState(value);
  if (value !== prevValue) {
    setPrevValue(value);
    setText(value);
  }

  const debounced = useDebounce(text, delay);
  useEffect(() => {
    // `debounced === text`: skip a stale debounced value right after an outside reset.
    if (debounced === text && debounced !== value) onChange(debounced);
  }, [debounced, text, value, onChange]);

  const clear = () => {
    setText('');
    if (value !== '') onChange('');
    inputRef.current?.focus();
  };

  return (
    <div
      className={cn(
        'flex h-10 w-full min-w-0 items-center gap-2 rounded-lg border border-input bg-surface ps-3 pe-1',
        'transition-colors duration-micro focus-within:border-primary focus-within:ring-3 focus-within:ring-primary/25',
        'pointer-coarse:h-11',
        className,
      )}
    >
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        aria-hidden="true"
        className="size-4.5 shrink-0 text-muted-foreground"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <input
        ref={inputRef}
        id={inputId}
        type="search"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape' && text) {
            e.preventDefault();
            clear();
          }
        }}
        className={cn(
          'h-full min-w-0 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground',
          'focus:outline-none focus-visible:outline-none [&::-webkit-search-cancel-button]:appearance-none',
        )}
        {...props}
      />
      {text && (
        <button
          type="button"
          aria-label="مسح البحث"
          onClick={clear}
          className={cn(
            'relative inline-flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground',
            'transition-colors duration-micro hover:bg-accent hover:text-foreground',
            'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
          )}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            aria-hidden="true"
            className="size-4"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
