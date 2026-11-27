const DEFAULT_LOCALE = 'ar';

/** 2026-11-25T10:00:00Z → "25 نوفمبر 2026" (locale-aware). */
export function formatDate(value: string | Date, locale = DEFAULT_LOCALE) {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date(value));
}

/** Date + time, e.g. for session start times. */
export function formatDateTime(value: string | Date, locale = DEFAULT_LOCALE) {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(
    new Date(value),
  );
}
