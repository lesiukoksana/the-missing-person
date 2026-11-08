import type { BoardConnection, BoardPosition, BoardState, PlayerNote } from '../../types/game';

export const CANVAS = { width: 2000, height: 1400 };
export const CARD = { width: 220, height: 132 };
export const NOTE = { width: 200, height: 150 };
export const NUDGE = 16;
export const BIG_NUDGE = 64;

export function clampPosition(position: BoardPosition, size = CARD): BoardPosition {
  return {
    x: Math.round(Math.min(Math.max(0, position.x), CANVAS.width - size.width)),
    y: Math.round(Math.min(Math.max(0, position.y), CANVAS.height - size.height)),
  };
}

/** Next free slot in a loose grid, so new cards don't land on top of each other. */
export function nextSlot(board: BoardState): BoardPosition {
  const taken = [...Object.values(board.positions), ...board.notes.map((note) => note.position)];
  for (let index = 0; index < 64; index += 1) {
    const slot = { x: 40 + (index % 6) * 260, y: 40 + Math.floor(index / 6) * 180 };
    const clash = taken.some((position) => Math.abs(position.x - slot.x) < 120 && Math.abs(position.y - slot.y) < 90);
    if (!clash) return slot;
  }
  return { x: 40, y: 40 };
}

export function sameConnection(connection: BoardConnection, from: string, to: string) {
  return (connection.from === from && connection.to === to) || (connection.from === to && connection.to === from);
}

export function pin(board: BoardState, id: string): BoardState {
  if (board.positions[id]) return board;
  return { ...board, positions: { ...board.positions, [id]: nextSlot(board) } };
}

export function unpin(board: BoardState, id: string): BoardState {
  const positions = { ...board.positions };
  delete positions[id];
  return {
    ...board,
    positions,
    connections: board.connections.filter((connection) => connection.from !== id && connection.to !== id),
  };
}

export function move(board: BoardState, id: string, position: BoardPosition): BoardState {
  if (board.positions[id]) {
    return { ...board, positions: { ...board.positions, [id]: clampPosition(position) } };
  }
  return {
    ...board,
    notes: board.notes.map((note) => (note.id === id ? { ...note, position: clampPosition(position, NOTE) } : note)),
  };
}

export function connect(board: BoardState, from: string, to: string): BoardState {
  if (from === to || board.connections.some((connection) => sameConnection(connection, from, to))) return board;
  return { ...board, connections: [...board.connections, { from, to }] };
}

export function disconnect(board: BoardState, from: string, to: string): BoardState {
  return { ...board, connections: board.connections.filter((connection) => !sameConnection(connection, from, to)) };
}

export function addNote(board: BoardState): { board: BoardState; note: PlayerNote } {
  const note: PlayerNote = { id: `note-${Date.now().toString(36)}`, text: '', position: nextSlot(board) };
  return { board: { ...board, notes: [...board.notes, note] }, note };
}

export function editNote(board: BoardState, id: string, text: string): BoardState {
  return { ...board, notes: board.notes.map((note) => (note.id === id ? { ...note, text } : note)) };
}

export function removeNote(board: BoardState, id: string): BoardState {
  return { ...board, notes: board.notes.filter((note) => note.id !== id) };
}

export function positionOf(board: BoardState, id: string) {
  return board.positions[id] ?? board.notes.find((note) => note.id === id)?.position ?? null;
}
