import type { PuzzleDefinition } from '../../types/game';

/** Titles only. Solutions live with each puzzle's own logic. */
export const PUZZLES: PuzzleDefinition[] = [
  { id: 'blogPassword', title: 'The password in the blog' },
  { id: 'photoMetadata', title: 'The photograph’s metadata' },
  { id: 'emailReconstruction', title: 'The deleted email' },
  { id: 'terminalCode', title: 'The terminal code' },
  { id: 'finalConnections', title: 'The final connections' },
];

export const PUZZLES_BY_ID = Object.fromEntries(
  PUZZLES.map((puzzle) => [puzzle.id, puzzle]),
) as Record<PuzzleDefinition['id'], PuzzleDefinition>;
