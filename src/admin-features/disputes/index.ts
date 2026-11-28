// Public API of the admin disputes feature. Other code imports ONLY from '@/admin-features/disputes'.
// Mocks are never exported from here (they stay out of the production bundle).
export { disputeKeys } from './api/disputes.keys';
export {
  useDispute,
  useDisputes,
  useResolveDispute,
  type ResolveDisputeVariables,
} from './api/disputes.queries';
export {
  ADMIN_NOTE_MAX,
  ADMIN_NOTE_MIN,
  BOOKING_STATUS_LABELS,
  DISPUTE_DECISION_LABELS,
  DISPUTE_REASON_LABELS,
  DISPUTE_STATUS_LABELS,
  DISPUTE_STATUS_VARIANTS,
  RESPONSE_STATE_LABELS,
  RESPONSE_STATE_VARIANTS,
} from './constants';
export { getResponseState, isPastResponseWindow, type ResponseState } from './lib/responseState';
export { disputesRoutes } from './routes';
export {
  DisputeListParamsSchema,
  type AdminDispute,
  type AdminPerson,
  type BookingCore,
  type BookingEvent,
  type BookingStatus,
  type DisputeDecision,
  type DisputeListParams,
  type DisputeReason,
  type DisputeStatus,
} from './schemas/dispute.schema';
export {
  ResolveDisputeRequestSchema,
  type ResolveDisputeRequest,
} from './schemas/resolve-form.schema';
