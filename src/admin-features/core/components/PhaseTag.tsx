import type { AdminNavPhase } from '../nav.config';

export type PhaseTagProps = {
  phase: Exclude<AdminNavPhase, 'v1'>;
};

/** "P2" outline tag, or a plain "لاحقاً" for entries with no release planned yet. */
export function PhaseTag({ phase }: PhaseTagProps) {
  if (phase === 'later') return <span className="text-[11px] text-muted-foreground">لاحقاً</span>;
  return (
    <span className="rounded-md border border-input px-1.5 font-sans text-[10px] leading-4.5 font-semibold text-muted-foreground">
      P2
    </span>
  );
}
