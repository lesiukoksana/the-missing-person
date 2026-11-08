import { Lock } from 'lucide-react';
import { href } from '../../app/router';
import { CASE_FILE } from '../../data/caseFile';
import { SECTIONS } from '../../data/sections';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useGame } from '../../store/GameContext';
import {
  countKnownEvidence,
  countOpenSections,
  describeRequirement,
  getCaseStatus,
  getProgressPercent,
  isSectionOpen,
  TOTAL_EVIDENCE,
} from '../../store/selectors';
import { formatDate } from '../../utils/format';
import { PUZZLES } from '../puzzles/definitions';

export function HubPage() {
  const { state } = useGame();
  useDocumentTitle('Case overview');

  const status = getCaseStatus(state);
  const progress = getProgressPercent(state);

  return (
    <div className="hub">
      <header className="hub__header">
        <p className="kicker">
          Case {CASE_FILE.number} · {CASE_FILE.lastSeenLocation}
        </p>
        <h1 className="page-title">{CASE_FILE.title}</h1>
      </header>

      <div className="hub__desk">
        <article className="dossier" aria-labelledby="dossier-title">
          <span className="stamp" aria-hidden="true">
            Inactive
          </span>
          <div className="dossier__photo">
            <span>Photograph detached</span>
          </div>
          <div className="dossier__body">
            <h2 id="dossier-title">Subject: {CASE_FILE.subject}</h2>
            <dl className="dossier__facts">
              <div>
                <dt>Age</dt>
                <dd>{CASE_FILE.age}</dd>
              </div>
              <div>
                <dt>Occupation</dt>
                <dd>{CASE_FILE.occupation}</dd>
              </div>
              <div>
                <dt>Disappeared</dt>
                <dd>{CASE_FILE.disappearanceDate}</dd>
              </div>
            </dl>
            <p>
              The investigation went nowhere and the case went inactive. In 2026 her website came
              back online, and a new post appeared on it:
            </p>
            <blockquote>“{CASE_FILE.newPost}”</blockquote>
          </div>
        </article>

        <aside className={`status-panel status-panel--${status.severity}`} aria-label="Case status">
          <h2 className="status-panel__heading">Case status</h2>
          <p className="status-panel__label">{status.label}</p>
          <p className="status-panel__detail">{status.detail}</p>
          {state.ending && (
            <a className="button status-panel__ending" href={href('/ending')}>
              Read your conclusion again
            </a>
          )}

          <div className="progress">
            <div className="progress__label">
              <span id="progress-label">Investigation progress</span>
              <span>{progress}%</span>
            </div>
            <div
              className="progress__track"
              role="progressbar"
              aria-labelledby="progress-label"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div className="progress__fill" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <dl className="ledger">
            <div>
              <dt>Evidence discovered</dt>
              <dd>
                {countKnownEvidence(state)} / {TOTAL_EVIDENCE}
              </dd>
            </div>
            <div>
              <dt>Puzzles solved</dt>
              <dd>
                {state.solvedPuzzles.length} / {PUZZLES.length}
              </dd>
            </div>
            <div>
              <dt>Sections open</dt>
              <dd>
                {countOpenSections(state)} / {SECTIONS.length}
              </dd>
            </div>
          </dl>
        </aside>
      </div>

      <div className="hub__lower">
        <section aria-labelledby="index-title">
          <h2 id="index-title" className="section-heading">
            Case index
          </h2>
          <ul className="file-list">
            {SECTIONS.map((section) => {
              const open = isSectionOpen(section, state);
              return (
                <li key={section.id}>
                  <a
                    className={`file-row${open ? '' : ' file-row--locked'}`}
                    href={href(section.path)}
                  >
                    <span className="file-row__index">{section.index}</span>
                    <span className="file-row__text">
                      <span className="file-row__title">{section.title}</span>
                      <span className="file-row__description">
                        {open || !section.requirement
                          ? section.description
                          : describeRequirement(section.requirement, state)}
                      </span>
                    </span>
                    <span className="file-row__state">
                      {!open && <Lock aria-hidden="true" size={13} />}
                      {open ? 'Open' : 'Locked'}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </section>

        <section aria-labelledby="recent-title">
          <h2 id="recent-title" className="section-heading">
            Recent discoveries
          </h2>
          {state.recentDiscoveries.length === 0 ? (
            <p className="empty-note">
              Nothing logged yet. Eleanor’s website is the obvious place to start.{' '}
              <a href={href('/website')}>Go to the website</a>.
            </p>
          ) : (
            <ol className="discovery-log">
              {state.recentDiscoveries.map((discovery) => (
                <li key={discovery.id}>
                  <time dateTime={discovery.at}>{formatDate(discovery.at)}</time>
                  <span>{discovery.label}</span>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </div>
  );
}
