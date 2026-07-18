'use client';

import { usePlayerState } from '../hooks/usePlayerState';
import { usePlayerRuntime } from '../hooks/usePlayerRuntime';

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return '00:00';
  }

  const safeSeconds = Math.floor(seconds);
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

export function PlayerProgress() {
  const playerRuntime = usePlayerRuntime();
  const { position, duration, currentItem } = usePlayerState();

  return (
    <div className="flex flex-1 items-center gap-3">
      <span className="min-w-[2.75rem] text-right text-xs text-text-secondary">{formatTime(position)}</span>
      <input
        type="range"
        min={0}
        max={duration || 0}
        step={1}
        value={position}
        onChange={(event) => playerRuntime.setCurrentTime(Number(event.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-surface-tertiary accent-accent"
        disabled={!currentItem?.audioUrl}
        aria-label="Playback progress"
      />
      <span className="min-w-[2.75rem] text-left text-xs text-text-secondary">{formatTime(duration)}</span>
    </div>
  );
}
