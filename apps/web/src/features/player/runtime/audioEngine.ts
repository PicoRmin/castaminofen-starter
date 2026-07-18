import type { PlayerPlaybackStatus } from '../types';

export type AudioPlaybackSnapshot = {
  playbackStatus: PlayerPlaybackStatus;
  duration: number;
  currentPosition: number;
  error: string | null;
  isPlaying: boolean;
};

export interface AudioEngine {
  load(src?: string): void;
  play(): Promise<void>;
  pause(): void;
  stop(): void;
  setVolume(volume: number): void;
  setCurrentTime(position: number): void;
  getCurrentTime(): number;
  getDuration(): number;
  subscribe(listener: (snapshot: AudioPlaybackSnapshot) => void): () => void;
  destroy(): void;
}

const clampVolume = (value: number) => Math.min(1, Math.max(0, value));

const createNoopAudioEngine = (): AudioEngine => ({
  load() {},
  async play() {},
  pause() {},
  stop() {},
  setVolume() {},
  setCurrentTime() {},
  getCurrentTime() { return 0; },
  getDuration() { return 0; },
  subscribe() { return () => {}; },
  destroy() {},
});

export function createBrowserAudioEngine(element?: HTMLAudioElement): AudioEngine {
  const audioElement = element ?? (typeof window !== 'undefined' && typeof window.Audio !== 'undefined' ? new window.Audio() : undefined);

  if (!audioElement) {
    return createNoopAudioEngine();
  }

  const listeners = new Set<(snapshot: AudioPlaybackSnapshot) => void>();

  const notify = () => {
    const snapshot: AudioPlaybackSnapshot = {
      playbackStatus: audioElement.ended ? 'idle' : audioElement.paused ? 'paused' : 'playing',
      duration: audioElement.duration || 0,
      currentPosition: audioElement.currentTime,
      error: null,
      isPlaying: !audioElement.paused && !audioElement.ended,
    };

    listeners.forEach((listener) => listener(snapshot));
  };

  const handleError = () => {
    const snapshot: AudioPlaybackSnapshot = {
      playbackStatus: 'paused',
      duration: audioElement.duration || 0,
      currentPosition: audioElement.currentTime,
      error: 'Unable to load audio playback.',
      isPlaying: false,
    };

    listeners.forEach((listener) => listener(snapshot));
  };

  const events = ['play', 'pause', 'ended', 'timeupdate', 'loadedmetadata', 'canplay', 'error'] as const;

  events.forEach((eventName) => {
    audioElement.addEventListener(eventName, notify);
    if (eventName === 'error') {
      audioElement.addEventListener(eventName, handleError);
    }
  });

  return {
    load(src) {
      if (src) {
        audioElement.src = src;
      }

      audioElement.load();
      notify();
    },
    async play() {
      try {
        await audioElement.play();
        notify();
      } catch (error) {
        handleError();
        throw error;
      }
    },
    pause() {
      audioElement.pause();
      notify();
    },
    stop() {
      audioElement.pause();
      audioElement.currentTime = 0;
      notify();
    },
    setVolume(volume) {
      audioElement.volume = clampVolume(volume);
      notify();
    },
    setCurrentTime(position) {
      audioElement.currentTime = position;
      notify();
    },
    getCurrentTime() {
      return audioElement.currentTime;
    },
    getDuration() {
      return audioElement.duration || 0;
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    destroy() {
      events.forEach((eventName) => {
        audioElement.removeEventListener(eventName, notify);
        if (eventName === 'error') {
          audioElement.removeEventListener(eventName, handleError);
        }
      });
      listeners.clear();
    },
  };
}
