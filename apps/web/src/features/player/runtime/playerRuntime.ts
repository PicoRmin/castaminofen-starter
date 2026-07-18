import { createBrowserAudioEngine, type AudioEngine } from './audioEngine';
import { usePlayerStore } from '../store/playerStore';
import type { PlayableItem, PlayerPlaybackStatus } from '../types';
import type { PlayerState } from '../store/playerStore';

export type PlayerRuntimeController = {
  loadItem(item: PlayableItem): Promise<void>;
  play(): Promise<void>;
  pause(): void;
  stop(): void;
  setVolume(volume: number): void;
  setCurrentTime(position: number): void;
  replaceQueue(items: PlayableItem[], startIndex?: number): Promise<void>;
  clearQueue(): void;
  next(): Promise<void>;
  previous(): Promise<void>;
  destroy(): void;
};

export function createPlayerRuntimeController(store: PlayerState, engine: AudioEngine = createBrowserAudioEngine()): PlayerRuntimeController {
  // Token used to ignore outdated load/play completions when multiple
  // rapid load/play requests happen. Incrementing this token makes earlier
  // promises no-ops so they don't overwrite newer state.
  let currentLoadToken = 0;
  let activeItemId: string | null = null;
  const getStoreState = () => usePlayerStore.getState();

  const normalizeTime = (value: number) => (Number.isFinite(value) && value >= 0 ? value : 0);

  const syncState = (snapshot?: { playbackStatus: PlayerPlaybackStatus; duration: number; currentPosition: number; error: string | null }) => {
    store.setPlaybackState({
      currentPosition: normalizeTime(snapshot?.currentPosition ?? engine.getCurrentTime()),
      duration: normalizeTime(snapshot?.duration ?? engine.getDuration()),
      error: snapshot?.error ?? null,
      playbackStatus: snapshot?.playbackStatus ?? 'paused',
    });
  };

  const stopPlaybackGracefully = (snapshot?: { playbackStatus: PlayerPlaybackStatus; duration: number; currentPosition: number; error: string | null }) => {
    currentLoadToken += 1;
    activeItemId = null;

    const finalPosition = normalizeTime(snapshot?.currentPosition ?? engine.getCurrentTime());
    const finalDuration = normalizeTime(snapshot?.duration ?? engine.getDuration());
    const currentStore = getStoreState();

    engine.stop();
    store.setPlaybackState({
      currentItem: currentStore.currentItem,
      playbackStatus: 'idle',
      duration: finalDuration,
      currentPosition: finalPosition,
      error: snapshot?.error ?? null,
    });
  };

  const playItem = async (item: PlayableItem) => {
    const loadToken = ++currentLoadToken;
    activeItemId = item.id;

    if (!item.audioUrl) {
      store.setCurrentItem(item);
      store.setPlaybackState({
        currentItem: item,
        playbackStatus: 'idle',
        duration: 0,
        currentPosition: 0,
        error: 'Audio source is unavailable.',
      });
      engine.stop();
      activeItemId = null;
      return;
    }

    store.setCurrentItem(item);
    store.setPlaybackState({
      currentItem: item,
      playbackStatus: 'loading',
      duration: 0,
      currentPosition: 0,
      error: null,
    });

    engine.load(item.audioUrl);

    try {
      await engine.play();

      if (loadToken !== currentLoadToken) return;
      if (activeItemId !== item.id) return;

      store.setPlaybackState({
        currentItem: item,
        playbackStatus: 'playing',
        duration: normalizeTime(engine.getDuration()),
        currentPosition: normalizeTime(engine.getCurrentTime()),
        error: null,
      });
    } catch (error) {
      if (loadToken !== currentLoadToken) return;
      if (activeItemId !== item.id) return;

      store.setPlaybackState({
        currentItem: item,
        playbackStatus: 'paused',
        duration: normalizeTime(engine.getDuration()),
        currentPosition: normalizeTime(engine.getCurrentTime()),
        error: 'Unable to start playback.',
      });
      throw error;
    }
  };

  const moveToNextQueueItem = async () => {
    const currentStore = getStoreState();

    if (!currentStore.queue.length) {
      stopPlaybackGracefully({
        playbackStatus: 'idle',
        duration: engine.getDuration(),
        currentPosition: engine.getCurrentTime(),
        error: null,
      });
      return;
    }

    if (currentStore.repeatMode === 'one' && currentStore.currentItem) {
      await playItem(currentStore.currentItem);
      return;
    }

    const nextItem = store.goToNext();
    if (!nextItem) {
      stopPlaybackGracefully({
        playbackStatus: 'idle',
        duration: engine.getDuration(),
        currentPosition: engine.getCurrentTime(),
        error: null,
      });
      return;
    }

    await playItem(nextItem);
  };

  const unsubscribe = engine.subscribe((snapshot) => {
    const currentStore = getStoreState();
    if (activeItemId && currentStore.currentItem?.id !== activeItemId) {
      return;
    }

    if (snapshot.playbackStatus === 'idle' && snapshot.currentPosition > 0 && currentStore.currentItem && currentStore.isPlaying) {
      void moveToNextQueueItem();
      return;
    }

    if (snapshot.error) {
      store.setPlaybackState({
        playbackStatus: snapshot.playbackStatus,
        duration: normalizeTime(snapshot.duration),
        currentPosition: normalizeTime(snapshot.currentPosition),
        error: snapshot.error,
      });
      return;
    }

    syncState(snapshot);
  });

  return {
    async loadItem(item) {
      store.replaceQueue([item], 0);
      await playItem(item);
    },
    async play() {
      const currentStore = getStoreState();
      const currentItem = currentStore.currentItem ?? currentStore.queue[currentStore.currentIndex] ?? currentStore.queue[0] ?? null;

      if (!currentItem?.audioUrl) {
        store.setPlaybackState({
          playbackStatus: 'idle',
          duration: 0,
          currentPosition: 0,
          error: currentItem ? 'Audio source is unavailable.' : 'No playable item selected.',
        });
        engine.stop();
        currentLoadToken += 1;
        activeItemId = null;
        return;
      }

      if (currentStore.playbackStatus === 'playing') {
        return;
      }

      if (currentStore.playbackStatus === 'loading') {
        return;
      }

      currentLoadToken += 1;
      activeItemId = currentItem.id;
      const token = currentLoadToken;

      try {
        await engine.play();

        if (token !== currentLoadToken) return;
        const latestStore = getStoreState();
        if (activeItemId && latestStore.currentItem?.id !== activeItemId) return;

        store.setPlaybackState({
          currentItem: latestStore.currentItem,
          playbackStatus: 'playing',
          duration: normalizeTime(engine.getDuration()),
          currentPosition: normalizeTime(engine.getCurrentTime()),
          error: null,
        });
      } catch (error) {
        if (token !== currentLoadToken) return;

        store.setPlaybackState({
          playbackStatus: 'paused',
          duration: normalizeTime(engine.getDuration()),
          currentPosition: normalizeTime(engine.getCurrentTime()),
          error: 'Unable to start playback.',
        });
        throw error;
      }
    },
    pause() {
      engine.pause();
      store.setPlaybackState({
        playbackStatus: 'paused',
        duration: normalizeTime(engine.getDuration()),
        currentPosition: normalizeTime(engine.getCurrentTime()),
        error: null,
      });
    },
    stop() {
      const currentStore = getStoreState();
      currentLoadToken += 1;
      activeItemId = null;
      engine.stop();
      store.setPlaybackState({
        currentItem: currentStore.currentItem,
        playbackStatus: 'idle',
        duration: normalizeTime(engine.getDuration()),
        currentPosition: 0,
        error: null,
      });
    },
    setVolume(volume) {
      engine.setVolume(volume);
      store.setVolume(volume);
      syncState();
    },
    setCurrentTime(position) {
      const safePosition = Number.isFinite(position) ? Math.max(0, position) : 0;
      engine.setCurrentTime(safePosition);
      syncState();
    },
    async replaceQueue(items, startIndex = 0) {
      if (!items.length) {
        currentLoadToken += 1;
        activeItemId = null;
        store.clearQueue();
        store.setPlaybackState({
          currentItem: null,
          playbackStatus: 'idle',
          duration: 0,
          currentPosition: 0,
          error: null,
        });
        engine.stop();
        return;
      }

      const targetIndex = Math.max(0, Math.min(startIndex, items.length - 1));
      const targetItem = items[targetIndex] ?? items[0];

      store.replaceQueue(items, targetIndex);
      await playItem(targetItem);
    },
    clearQueue() {
      currentLoadToken += 1;
      activeItemId = null;
      store.clearQueue();
      store.setPlaybackState({
        currentItem: null,
        playbackStatus: 'idle',
        duration: 0,
        currentPosition: 0,
        error: null,
      });
      engine.stop();
    },
    async next() {
      await moveToNextQueueItem();
    },
    async previous() {
      const currentStore = getStoreState();
      if (!currentStore.queue.length) {
        stopPlaybackGracefully({
          playbackStatus: 'idle',
          duration: engine.getDuration(),
          currentPosition: engine.getCurrentTime(),
          error: null,
        });
        return;
      }

      const previousItem = store.goToPrevious();

      if (!previousItem) {
        return;
      }

      await playItem(previousItem);
    },
    destroy() {
      unsubscribe();
      engine.destroy();
    },
  };
}

let sharedPlayerRuntimeController: PlayerRuntimeController | null = null;

export function getPlayerRuntimeController(): PlayerRuntimeController {
  if (!sharedPlayerRuntimeController) {
    sharedPlayerRuntimeController = createPlayerRuntimeController(usePlayerStore.getState());

    if (typeof window !== 'undefined' && 'addEventListener' in window) {
      window.addEventListener('beforeunload', destroyPlayerRuntimeController, { once: true });
    }
  }

  return sharedPlayerRuntimeController;
}

export function destroyPlayerRuntimeController() {
  sharedPlayerRuntimeController?.destroy();
  sharedPlayerRuntimeController = null;
}
