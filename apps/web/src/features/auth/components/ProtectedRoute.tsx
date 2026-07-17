'use client';

import { useSession } from '@/lib/auth';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { data, isLoading, isError } = useSession();
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  useEffect(() => {
    if (!isLoading && isHydrated && !isAuthenticated && !data) {
      router.replace('/login');
    }
  }, [data, isAuthenticated, isHydrated, isLoading, router]);

  if (isLoading || !isHydrated) {
    return <LoadingState message="Checking session..." />;
  }

  if (isError || !data || !isAuthenticated) {
    return <ErrorState message="You need to be logged in to access this area." />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
