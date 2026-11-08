import { Link2, Pin, PinOff, Plus, StickyNote, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { href } from '../../app/router';
import { establishedKeyLinks, judgeConnection, KEY_LINKS, type Verdict } from '../../data/connections';
import { EVIDENCE, EVIDENCE_BY_ID, type EvidenceId } from '../../data/evidence';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useGame } from '../../store/GameContext';
import type { BoardState } from '../../types/game';
import { PUZZLES_BY_ID } from '../puzzles/definitions';
import { BoardCanvas } from './BoardCanvas';
import { addNote, connect, disconnect, editNote, pin, removeNote, unpin } from './boardLogic';

const MIN_EVIDENCE = 2;

export function verdictLabel(verdict: Verdict) {
  if (verdict.kind === 'key') return 'Key link';
  if (verdict.kind === 'side') return 'Meaningful';
  return 'No clear link';
}

function evidenceTitle(id: string) {
  return EVIDENCE_BY_ID[id as EvidenceId]?.title ?? id;
}

export function BoardPage() {
  const { state, dispatch } = useGame();
  useDocumentTitle('Evidence Board');
  const board = state.board;
  const [selected, setSelected] = useState<string | null>(null);
  const [connectTarget, setConnectTarget] = useState('');
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const [newNoteId, setNewNoteId] = useState<string | null>(null);
  const solvedRef = useRef(state.solvedPuzzles.includes('finalConnections'));

  const discovered = useMemo(
    () => EVIDENCE.filter((item) => state.discoveredEvidence.includes(item.id)),
    [state.discoveredEvidence],
  );
  const pinnedIds = Object.keys(board.positions).filter((id) => state.discoveredEvidence.includes(id));
  const established = establishedKeyLinks(board.connections);
  const solved = state.solvedPuzzles.includes('finalConnections');

  function save(next: BoardState) {
    dispatch({ type: 'setBoard', board: next });
  }

  useEffect(() => {
    if (solvedRef.current || established.length < KEY_LINKS.length) return;
    solvedRef.current = true;
    dispatch({
      type: 'solvePuzzle',
      puzzle: 'finalConnections',
      label: `Puzzle solved: ${PUZZLES_BY_ID.finalConnections.title}`,
      at: new Date().toISOString(),
    });
  }, [established.length, dispatch]);

  function link(from: string, to: string) {
    if (from === to) return;
    save(connect(board, from, to));
    const verdict = judgeConnection(from, to);
    setAnnouncement(`Connected “${evidenceTitle(from)}” and “${evidenceTitle(to)}”. ${verdictLabel(verdict)}.`);
    setConnectingFrom(null);
    setConnectTarget('');
  }

  function handleCardActivate(id: string) {
    if (connectingFrom && connectingFrom !== id && !id.startsWith('note-')) {
      link(connectingFrom, id);
      setSelected(id);
      return;
    }
    setSelected(id);
  }

  function createNote() {
    const { board: next, note } = addNote(board);
    save(next);
    setSelected(note.id);
    setNewNoteId(note.id);
  }

  if (discovered.length < MIN_EVIDENCE) {
    return (
      <div className="board-page">
        <header className="archive__header">
          <p className="kicker">File 03 · Your working theory</p>
          <h1 className="page-title">Evidence Board</h1>
        </header>
        <div className="archive__empty board-empty">
          <p>There’s nothing to pin up yet.</p>
          <p className="archive__empty-hint">
            Evidence collects here as you find it: in the blog, the photographs, the police records. Find at
            least {MIN_EVIDENCE} pieces and this board will let you lay them out, connect them and test what holds.
            You have {discovered.length}.
          </p>
          <div className="button-row">
            <a className="button" href={href('/website')}>
              Eleanor’s website
            </a>
            <a className="button" href={href('/archive')}>
              Police Archive
            </a>
          </div>
        </div>
      </div>
    );
  }

  const selectedIsNote = selected?.startsWith('note-') ?? false;
  const selectedEvidence = selected && !selectedIsNote ? EVIDENCE_BY_ID[selected as EvidenceId] : null;
  const selectedNote = selectedIsNote ? board.notes.find((note) => note.id === selected) : null;
  const selectedConnections = selected
    ? board.connections.filter((connection) => connection.from === selected || connection.to === selected)
    : [];
  const connectOptions = pinnedIds.filter(
    (id) =>
      id !== selected &&
      !selectedConnections.some((connection) => connection.from === id || connection.to === id),
  );

  return (
    <div className="board-page">
      <header className="archive__header">
        <p className="kicker">File 03 · Your working theory</p>
        <h1 className="page-title">Evidence Board</h1>
        <p className="board-progress" role="status">
          {solved ? (
            <strong>The chain holds. All {KEY_LINKS.length} key links are on the board.</strong>
          ) : established.length > 0 ? (
            `Key links established: ${established.length} of ${KEY_LINKS.length}.`
          ) : (
            'Pin evidence, then connect cards that explain each other. The board tells you which connections hold.'
          )}
        </p>
        {solved && (
          <p>
            <a className="button button--primary" href={href('/conclusion')}>
              Go to Case Conclusion
            </a>
          </p>
        )}
      </header>

      <div className="board-layout">
        <aside className="board-tray" aria-labelledby="tray-title">
          <h2 id="tray-title" className="section-heading">
            Evidence ({discovered.length})
          </h2>
          <ul>
            {discovered.map((item) => {
              const pinned = Boolean(board.positions[item.id]);
              return (
                <li key={item.id} className={pinned ? 'tray-item tray-item--pinned' : 'tray-item'}>
                  <span className="tray-item__text">
                    <span className="tray-item__title">{item.title}</span>
                    <span className="tray-item__source">{item.source}</span>
                  </span>
                  <button
                    type="button"
                    className="icon-button"
                    aria-label={pinned ? `Take “${item.title}” off the board` : `Pin “${item.title}” to the board`}
                    aria-pressed={pinned}
                    onClick={() => {
                      save(pinned ? unpin(board, item.id) : pin(board, item.id));
                      if (!pinned) setSelected(item.id);
                      else if (selected === item.id) setSelected(null);
                    }}
                  >
                    {pinned ? <PinOff aria-hidden="true" size={16} /> : <Pin aria-hidden="true" size={16} />}
                  </button>
                </li>
              );
            })}
          </ul>
          <button type="button" className="button button--ghost board-add-note" onClick={createNote}>
            <Plus aria-hidden="true" size={16} /> Add a note
          </button>
        </aside>

        <div className="board-main">
          <BoardCanvas
            board={board}
            pinnedIds={pinnedIds}
            selected={selected}
            connectingFrom={connectingFrom}
            focusNoteId={newNoteId}
            onActivate={handleCardActivate}
            onChange={save}
            onAnnounce={setAnnouncement}
          />
          <p className="board-legend">
            <span className="legend legend--key">Key link: solid red line</span>
            <span className="legend legend--side">Meaningful: solid green line</span>
            <span className="legend legend--none">No clear link: dashed grey line</span>
          </p>
          <p className="visually-hidden" aria-live="polite">
            {announcement}
          </p>
        </div>

        <aside className="board-inspector" aria-label="Selected card">
          {!selected && (
            <p className="board-inspector__empty">
              Select a card to inspect it and connect it to others. Drag cards to arrange them, or select one and
              use the arrow keys.
            </p>
          )}

          {selectedEvidence && (
            <>
              <p className="doc__id">{selectedEvidence.source}</p>
              <h2 className="board-inspector__title">{selectedEvidence.title}</h2>
              <p>{selectedEvidence.summary}</p>

              {connectingFrom === selected ? (
                <div className="board-inspector__connecting" role="status">
                  <p>Now select the card to connect it to.</p>
                  <button type="button" className="button button--ghost" onClick={() => setConnectingFrom(null)}>
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="board-connect">
                  <button
                    type="button"
                    className="button"
                    disabled={connectOptions.length === 0}
                    onClick={() => setConnectingFrom(selected)}
                  >
                    <Link2 aria-hidden="true" size={16} /> Connect by clicking a card
                  </button>
                  <div className="field">
                    <label htmlFor="connect-to">Or connect to</label>
                    <div className="old-form-row">
                      <select id="connect-to" value={connectTarget} onChange={(event) => setConnectTarget(event.target.value)}>
                        <option value="">Choose a pinned card</option>
                        {connectOptions.map((id) => (
                          <option key={id} value={id}>
                            {evidenceTitle(id)}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        className="button"
                        disabled={!connectTarget}
                        onClick={() => selected && link(selected, connectTarget)}
                      >
                        Connect
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <h3 className="section-heading">Connections ({selectedConnections.length})</h3>
              {selectedConnections.length === 0 ? (
                <p className="board-inspector__empty">None yet.</p>
              ) : (
                <ul className="board-links">
                  {selectedConnections.map((connection) => {
                    const other = connection.from === selected ? connection.to : connection.from;
                    const verdict = judgeConnection(connection.from, connection.to);
                    return (
                      <li key={other} className={`board-link board-link--${verdict.kind}`}>
                        <span className="board-link__verdict">{verdictLabel(verdict)}</span>
                        <span className="board-link__other">{evidenceTitle(other)}</span>
                        {verdict.kind === 'key' && <span className="board-link__finding">{verdict.link.finding}</span>}
                        {verdict.kind === 'side' && <span className="board-link__finding">{verdict.finding}</span>}
                        <button
                          type="button"
                          className="text-button"
                          onClick={() => selected && save(disconnect(board, selected, other))}
                        >
                          Remove connection
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}

              <button
                type="button"
                className="text-button"
                onClick={() => {
                  save(unpin(board, selectedEvidence.id));
                  setSelected(null);
                }}
              >
                <PinOff aria-hidden="true" size={14} /> Take off the board
              </button>
            </>
          )}

          {selectedNote && (
            <>
              <p className="doc__id">
                <StickyNote aria-hidden="true" size={12} /> Your note
              </p>
              <div className="field">
                <label htmlFor="note-text">Note</label>
                <textarea
                  id="note-text"
                  className="board-note-input"
                  rows={5}
                  value={selectedNote.text}
                  onChange={(event) => save(editNote(board, selectedNote.id, event.target.value))}
                />
                <p className="field__hint">Saved as you type.</p>
              </div>
              <button
                type="button"
                className="button button--ghost"
                onClick={() => {
                  save(removeNote(board, selectedNote.id));
                  setSelected(null);
                }}
              >
                <Trash2 aria-hidden="true" size={16} /> Delete note
              </button>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
