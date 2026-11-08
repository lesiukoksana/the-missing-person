import { useState } from 'react';
import { GUESTBOOK, type GuestbookEntry } from '../../../data/website/guestbook';
import { useDiscovery } from '../../../hooks/useDiscovery';
import { useGame } from '../../../store/GameContext';
import { formatDate } from '../../../utils/format';
import { playerWords } from '../../endings/endingState';

/** Two UNKNOWN USER posts are enough to see they don't come from the same place. */
const INSPECTIONS_FOR_EVIDENCE = 2;

function visibleEntries(solved: string[], flags: string[]) {
  const visible = GUESTBOOK.filter(
    (entry) =>
      (!entry.revealAfter || solved.includes(entry.revealAfter)) &&
      (!entry.revealFlag || flags.includes(entry.revealFlag)),
  );
  // Last in, first out. Posts with no stored date are the ones appearing today.
  return [...visible].sort((a, b) => (b.isoDate ?? '9999').localeCompare(a.isoDate ?? '9999'));
}

function EntryCard({ entry }: { entry: GuestbookEntry }) {
  const { state } = useGame();
  const { discover, record } = useDiscovery();
  const [open, setOpen] = useState(false);

  const isUnknown = entry.name === 'UNKNOWN USER';
  const detailsId = `guestbook-details-${entry.id}`;
  const edited = entry.editedAfter && state.solvedPuzzles.includes(entry.editedAfter);
  const date = entry.isoDate ? entry.displayDate : formatDate(new Date().toISOString());

  function toggle() {
    const opening = !open;
    setOpen(opening);
    if (!opening) return;

    if (entry.evidence) discover(entry.evidence);
    if (isUnknown) {
      const flag = `inspected-uu:${entry.id}`;
      record('flags', flag);
      const others = state.flags.filter((item) => item.startsWith('inspected-uu:') && item !== flag);
      if (others.length + 1 >= INSPECTIONS_FOR_EVIDENCE) discover('guestbook-uid');
    }
  }

  return (
    <li className={`oldweb-entry${isUnknown ? ' oldweb-entry--unknown' : ''}`}>
      <p className="oldweb-entry__head">
        <strong>{entry.name}</strong> <span className="oldweb-date">{date}</span>
      </p>
      <p className="oldweb-entry__message">{entry.message}</p>
      {edited && <p className="oldweb-date">(edited 17 Oct 2026)</p>}
      <button
        type="button"
        className="oldweb-linkbutton"
        aria-expanded={open}
        aria-controls={detailsId}
        onClick={toggle}
      >
        {open ? 'hide details' : 'details'}
      </button>
      {open && (
        <dl className="oldweb-entry__details" id={detailsId}>
          <div>
            <dt>uid</dt>
            <dd>{entry.uid}</dd>
          </div>
          <div>
            <dt>address</dt>
            <dd>{entry.address}</dd>
          </div>
          <div>
            <dt>browser</dt>
            <dd>{entry.browser}</dd>
          </div>
        </dl>
      )}
    </li>
  );
}

export function GuestbookPage() {
  const { state } = useGame();
  const entries = visibleEntries(state.solvedPuzzles, state.flags);
  // STILL ONLINE: the player's own words, posted as UNKNOWN USER.
  if (state.endingsReached.includes('stillOnline')) {
    entries.unshift({
      id: 'uu-you',
      name: 'UNKNOWN USER',
      isoDate: null,
      displayDate: '',
      message: playerWords(state),
      uid: 0,
      address: 'local (reader_0918)',
      browser: 'case terminal',
    });
  }

  return (
    <section>
      <h1>the guestbook</h1>
      <p className="eleanor-text">Say hello.  I wrote this bit myself so it may eat your message.  Leave the name blank if you are shy.</p>
      <p className="oldweb-notice">New entries are switched off on this restored copy.</p>
      <ol className="oldweb-entries">
        {entries.map((entry) => (
          <EntryCard key={entry.id} entry={entry} />
        ))}
      </ol>
    </section>
  );
}
