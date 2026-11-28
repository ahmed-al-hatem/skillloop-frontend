import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ArchiveRequest, ServiceListParams } from '../schemas/service.schema';
import { archiveService, getServices } from './services.api';
import { adminDashboardKey, serviceKeys } from './services.keys';

/** Services list. Keeps the previous page on screen while the next one loads. */
export function useServices(params: ServiceListParams) {
  return useQuery({
    queryKey: serviceKeys.list(params),
    queryFn: () => getServices(params),
    placeholderData: keepPreviousData,
  });
}

/**
 * Archives a service (final; running bookings continue).
 * Errors: 400 `VALIDATION_ERROR` (reason), 404, 409 `INVALID_STATE_TRANSITION` (already archived).
 */
export function useArchiveService(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: ArchiveRequest) => archiveService(id, body),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: serviceKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: adminDashboardKey }),
      ]),
  });
}
