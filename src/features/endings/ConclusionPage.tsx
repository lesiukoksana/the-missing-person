import { CircleCheck, Circle } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { href, navigate } from '../../app/router';
import { establishedKeyLinks, KEY_LINKS } from '../../data/connections';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useGame } from '../../store/GameContext';
import type { EndingId } from '../../types/game';
import { PUZZLES, PUZZLES_BY_ID } from '../puzzles/definitions';
import { ENDING_TITLES, missingForTruth } from './endingState';

type Finding = '' | 'left' | 'harmed';
type Accused = '' | 'daniel' | 'sarah' | 'reed';

const ACCUSED_NAMES: Record<Exclude<Accused, ''>, string> = {
  daniel: 'Daniel Cross',
  sarah: 'Sarah Bennett',
  reed: 'Thomas Reed',
};

function FiledSummary() {
  const { state, dispatch } = useGame();
  const ending = state.ending!;
  const accused = state.endingVariant as Exclude<Accused, ''> | null;

  return (
    <section className="conclusion-filed" aria-labelledby="filed-title">
      <p className="kicker">Conclusion filed</p>
      <h2 id="filed-title" className="conclusion-filed__title">
        {ENDING_TITLES[ending]}
      </h2>
      {ending === 'wrongPerson' && accused && <p>You named {ACCUSED_NAMES[accused]}.</p>}
      {ending === 'stillOnline' && <p>You didn’t file this one. You typed the word.</p>}
      <div className="button-row">
        <a className="button button--primary" href={href('/ending')}>
          Read it again
        </a>
        <button
          type="button"
          className="button button--ghost"
          onClick={() => dispatch({ type: 'reopenCase' })}
        >
          Reopen the case
        </button>
      </div>
      <p className="field__hint">Reopening withdraws your conclusion. Everything you have found stays.</p>
    </section>
  );
}

export function ConclusionPage() {
  const { state, dispatch } = useGame();
  useDocumentTitle('Case Conclusion');
  const [finding, setFinding] = useState<Finding>('');
  const [accused, setAccused] = useState<Accused>('');
  const [error, setError] = useState<string[] | null>(null);
  const [confirming, setConfirming] = useState(false);

  const established = establishedKeyLinks(state.board.connections).length;
  const missing = missingForTruth(state);

  function chosenEnding(): { ending: EndingId; variant?: string } | null {
    if (finding === 'left') return { ending: 'officialStory' };
    if (finding === 'harmed' && (accused === 'daniel' || accused === 'sarah')) return { ending: 'wrongPerson', variant: accused };
    if (finding === 'harmed' && accused === 'reed') return { ending: 'truth', variant: 'reed' };
    return null;
  }

  function review(event: FormEvent) {
    event.preventDefault();
    if (!finding) {
      setError(['Choose what you believe happened to Eleanor.']);
      return;
    }
    if (finding === 'harmed' && !accused) {
      setError(['Choose who you believe is responsible.']);
      return;
    }
    if (accused === 'reed' && finding === 'harmed' && missing.length > 0) {
      setError([
        'The file doesn’t support that yet. You may be right, but you can’t show it. Still to do:',
        ...missing.map((puzzle) => PUZZLES_BY_ID[puzzle].title),
      ]);
      return;
    }
    setError(null);
    setConfirming(true);
  }

  function file() {
    const choice = chosenEnding();
    if (!choice) return;
    dispatch({ type: 'reachEnding', ending: choice.ending, variant: choice.variant, at: new Date().toISOString() });
    navigate('/ending');
  }

  const summary =
    finding === 'left'
      ? 'Eleanor Vale left Ashford of her own accord. No one is responsible.'
      : accused
        ? `Someone is responsible for what happened to Eleanor Vale: ${ACCUSED_NAMES[accused as Exclude<Accused, ''>]}.`
        : '';

  return (
    <div className="conclusion">
      <header className="archive__header">
        <p className="kicker">File 09 · Your conclusion</p>
        <h1 className="page-title">Case Conclusion</h1>
        <p className="suspects__intro">
          When you think you know what happened, say so here. What you file decides how this ends.
        </p>
      </header>

      {state.ending ? (
        <FiledSummary />
      ) : (
        <div className="conclusion-layout">
          <aside className="conclusion-readiness" aria-labelledby="readiness-title">
            <h2 id="readiness-title" className="section-heading">
              Your case so far
            </h2>
            <ul className="readiness-list">
              {PUZZLES.map((puzzle) => {
                const solved = state.solvedPuzzles.includes(puzzle.id);
                return (
                  <li key={puzzle.id} className={solved ? 'readiness-list__done' : ''}>
                    {solved ? <CircleCheck aria-hidden="true" size={15} /> : <Circle aria-hidden="true" size={15} />}
                    {puzzle.title}
                    <span className="visually-hidden">{solved ? ' (solved)' : ' (not solved)'}</span>
                  </li>
                );
              })}
            </ul>
            <dl className="ledger">
              <div>
                <dt>Evidence found</dt>
                <dd>{state.discoveredEvidence.length}</dd>
              </div>
              <div>
                <dt>Key links on your board</dt>
                <dd>
                  {established} / {KEY_LINKS.length}
                </dd>
              </div>
            </dl>
          </aside>

          {confirming ? (
            <section className="conclusion-form" aria-labelledby="confirm-title">
              <h2 id="confirm-title" className="conclusion-filed__title">
                File this conclusion?
              </h2>
              <blockquote className="conclusion-quote">{summary}</blockquote>
              <p>This closes the investigation. You can reopen it afterwards and keep everything you have found.</p>
              <div className="button-row">
                <button type="button" className="button button--primary" onClick={file}>
                  File it
                </button>
                <button type="button" className="button button--ghost" onClick={() => setConfirming(false)}>
                  Go back
                </button>
              </div>
            </section>
          ) : (
            <form className="conclusion-form" onSubmit={review} noValidate>
              <fieldset>
                <legend>What happened to Eleanor?</legend>
                <label className="choice">
                  <input
                    type="radio"
                    name="finding"
                    value="left"
                    checked={finding === 'left'}
                    onChange={() => {
                      setFinding('left');
                      setAccused('');
                      setError(null);
                    }}
                  />
                  <span>
                    <strong>She left Ashford of her own accord.</strong>
                    <span className="choice__hint">The official explanation.</span>
                  </span>
                </label>
                <label className="choice">
                  <input
                    type="radio"
                    name="finding"
                    value="harmed"
                    checked={finding === 'harmed'}
                    onChange={() => {
                      setFinding('harmed');
                      setError(null);
                    }}
                  />
                  <span>
                    <strong>Someone is responsible for what happened to her.</strong>
                  </span>
                </label>
              </fieldset>

              {finding === 'harmed' && (
                <fieldset>
                  <legend>Who is responsible?</legend>
                  {(Object.keys(ACCUSED_NAMES) as Exclude<Accused, ''>[]).map((id) => (
                    <label key={id} className="choice">
                      <input
                        type="radio"
                        name="accused"
                        value={id}
                        checked={accused === id}
                        onChange={() => {
                          setAccused(id);
                          setError(null);
                        }}
                      />
                      <span>
                        <strong>{ACCUSED_NAMES[id]}</strong>
                      </span>
                    </label>
                  ))}
                </fieldset>
              )}

              {error && (
                <div className="conclusion-error" role="alert">
                  <p>{error[0]}</p>
                  {error.length > 1 && (
                    <ul>
                      {error.slice(1).map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              <div className="button-row">
                <button type="submit" className="button button--primary">
                  Review my conclusion
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
