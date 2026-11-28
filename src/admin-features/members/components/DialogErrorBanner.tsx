export type DialogErrorBannerProps = { message: string | null };

/**
 * Server error inside a dialog, read out once when it appears. Rendered as a `<span>` so it
 * fits in `ConfirmDialog`'s `description` (a `<p>`).
 */
export function DialogErrorBanner({ message }: DialogErrorBannerProps) {
  if (!message) return null;
  return (
    <span
      role="alert"
      className="mt-1 block rounded-lg border border-danger/40 bg-danger-muted px-3 py-2 text-[13px] text-danger"
    >
      {message}
    </span>
  );
}
