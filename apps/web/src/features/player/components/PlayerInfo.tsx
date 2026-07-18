'use client';

import { usePlayerState } from '../hooks/usePlayerState';

export function PlayerInfo() {
  const { currentItem, playbackStatus, error } = usePlayerState();

  const title = currentItem?.title ?? 'No active playback';
  const subtitle = currentItem?.subtitle ?? (playbackStatus === 'loading' ? 'Preparing audio…' : playbackStatus === 'idle' ? 'Choose an episode to start listening.' : 'Playback available');

  return (
    <div className="min-w-0">
      <p className="truncate text-sm font-semibold text-text-primary">{title}</p>
      <p className="truncate text-xs text-text-secondary">{subtitle}</p>
      {error ? <p className="mt-1 truncate text-xs text-accent">{error}</p> : null}
    </div>
  );
}
