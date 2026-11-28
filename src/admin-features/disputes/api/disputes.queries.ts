import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiRequestError } from '@/shared/api/client';
import { QUERY_RETRY } from '@/shared/constants/query';
import type { DisputeListParams } from '../schemas/dispute.schema';
import type { ResolveDisputeRequest } from '../schemas/resolve-form.schema';
import { getDispute, getDisputes, resolveDispute } from './disputes.api';
import { adminDashboardKey, disputeKeys } from './disputes.keys';

/** Dispute queue page. Keeps the previous page on screen while the next one loads. */
export function useDisputes(params: DisputeListParams) {
  return useQuery({
    queryKey: disputeKeys.list(params),
    queryFn: () => getDisputes(params),
    placeholderData: keepPreviousData,
  });
}

/** One dispute with all evidence. A 404 is final (no retry), so «غير موجود» shows at once. */
export function useDispute(id: string | undefined) {
  return useQuery({
    queryKey: disputeKeys.detail(id ?? ''),
    queryFn: () => getDispute(id ?? ''),
    enabled: Boolean(id),
    retry: (failureCount, error) =>
      !(error instanceof ApiRequestError && error.status === 404) && failureCount < QUERY_RETRY,
  });
}

export type ResolveDisputeVariables = { id: string; body: ResolveDisputeRequest };

/**
 * Resolves a dispute. Seeds the detail cache with the response (the backend's numbers are the
 * truth), then refreshes the detail, every dispute list and the dashboard counters.
 */
export function useResolveDispute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: ResolveDisputeVariables) => resolveDispute(id, body),
    onSuccess: (dispute) => {
      queryClient.setQueryData(disputeKeys.detail(dispute.id), dispute);
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: disputeKeys.detail(dispute.id) }),
        queryClient.invalidateQueries({ queryKey: disputeKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: adminDashboardKey }),
      ]);
    },
    // 409: the dispute changed meanwhile (already resolved, or the window is still open): refetch.
    onError: (error, { id }) => {
      if (error instanceof ApiRequestError && error.status === 409) {
        void queryClient.invalidateQueries({ queryKey: disputeKeys.detail(id) });
      }
    },
  });
}
