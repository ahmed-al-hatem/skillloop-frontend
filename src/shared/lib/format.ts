// Display-only formatting. Values (balances, prices, percents) come from the backend as they are;
// nothing here computes them.

/** Arabic UI with Latin digits (per the admin design): "46,920", "السبت، 28 نوفمبر 2026". */
const DEFAULT_LOCALE = 'ar-u-nu-latn';

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

/** Full local date for tooltips: "السبت، 28 نوفمبر 2026 في 9:32 ص". UTC from the API → local time. */
export function formatFullDateTime(value: string | Date, locale = DEFAULT_LOCALE) {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'full', timeStyle: 'short' }).format(
    new Date(value),
  );
}

/** 46920 → "46,920". */
export function formatNumber(value: number, locale = DEFAULT_LOCALE) {
  return new Intl.NumberFormat(locale).format(value);
}

/** Points with grouping. `signed` shows "+" / "-" for adjustments: 50 → "+50", -20 → "-20", 0 → "0". */
export function formatPoints(value: number, { signed = false, locale = DEFAULT_LOCALE } = {}) {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
    signDisplay: signed ? 'exceptZero' : 'auto',
  }).format(value);
}

/** Takes a percent as the API sends it (0–100): 40 → "40%", 12.5 → "12.5%". */
export function formatPercent(
  value: number,
  { maximumFractionDigits = 1, locale = DEFAULT_LOCALE } = {},
) {
  return new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits }).format(
    value / 100,
  );
}

const RELATIVE_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 365 * 24 * 60 * 60],
  ['month', 30 * 24 * 60 * 60],
  ['week', 7 * 24 * 60 * 60],
  ['day', 24 * 60 * 60],
  ['hour', 60 * 60],
  ['minute', 60],
];

/**
 * "منذ 3 ساعات", "أمس", "الآن". Uses `Intl.RelativeTimeFormat` for Arabic plurals; its past form
 * starts with "قبل", which the design writes as "منذ".
 */
export function formatRelative(
  value: string | Date,
  now: Date = new Date(),
  locale = DEFAULT_LOCALE,
) {
  const seconds = Math.round((new Date(value).getTime() - now.getTime()) / 1000);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  const match = RELATIVE_UNITS.find(([, size]) => Math.abs(seconds) >= size);
  const text = match
    ? rtf.format(Math.trunc(seconds / match[1]), match[0])
    : rtf.format(0, 'second');
  return locale.startsWith('ar') ? text.replace(/^قبل /, 'منذ ') : text;
}
