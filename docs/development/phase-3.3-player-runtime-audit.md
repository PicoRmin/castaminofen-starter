# Phase 3.3 — Player Runtime Stabilization Audit Report

## 1. Current State

The Player feature is currently implemented as a dedicated feature boundary inside `apps/web/src/features/player`.
The runtime is exposed through `playerRuntime.ts`, with `usePlayerRuntime()` returning a singleton controller.
Playback state is owned by a Zustand store in `playerStore.ts` and consumed by UI components via `usePlayerState()`.
The compact player UI is mounted in `apps/web/src/components/layout/app-shell.tsx` and includes `PlayerBar`, `PlayerControls`, `PlayerInfo`, `PlayerProgress`, and `PlayerVolume`.

No direct audio playback logic or `HTMLAudioElement` creation was found outside `apps/web/src/features/player/runtime/audioEngine.ts`.

## 2. Runtime Architecture Review

- The runtime controller is the only owner of playback lifecycle methods (`loadItem`, `play`, `pause`, `stop`, `next`, `previous`, `replaceQueue`, `clearQueue`).
- `audioEngine.ts` is a browser audio adapter with a clear contract: load, play, pause, stop, volume/time control, snapshot subscription, and destroy.
- There is a singleton runtime controller created by `getPlayerRuntimeController()` and cleaned up by `destroyPlayerRuntimeController()`.
- `usePlayerRuntime()` correctly avoids creating duplicated runtime instances and always returns the shared controller.
- `audioEngine` event listeners are registered in `createBrowserAudioEngine()` and removed in `destroy()`.
- `PlayerRuntime` uses a `currentLoadToken` guard to prevent stale async successes from overwriting new playback state.
- No unnecessary abstraction layers were introduced: there is no `PlaybackService`, `QueueManager`, event bus, state machine framework, or generic media framework in the current Player implementation.

## 3. State Ownership Review

- The store is the single source of truth for playback state and queue state.
- `PlayerState` contains:
  - `currentItem`
  - `queue`
  - `currentIndex`
  - `playbackStatus`
  - `duration`
  - `currentPosition`
  - `error`
  - `volume`
  - `repeatMode`
  - `shuffleEnabled`
  - `isPlaying` (derived from `playbackStatus`)
- No duplicate playback fields were found beyond the derived `isPlaying` flag.
- Queue decisions remain inside the Player store and runtime:
  - `replaceQueue`, `clearQueue`, `goToNext`, `goToPrevious` are store-owned.
  - `moveToNextQueueItem` and `playItem` in runtime coordinate playback transitions.
- `setPlaybackState` is the single update path for runtime-controlled playback fields.
- `goToNext` implements repeat one, repeat queue wrap, and shuffle selection without mutating queue order.
- `replaceQueue` clamps invalid start indices and safely handles empty queue replacements.

## 4. UI Review

- `PlayerBar` is compact and mobile-first, with responsive display logic for progress and volume.
- `PlayerControls` disables previous/next based on queue boundaries, repeat mode, and shuffle state.
- `PlayerControls` exposes repeat and shuffle toggles with proper `aria-pressed` and accessible labels.
- `PlayerInfo` shows current title, contextual subtitle, and error text.
- `PlayerProgress` displays formatted position/duration and allows seeking via `setCurrentTime`.
- `PlayerVolume` exposes browser volume control and disables when no playable item is selected.
- Loading state is visible in both the player bar and play button.
- Empty and idle states are presented with user guidance messages.
- No explicit RTL-specific CSS was found, but the layout uses generic Tailwind utility classes and does not hardcode left/right direction.

## 5. Edge Case Review

- Empty queue handling:
  - `next()` gracefully stops playback and sets `playbackStatus` to `idle` when queue is empty.
  - `clearQueue()` also resets current item, playback status, position, and duration.
- Missing playable source:
  - `loadItem` with no `audioUrl` sets `error: 'Audio source is unavailable.'` and `playbackStatus: 'idle'`.
  - `play()` with a missing or invalid current item also returns idle state with an error.
- Invalid queue index:
  - `replaceQueue()` clamps `startIndex` to a valid range.
- Next at queue boundary:
  - `goToNext()` returns null if there is no next item and repeat queue is not active.
  - `moveToNextQueueItem()` stops gracefully when there is no next item.
- Previous at queue boundary:
  - `goToPrevious()` returns null and preserves state when `currentIndex <= 0`.
  - This behavior is consistent with the UI disabling the previous button.
- Repeat one:
  - Runtime replays the current item when `repeatMode === 'one'`.
- Repeat queue:
  - Store wraps from queue end to the first item when `repeatMode === 'queue'`.
- Shuffle enabled:
  - Store chooses a random non-current queue item and keeps queue order unchanged.
- Rapid next/previous and play/pause:
  - `currentLoadToken` guards stale async loads and plays.
  - `pause()` and `stop()` immediately call engine control methods and sync state.
- Browser audio errors:
  - `AudioEngine` listens for `error` and publishes a snapshot with `pendingError`.
  - Runtime propagates snapshot error into store state.

## 6. Test Coverage Review

Existing Vitest coverage includes:
- Repeat queue wrapping.
- Repeat toggle cycling.
- Shuffle selection without queue mutation.
- Missing audio source error state.
- `setCurrentItem` preserving idle state.
- Singleton runtime controller sharing.
- Runtime destroy cleanup of engine subscriptions.
- `next()` with empty queue stopping gracefully.

Coverage gaps identified for future regression tests:
- Runtime initialization and singleton creation on mount.
- `getPlayerRuntimeController()` `beforeunload` cleanup registration.
- `replaceQueue()` with empty items and start-index clamping.
- `clearQueue()` state reset behavior.
- `previous()` behavior at queue boundary and with repeat/shuffle edge cases.
- `play()` when current item is valid but previously paused.
- `setCurrentTime()` and `setVolume()` state synchronization.
- Error propagation from actual browser audio `error` events into runtime state.
- Rapid sequential `next()`/`previous()` calls under queue boundaries.

## 7. Findings

- The Player architecture is appropriately simple and feature-focused.
- Player Runtime is the owner of playback lifecycle, while `AudioEngine` is a thin browser audio adapter.
- State ownership is centralized in the Player store; the runtime does not duplicate queue or playback fields.
- No legacy audio playback references or direct `new Audio()` usage were found outside `audioEngine.ts`.
- No over-engineering patterns were detected in current Player code.
- The UI surface is consistent with mobile-first expectations and provides clear loading, idle, and error feedback.

## 8. Risks

- `goToPrevious()` does not support repeat queue wrapping or shuffle-based backward navigation; this may be a user expectation gap if previous behavior is intended to match next logic.
- `AudioEngine.destroy()` removes listeners and clears subscriptions, but it does not explicitly clear `audioElement.src`; this is a low-risk cleanup detail.
- Current edge-case tests are focused on store and runtime; UI-driven interaction regressions are not covered by the Player runtime test file.
- `PlayerProgress` relies on `duration || 0` and may show `00:00` while metadata is loading; this is the expected current behavior but should be tracked during polish.

## 9. Recommendation

The current Player runtime and UI state are stable enough to proceed to runtime hardening and UX polish.
The architecture is coherent, ownership boundaries are clear, and no code restructuring is required before the next implementation phase.

## 10. Final Decision

READY FOR IMPLEMENTATION
