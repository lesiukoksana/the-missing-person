export type PuzzleId =
  | 'blogPassword'
  | 'photoMetadata'
  | 'emailReconstruction'
  | 'terminalCode'
  | 'finalConnections';

export type EndingId = 'officialStory' | 'wrongPerson' | 'truth' | 'stillOnline';

export type SectionId =
  | 'website'
  | 'archive'
  | 'messages'
  | 'board'
  | 'suspects'
  | 'timeline'
  | 'recovery'
  | 'terminal'
  | 'conclusion';

export type MotionPreference = 'system' | 'reduced';

export interface Settings {
  motion: MotionPreference;
  /** Ambient sound. Off by default, and only ever started by a click or key press. */
  sound: boolean;
}

export interface BoardPosition {
  x: number;
  y: number;
}

export interface BoardConnection {
  from: string;
  to: string;
}

export interface PlayerNote {
  id: string;
  text: string;
  position: BoardPosition;
}

export interface BoardState {
  positions: Record<string, BoardPosition>;
  connections: BoardConnection[];
  notes: PlayerNote[];
}

export interface RecentDiscovery {
  id: string;
  label: string;
  at: string;
}

export interface GameState {
  startedAt: string | null;
  discoveredEvidence: string[];
  readDocuments: string[];
  viewedPhotos: string[];
  discoveredMessages: string[];
  timelineDiscoveries: string[];
  /** Pages and files opened by puzzles or clues. Sections use their own requirements. */
  unlocked: string[];
  /** Easter eggs and story beats. */
  flags: string[];
  solvedPuzzles: PuzzleId[];
  /** Every time the player typed the word at the owl page. Each one resets the switch. */
  checkIns: string[];
  board: BoardState;
  recentDiscoveries: RecentDiscovery[];
  ending: EndingId | null;
  /** For THE WRONG PERSON: who was accused. */
  endingVariant: string | null;
  /** When the conclusion was filed. Starts the 30-day timer after THE TRUTH. */
  endingAt: string | null;
  /** Every ending ever reached. Survives a reset. */
  endingsReached: EndingId[];
  settings: Settings;
}

/** The parts of the state that are plain lists of unique ids. */
export type CollectionKey =
  | 'discoveredEvidence'
  | 'readDocuments'
  | 'viewedPhotos'
  | 'discoveredMessages'
  | 'timelineDiscoveries'
  | 'unlocked'
  | 'flags';

export type Requirement =
  | { kind: 'evidence'; count: number }
  | { kind: 'documents'; count: number }
  | { kind: 'puzzle'; puzzle: PuzzleId }
  | { kind: 'flag'; flag: string; description: string };

export interface SectionDefinition {
  id: SectionId;
  index: string;
  path: string;
  title: string;
  description: string;
  /** Null means the section is open from the start. */
  requirement: Requirement | null;
}

export interface PuzzleDefinition {
  id: PuzzleId;
  title: string;
}
