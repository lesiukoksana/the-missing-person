import { PUZZLES } from '../features/puzzles/definitions';
import { createInitialState } from '../store/gameState';
import type {
  BoardConnection,
  BoardPosition,
  BoardState,
  EndingId,
  GameState,
  PlayerNote,
  PuzzleId,
  RecentDiscovery,
  Settings,
} from '../types/game';

export const SAVE_KEY = 'the-missing-person:save';
const CORRUPT_BACKUP_KEY = 'the-missing-person:save:corrupt';
const ENDINGS: EndingId[] = ['officialStory', 'wrongPerson', 'truth', 'stillOnline'];

export type StorageIssue = 'corrupt' | 'unavailable';

export interface LoadResult {
  state: GameState;
  issue: StorageIssue | null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function uniqueStrings(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((item): item is string => typeof item === 'string'))];
}

function isPosition(value: unknown): value is BoardPosition {
  return isRecord(value) && Number.isFinite(value.x) && Number.isFinite(value.y);
}

function normalizeBoard(value: unknown): BoardState {
  if (!isRecord(value)) return { positions: {}, connections: [], notes: [] };

  const positions = isRecord(value.positions)
    ? Object.fromEntries(Object.entries(value.positions).filter(([, item]) => isPosition(item)))
    : {};

  const connections = Array.isArray(value.connections)
    ? value.connections.filter(
        (item): item is BoardConnection =>
          isRecord(item) && typeof item.from === 'string' && typeof item.to === 'string',
      )
    : [];

  const notes = Array.isArray(value.notes)
    ? value.notes.filter(
        (item): item is PlayerNote =>
          isRecord(item) &&
          typeof item.id === 'string' &&
          typeof item.text === 'string' &&
          isPosition(item.position),
      )
    : [];

  return { positions: positions as Record<string, BoardPosition>, connections, notes };
}

function normalizeSettings(value: unknown): Settings {
  const motion = isRecord(value) && value.motion === 'reduced' ? 'reduced' : 'system';
  const sound = isRecord(value) && value.sound === true;
  return { motion, sound };
}

function normalizeRecent(value: unknown): RecentDiscovery[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is RecentDiscovery =>
      isRecord(item) &&
      typeof item.id === 'string' &&
      typeof item.label === 'string' &&
      typeof item.at === 'string',
  );
}

/** Rebuilds a state from stored data, so older or damaged saves can't break the game. */
export function normalizeState(raw: unknown): GameState {
  const defaults = createInitialState();
  if (!isRecord(raw)) return defaults;

  const puzzleIds = new Set<string>(PUZZLES.map((puzzle) => puzzle.id));

  return {
    startedAt: typeof raw.startedAt === 'string' ? raw.startedAt : null,
    discoveredEvidence: uniqueStrings(raw.discoveredEvidence),
    readDocuments: uniqueStrings(raw.readDocuments),
    viewedPhotos: uniqueStrings(raw.viewedPhotos),
    discoveredMessages: uniqueStrings(raw.discoveredMessages),
    timelineDiscoveries: uniqueStrings(raw.timelineDiscoveries),
    unlocked: uniqueStrings(raw.unlocked),
    flags: uniqueStrings(raw.flags),
    solvedPuzzles: uniqueStrings(raw.solvedPuzzles).filter((id): id is PuzzleId =>
      puzzleIds.has(id),
    ),
    checkIns: Array.isArray(raw.checkIns)
      ? raw.checkIns.filter((item): item is string => typeof item === 'string')
      : [],
    board: normalizeBoard(raw.board),
    recentDiscoveries: normalizeRecent(raw.recentDiscoveries),
    ending: ENDINGS.includes(raw.ending as EndingId) ? (raw.ending as EndingId) : null,
    endingVariant: typeof raw.endingVariant === 'string' ? raw.endingVariant : null,
    endingAt: typeof raw.endingAt === 'string' ? raw.endingAt : null,
    endingsReached: uniqueStrings(raw.endingsReached).filter((id): id is EndingId =>
      ENDINGS.includes(id as EndingId),
    ),
    settings: normalizeSettings(raw.settings),
  };
}

export function loadGame(): LoadResult {
  let stored: string | null;
  try {
    stored = window.localStorage.getItem(SAVE_KEY);
  } catch {
    return { state: createInitialState(), issue: 'unavailable' };
  }

  if (stored === null) return { state: createInitialState(), issue: null };

  try {
    const parsed: unknown = JSON.parse(stored);
    if (!isRecord(parsed)) throw new Error('Save is not an object');
    return { state: normalizeState(parsed), issue: null };
  } catch {
    try {
      window.localStorage.setItem(CORRUPT_BACKUP_KEY, stored);
    } catch {
      // The save is unreadable and can't be backed up. Starting fresh is all that's left.
    }
    return { state: createInitialState(), issue: 'corrupt' };
  }
}

export function saveGame(state: GameState): boolean {
  try {
    window.localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}
