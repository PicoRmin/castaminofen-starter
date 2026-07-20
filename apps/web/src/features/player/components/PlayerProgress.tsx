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
  const { currentPosition, duration, currentItem, playbackStatus } = usePlayerState();

  const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : 0;
  const safePosition = Number.isFinite(currentPosition) ? Math.min(currentPosition, safeDuration) : 0;
  const disabled = !currentItem?.audioUrl || playbackStatus === 'loading';

  return (
    <div className="flex flex-1 items-center gap-3">
      <span className="min-w-[2.75rem] text-right text-xs text-text-secondary">{formatTime(safePosition)}</span>
      <input
        type="range"
        min={0}
        max={safeDuration}
        step={1}
        value={safePosition}
        onChange={(event) => playerRuntime.setCurrentTime(Number(event.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-surface-tertiary accent-accent"
        disabled={disabled}
        aria-label="Playback progress"
      />
      <span className="min-w-[2.75rem] text-left text-xs text-text-secondary">{formatTime(safeDuration)}</span>
    </div>
  );
}
