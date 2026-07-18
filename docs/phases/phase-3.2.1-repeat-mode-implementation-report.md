# Phase 3.2.1 — Repeat Mode Implementation Report

## Objective

Add the first real playback mode to the Player feature by supporting Repeat Off, Repeat One, and Repeat Queue while keeping Episode ownership unchanged and preserving the existing Player runtime architecture.

## Scope

- Extend Player state with a repeat mode owner inside the Player feature.
- Route playback end-of-track decisions through the Player runtime.
- Expose a repeat toggle in the existing Player controls UI.
- Preserve queue ownership and avoid introducing new abstractions.

## Implemented Work

- Added a Player-owned repeat mode type and state transitions in [apps/web/src/features/player/store/playerStore.ts](../apps/web/src/features/player/store/playerStore.ts).
- Updated the runtime in [apps/web/src/features/player/runtime/playerRuntime.ts](../apps/web/src/features/player/runtime/playerRuntime.ts) so:
  - Repeat Off keeps the existing next-item behavior.
  - Repeat One reloads and replays the current item.
  - Repeat Queue wraps back to the first queue item after the queue is exhausted.
- Added a repeat toggle control to [apps/web/src/features/player/components/PlayerControls.tsx](../apps/web/src/features/player/components/PlayerControls.tsx).
- Added regression tests for repeat-mode state transitions and queue wrapping in [apps/web/src/features/player/runtime/playerRuntime.test.ts](../apps/web/src/features/player/runtime/playerRuntime.test.ts).

## Files Changed

- [apps/web/src/features/player/store/playerStore.ts](../apps/web/src/features/player/store/playerStore.ts)
- [apps/web/src/features/player/runtime/playerRuntime.ts](../apps/web/src/features/player/runtime/playerRuntime.ts)
- [apps/web/src/features/player/components/PlayerControls.tsx](../apps/web/src/features/player/components/PlayerControls.tsx)
- [apps/web/src/features/player/types/index.ts](../apps/web/src/features/player/types/index.ts)
- [apps/web/src/features/player/runtime/playerRuntime.test.ts](../apps/web/src/features/player/runtime/playerRuntime.test.ts)

## Validation

Commands executed:

- `node --test apps/web/src/features/player/runtime/playerRuntime.test.ts`
- `pnpm --filter @castaminofen/web lint`
- `pnpm --filter @castaminofen/web build`

Results:

- Regression tests passed: 2/2
- Web lint passed with no errors
- Web build completed successfully

## Notes

The implementation follows the planned ownership model by keeping repeat logic inside the Player feature and leaving Episode and Audio Engine responsibilities unchanged.

## Recommended Next Step

Proceed with the next playback-modes phase by adding Shuffle support on top of the same Player-owned runtime decision path.
