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

/** 1240 → "1,240"; 91.25 → "91.25". Western digits, Arabic separators (dates keep the locale's digits). */
export function formatNumber(value: number, locale = DEFAULT_LOCALE, maximumFractionDigits = 2) {
  return new Intl.NumberFormat(locale, { numberingSystem: 'latn', maximumFractionDigits }).format(
    value,
  );
}
