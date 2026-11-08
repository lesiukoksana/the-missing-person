import { ArrowDown, ArrowUp } from 'lucide-react';
import { useState } from 'react';
import type { Thread } from '../../data/messages';
import { useDiscovery } from '../../hooks/useDiscovery';
import { useGame } from '../../store/GameContext';
import { PUZZLES_BY_ID } from '../puzzles/definitions';
import { countInPlace, FRAGMENTS, isReconstructed, SCRAMBLED_ORDER } from '../puzzles/emailReconstruction';

const FRAGMENTS_BY_ID = Object.fromEntries(FRAGMENTS.map((fragment) => [fragment.id, fragment]));

function EmailHeader({ thread }: { thread: Thread }) {
  return (
    <dl className="mail__head">
      {thread.details.slice(0, 3).map(([field, value]) => (
        <div key={field}>
          <dt>{field}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function ReconstructionPuzzle({ thread }: { thread: Thread }) {
  const { state, dispatch } = useGame();
  const { discover } = useDiscovery();
  const [order, setOrder] = useState(SCRAMBLED_ORDER);
  const [feedback, setFeedback] = useState('');
  const solved = state.solvedPuzzles.includes('emailReconstruction');

  if (solved) {
    return (
      <div className="mail">
        <EmailHeader thread={thread} />
        <div className="mail__body eleanor-text">
          {FRAGMENTS.map((fragment) => (
            <p key={fragment.id}>{fragment.text}</p>
          ))}
        </div>
        <p className="mail__restored">Rebuilt from 6 fragments.</p>
      </div>
    );
  }

  function move(index: number, by: number) {
    const target = index + by;
    if (target < 0 || target >= order.length) return;
    const next = [...order];
    [next[index], next[target]] = [next[target], next[index]];
    setOrder(next);
    setFeedback('');
  }

  function submit() {
    if (!isReconstructed(order)) {
      const inPlace = countInPlace(order);
      setFeedback(
        `${inPlace} of ${FRAGMENTS.length} fragments are in the right place. The offsets only survive in part, but they still count upwards.`,
      );
      return;
    }
    dispatch({
      type: 'solvePuzzle',
      puzzle: 'emailReconstruction',
      label: `Puzzle solved: ${PUZZLES_BY_ID.emailReconstruction.title}`,
      at: new Date().toISOString(),
    });
    discover('email-reconstructed');
  }

  return (
    <section className="reconstruct" aria-labelledby="reconstruct-title">
      <EmailHeader thread={thread} />
      <h3 id="reconstruct-title" className="section-heading">
        Recovered fragments
      </h3>
      <p className="reconstruct__help">
        The body survives as six fragments, out of order. Each one keeps part of its byte offset, the
        position it held in the original file. Put them back in order.
      </p>

      <ol className="reconstruct__list">
        {order.map((id, index) => {
          const fragment = FRAGMENTS_BY_ID[id];
          return (
            <li key={id} className="fragment">
              <span className="fragment__offset">{fragment.offset}</span>
              <p className="fragment__text eleanor-text">{fragment.text}</p>
              <span className="fragment__controls">
                <button
                  type="button"
                  className="icon-button"
                  aria-label={`Move fragment ${fragment.offset} up`}
                  disabled={index === 0}
                  onClick={() => move(index, -1)}
                >
                  <ArrowUp aria-hidden="true" size={18} />
                </button>
                <button
                  type="button"
                  className="icon-button"
                  aria-label={`Move fragment ${fragment.offset} down`}
                  disabled={index === order.length - 1}
                  onClick={() => move(index, 1)}
                >
                  <ArrowDown aria-hidden="true" size={18} />
                </button>
              </span>
            </li>
          );
        })}
      </ol>

      <div className="button-row">
        <button type="button" className="button button--primary" onClick={submit}>
          Rebuild the email
        </button>
        <button
          type="button"
          className="button button--ghost"
          onClick={() => {
            setOrder(SCRAMBLED_ORDER);
            setFeedback('');
          }}
        >
          Start again
        </button>
      </div>
      {feedback && (
        <p className="reconstruct__feedback" role="alert">
          {feedback}
        </p>
      )}
    </section>
  );
}
