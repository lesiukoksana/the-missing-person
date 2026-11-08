import type { ReactNode } from 'react';
import { establishedKeyLinks, KEY_LINKS } from '../../data/connections';
import { EVIDENCE, EVIDENCE_BY_ID, type EvidenceId } from '../../data/evidence';
import { SUSPECTS } from '../../data/suspects';
import type { GameState } from '../../types/game';
import { formatDate } from '../../utils/format';
import { buildCheckinLog } from '../recovery/checkinLog';
import { daysUntil, hasSent, playerWords, switchDeadline } from './endingState';

export type SceneTone = 'paper' | 'dark' | 'terminal' | 'site' | 'sms' | 'news' | 'quiet';

export interface Scene {
  id: string;
  tone: SceneTone;
  kicker?: string;
  title?: string;
  body: ReactNode;
}

const title = (id: string) => EVIDENCE_BY_ID[id as EvidenceId]?.title ?? id;

/* ---------------------------------------------------------------- THE OFFICIAL STORY */

function officialStory(state: GameState): Scene[] {
  const reviewed = EVIDENCE.filter((item) => state.discoveredEvidence.includes(item.id)).slice(0, 8);
  const knowsSwitch = state.discoveredEvidence.includes('site-checkin-script');

  return [
    {
      id: 'filed',
      tone: 'paper',
      kicker: 'Case #0917 · Review of an inactive file',
      title: 'Conclusion of review',
      body: (
        <>
          <dl className="ending-fields">
            <div>
              <dt>Reviewed by</dt>
              <dd>reader_0918</dd>
            </div>
            <div>
              <dt>Finding</dt>
              <dd>Voluntary departure</dd>
            </div>
            <div>
              <dt>Further action</dt>
              <dd>None</dd>
            </div>
          </dl>
          <p className="ending-stamp">No further action</p>
        </>
      ),
    },
    {
      id: 'repeat',
      tone: 'paper',
      kicker: 'The file agrees with you',
      body: (
        <>
          <blockquote>The MP is an adult with the right to leave without informing others.</blockquote>
          <blockquote>No evidence of third-party involvement has been found.</blockquote>
          <blockquote>On the evidence available, voluntary departure is the most probable explanation.</blockquote>
          <p>You have added your name under his.</p>
        </>
      ),
    },
    {
      id: 'reviewed',
      tone: 'dark',
      kicker: 'Everything you found',
      body:
        reviewed.length === 0 ? (
          <p>Nothing else was reviewed.</p>
        ) : (
          <ul className="ending-list">
            {reviewed.map((item) => (
              <li key={item.id}>
                {item.title} <span className="ending-list__verdict">Reviewed. No action.</span>
              </li>
            ))}
          </ul>
        ),
    },
    {
      id: 'offline',
      tone: 'site',
      kicker: 'A few days later',
      body: (
        <>
          <div className="ending-browser">
            <p className="ending-browser__address">http://eleanorvale.example/</p>
            <p className="ending-browser__error">503 Service Unavailable</p>
            <p>This account has been suspended. If you are the owner, please contact your hosting provider.</p>
          </div>
          <p>Nobody renews it.{knowsSwitch && ' Her switch stops with it, for the second time.'}</p>
        </>
      ),
    },
    {
      id: 'text',
      tone: 'sms',
      body: (
        <div className="ending-sms">
          <p className="ending-sms__bubble">need a few days. dont worry. dont tell D x</p>
          <p className="ending-sms__time">17 Oct 2014, 22:04</p>
        </div>
      ),
    },
  ];
}

/* ---------------------------------------------------------------- THE WRONG PERSON */

function wrongPerson(state: GameState): Scene[] {
  const accused = state.endingVariant === 'sarah' ? 'sarah' : 'daniel';
  const suspect = SUSPECTS.find((item) => item.id === accused)!;
  const points = suspect.facts.filter((fact) => fact.stance === 'for' && state.discoveredEvidence.includes(fact.evidence));
  const knowsReed = state.discoveredEvidence.includes('box-reed-letter') || state.discoveredEvidence.includes('plate-heritage');

  const caseScene: Scene = {
    id: 'case',
    tone: 'paper',
    kicker: `Your conclusion: ${suspect.name}`,
    title: 'The case you made',
    body: (
      <>
        {points.length > 0 ? (
          <ul className="ending-list">
            {points.map((fact) => (
              <li key={`${fact.evidence}-${fact.text}`}>
                {fact.text} <span className="ending-list__verdict">True.</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>You didn’t have much. It turned out you didn’t need much.</p>
        )}
        <p>Every line of it is true.</p>
      </>
    ),
  };

  const tail: Scene[] = [
    {
      id: 'elsewhere',
      tone: 'quiet',
      body: knowsReed ? (
        <p>
          Somebody else was at Harrow Mill that night. You had his car, his notes and, by the end, his handwriting.
          You put a different name at the bottom of the page.
        </p>
      ) : (
        <p>Somebody else was at Harrow Mill that night. You never found out who.</p>
      ),
    },
    {
      id: 'post',
      tone: 'site',
      kicker: 'eleanorvale.example · guestbook',
      body: (
        <div className="ending-guestbook">
          <p className="ending-guestbook__name">
            UNKNOWN USER <span>{formatDate(new Date().toISOString())}</span>
          </p>
          <p>Everything you said about {accused === 'daniel' ? 'him' : 'her'} was true.</p>
        </div>
      ),
    },
  ];

  if (accused === 'daniel') {
    return [
      caseScene,
      {
        id: 'thread',
        tone: 'news',
        kicker: 'Ashford Lost · forum',
        title: 'ELEANOR VALE: it was the ex',
        body: (
          <ul className="ending-forum">
            <li>
              <strong>caseFilesAnon</strong> someone finally laid it all out. key to the flat, the keylogger, the alibi that
              nobody checked
            </li>
            <li>
              <strong>ashford_mum2</strong> he works in town. I know the building
            </li>
            <li>
              <strong>truthseeker_88</strong> found his kids school
            </li>
            <li>
              <strong>caseFilesAnon</strong> nobody go round. seriously
            </li>
            <li className="ending-forum__count">2,417 replies</li>
          </ul>
        ),
      },
      {
        id: 'findmate',
        tone: 'terminal',
        kicker: 'Posted by Daniel Cross, three weeks later',
        body: (
          <>
            <pre>{`FindMate · location history · E. VALE
17 Oct 2014  19:55  Mill Road, Harrow Mill   stationary
17 Oct 2014  20:35  (my car) Mill Road        stationary 15 min
17 Oct 2014  20:50  (my car) home`}</pre>
            <p>The three emails he deleted the next morning:</p>
            <pre>{`20:58  i can see youre at the mill. whose car is that
21:44  el please. im sorry. ill stop. just tell me youre ok
23:10  i went home. i promised you i would stop. im stopping`}</pre>
            <p>
              He followed her. He saw a car at the gate and drove home, because he had promised to stop. He couldn’t
              say so in 2014 without saying the rest. He can’t prove any of it now.
            </p>
          </>
        ),
      },
      ...tail,
    ];
  }

  return [
    caseScene,
    {
      id: 'career',
      tone: 'news',
      kicker: 'Ashford Lost · forum',
      title: 'THE JOURNALIST KNEW',
      body: (
        <ul className="ending-forum">
          <li>
            <strong>caseFilesAnon</strong> she lied about the date. she deleted the email. she REDACTED HER OWN NAME in 2026
          </li>
          <li>
            <strong>ashford_mum2</strong> “friend”
          </li>
          <li className="ending-forum__count">The commissions stop within a week.</li>
        </ul>
      ),
    },
    {
      id: 'admission',
      tone: 'paper',
      kicker: 'Sarah Bennett · published on her own site',
      title: 'What I did',
      body: (
        <>
          <p>
            I rang him. I sat across from him three days later and said nothing. I deleted her last email. I took my own
            name out of the file this year and told myself it was to protect a source.
          </p>
          <p>Everything you have read about me is true.</p>
          <p className="ending-note">The comments underneath read it as a confession to something bigger.</p>
        </>
      ),
    },
    ...tail,
  ];
}

/* ---------------------------------------------------------------- THE TRUTH */

function truth(state: GameState): Scene[] {
  const established = establishedKeyLinks(state.board.connections);
  const chain = KEY_LINKS.map((link) => {
    const connection = state.board.connections.find(
      (item) =>
        (link.a.includes(item.from as EvidenceId) && link.b.includes(item.to as EvidenceId)) ||
        (link.a.includes(item.to as EvidenceId) && link.b.includes(item.from as EvidenceId)),
    );
    return { link, connection };
  });
  const deadline = switchDeadline(state);
  const sent = hasSent(state);

  return [
    {
      id: 'chain',
      tone: 'dark',
      kicker: `Your board · ${established.length} of ${KEY_LINKS.length} key links`,
      title: 'What happened',
      body: (
        <ol className="ending-chain">
          {chain.map(({ link, connection }) => (
            <li key={link.id}>
              {connection && (
                <span className="ending-chain__pair">
                  {title(connection.from)} ↔ {title(connection.to)}
                </span>
              )}
              <span>{link.finding}</span>
            </li>
          ))}
        </ol>
      ),
    },
    {
      id: 'aldous',
      tone: 'paper',
      kicker: 'Harrow Mill fire · 15 November 2013',
      title: 'Peter John Aldous',
      body: (
        <>
          <p>1955 – 2013. Former overlooker, Harrow Mill. Survived by a sister.</p>
          <dl className="ending-fields">
            <div>
              <dt>02:45</dt>
              <dd>DI Reed reaches the gate.</dd>
            </div>
            <div>
              <dt>03:00</dt>
              <dd>The coroner’s estimate: until about now, he would probably have survived a rescue.</dd>
            </div>
            <div>
              <dt>03:14</dt>
              <dd>The 999 call.</dd>
            </div>
          </dl>
          <p>On 17 October 2014 it took Thomas Reed fifty minutes to decide again. He decided the same way.</p>
        </>
      ),
    },
    {
      id: 'sarah',
      tone: 'quiet',
      kicker: 'From the sender',
      body: (
        <blockquote className="ending-letter">
          You got there. I’ve changed the addresses in her script — mine is still on it, so are two papers that still
          exist, and the Standards Unit. It doesn’t need anyone to press anything. It never did. — S.
        </blockquote>
      ),
    },
    {
      id: 'pit',
      tone: 'news',
      kicker: 'Ashford · local news',
      title: 'Police drain wheel pit beneath apartment lobby',
      body: (
        <p>
          Residents of Wheelhouse Court watched from the stairs as divers worked under the glass floor of their lobby.
          They recovered a camera strap and the timbers of a gallery. They did not find her.
        </p>
      ),
    },
    {
      id: 'callum',
      tone: 'quiet',
      body: (
        <p>
          Callum Reed is thirty and teaches geography across town. He reads about the twenty-nine minutes on a Tuesday,
          between lessons. He has done nothing since he was seventeen except believe his father.
        </p>
      ),
    },
    {
      id: 'switch',
      tone: 'terminal',
      kicker: 'checkin.php',
      body: sent ? (
        <>
          <pre>{`stage 2: owls.zip sent to 3 recipients
delivered.`}</pre>
          <p className="ending-final">Sent.</p>
          <p>Nobody typed the word for thirty days. You stopped looking.</p>
        </>
      ) : (
        <>
          <pre>{`// If you're looking for me you'll find the word.  If you type the word it thinks I'm fine.
// So don't look.  Let it run.`}</pre>
          <p>
            There’s nothing left to press. Her switch will send everything
            {deadline ? ` in ${daysUntil(deadline)} days, on ${formatDate(deadline.toISOString())},` : ''} as long as
            nobody types the word.
          </p>
          <p>The owl page is still there. The password box still works.</p>
          <p className="ending-final">Stop looking. Let it run.</p>
        </>
      ),
    },
  ];
}

/* ---------------------------------------------------------------- STILL ONLINE */

function stillOnline(state: GameState): Scene[] {
  const log = buildCheckinLog(state).filter((line) => !line.startsWith('#'));
  const tail = log.slice(-3).join('\n');

  return [
    {
      id: 'log',
      tone: 'terminal',
      kicker: 'site_restore/checkin.log',
      body: <pre>{tail}</pre>,
    },
    {
      id: 'post',
      tone: 'site',
      kicker: 'eleanorvale.example · guestbook',
      body: (
        <div className="ending-guestbook">
          <p className="ending-guestbook__name">
            UNKNOWN USER <span>{formatDate(new Date().toISOString())}</span>
          </p>
          <p>{playerWords(state)}</p>
        </div>
      ),
    },
    {
      id: 'counter',
      tone: 'site',
      body: (
        <p className="ending-counter">
          you are visitor <span>000919</span>
        </p>
      ),
    },
    {
      id: 'fine',
      tone: 'site',
      kicker: 'http://eleanorvale.example/',
      body: (
        <div className="ending-oldweb">
          <p className="ending-oldweb__title">~ eleanor's corner of the web ~</p>
          <p className="eleanor-text">This is my little corner of the internet.  Have a look around.  Sign the guestbook.  Mind the damp.</p>
          <p className="ending-oldweb__updated">last updated: today</p>
        </div>
      ),
    },
    {
      id: 'next',
      tone: 'terminal',
      body: <p className="ending-final ending-final--mono">next check-in due: the 17th</p>,
    },
  ];
}

export function scenesFor(state: GameState): Scene[] {
  switch (state.ending) {
    case 'officialStory':
      return officialStory(state);
    case 'wrongPerson':
      return wrongPerson(state);
    case 'truth':
      return truth(state);
    case 'stillOnline':
      return stillOnline(state);
    default:
      return [];
  }
}
