import { useEffect, useRef, useState } from 'react';
import { href, navigate } from '../../app/router';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useGame } from '../../store/GameContext';
import type { EndingId } from '../../types/game';
import { ENDING_TITLES } from './endingState';
import { scenesFor } from './scenes';

const ORDER: EndingId[] = ['officialStory', 'wrongPerson', 'truth', 'stillOnline'];

function Afterword() {
  const { state, dispatch } = useGame();
  const [confirmingReset, setConfirmingReset] = useState(false);

  return (
    <section className="ending-after" aria-labelledby="after-title">
      <h2 id="after-title" className="ending-after__title">
        {state.ending ? ENDING_TITLES[state.ending] : ''}
      </h2>

      <div className="ending-found">
        <p className="kicker">
          Endings found: {state.endingsReached.length} of {ORDER.length}
        </p>
        <ul>
          {ORDER.map((id) => {
            const found = state.endingsReached.includes(id);
            const secret = id === 'stillOnline';
            return (
              <li key={id} className={found ? 'ending-found__item--found' : ''}>
                {found || !secret ? ENDING_TITLES[id] : '? ? ?'}
                <span className="ending-found__state">{found ? ' · found' : ' · not yet'}</span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="ending-actions">
        <a className="button button--primary" href={href('/hub')}>
          Review the case
        </a>
        <button
          type="button"
          className="button"
          onClick={() => {
            dispatch({ type: 'reopenCase' });
            navigate('/conclusion');
          }}
        >
          Reopen the case
        </button>
        {confirmingReset ? (
          <div className="ending-reset" role="alert">
            <p>Start again from nothing? Your evidence, puzzles and notes will be erased. The endings you have found are kept.</p>
            <div className="button-row">
              <button
                type="button"
                className="button button--danger"
                onClick={() => {
                  dispatch({ type: 'reset' });
                  navigate('/');
                }}
              >
                Erase and start over
              </button>
              <button type="button" className="button button--ghost" onClick={() => setConfirmingReset(false)}>
                Keep my progress
              </button>
            </div>
          </div>
        ) : (
          <button type="button" className="button button--ghost" onClick={() => setConfirmingReset(true)}>
            Start a new investigation
          </button>
        )}
      </div>
      <p className="field__hint">
        Reviewing keeps everything as it is. Reopening withdraws your conclusion but keeps what you found.
      </p>
    </section>
  );
}

export function EndingPage() {
  const { state } = useGame();
  const [step, setStep] = useState(0);
  const sceneRef = useRef<HTMLElement>(null);
  const firstRender = useRef(true);
  useDocumentTitle(state.ending ? ENDING_TITLES[state.ending] : 'Ending');

  const scenes = scenesFor(state);
  const atEnd = step >= scenes.length;
  const scene = scenes[step];

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    sceneRef.current?.focus();
  }, [step]);

  if (!state.ending) {
    return (
      <div className="ending">
        <section className="ending-scene ending-scene--quiet">
          <p>No conclusion has been filed.</p>
          <a className="button" href={href('/hub')}>
            Back to the case
          </a>
        </section>
      </div>
    );
  }

  return (
    <div className={`ending ending--${state.ending}`}>
      <header className="ending__header">
        <p className="kicker">Case #0917</p>
        <p className="ending__name">{ENDING_TITLES[state.ending]}</p>
        {!atEnd && (
          <p className="ending__progress">
            {step + 1} / {scenes.length}
          </p>
        )}
      </header>

      <main className="ending__main">
        {atEnd ? (
          <section ref={sceneRef} tabIndex={-1} className="ending-scene ending-scene--quiet" aria-label="After">
            <Afterword />
          </section>
        ) : (
          <section
            key={scene.id}
            ref={sceneRef}
            tabIndex={-1}
            className={`ending-scene ending-scene--${scene.tone}`}
            aria-labelledby={scene.title ? `scene-${scene.id}` : undefined}
            aria-label={scene.title ? undefined : scene.kicker ?? `Part ${step + 1}`}
          >
            {scene.kicker && <p className="ending-scene__kicker">{scene.kicker}</p>}
            {scene.title && (
              <h1 id={`scene-${scene.id}`} className="ending-scene__title">
                {scene.title}
              </h1>
            )}
            <div className="ending-scene__body">{scene.body}</div>
          </section>
        )}

        <nav className="ending__nav" aria-label="Ending">
          {step > 0 && (
            <button type="button" className="button button--ghost" onClick={() => setStep(step - 1)}>
              Back
            </button>
          )}
          {!atEnd && (
            <button type="button" className="button button--primary" onClick={() => setStep(step + 1)} autoFocus>
              {step === scenes.length - 1 ? 'Finish' : 'Continue'}
            </button>
          )}
          {!atEnd && step < scenes.length - 1 && (
            <button type="button" className="text-button" onClick={() => setStep(scenes.length)}>
              Skip to the end
            </button>
          )}
        </nav>
      </main>
    </div>
  );
}
