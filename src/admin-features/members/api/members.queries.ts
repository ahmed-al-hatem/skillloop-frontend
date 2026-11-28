import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { PointsAdjustmentRequest, SuspendRequest } from '../schemas/member-forms.schema';
import type { MemberListParams } from '../schemas/member.schema';
import {
  adjustMemberPoints,
  getMember,
  getMembers,
  suspendMember,
  unsuspendMember,
} from './members.api';
import { adminDashboardKey, memberKeys } from './members.keys';

/** Members list. Keeps the previous page on screen while the next one loads. */
export function useMembers(params: MemberListParams) {
  return useQuery({
    queryKey: memberKeys.list(params),
    queryFn: () => getMembers(params),
    placeholderData: keepPreviousData,
  });
}

/** One member with wallet counters and the last 20 transactions. */
export function useMember(id: string | undefined) {
  return useQuery({
    queryKey: memberKeys.detail(id ?? ''),
    queryFn: () => getMember(id ?? ''),
    enabled: Boolean(id),
  });
}

/** Refreshes everything a member mutation can change: detail, lists and dashboard counters. */
function useInvalidateMember() {
  const queryClient = useQueryClient();
  return (id: string) =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: memberKeys.detail(id) }),
      queryClient.invalidateQueries({ queryKey: memberKeys.lists() }),
      queryClient.invalidateQueries({ queryKey: adminDashboardKey }),
    ]);
}

export function useSuspendMember(id: string) {
  const invalidate = useInvalidateMember();
  return useMutation({
    mutationFn: (body: SuspendRequest) => suspendMember(id, body),
    onSuccess: () => invalidate(id),
  });
}

export function useUnsuspendMember(id: string) {
  const invalidate = useInvalidateMember();
  return useMutation({
    mutationFn: () => unsuspendMember(id),
    onSuccess: () => invalidate(id),
  });
}

/** Errors: 422 `INSUFFICIENT_POINTS` when the balance would go below 0 (show its message). */
export function useAdjustPoints(id: string) {
  const invalidate = useInvalidateMember();
  return useMutation({
    mutationFn: (body: PointsAdjustmentRequest) => adjustMemberPoints(id, body),
    onSuccess: () => invalidate(id),
  });
}
