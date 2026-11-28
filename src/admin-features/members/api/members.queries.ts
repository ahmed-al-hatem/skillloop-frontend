import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { MemberListParams } from '../schemas/member.schema';
import { getMember, getMembers } from './members.api';
import { memberKeys } from './members.keys';

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
