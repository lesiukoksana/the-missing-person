import type { Thread } from '../../data/messages';
import { isRequirementMet } from '../../store/selectors';
import type { GameState } from '../../types/game';

export function isThreadOpen(thread: Thread, state: GameState) {
  return thread.requirement === null || isRequirementMet(thread.requirement, state);
}

/** Locked threads stay hidden, except the deleted email, which tells the player how to recover it. */
export function isThreadListed(thread: Thread, state: GameState) {
  return thread.kind === 'reconstruction' || isThreadOpen(thread, state);
}
