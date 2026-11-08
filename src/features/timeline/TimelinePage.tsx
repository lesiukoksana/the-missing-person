import { CircleCheck, CircleHelp, FileQuestion, Scale, TriangleAlert } from 'lucide-react';
import { useState } from 'react';
import { href } from '../../app/router';
import { CATEGORIES, TIMELINE, type Category, type TimelineEvent } from '../../data/timeline';
import { useDiscovery } from '../../hooks/useDiscovery';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useGame } from '../../store/GameContext';

type Standing = 'recorded' | 'unverified' | 'disputed' | 'resolved' | 'unexplained';
type StatusFilter = 'all' | 'conflicts' | 'disputed' | 'resolved';

const STANDING: Record<Standing, { label: string; icon: typeof CircleCheck }> = {
  recorded: { label: 'Recorded', icon: CircleCheck },
  unverified: { label: 'One source only', icon: CircleHelp },
  disputed: { label: 'Disputed', icon: Scale },
  resolved: { label: 'Resolved', icon: CircleCheck },
  unexplained: { label: 'Unexplained', icon: FileQuestion },
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function displayDate(event: TimelineEvent) {
  const [year, month, day] = event.date.split('-').map(Number);
  return `${String(day).padStart(2, '0')} ${MONTHS[month - 1]} ${year}${event.time ? `, ${event.time}` : ''}`;
}

function visibleVersions(event: TimelineEvent, found: string[]) {
  return event.conflict?.versions.filter((version) => version.reveal === null || found.includes(version.reveal)) ?? [];
}

function isVisible(event: TimelineEvent, found: string[]) {
  if (event.conflict) return visibleVersions(event, found).length > 0;
  return event.reveal === null || found.includes(event.reveal);
}

function isResolved(event: TimelineEvent, found: string[]) {
  return Boolean(event.conflict?.resolvedBy.some((id) => found.includes(id)));
}

function standing(event: TimelineEvent, found: string[]): Standing {
  if (event.unexplained) return 'unexplained';
  if (!event.conflict) return 'recorded';
  if (isResolved(event, found)) return 'resolved';
  return visibleVersions(event, found).length > 1 ? 'disputed' : 'unverified';
}

function EventItem({ event }: { event: TimelineEvent }) {
  const { state } = useGame();
  const { record } = useDiscovery();
  const [open, setOpen] = useState(false);
  const found = state.discoveredEvidence;
  const current = standing(event, found);
  const updated = event.update && found.includes(event.update.evidence) ? event.update : null;
  const title = updated?.title ?? event.title;
  const description = updated?.description ?? event.description;
  const resolved = isResolved(event, found);
  const versions = visibleVersions(event, found);
  const detailsId = `event-${event.id}`;
  const { label, icon: Icon } = STANDING[current];
  const seen = state.timelineDiscoveries.includes(event.id);

  function toggle() {
    setOpen(!open);
    if (!open) record('timelineDiscoveries', event.id);
  }

  return (
    <li className={`tl-event tl-event--${event.category} tl-event--${current}`}>
      <span className="tl-event__dot" aria-hidden="true" />
      <div className="tl-event__card">
        <p className="tl-event__meta">
          <time dateTime={event.date}>{displayDate(event)}</time>
          <span className="tl-event__category">{CATEGORIES.find((category) => category.id === event.category)?.label}</span>
        </p>
        <h3 className="tl-event__title">{event.conflict ? (resolved ? (event.conflict.settled ?? title) : event.conflict.question) : title}</h3>
        <p className={`tl-standing tl-standing--${current}`}>
          <Icon aria-hidden="true" size={14} />
          {label}
          {updated && <span className="tl-standing__note">· updated by new evidence</span>}
        </p>
        <button
          type="button"
          className="text-button tl-event__toggle"
          aria-expanded={open}
          aria-controls={detailsId}
          onClick={toggle}
        >
          {open ? 'Hide details' : seen ? 'Details' : 'Inspect'}
        </button>

        {open && (
          <div className="tl-event__details" id={detailsId}>
            <p>{description}</p>

            {event.conflict && (
              <ul className="tl-versions" aria-label="Versions">
                {versions.map((version) => {
                  const verdict = resolved ? (version.reliable ? 'supported' : 'contradicted') : 'claimed';
                  return (
                    <li key={version.claim} className={`tl-version tl-version--${verdict}`}>
                      <span className="tl-version__verdict">
                        {verdict === 'supported' && <CircleCheck aria-hidden="true" size={13} />}
                        {verdict === 'contradicted' && <TriangleAlert aria-hidden="true" size={13} />}
                        {verdict === 'supported' ? 'Supported' : verdict === 'contradicted' ? 'Contradicted' : 'Claimed'}
                      </span>
                      <span className="tl-version__claim">{version.claim}</span>
                      <span className="tl-version__source">Source: {version.source}</span>
                    </li>
                  );
                })}
                {event.conflict.versions.length > versions.length && (
                  <li className="tl-version tl-version--missing">
                    There’s another account of this somewhere you haven’t looked yet.
                  </li>
                )}
              </ul>
            )}
            {event.conflict && resolved && <p className="tl-resolution">{event.conflict.resolution}</p>}
            {event.conflict && !resolved && versions.length > 1 && event.conflict.resolvedBy.length > 0 && (
              <p className="tl-resolution tl-resolution--open">
                Both can’t be true. Something in the case file settles it.
              </p>
            )}
            {event.conflict && event.conflict.resolvedBy.length === 0 && versions.length > 1 && (
              <p className="tl-resolution tl-resolution--open">Nothing in the case file settles this one.</p>
            )}

            {event.links && (
              <ul className="tl-links">
                {event.links.map((link) => (
                  <li key={link.to}>
                    <a href={href(link.to)}>{link.label}</a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </li>
  );
}

export function TimelinePage() {
  const { state } = useGame();
  useDocumentTitle('Timeline');
  const found = state.discoveredEvidence;
  const [categories, setCategories] = useState<Category[]>(CATEGORIES.map((category) => category.id));
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const sorted = [...TIMELINE].sort((a, b) => `${a.date}${a.time ?? ''}`.localeCompare(`${b.date}${b.time ?? ''}`));
  const visible = sorted.filter((event) => isVisible(event, found));
  const hiddenCount = sorted.length - visible.length;

  const shown = visible.filter((event) => {
    if (!categories.includes(event.category)) return false;
    const current = standing(event, found);
    if (statusFilter === 'conflicts') return Boolean(event.conflict);
    if (statusFilter === 'disputed') return current === 'disputed' || current === 'unverified' || current === 'unexplained';
    if (statusFilter === 'resolved') return current === 'resolved';
    return true;
  });

  const years = [...new Set(shown.map((event) => event.date.slice(0, 4)))];
  const disputedCount = visible.filter((event) => standing(event, found) === 'disputed').length;
  const resolvedCount = visible.filter((event) => standing(event, found) === 'resolved').length;

  function toggleCategory(id: Category) {
    setCategories((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  function jumpTo(year: string) {
    const heading = document.getElementById(`year-${year}`);
    heading?.scrollIntoView({ block: 'start' });
    heading?.focus({ preventScroll: true });
  }

  return (
    <div className="timeline-page">
      <header className="archive__header">
        <p className="kicker">File 06 · 2012 to 2026</p>
        <h1 className="page-title">Timeline</h1>
        <p className="suspects__intro">
          {visible.length} events found · {disputedCount} disputed · {resolvedCount} resolved
          {hiddenCount > 0 && ` · ${hiddenCount} not found yet`}
        </p>
      </header>

      <section className="tl-filters" aria-label="Filter the timeline">
        <div className="tl-filters__group" role="group" aria-label="Categories">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              type="button"
              className={`tl-chip tl-chip--${category.id}`}
              aria-pressed={categories.includes(category.id)}
              onClick={() => toggleCategory(category.id)}
            >
              <span className="tl-chip__tick" aria-hidden="true">
                {categories.includes(category.id) ? '✓' : ''}
              </span>
              {category.label}
            </button>
          ))}
        </div>
        <div className="tl-filters__row">
          <div className="field tl-filters__field">
            <label htmlFor="tl-status">Show</label>
            <select id="tl-status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}>
              <option value="all">Everything</option>
              <option value="conflicts">Conflicting records only</option>
              <option value="disputed">Still uncertain</option>
              <option value="resolved">Resolved conflicts</option>
            </select>
          </div>
          {years.length > 1 && (
            <nav className="tl-years" aria-label="Jump to year">
              {years.map((year) => (
                <button key={year} type="button" className="tl-year-button" onClick={() => jumpTo(year)}>
                  {year}
                </button>
              ))}
            </nav>
          )}
          {(categories.length < CATEGORIES.length || statusFilter !== 'all') && (
            <button
              type="button"
              className="text-button"
              onClick={() => {
                setCategories(CATEGORIES.map((category) => category.id));
                setStatusFilter('all');
              }}
            >
              Clear filters
            </button>
          )}
        </div>
      </section>

      {shown.length === 0 ? (
        <div className="archive__empty">
          <p>No events match these filters.</p>
        </div>
      ) : (
        years.map((year) => (
          <section key={year} className="tl-year" aria-labelledby={`year-${year}`}>
            <h2 id={`year-${year}`} className="tl-year__heading" tabIndex={-1}>
              {year}
            </h2>
            <ol className="tl-list">
              {shown
                .filter((event) => event.date.startsWith(year))
                .map((event) => (
                  <EventItem key={event.id} event={event} />
                ))}
            </ol>
          </section>
        ))
      )}
    </div>
  );
}
