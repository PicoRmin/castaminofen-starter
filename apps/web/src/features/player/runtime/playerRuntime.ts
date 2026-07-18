import { createBrowserAudioEngine } from './audioEngine';
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

export function createPlayerRuntimeController(store: PlayerState): PlayerRuntimeController {
  const engine = createBrowserAudioEngine();

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
    store.setCurrentItem(item);
    store.setPlaybackState({
      currentItem: item,
      playbackStatus: 'loading',
      duration: 0,
      currentPosition: 0,
      error: null,
    });

    engine.load(item.audioUrl);
    await engine.play();
    store.setPlaybackState({
      currentItem: item,
      playbackStatus: 'playing',
      duration: engine.getDuration(),
      currentPosition: engine.getCurrentTime(),
      error: null,
    });
  };

  const moveToNextQueueItem = async () => {
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

    syncState(snapshot);
  });

  return {
    async loadItem(item) {
      store.replaceQueue([item], 0);
      await playItem(item);
    },
    async play() {
      await engine.play();
      syncState();
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
      engine.setCurrentTime(position);
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
