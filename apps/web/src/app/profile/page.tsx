'use client';

import { useSession } from '@/lib/auth';
import { LoadingState } from '@/components/ui/loading-state';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuthStore } from '@/stores/authStore';

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const sessionQuery = useSession();
  const profile = user ?? sessionQuery.data;

  if (sessionQuery.isLoading && !profile) {
    return <LoadingState message="Checking profile..." />;
  }

  return (
    <ProtectedRoute>
      <main className="page-container">
        <section className="card">
          <h1>Profile</h1>
          <p>
            <strong>Email:</strong> {profile?.email ?? '—'}
          </p>
          <p>
            <strong>Name:</strong> {profile?.name || '—'}
          </p>
          <p>
            <strong>User ID:</strong> {profile?.id ?? '—'}
          </p>
        </section>
      </main>
    </ProtectedRoute>
  );
}
