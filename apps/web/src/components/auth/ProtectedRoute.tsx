'use client';

import { ProtectedRoute as ProtectedRouteFeature } from '@/features/auth';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return <ProtectedRouteFeature>{children}</ProtectedRouteFeature>;
}
