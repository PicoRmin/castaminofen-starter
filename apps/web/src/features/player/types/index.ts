export type PlayerPlaybackStatus = 'idle' | 'loading' | 'playing' | 'paused';

export type PlayerRepeatMode = 'off' | 'one' | 'queue';

export type PlayableSourceType = 'episode' | 'podcast' | 'library' | 'unknown';

export interface PlayableItem {
  id: string;
  title: string;
  subtitle?: string;
  audioUrl?: string;
  artworkUrl?: string;
  duration?: number;
  sourceType: PlayableSourceType;
}

export interface PlayerRuntimeState {
  currentItem: PlayableItem | null;
  playbackStatus: PlayerPlaybackStatus;
  duration: number;
  currentPosition: number;
  error: string | null;
}
