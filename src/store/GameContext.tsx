import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type Dispatch,
  type ReactNode,
} from 'react';
import type { GameState } from '../types/game';
import { loadGame, saveGame, SAVE_KEY, type StorageIssue } from '../utils/storage';
import { gameReducer, type GameAction } from './gameState';

interface GameContextValue {
  state: GameState;
  dispatch: Dispatch<GameAction>;
  storageIssue: StorageIssue | null;
  dismissStorageIssue: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [loaded] = useState(loadGame);
  const [state, dispatch] = useReducer(gameReducer, loaded.state);
  const [storageIssue, setStorageIssue] = useState(loaded.issue);

  useEffect(() => {
    if (!saveGame(state)) setStorageIssue('unavailable');
  }, [state]);

  // Keeps two open tabs from overwriting each other's progress.
  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (event.key === SAVE_KEY || event.key === null) {
        dispatch({ type: 'hydrate', state: loadGame().state });
      }
    }
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const value = useMemo(
    () => ({
      state,
      dispatch,
      storageIssue,
      dismissStorageIssue: () => setStorageIssue(null),
    }),
    [state, storageIssue],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const value = useContext(GameContext);
  if (!value) throw new Error('useGame must be used inside GameProvider');
  return value;
}
