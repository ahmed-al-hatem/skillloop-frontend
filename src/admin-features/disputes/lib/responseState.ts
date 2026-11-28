import type { AdminDispute } from '../schemas/dispute.schema';

/**
 * Where an open dispute stands on the provider's reply, read from backend fields only:
 * - `responded`: `providerRespondedAt` is set.
 * - `overdue`: no reply and the 🟡 `providerResponseDueAt` has passed.
 * - `waiting`: no reply yet (also when the backend doesn't send the due date).
 * `now` is a timestamp in ms (pass the query's `dataUpdatedAt` so rendering stays pure).
 */
export type ResponseState = 'responded' | 'overdue' | 'waiting';

export function getResponseState(dispute: AdminDispute, now: number): ResponseState {
  if (dispute.providerRespondedAt) return 'responded';
  return isPastResponseWindow(dispute, now) ? 'overdue' : 'waiting';
}

/**
 * True when the 48 h response window (🟡 `providerResponseDueAt`) is over. Without that field
 * nothing is highlighted: the UI doesn't guess the window from `createdAt`.
 */
export function isPastResponseWindow(dispute: AdminDispute, now: number): boolean {
  const due = dispute.providerResponseDueAt;
  return due !== undefined && Date.parse(due) <= now;
}

/**
 * Whether the resolve button is locked. The backend decides (🟡 `canResolve`); without it the
 * lock follows the reply and the 🟡 due date, and with neither the UI doesn't lock (a 409 does).
 */
export function isResolveLocked(dispute: AdminDispute, now: number): boolean {
  if (dispute.canResolve !== undefined) return !dispute.canResolve;
  if (dispute.providerRespondedAt || dispute.providerResponseDueAt === undefined) return false;
  return !isPastResponseWindow(dispute, now);
}
