import assert from 'node:assert/strict';
import test from 'node:test';
import { createPlayerRuntimeController } from './playerRuntime';
import { usePlayerStore } from '../store/playerStore';

const createItem = (id: string) => ({
  id,
  title: `Episode ${id}`,
  audioUrl: `https://example.com/${id}.mp3`,
  sourceType: 'episode' as const,
});

test('repeat queue wraps to the first item when advancing from the end of the queue', () => {
  const store = usePlayerStore.getState();
  const items = [createItem('a'), createItem('b'), createItem('c')];

  usePlayerStore.setState({
    ...store,
    currentItem: items[2],
    queue: items,
    currentIndex: 2,
    repeatMode: 'queue',
  });

  const nextItem = usePlayerStore.getState().goToNext();

  assert.equal(nextItem?.id, 'a');
});

test('toggleRepeat cycles through off, one, and queue modes', () => {
  const store = usePlayerStore.getState();

  usePlayerStore.setState({
    ...store,
    repeatMode: 'off',
  });

  usePlayerStore.getState().toggleRepeat();
  assert.equal(usePlayerStore.getState().repeatMode, 'one');

  usePlayerStore.getState().toggleRepeat();
  assert.equal(usePlayerStore.getState().repeatMode, 'queue');

  usePlayerStore.getState().toggleRepeat();
  assert.equal(usePlayerStore.getState().repeatMode, 'off');
});

test('goToNext uses shuffle selection without mutating the queue order', () => {
  const store = usePlayerStore.getState();
  const items = [createItem('a'), createItem('b'), createItem('c')];
  const originalRandom = Math.random;

  usePlayerStore.setState({
    ...store,
    currentItem: items[2],
    queue: items,
    currentIndex: 2,
    repeatMode: 'off',
    shuffleEnabled: true,
  });

  Math.random = () => 0;

  try {
    const nextItem = usePlayerStore.getState().goToNext();
    assert.equal(nextItem?.id, 'a');
  } finally {
    Math.random = originalRandom;
  }

  assert.deepEqual(usePlayerStore.getState().queue.map((item) => item.id), ['a', 'b', 'c']);
});

test('loadItem reports a clear error when an item has no audio source', async () => {
  const store = usePlayerStore.getState();
  const controller = createPlayerRuntimeController(store, {
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

  usePlayerStore.setState({
    ...store,
    currentItem: null,
    queue: [],
    currentIndex: -1,
    playbackStatus: 'idle',
    status: 'idle',
    error: null,
    isPlaying: false,
  });

  await controller.loadItem({
    id: 'missing-audio',
    title: 'Missing audio',
    sourceType: 'episode',
  });

  const state = usePlayerStore.getState();
  assert.equal(state.error, 'Audio source is unavailable.');
  assert.equal(state.playbackStatus, 'idle');
  assert.equal(state.currentItem?.id, 'missing-audio');
  controller.destroy();
});

test('next stops gracefully when the queue is empty', async () => {
  const store = usePlayerStore.getState();
  const controller = createPlayerRuntimeController(store, {
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

  usePlayerStore.setState({
    ...store,
    currentItem: null,
    queue: [],
    currentIndex: -1,
    playbackStatus: 'playing',
    status: 'playing',
    error: null,
    isPlaying: true,
  });

  await controller.next();

  const state = usePlayerStore.getState();
  assert.equal(state.playbackStatus, 'idle');
  assert.equal(state.error, null);
  controller.destroy();
});
