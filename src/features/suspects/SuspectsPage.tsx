import { ArrowLeft, CircleCheck, CircleHelp, TriangleAlert } from 'lucide-react';
import { useEffect } from 'react';
import { href, usePath } from '../../app/router';
import { EVIDENCE_BY_ID } from '../../data/evidence';
import { pick, SUBJECT, SUSPECTS, type StatusVariant, type Suspect } from '../../data/suspects';
import { useDiscovery } from '../../hooks/useDiscovery';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useGame } from '../../store/GameContext';

const PROFILES = [SUBJECT, ...SUSPECTS];
const DEFAULT_STANCES: [string, string] = ['Points towards them', 'Points away from them'];

const TONE_ICONS = {
  neutral: CircleHelp,
  warning: TriangleAlert,
  alarm: TriangleAlert,
  cleared: CircleCheck,
};

function Portrait({ suspect }: { suspect: Suspect }) {
  return (
    <div className={`portrait portrait--${suspect.id}`} aria-hidden="true">
      <svg viewBox="0 0 120 150" className="portrait__svg">
        <rect width="120" height="150" className="portrait__bg" />
        <circle cx="60" cy="58" r="24" className="portrait__figure" />
        <path d="M18 150 C22 104 44 92 60 92 C76 92 98 104 102 150Z" className="portrait__figure" />
        <rect x="0" y="122" width="120" height="28" className="portrait__band" />
      </svg>
      <span className="portrait__initials">{suspect.initials}</span>
      <span className="portrait__note">No photograph on file</span>
    </div>
  );
}

function StatusBadge({ status }: { status: StatusVariant }) {
  const Icon = TONE_ICONS[status.tone];
  return (
    <span className={`suspect-status suspect-status--${status.tone}`}>
      <Icon aria-hidden="true" size={14} />
      {status.text}
    </span>
  );
}

function knownFacts(suspect: Suspect, discovered: string[]) {
  const facts = suspect.facts.filter((fact) => discovered.includes(fact.evidence));
  return {
    towards: facts.filter((fact) => fact.stance === 'for'),
    away: facts.filter((fact) => fact.stance === 'against'),
  };
}

function SuspectCard({ suspect }: { suspect: Suspect }) {
  const { state } = useGame();
  const discovered = state.discoveredEvidence;
  const { towards, away } = knownFacts(suspect, discovered);
  const [towardsLabel, awayLabel] = suspect.stanceLabels ?? DEFAULT_STANCES;

  return (
    <li>
      <a className={`suspect-card${suspect.id === 'eleanor' ? ' suspect-card--subject' : ''}`} href={href(`/suspects/${suspect.id}`)}>
        <Portrait suspect={suspect} />
        <span className="suspect-card__body">
          <span className="suspect-card__role">{suspect.role}</span>
          <span className="suspect-card__name">{suspect.name}</span>
          <StatusBadge status={pick(suspect.status, discovered)} />
          <span className="suspect-card__text">{pick(suspect.relationship, discovered).text}</span>
          <span className="suspect-card__counts">
            {towardsLabel}: {towards.length} · {awayLabel}: {away.length}
          </span>
        </span>
      </a>
    </li>
  );
}

function SuspectDetail({ suspect }: { suspect: Suspect }) {
  const { state } = useGame();
  const { record } = useDiscovery();
  const discovered = state.discoveredEvidence;
  const { towards, away } = knownFacts(suspect, discovered);
  const [towardsLabel, awayLabel] = suspect.stanceLabels ?? DEFAULT_STANCES;
  const hidden = suspect.facts.length - towards.length - away.length;
  useDocumentTitle(suspect.name);

  useEffect(() => {
    record('flags', `viewed-profile:${suspect.id}`);
  }, [suspect.id, record]);

  const factList = (facts: typeof towards, empty: string) =>
    facts.length === 0 ? (
      <p className="board-inspector__empty">{empty}</p>
    ) : (
      <ul className="suspect-facts">
        {facts.map((fact, index) => (
          <li key={`${fact.evidence}-${index}`}>
            <span>{fact.text}</span>
            <span className="suspect-facts__source">{EVIDENCE_BY_ID[fact.evidence].source}</span>
          </li>
        ))}
      </ul>
    );

  return (
    <article className="suspect-detail" aria-labelledby="suspect-name">
      <a className="archive__back suspect-detail__back" href={href('/suspects')}>
        <ArrowLeft aria-hidden="true" size={16} /> All profiles
      </a>

      <header className="suspect-detail__head">
        <Portrait suspect={suspect} />
        <div className="suspect-detail__intro">
          <p className="kicker">{suspect.role}</p>
          <h2 id="suspect-name" className="page-title">
            {suspect.name}
          </h2>
          <StatusBadge status={pick(suspect.status, discovered)} />
        </div>
      </header>

      <dl className="suspect-fields">
        <div>
          <dt>{suspect.id === 'eleanor' ? 'Who she was' : 'Relationship to Eleanor'}</dt>
          <dd>{pick(suspect.relationship, discovered).text}</dd>
        </div>
        <div>
          <dt>{suspect.id === 'eleanor' ? 'Did she leave?' : 'Possible motive'}</dt>
          <dd>{pick(suspect.motive, discovered).text}</dd>
        </div>
        <div>
          <dt>{suspect.id === 'eleanor' ? 'Last known whereabouts' : 'Alibi or whereabouts, 17 October 2014'}</dt>
          <dd>{pick(suspect.whereabouts, discovered).text}</dd>
        </div>
      </dl>

      <div className="suspect-columns">
        <section aria-labelledby="towards-title">
          <h3 id="towards-title" className="section-heading">
            {towardsLabel} ({towards.length})
          </h3>
          {factList(towards, 'Nothing found yet.')}
        </section>
        <section aria-labelledby="away-title">
          <h3 id="away-title" className="section-heading">
            {awayLabel} ({away.length})
          </h3>
          {factList(away, 'Nothing found yet.')}
        </section>
      </div>

      {hidden > 0 && (
        <p className="suspect-detail__hidden">
          There’s more about {suspect.id === 'unknown' ? 'this account' : suspect.name.split(' ')[0]} in the case file
          that you haven’t found yet.
        </p>
      )}

      <section aria-labelledby="related-title" className="doc__related">
        <h3 id="related-title" className="section-heading">
          Records
        </h3>
        <ul>
          {suspect.related.map((link) => (
            <li key={link.to}>
              <a href={href(link.to)}>{link.label}</a>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}

export function SuspectsPage() {
  const path = usePath();
  const id = path.split('/')[2] ?? null;
  const suspect = id ? PROFILES.find((profile) => profile.id === id) : null;
  useDocumentTitle('Suspects');

  if (id && suspect) {
    return (
      <div className="suspects">
        <SuspectDetail suspect={suspect} />
      </div>
    );
  }

  return (
    <div className="suspects">
      <header className="archive__header">
        <p className="kicker">File 05 · People connected to the case</p>
        <h1 className="page-title">Suspects</h1>
        <p className="suspects__intro">
          These profiles hold only what you have found. They change as you find more, and they can be wrong.
        </p>
      </header>

      {id && !suspect && (
        <p className="notice-page__requirement">
          There’s no profile called “{id}”. <a href={href('/suspects')}>See all profiles</a>.
        </p>
      )}

      <ul className="suspect-grid">
        {PROFILES.map((profile) => (
          <SuspectCard key={profile.id} suspect={profile} />
        ))}
      </ul>
    </div>
  );
}
