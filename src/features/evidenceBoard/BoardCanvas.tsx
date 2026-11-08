import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { judgeConnection } from '../../data/connections';
import { EVIDENCE_BY_ID, type EvidenceId } from '../../data/evidence';
import type { BoardPosition, BoardState } from '../../types/game';
import { BIG_NUDGE, CANVAS, CARD, move, NOTE, NUDGE, positionOf } from './boardLogic';

interface BoardCanvasProps {
  board: BoardState;
  pinnedIds: string[];
  selected: string | null;
  connectingFrom: string | null;
  focusNoteId: string | null;
  onActivate: (id: string) => void;
  onChange: (board: BoardState) => void;
  onAnnounce: (text: string) => void;
}

interface Drag {
  id: string;
  pointerId: number;
  startX: number;
  startY: number;
  origin: BoardPosition;
  moved: boolean;
}

const DRAG_THRESHOLD = 4;
const ARROWS: Record<string, [number, number]> = {
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
};

function center(position: BoardPosition, isNote: boolean) {
  const size = isNote ? NOTE : CARD;
  return { x: position.x + size.width / 2, y: position.y + size.height / 2 };
}

export function BoardCanvas({
  board,
  pinnedIds,
  selected,
  connectingFrom,
  focusNoteId,
  onActivate,
  onChange,
  onAnnounce,
}: BoardCanvasProps) {
  const drag = useRef<Drag | null>(null);
  const [live, setLive] = useState<{ id: string; position: BoardPosition } | null>(null);
  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (focusNoteId) nodeRefs.current[focusNoteId]?.focus();
  }, [focusNoteId]);

  function displayed(id: string) {
    return live?.id === id ? live.position : positionOf(board, id);
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>, id: string) {
    if (event.button !== 0 || (event.target as HTMLElement).closest('button, textarea')) return;
    const origin = positionOf(board, id);
    if (!origin) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { id, pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, origin, moved: false };
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const current = drag.current;
    if (!current || current.pointerId !== event.pointerId) return;
    const dx = event.clientX - current.startX;
    const dy = event.clientY - current.startY;
    if (!current.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
    current.moved = true;
    setLive({ id: current.id, position: { x: current.origin.x + dx, y: current.origin.y + dy } });
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    const current = drag.current;
    if (!current || current.pointerId !== event.pointerId) return;
    drag.current = null;
    if (current.moved && live) {
      onChange(move(board, current.id, live.position));
    } else {
      onActivate(current.id);
    }
    setLive(null);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>, id: string, label: string) {
    if (event.target !== event.currentTarget) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onActivate(id);
      return;
    }
    const arrow = ARROWS[event.key];
    if (!arrow) return;
    event.preventDefault();
    const position = positionOf(board, id);
    if (!position) return;
    const step = event.shiftKey ? BIG_NUDGE : NUDGE;
    onChange(move(board, id, { x: position.x + arrow[0] * step, y: position.y + arrow[1] * step }));
    onAnnounce(`Moved ${label}.`);
  }

  const lines = board.connections
    .map((connection) => {
      const from = displayed(connection.from);
      const to = displayed(connection.to);
      if (!from || !to) return null;
      const a = center(from, connection.from.startsWith('note-'));
      const b = center(to, connection.to.startsWith('note-'));
      return { key: `${connection.from}|${connection.to}`, a, b, kind: judgeConnection(connection.from, connection.to).kind };
    })
    .filter((line) => line !== null);

  return (
    <div className="board-viewport" role="region" aria-label="Evidence board. Scroll to see more of it." tabIndex={0}>
      <div
        className={`board-canvas${connectingFrom ? ' board-canvas--connecting' : ''}`}
        style={{ width: CANVAS.width, height: CANVAS.height }}
      >
        <svg className="board-lines" width={CANVAS.width} height={CANVAS.height} aria-hidden="true">
          {lines.map((line) => (
            <line
              key={line.key}
              x1={line.a.x}
              y1={line.a.y}
              x2={line.b.x}
              y2={line.b.y}
              className={`board-line board-line--${line.kind}`}
            />
          ))}
        </svg>

        {pinnedIds.map((id) => {
          const evidence = EVIDENCE_BY_ID[id as EvidenceId];
          const position = displayed(id);
          if (!evidence || !position) return null;
          const count = board.connections.filter((connection) => connection.from === id || connection.to === id).length;
          return (
            <div
              key={id}
              ref={(node) => {
                nodeRefs.current[id] = node;
              }}
              className={`board-card${selected === id ? ' board-card--selected' : ''}${live?.id === id ? ' board-card--dragging' : ''}`}
              style={{ left: position.x, top: position.y, width: CARD.width, minHeight: CARD.height }}
              role="button"
              tabIndex={0}
              aria-pressed={selected === id}
              aria-label={`${evidence.title}. ${evidence.source}. ${count} connection${count === 1 ? '' : 's'}.${
                connectingFrom && connectingFrom !== id ? ' Press Enter to connect.' : ''
              }`}
              onPointerDown={(event) => handlePointerDown(event, id)}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={() => {
                drag.current = null;
                setLive(null);
              }}
              onKeyDown={(event) => handleKeyDown(event, id, evidence.title)}
            >
              <span className="board-card__source">{evidence.source}</span>
              <span className="board-card__title">{evidence.title}</span>
              {count > 0 && <span className="board-card__count">{count} linked</span>}
            </div>
          );
        })}

        {board.notes.map((note) => {
          const position = displayed(note.id);
          if (!position) return null;
          return (
            <div
              key={note.id}
              ref={(node) => {
                nodeRefs.current[note.id] = node;
              }}
              className={`board-note${selected === note.id ? ' board-card--selected' : ''}${live?.id === note.id ? ' board-card--dragging' : ''}`}
              style={{ left: position.x, top: position.y, width: NOTE.width, minHeight: NOTE.height }}
              role="button"
              tabIndex={0}
              aria-pressed={selected === note.id}
              aria-label={`Your note: ${note.text || 'empty'}`}
              onPointerDown={(event) => handlePointerDown(event, note.id)}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={() => {
                drag.current = null;
                setLive(null);
              }}
              onKeyDown={(event) => handleKeyDown(event, note.id, 'your note')}
            >
              <p className="board-note__text">{note.text || 'Empty note. Select it to write.'}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
