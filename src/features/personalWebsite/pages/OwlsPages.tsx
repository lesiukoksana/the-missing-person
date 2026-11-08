import { useEffect, useState, type FormEvent } from 'react';
import { href } from '../../../app/router';
import { HIDDEN_FRAME, OWL_FRAMES } from '../../../data/website/photos';
import { useDiscovery } from '../../../hooks/useDiscovery';
import { useGame } from '../../../store/GameContext';
import { formatDate } from '../../../utils/format';
import { checkBlogPassword } from '../../puzzles/blogPassword';
import { PUZZLES_BY_ID } from '../../puzzles/definitions';
import { OwlFrameArt } from '../photoArt';
import { PhotoInspector } from '../PhotoInspector';
import { ServerNotFoundPage } from './ErrorPages';

function hasViewedAllFrames(viewed: string[]) {
  return OWL_FRAMES.every((frame) => viewed.includes(frame.id));
}

function PasswordBox({ compact = false }: { compact?: boolean }) {
  const { state, dispatch } = useGame();
  const { discover } = useDiscovery();
  const [word, setWord] = useState('');
  const [feedback, setFeedback] = useState('');
  const [accepted, setAccepted] = useState(false);

  function submit(event: FormEvent) {
    event.preventDefault();
    const result = checkBlogPassword(word);
    if (!result.correct) {
      setFeedback(result.feedback);
      setAccepted(false);
      return;
    }

    const at = new Date().toISOString();
    setWord('');
    setFeedback('');
    setAccepted(true);
    // Every correct entry is a check-in on the dead man's switch. The player isn't told yet.
    dispatch({ type: 'checkIn', at });
    if (!state.solvedPuzzles.includes('blogPassword')) {
      dispatch({
        type: 'solvePuzzle',
        puzzle: 'blogPassword',
        label: `Puzzle solved: ${PUZZLES_BY_ID.blogPassword.title}`,
        at,
      });
      discover('owl-gallery');
    }
  }

  return (
    <form className={`oldweb-password${compact ? ' oldweb-password--compact' : ''}`} onSubmit={submit}>
      <label htmlFor="owl-word">{compact ? 'sign in again' : 'the word:'}</label>
      <div className="old-form-row">
        <input
          id="owl-word"
          type="password"
          value={word}
          autoComplete="off"
          onChange={(event) => setWord(event.target.value)}
        />
        <button type="submit" className="old-button">
          enter
        </button>
      </div>
      {feedback && (
        <p className="old-feedback eleanor-text" role="alert">
          {feedback}
        </p>
      )}
      {accepted && compact && <p role="status">Okay.</p>}
    </form>
  );
}

export function OwlsPage() {
  const { state } = useGame();
  const unlocked = state.solvedPuzzles.includes('blogPassword');

  if (!unlocked) {
    return (
      <section>
        <h1>the owl page</h1>
        <p className="eleanor-text">This page is locked, sorry.  If you are supposed to get in, you know what to do.</p>
        <PasswordBox />
      </section>
    );
  }

  const lastCheckIn = state.checkIns[state.checkIns.length - 1];
  const showHidden = hasViewedAllFrames(state.viewedPhotos);

  return (
    <section>
      <h1>the owl page</h1>
      <p className="eleanor-text">Hello, you.  Everything from the wheel house camera.  It stamps the time on every frame, seven minutes wrong.</p>
      {lastCheckIn && <p className="oldweb-date">last signed in: {formatDate(lastCheckIn)}</p>}

      <ul className="oldweb-gallery">
        {OWL_FRAMES.map((frame) => (
          <li key={frame.id}>
            <a href={href(`/website/owls/${frame.id}`)}>
              <span className="oldweb-gallery__thumb photo-art photo-art--infrared">
                <OwlFrameArt frame={frame} />
              </span>
              <span className="oldweb-gallery__title">{frame.fileName}</span>
              {state.viewedPhotos.includes(frame.id) && <span className="oldweb-date"> (viewed)</span>}
            </a>
          </li>
        ))}
        {showHidden && (
          <li>
            <a href={href(`/website/owls/${HIDDEN_FRAME.id}`)}>
              <span className="oldweb-gallery__thumb oldweb-gallery__thumb--missing">no preview</span>
              <span className="oldweb-gallery__title">{HIDDEN_FRAME.fileName}</span>
            </a>
          </li>
        )}
      </ul>

      <PasswordBox compact />
    </section>
  );
}

export function OwlFramePage({ id }: { id: string }) {
  const { state } = useGame();
  const { record } = useDiscovery();

  const isHidden = id === HIDDEN_FRAME.id;
  const allowed =
    state.solvedPuzzles.includes('blogPassword') &&
    (!isHidden || hasViewedAllFrames(state.viewedPhotos));
  const frame = isHidden ? HIDDEN_FRAME : OWL_FRAMES.find((candidate) => candidate.id === id);

  useEffect(() => {
    if (!allowed || !frame) return;
    record('viewedPhotos', frame.id);
    if (isHidden) record('flags', 'found-te-0917');
  }, [allowed, frame, isHidden, record]);

  if (!allowed || !frame) return <ServerNotFoundPage />;

  const index = OWL_FRAMES.indexOf(frame);
  const next = isHidden ? undefined : OWL_FRAMES[index + 1];
  const showHiddenNext = !isHidden && !next && hasViewedAllFrames(state.viewedPhotos);

  return (
    <article>
      <h1>{frame.fileName}</h1>
      {frame.caption && <p className="eleanor-text">{frame.caption}</p>}

      <PhotoInspector alt={frame.alt} art={<OwlFrameArt frame={frame} />} />

      <details className="oldweb-details">
        <summary>File details</summary>
        <table className="oldweb-table">
          <tbody>
            <tr>
              <th scope="row">FileName</th>
              <td>{frame.fileName}</td>
            </tr>
            <tr>
              <th scope="row">Make</th>
              <td>TrailEye</td>
            </tr>
            <tr>
              <th scope="row">Model</th>
              <td>TC-12</td>
            </tr>
            <tr>
              <th scope="row">DateTimeOriginal</th>
              <td>{frame.taken}</td>
            </tr>
          </tbody>
        </table>
      </details>

      <nav className="oldweb-pager" aria-label="More frames">
        {index > 0 ? (
          <a href={href(`/website/owls/${OWL_FRAMES[index - 1].id}`)}>&laquo; previous</a>
        ) : (
          <span />
        )}
        <a href={href('/website/owls')}>all frames</a>
        {next && <a href={href(`/website/owls/${next.id}`)}>next &raquo;</a>}
        {showHiddenNext && <a href={href(`/website/owls/${HIDDEN_FRAME.id}`)}>next &raquo;</a>}
        {!next && !showHiddenNext && <span />}
      </nav>
    </article>
  );
}
