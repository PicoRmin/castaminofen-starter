import { create } from 'zustand';
import type { PlayableItem, PlayerPlaybackStatus, PlayerRepeatMode, PlayerRuntimeState } from '../types';

export type PlayerState = {
  currentItem: PlayableItem | null;
  queue: PlayableItem[];
  currentIndex: number;
  isPlaying: boolean;
  playbackStatus: PlayerPlaybackStatus;
  status: PlayerPlaybackStatus;
  duration: number;
  currentPosition: number;
  position: number;
  error: string | null;
  volume: number;
  repeatMode: PlayerRepeatMode;
  shuffle: boolean;
  setCurrentItem: (item: PlayableItem) => void;
  setPlaybackState: (state: Partial<PlayerRuntimeState>) => void;
  replaceQueue: (items: PlayableItem[], startIndex?: number) => void;
  clearQueue: () => void;
  goToNext: () => PlayableItem | null;
  goToPrevious: () => PlayableItem | null;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  resetPlayer: () => void;
};

const clampVolume = (value: number) => Math.min(1, Math.max(0, value));

export const usePlayerStore = create<PlayerState>((set) => ({
  currentItem: null,
  queue: [],
  currentIndex: -1,
  isPlaying: false,
  playbackStatus: 'idle',
  status: 'idle',
  duration: 0,
  currentPosition: 0,
  position: 0,
  error: null,
  volume: 0.8,
  repeatMode: 'off',
  shuffle: false,
  setCurrentItem: (item) =>
    set((state) => ({
      ...state,
      currentItem: item,
      queue: state.queue.length ? state.queue : [item],
      currentIndex: state.queue.length ? state.currentIndex : 0,
      isPlaying: true,
      playbackStatus: 'playing',
      status: 'playing',
      currentPosition: 0,
      position: 0,
      duration: 0,
      error: null,
    })),
  setPlaybackState: (state) =>
    set((currentState) => {
      const nextPlaybackStatus = state.playbackStatus ?? currentState.playbackStatus;
      const nextPosition = state.currentPosition ?? currentState.currentPosition;
      const nextDuration = state.duration ?? currentState.duration;
      const nextError = state.error ?? currentState.error;

      return {
        ...currentState,
        ...state,
        playbackStatus: nextPlaybackStatus,
        status: nextPlaybackStatus,
        currentPosition: nextPosition,
        position: nextPosition,
        duration: nextDuration,
        error: nextError,
        isPlaying: nextPlaybackStatus === 'playing',
      };
    }),
  replaceQueue: (items, startIndex = 0) =>
    set((state) => {
      const normalizedItems = items.filter(Boolean);
      const safeStartIndex = normalizedItems.length
        ? Math.max(0, Math.min(startIndex, normalizedItems.length - 1))
        : -1;
      const nextItem = safeStartIndex >= 0 ? normalizedItems[safeStartIndex] : null;

      return {
        ...state,
        queue: normalizedItems,
        currentIndex: safeStartIndex,
        currentItem: nextItem,
      };
    }),
  clearQueue: () =>
    set((state) => ({
      ...state,
      queue: [],
      currentIndex: -1,
      currentItem: null,
      isPlaying: false,
      playbackStatus: 'idle',
      status: 'idle',
      currentPosition: 0,
      position: 0,
      duration: 0,
      error: null,
    })),
  goToNext: () => {
    let nextItem: PlayableItem | null = null;

    set((state) => {
      if (!state.queue.length) {
        return state;
      }

      const isAtEnd = state.currentIndex >= state.queue.length - 1;
      const shouldWrap = state.repeatMode === 'queue' && isAtEnd;

      if (!shouldWrap && isAtEnd) {
        return state;
      }

      const targetIndex = shouldWrap ? 0 : state.currentIndex + 1;
      nextItem = state.queue[targetIndex] ?? null;

      return {
        ...state,
        currentItem: nextItem,
        currentIndex: targetIndex,
      };
    });

    return nextItem;
  },
  goToPrevious: () => {
    let previousItem: PlayableItem | null = null;

    set((state) => {
      if (!state.queue.length || state.currentIndex <= 0) {
        return state;
      }

      const targetIndex = state.currentIndex - 1;
      previousItem = state.queue[targetIndex] ?? null;

      return {
        ...state,
        currentItem: previousItem,
        currentIndex: targetIndex,
      };
    });

    return previousItem;
  },
  togglePlay: () =>
    set((state) => {
      const nextPlaybackStatus = state.isPlaying ? 'paused' : 'playing';

      return {
        isPlaying: !state.isPlaying,
        playbackStatus: nextPlaybackStatus,
        status: nextPlaybackStatus,
      };
    }),
  setVolume: (volume) => set({ volume: clampVolume(volume) }),
  toggleRepeat: () =>
    set((state) => ({
      repeatMode: state.repeatMode === 'off' ? 'one' : state.repeatMode === 'one' ? 'queue' : 'off',
    })),
  toggleShuffle: () => set((state) => ({ shuffle: !state.shuffle })),
  resetPlayer: () =>
    set({
      currentItem: null,
      queue: [],
      currentIndex: -1,
      isPlaying: false,
      playbackStatus: 'idle',
      status: 'idle',
      duration: 0,
      currentPosition: 0,
      position: 0,
      error: null,
      volume: 0.8,
      repeatMode: 'off',
      shuffle: false,
    }),
}));
