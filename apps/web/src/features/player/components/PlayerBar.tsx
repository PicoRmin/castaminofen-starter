'use client';

import { PlayerControls } from './PlayerControls';
import { PlayerInfo } from './PlayerInfo';
import { PlayerProgress } from './PlayerProgress';
import { PlayerVolume } from './PlayerVolume';
import { usePlayerState } from '../hooks/usePlayerState';

export function PlayerBar() {
  const { currentItem, playbackStatus, error, queue } = usePlayerState();

  return (
    <div className="rounded-2xl border border-border bg-surface-secondary/95 p-3 shadow-soft backdrop-blur">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="min-w-0 flex-1">
          <PlayerInfo />
          {!currentItem && !error && queue.length === 0 ? (
            <p className="mt-1 text-xs text-text-secondary">Select an episode to start listening.</p>
          ) : null}
          {!currentItem && !error && queue.length > 0 ? (
            <p className="mt-1 text-xs text-text-secondary">Queue ready. Press play to start.</p>
          ) : null}
          {playbackStatus === 'loading' ? <p className="mt-1 text-xs text-text-secondary">Loading playback…</p> : null}
          {error ? <p className="mt-1 text-xs text-accent">{error}</p> : null}
        </div>
        <div className="flex items-center justify-between gap-3 md:justify-center">
          <PlayerControls />
          <div className="hidden md:block md:flex-1">
            <PlayerProgress />
          </div>
          <div className="hidden sm:block">
            <PlayerVolume />
          </div>
        </div>
      </div>
      <div className="mt-2 md:hidden">
        <PlayerProgress />
      </div>
    </div>
  );
}
