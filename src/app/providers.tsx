import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { ReactNode } from 'react';
import { adminAuthHandlers } from '@/admin-features/core';
import { registerAuthInterceptors } from '@/features/auth';
import { ToastProvider } from '@/shared/components/ToastProvider';
import { QUERY_RETRY, QUERY_STALE_TIME } from '@/shared/constants/query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: QUERY_STALE_TIME,
      retry: QUERY_RETRY,
      refetchOnWindowFocus: false,
    },
  },
});

registerAuthInterceptors(queryClient, adminAuthHandlers);

/** Global providers. The router itself is mounted in App.tsx. */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>{children}</ToastProvider>
      {import.meta.env.DEV && <ReactQueryDevtools buttonPosition="bottom-left" />}
    </QueryClientProvider>
  );
}
