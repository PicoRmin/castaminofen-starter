import { create } from 'zustand';
import type { Episode } from '@/lib/types';

export type PlayerState = {
  currentEpisode?: Episode | null;
  isPlaying: boolean;
  volume: number;
  repeatMode: 'off' | 'one' | 'all';
  shuffle: boolean;
  setCurrentEpisode: (episode: Episode) => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  resetPlayer: () => void;
};

const clampVolume = (value: number) => Math.min(1, Math.max(0, value));

export const usePlayerStore = create<PlayerState>((set) => ({
  currentEpisode: null,
  isPlaying: false,
  volume: 0.8,
  repeatMode: 'off',
  shuffle: false,
  setCurrentEpisode: (episode) => set({ currentEpisode: episode, isPlaying: true }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setVolume: (volume) => set({ volume: clampVolume(volume) }),
  toggleRepeat: () =>
    set((state) => ({
      repeatMode: state.repeatMode === 'off' ? 'all' : state.repeatMode === 'all' ? 'one' : 'off',
    })),
  toggleShuffle: () => set((state) => ({ shuffle: !state.shuffle })),
  resetPlayer: () =>
    set({ currentEpisode: null, isPlaying: false, volume: 0.8, repeatMode: 'off', shuffle: false }),
}));
