import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type FocusEvent,
  type Ref,
} from 'react';
import { cn } from '@/shared/lib/cn';

export type SelectOption<V extends string = string> = {
  value: V;
  label: string;
  disabled?: boolean;
};

export type SelectProps<V extends string = string> = {
  options: readonly SelectOption<V>[];
  value: V | undefined;
  onChange: (value: V) => void;
  /** Accessible name. Always required; `hideLabel` keeps it for screen readers only. */
  label: string;
  hideLabel?: boolean;
  /** Shown when `value` matches no option. */
  placeholder?: string;
  id?: string;
  name?: string;
  disabled?: boolean;
  /** Validation message (e.g. `fieldState.error?.message`). */
  error?: string;
  onBlur?: () => void;
  ref?: Ref<HTMLButtonElement>;
  className?: string;
};

const TYPEAHEAD_RESET_MS = 500;

/**
 * Single-choice dropdown: a button that opens a `listbox` popup.
 * Keyboard: ↑/↓/Enter/Space open · ↑/↓ move · Home/End · type letters to jump ·
 * Enter/Space pick · Esc closes · focus goes back to the button.
 * react-hook-form: `<Controller render={({ field, fieldState }) => (
 *   <Select {...field} options={…} label="الحالة" error={fieldState.error?.message} />)} />`.
 */
export function Select<V extends string = string>({
  options,
  value,
  onChange,
  label,
  hideLabel = false,
  placeholder = 'اختر',
  id,
  name,
  disabled = false,
  error,
  onBlur,
  ref,
  className,
}: SelectProps<V>) {
  const autoId = useId();
  const baseId = id ?? autoId;
  const labelId = `${baseId}-label`;
  const listId = `${baseId}-list`;
  const errorId = `${baseId}-error`;

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typeahead = useRef({ text: '', timer: 0 });

  const selectedIndex = options.findIndex((o) => o.value === value);
  const selected = options[selectedIndex];

  const setButtonRef = (node: HTMLButtonElement | null) => {
    buttonRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  };

  const enabledIndexes = options.flatMap((o, i) => (o.disabled ? [] : [i]));

  const step = (from: number, delta: 1 | -1) => {
    const pos = enabledIndexes.indexOf(from);
    if (pos === -1) return delta === 1 ? enabledIndexes[0] : enabledIndexes.at(-1);
    return enabledIndexes[Math.min(Math.max(pos + delta, 0), enabledIndexes.length - 1)];
  };

  const openList = (index = selectedIndex) => {
    if (disabled) return;
    setActiveIndex(options[index] && !options[index].disabled ? index : (enabledIndexes[0] ?? -1));
    setOpen(true);
  };

  const close = (returnFocus = true) => {
    setOpen(false);
    if (returnFocus) buttonRef.current?.focus();
  };

  const pick = (index: number) => {
    const option = options[index];
    if (!option || option.disabled) return;
    if (option.value !== value) onChange(option.value);
    close();
  };

  /** Jump to the next enabled option whose label starts with the typed letters. */
  const findByTypeahead = (key: string, from: number) => {
    const state = typeahead.current;
    window.clearTimeout(state.timer);
    state.text += key.toLocaleLowerCase();
    state.timer = window.setTimeout(() => (state.text = ''), TYPEAHEAD_RESET_MS);
    const start = state.text.length === 1 ? from + 1 : Math.max(from, 0);
    const ordered = [...options.slice(start), ...options.slice(0, start)];
    const match = ordered.find(
      (o) => !o.disabled && o.label.toLocaleLowerCase().startsWith(state.text),
    );
    return match ? options.indexOf(match) : -1;
  };

  const isTypeaheadKey = (e: KeyboardEvent) =>
    e.key.length === 1 && e.key !== ' ' && !e.ctrlKey && !e.metaKey && !e.altKey;

  const onButtonKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
      e.preventDefault();
      openList(
        selectedIndex === -1 && e.key === 'ArrowUp' ? (enabledIndexes.at(-1) ?? -1) : selectedIndex,
      );
    } else if (isTypeaheadKey(e)) {
      const index = findByTypeahead(e.key, selectedIndex);
      openList(index === -1 ? selectedIndex : index);
    }
  };

  const onListKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    const keys: Record<string, () => void> = {
      ArrowDown: () => setActiveIndex((i) => step(i, 1) ?? i),
      ArrowUp: () => setActiveIndex((i) => step(i, -1) ?? i),
      Home: () => setActiveIndex(enabledIndexes[0] ?? -1),
      End: () => setActiveIndex(enabledIndexes.at(-1) ?? -1),
      Enter: () => pick(activeIndex),
      ' ': () => pick(activeIndex),
      Escape: () => close(),
    };
    const action = keys[e.key];
    if (action) {
      e.preventDefault();
      action();
    } else if (e.key === 'Tab') {
      close(false);
    } else if (isTypeaheadKey(e)) {
      const index = findByTypeahead(e.key, activeIndex);
      if (index !== -1) setActiveIndex(index);
    }
  };

  const onRootBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (rootRef.current?.contains(e.relatedTarget as Node | null)) return;
    setOpen(false);
    onBlur?.();
  };

  useEffect(() => {
    if (open) listRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open || activeIndex < 0) return;
    document.getElementById(`${listId}-${activeIndex}`)?.scrollIntoView({ block: 'nearest' });
  }, [open, activeIndex, listId]);

  // Clicking outside closes the list.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <span id={labelId} className={cn('text-[13px] font-semibold', hideLabel && 'sr-only')}>
        {label}
      </span>
      <div ref={rootRef} className="relative" onBlur={onRootBlur}>
        <button
          ref={setButtonRef}
          id={baseId}
          type="button"
          name={name}
          value={value ?? ''}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          aria-labelledby={`${labelId} ${baseId}`}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onClick={() => (open ? close() : openList())}
          onKeyDown={onButtonKeyDown}
          className={cn(
            'flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-input bg-surface ps-3 pe-2.5 text-start text-sm',
            'transition-colors duration-micro focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/25 focus-visible:outline-none',
            'disabled:cursor-not-allowed disabled:opacity-50 pointer-coarse:h-11',
            open && 'border-primary ring-3 ring-primary/25',
            error && 'border-danger',
          )}
        >
          <span className={cn('truncate', !selected && 'text-muted-foreground')}>
            {selected?.label ?? placeholder}
          </span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className={cn(
              'size-4 shrink-0 text-muted-foreground transition-transform duration-micro',
              open && 'rotate-180',
            )}
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>

        {open && (
          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            tabIndex={-1}
            aria-labelledby={labelId}
            aria-activedescendant={activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
            onKeyDown={onListKeyDown}
            className="absolute inset-x-0 top-full z-50 mt-1 max-h-64 overflow-auto rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-lg focus:outline-none"
          >
            {options.map((option, i) => (
              <li
                key={option.value}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === selectedIndex}
                aria-disabled={option.disabled || undefined}
                onPointerMove={() => !option.disabled && setActiveIndex(i)}
                onPointerDown={(e) => e.preventDefault()}
                onClick={() => pick(i)}
                className={cn(
                  'flex min-h-9 cursor-pointer items-center justify-between gap-2 rounded-md px-2.5 text-sm pointer-coarse:min-h-11',
                  i === activeIndex && 'bg-accent text-accent-foreground',
                  i === selectedIndex && 'font-semibold',
                  option.disabled && 'cursor-not-allowed opacity-50',
                )}
              >
                <span className="truncate">{option.label}</span>
                {i === selectedIndex && (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="size-4 shrink-0 text-foreground light:text-primary"
                  >
                    <path d="m5 12 5 5 9-10" />
                  </svg>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      {error && (
        <p id={errorId} className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
