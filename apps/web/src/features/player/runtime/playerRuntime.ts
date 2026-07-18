import { createBrowserAudioEngine, type AudioEngine } from './audioEngine';
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

  const syncState = (snapshot?: { playbackStatus: PlayerPlaybackStatus; duration: number; currentPosition: number; error: string | null }) => {
    store.setPlaybackState({
      currentPosition: snapshot?.currentPosition ?? engine.getCurrentTime(),
      duration: snapshot?.duration ?? engine.getDuration(),
      error: snapshot?.error ?? null,
      playbackStatus: snapshot?.playbackStatus ?? 'paused',
    });
  };

  const stopPlaybackGracefully = (snapshot?: { playbackStatus: PlayerPlaybackStatus; duration: number; currentPosition: number; error: string | null }) => {
    const finalPosition = snapshot?.currentPosition ?? engine.getCurrentTime();
    const finalDuration = snapshot?.duration ?? engine.getDuration();

    engine.stop();
    store.setPlaybackState({
      currentItem: store.currentItem,
      playbackStatus: 'idle',
      duration: finalDuration,
      currentPosition: finalPosition,
      error: snapshot?.error ?? null,
    });
  };

  const playItem = async (item: PlayableItem) => {
    const loadToken = ++currentLoadToken;
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

      // Ignore results from earlier loads/plays if another load started
      // after this one.
      if (loadToken !== currentLoadToken) return;

      store.setPlaybackState({
        currentItem: item,
        playbackStatus: 'playing',
        duration: engine.getDuration(),
        currentPosition: engine.getCurrentTime(),
        error: null,
      });
    } catch (error) {
      // If a newer load has been requested, avoid overwriting state.
      if (loadToken !== currentLoadToken) return;

      store.setPlaybackState({
        currentItem: item,
        playbackStatus: 'paused',
        duration: engine.getDuration(),
        currentPosition: engine.getCurrentTime(),
        error: 'Unable to start playback.',
      });
      throw error;
    }
  };

  const moveToNextQueueItem = async () => {
    if (!store.queue.length) {
      stopPlaybackGracefully({
        playbackStatus: 'idle',
        duration: engine.getDuration(),
        currentPosition: engine.getCurrentTime(),
        error: null,
      });
      return;
    }

    if (store.repeatMode === 'one' && store.currentItem) {
      await playItem(store.currentItem);
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
    if (snapshot.playbackStatus === 'idle' && snapshot.currentPosition > 0 && store.currentItem && store.isPlaying) {
      void moveToNextQueueItem();
      return;
    }

    if (snapshot.error) {
      store.setPlaybackState({
        playbackStatus: snapshot.playbackStatus,
        duration: snapshot.duration,
        currentPosition: snapshot.currentPosition,
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
      if (!store.currentItem?.audioUrl) {
        store.setPlaybackState({
          playbackStatus: 'idle',
          duration: 0,
          currentPosition: 0,
          error: store.currentItem ? 'Audio source is unavailable.' : 'No playable item selected.',
        });
        engine.stop();
        return;
      }

      const token = currentLoadToken;

      try {
        await engine.play();

        // if a newer load started while we were waiting, ignore the result
        if (token !== currentLoadToken) return;

        syncState();
      } catch (error) {
        if (token !== currentLoadToken) return;

        store.setPlaybackState({
          playbackStatus: 'paused',
          duration: engine.getDuration(),
          currentPosition: engine.getCurrentTime(),
          error: 'Unable to start playback.',
        });
        throw error;
      }
    },
    pause() {
      engine.pause();
      syncState();
    },
    stop() {
      engine.stop();
      store.setPlaybackState({
        currentItem: store.currentItem,
        playbackStatus: 'idle',
        duration: engine.getDuration(),
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
      if (!store.queue.length) {
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
