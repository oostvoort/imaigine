import { expect, it } from '@jest/globals'
import useQueue from '@/hooks/minigame/useQueue'

it('test_returns_object_with_battle_queue_and_set_queue_properties', () => {
  const result = useQueue();
  expect(result).toHaveProperty('battleQueue');
  expect(result).toHaveProperty('setQueue');
});
