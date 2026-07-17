'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from './api';
import { clearAccessToken, getAccessToken, setAccessToken } from './auth-token';
import type { UserProfile } from './types';
import { useAuthStore } from '@/stores/authStore';

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = {
  email: string;
  password: string;
  name?: string;
};

export async function loginUser(input: LoginInput) {
  const response = await apiFetch<{ accessToken: string }>('auth/login', {
    method: 'POST',
    body: input,
  });

  setAccessToken(response.accessToken);
  return response;
}

function syncAuthStore(user: UserProfile | null, hydrated = true) {
  const authStore = useAuthStore.getState();
  authStore.setUser(user);
  authStore.setHydrated(hydrated);
}

export async function registerUser(input: RegisterInput) {
  const response = await apiFetch<{ accessToken: string }>('auth/register', {
    method: 'POST',
    body: input,
  });

  setAccessToken(response.accessToken);
  return response;
}

export async function refreshSession(): Promise<{ accessToken?: string; ok?: boolean }> {
  return apiFetch<{ accessToken?: string; ok?: boolean }>('auth/refresh', {
    method: 'POST',
  }).catch(() => ({ ok: false }));
}

export async function fetchProfile() {
  return apiFetch<UserProfile>('users/me');
}

export async function logoutUser() {
  await apiFetch<{ ok: boolean }>('auth/logout', {
    method: 'POST',
  });
  syncAuthStore(null, true);
  clearAccessToken();
}

export async function getSession(): Promise<UserProfile | null> {
  const token = getAccessToken();

  if (token) {
    try {
      const profile = await fetchProfile();
      syncAuthStore(profile);
      return profile;
    } catch {
      // Try refresh if the stored token is invalid.
    }
  }

  const refreshResult = await refreshSession();

  if (refreshResult?.accessToken) {
    setAccessToken(refreshResult.accessToken);
    const profile = await fetchProfile();
    syncAuthStore(profile);
    return profile;
  }

  syncAuthStore(null);
  clearAccessToken();
  return null;
}

export function useSession() {
  const query = useQuery<UserProfile | null, Error>({
    queryKey: ['session'],
    queryFn: getSession,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (!query.isLoading) {
      useAuthStore.getState().setHydrated(true);
    }
  }, [query.isLoading]);

  useEffect(() => {
    if (query.isError) {
      syncAuthStore(null, true);
      return;
    }

    if (query.data) {
      syncAuthStore(query.data, true);
    }
  }, [query.data, query.isError]);

  return query;
}
