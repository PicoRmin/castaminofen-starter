'use client';

import { ChevronLeft, ChevronRight, Pause, Play, Repeat1, Repeat2, Shuffle, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePlayerRuntime } from '../hooks/usePlayerRuntime';
import { usePlayerState } from '../hooks/usePlayerState';

export function PlayerControls() {
  const playerRuntime = usePlayerRuntime();
  const { currentItem, playbackStatus, isPlaying, queue, currentIndex, repeatMode, shuffleEnabled, toggleRepeat, toggleShuffle } = usePlayerState();

  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex >= 0 && queue.length > 0 && (repeatMode === 'queue' || shuffleEnabled || currentIndex < queue.length - 1);
  const hasPlayableItem = Boolean(currentItem?.audioUrl);

  const handleTogglePlayback = async () => {
    if (!currentItem?.audioUrl) {
      return;
    }

    if (playbackStatus === 'playing') {
      playerRuntime.pause();
      return;
    }

    if (playbackStatus === 'paused') {
      await playerRuntime.play();
      return;
    }

    await playerRuntime.loadItem(currentItem);
  };

  const handleStop = () => {
    playerRuntime.stop();
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-10 w-10 rounded-full p-0"
        onClick={() => void playerRuntime.previous()}
        disabled={!canGoPrevious || !hasPlayableItem}
        aria-label="Previous item"
      >
        <ChevronLeft size={16} />
      </Button>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="h-10 w-10 rounded-full p-0"
        onClick={() => void handleTogglePlayback()}
        disabled={!hasPlayableItem}
        aria-label={isPlaying ? 'Pause playback' : 'Start playback'}
        aria-busy={playbackStatus === 'loading'}
      >
        {playbackStatus === 'loading' ? <span className="text-xs font-semibold">...</span> : isPlaying ? <Pause size={16} /> : <Play size={16} />}
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-10 w-10 rounded-full p-0"
        onClick={handleStop}
        disabled={!hasPlayableItem}
        aria-label="Stop playback"
      >
        <Square size={14} />
      </Button>
      <Button
        type="button"
        variant={shuffleEnabled ? 'secondary' : 'ghost'}
        size="sm"
        className={`h-10 w-10 rounded-full p-0 ${shuffleEnabled ? 'text-primary' : ''}`}
        onClick={() => toggleShuffle()}
        aria-label={`Shuffle ${shuffleEnabled ? 'on' : 'off'}`}
        aria-pressed={shuffleEnabled}
      >
        <Shuffle size={16} />
      </Button>
      <Button
        type="button"
        variant={repeatMode === 'off' ? 'ghost' : 'secondary'}
        size="sm"
        className={`h-10 w-10 rounded-full p-0 ${repeatMode !== 'off' ? 'text-primary' : ''}`}
        onClick={() => toggleRepeat()}
        aria-label={`Repeat ${repeatMode}`}
        aria-pressed={repeatMode !== 'off'}
      >
        {repeatMode === 'one' ? <Repeat1 size={16} /> : <Repeat2 size={16} />}
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-10 w-10 rounded-full p-0"
        onClick={() => void playerRuntime.next()}
        disabled={!canGoNext || !hasPlayableItem}
        aria-label="Next item"
      >
        <ChevronRight size={16} />
      </Button>
    </div>
  );
}
