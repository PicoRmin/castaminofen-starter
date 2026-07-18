'use client';

import { Volume2 } from 'lucide-react';
import { usePlayerRuntime } from '../hooks/usePlayerRuntime';
import { usePlayerState } from '../hooks/usePlayerState';

export function PlayerVolume() {
  const playerRuntime = usePlayerRuntime();
  const { volume, currentItem } = usePlayerState();

  return (
    <div className="flex items-center gap-2">
      <Volume2 size={16} className="text-text-secondary" />
      <input
        type="range"
        min={0}
        max={1}
        step={0.05}
        value={volume}
        onChange={(event) => playerRuntime.setVolume(Number(event.target.value))}
        className="h-2 w-20 cursor-pointer appearance-none rounded-full bg-surface-tertiary accent-accent"
        disabled={!currentItem?.audioUrl}
        aria-label="Playback volume"
      />
    </div>
  );
}
