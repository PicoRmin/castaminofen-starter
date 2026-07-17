import { create } from 'zustand';
import type { UserProfile } from '@/lib/types';

export type AuthState = {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  setUser: (user: UserProfile | null) => void;
  clearUser: () => void;
  setHydrated: (value: boolean) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isHydrated: false,
  setUser: (user) => set({ user, isAuthenticated: Boolean(user) }),
  clearUser: () => set({ user: null, isAuthenticated: false }),
  setHydrated: (value) => set({ isHydrated: value }),
}));
