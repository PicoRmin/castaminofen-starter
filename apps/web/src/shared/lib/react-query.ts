import type { QueryClientConfig } from '@tanstack/react-query';
import { QueryClient } from '@tanstack/react-query';

export const reactQueryConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60,
      gcTime: 1000 * 60 * 10,
    },
    mutations: {
      retry: false,
    },
  },
};

export function createQueryClient() {
  return new QueryClient(reactQueryConfig);
}
