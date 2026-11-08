import { useEffect } from 'react';
import { useDiscovery } from '../../../hooks/useDiscovery';
import { useGame } from '../../../store/GameContext';
import { ServerNotFoundPage } from './ErrorPages';

/** Egg 8. Reached only by walking the site's pages in reverse. Part of the secret route. */
export function StillPage() {
  const { state } = useGame();
  const { record } = useDiscovery();
  const found = state.flags.includes('found-still');

  useEffect(() => {
    if (found) record('flags', 'read-still');
  }, [found, record]);

  if (!found) return <ServerNotFoundPage />;

  return (
    <section className="oldweb-index">
      <h1>Index of /~eleanor/still/</h1>
      <pre tabIndex={0}>
        <code>{`Name            Last modified       Size
-----------------------------------------
Parent Directory                       -
still.txt       17-Oct-2014 18:40     12
-----------------------------------------`}</code>
      </pre>
      <p className="eleanor-text oldweb-index__contents">still here.</p>
    </section>
  );
}
