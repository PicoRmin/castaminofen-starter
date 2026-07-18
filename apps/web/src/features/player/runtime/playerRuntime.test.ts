import assert from 'node:assert/strict';
import test from 'node:test';
import { usePlayerStore } from '../store/playerStore.ts';

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
