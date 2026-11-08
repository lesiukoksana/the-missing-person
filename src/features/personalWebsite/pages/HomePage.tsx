import { href } from '../../../app/router';
import { useGame } from '../../../store/GameContext';

export function HomePage() {
  const { state } = useGame();
  const counter = state.endingsReached.includes('stillOnline')
    ? '000919'
    : state.flags.includes('visited-site')
      ? '000918'
      : '000917';

  return (
    <div className="oldweb-home">
      <div className="oldweb-home__intro">
        <h1>hello, and welcome!</h1>
        <p className="eleanor-text">
          This is my little corner of the internet.  I am Eleanor.  I live in Ashford, I print things for a living, and I take photographs of places that everybody else has finished with.
        </p>
        <p className="eleanor-text">
          Have a look around.  Sign the guestbook.  Mind the damp.
        </p>

        <h2>new on the site</h2>
        <ul className="oldweb-list">
          <li>
            <span className="oldweb-new">NEW!</span>{' '}
            <a href={href('/website/blog/untitled')}>(no title)</a> <span className="oldweb-date">17 Oct 2026</span>
          </li>
          <li>
            <a href={href('/website/blog/almost-done')}>Almost done</a> <span className="oldweb-date">15 Oct 2014</span>
          </li>
          <li>
            <a href={href('/website/blog/backups')}>Backups (a boring post)</a> <span className="oldweb-date">12 Oct 2014</span>
          </li>
        </ul>
      </div>

      <aside className="oldweb-home__side">
        <dl className="oldweb-facts">
          <div>
            <dt>last updated</dt>
            <dd>17/10/2026</dd>
          </div>
          <div>
            <dt>you are visitor</dt>
            <dd className="oldweb-counter">{counter}</dd>
          </div>
        </dl>

        <h2>links</h2>
        <ul className="oldweb-list">
          <li>
            <a href={href('/website/out/ashfordcourier.example')}>the Ashford Courier</a>
          </li>
          <li>
            <a href={href('/website/out/ashford-localstudies.example')}>Ashford Local Studies</a>
          </li>
          <li>
            <a href={href('/website/out/ashfordcameraclub.example')}>Ashford Camera Club</a>
          </li>
        </ul>

        {state.flags.includes('found-still') && (
          <p className="oldweb-still-link">
            <a href={href('/website/~eleanor/still')}>~</a>
          </p>
        )}
      </aside>
    </div>
  );
}
