import type {
  BoardState,
  CollectionKey,
  EndingId,
  GameState,
  PuzzleId,
  Settings,
} from '../types/game';

const MAX_RECENT_DISCOVERIES = 8;

export function createInitialState(
  settings: Settings = { motion: 'system', sound: false },
  endingsReached: EndingId[] = [],
): GameState {
  return {
    startedAt: null,
    discoveredEvidence: [],
    readDocuments: [],
    viewedPhotos: [],
    discoveredMessages: [],
    timelineDiscoveries: [],
    unlocked: [],
    flags: [],
    solvedPuzzles: [],
    checkIns: [],
    board: { positions: {}, connections: [], notes: [] },
    recentDiscoveries: [],
    ending: null,
    endingVariant: null,
    endingAt: null,
    endingsReached,
    settings,
  };
}

export type GameAction =
  | { type: 'startInvestigation'; at: string }
  /** Adds an id to a collection. Duplicates are ignored. A label also logs it as a recent discovery. */
  | { type: 'collect'; collection: CollectionKey; id: string; label?: string; at: string }
  | { type: 'solvePuzzle'; puzzle: PuzzleId; label: string; at: string }
  | { type: 'checkIn'; at: string }
  | { type: 'setBoard'; board: BoardState }
  | { type: 'reachEnding'; ending: EndingId; variant?: string; at: string }
  /** Withdraws the filed conclusion. All progress is kept. */
  | { type: 'reopenCase' }
  | { type: 'updateSettings'; settings: Partial<Settings> }
  /** Clears all progress. Settings and the list of endings found are kept. */
  | { type: 'reset' }
  /** Replaces the state with one loaded from storage, for example from another tab. */
  | { type: 'hydrate'; state: GameState };

function logDiscovery(state: GameState, id: string, label: string, at: string) {
  return [{ id, label, at }, ...state.recentDiscoveries].slice(0, MAX_RECENT_DISCOVERIES);
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'startInvestigation':
      return state.startedAt ? state : { ...state, startedAt: action.at };

    case 'collect': {
      if (state[action.collection].includes(action.id)) return state;
      return {
        ...state,
        [action.collection]: [...state[action.collection], action.id],
        recentDiscoveries: action.label
          ? logDiscovery(state, action.id, action.label, action.at)
          : state.recentDiscoveries,
      };
    }

    case 'solvePuzzle':
      if (state.solvedPuzzles.includes(action.puzzle)) return state;
      return {
        ...state,
        solvedPuzzles: [...state.solvedPuzzles, action.puzzle],
        recentDiscoveries: logDiscovery(state, action.puzzle, action.label, action.at),
      };

    case 'checkIn':
      return { ...state, checkIns: [...state.checkIns, action.at] };

    case 'setBoard':
      return { ...state, board: action.board };

    case 'reachEnding':
      return {
        ...state,
        ending: action.ending,
        endingVariant: action.variant ?? null,
        endingAt: action.at,
        endingsReached: state.endingsReached.includes(action.ending)
          ? state.endingsReached
          : [...state.endingsReached, action.ending],
      };

    case 'reopenCase':
      return { ...state, ending: null, endingVariant: null, endingAt: null };

    case 'updateSettings':
      return { ...state, settings: { ...state.settings, ...action.settings } };

    case 'reset':
      return createInitialState(state.settings, state.endingsReached);

    case 'hydrate':
      return action.state;
  }
}
