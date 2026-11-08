import type { EndingId, GameState } from '../../types/game';

const DAY = 86_400_000;
export const SWITCH_DAYS = 30;

export const ENDING_TITLES: Record<EndingId, string> = {
  officialStory: 'The Official Story',
  wrongPerson: 'The Wrong Person',
  truth: 'The Truth',
  stillOnline: 'Still Online',
};

/**
 * After THE TRUTH, Eleanor's switch sends everything once 30 days pass without anyone typing the word.
 * Every check-in pushes the date back. The game never says so.
 */
export function switchDeadline(state: GameState): Date | null {
  if (state.ending !== 'truth' || !state.endingAt) return null;
  const times = [state.endingAt, ...state.checkIns].map((value) => Date.parse(value)).filter((value) => !Number.isNaN(value));
  if (times.length === 0) return null;
  return new Date(Math.max(...times) + SWITCH_DAYS * DAY);
}

export function hasSent(state: GameState, now = Date.now()) {
  const deadline = switchDeadline(state);
  return deadline !== null && now >= deadline.getTime();
}

export function daysUntil(date: Date, now = Date.now()) {
  return Math.max(0, Math.ceil((date.getTime() - now) / DAY));
}

/** The words that appear in the guestbook in STILL ONLINE: the player's own longest note. */
export function playerWords(state: GameState) {
  const notes = state.board.notes.map((note) => note.text.trim()).filter(Boolean);
  if (notes.length === 0) return 'where are you';
  const longest = notes.reduce((best, note) => (note.length > best.length ? note : best));
  return longest.length > 280 ? `${longest.slice(0, 277)}…` : longest;
}

/** Puzzles the player still needs before the file supports naming Reed. */
export function missingForTruth(state: GameState) {
  return (['blogPassword', 'photoMetadata', 'emailReconstruction', 'terminalCode', 'finalConnections'] as const).filter(
    (puzzle) => !state.solvedPuzzles.includes(puzzle),
  );
}
