import { navigate } from '../app/router';
import { SettingsButton } from '../components/SettingsButton';
import { SoundToggle } from '../components/SoundToggle';
import { CASE_FILE } from '../data/caseFile';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useGame } from '../store/GameContext';
import { formatDate } from '../utils/format';

function CorruptedSitePreview() {
  return (
    <div className="site-ghost" aria-hidden="true">
      <div className="site-ghost__chrome">
        <span>http://{CASE_FILE.website}/</span>
      </div>
      <div className="site-ghost__page">
        <p className="site-ghost__heading">~ eleanor's corner of the web ~</p>
        <p className="site-ghost__nav">home | about | blog | photos | guestbook | friends | contact</p>
        <hr />
        <p className="site-ghost__post">{CASE_FILE.newPost}</p>
        <p className="site-ghost__post site-ghost__post--echo">{CASE_FILE.newPost}</p>
        <hr />
        <p className="site-ghost__counter">visitors: 0 0 0 9 1 7</p>
      </div>
    </div>
  );
}

export function LandingPage() {
  const { state, dispatch } = useGame();
  useDocumentTitle('The Missing Person');

  const isReturning = state.startedAt !== null;

  function openCase() {
    dispatch({ type: 'startInvestigation', at: new Date().toISOString() });
    navigate('/hub');
  }

  return (
    <div className="landing">
      <CorruptedSitePreview />

      <header className="landing__top">
        <span>Case {CASE_FILE.number}</span>
        <span className="landing__controls">
          <SoundToggle />
          <SettingsButton />
        </span>
      </header>

      <main className="landing__main">
        <h1 className="landing__title">
          <span>The Missing</span> <span>Person</span>
        </h1>

        <p className="landing__lede">
          {CASE_FILE.subject}, {CASE_FILE.age}, disappeared from {CASE_FILE.lastSeenLocation} on{' '}
          {CASE_FILE.disappearanceDate}. The case went inactive years ago. Her personal website did
          not stay that way.
        </p>

        <dl className="landing__status">
          <div>
            <dt>Case</dt>
            <dd>Inactive</dd>
          </div>
          <div>
            <dt>Website</dt>
            <dd className="landing__online">
              <span className="pulse-dot" aria-hidden="true" />
              Online
            </dd>
          </div>
          <div>
            <dt>Last modified</dt>
            <dd>Today</dd>
          </div>
        </dl>

        <div className="landing__actions">
          <button type="button" className="button button--primary" onClick={openCase}>
            {isReturning ? 'Resume investigation' : 'Open case'}
          </button>
          {isReturning && state.startedAt && (
            <p className="landing__resume-note">Case opened {formatDate(state.startedAt)}</p>
          )}
        </div>
      </main>
    </div>
  );
}
