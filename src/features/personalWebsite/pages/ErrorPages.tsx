import { href } from '../../../app/router';

export function ServerNotFoundPage() {
  return (
    <section className="server-error">
      <h1>Not Found</h1>
      <p>The requested URL was not found on this server.</p>
      <hr />
      <p>
        <em>Apache/2.2.22 Server at eleanorvale.example Port 80</em>
      </p>
      <p>
        <a href={href('/website')}>Return to the home page</a>
      </p>
    </section>
  );
}

export function OutboundPage({ host }: { host: string }) {
  return (
    <section className="server-error">
      <h1>The page cannot be displayed</h1>
      <p>
        The server at <code>{host}</code> could not be found. The site may have closed, or moved to a
        new address.
      </p>
      <p>
        <a href={href('/website')}>Back to Eleanor’s site</a>
      </p>
    </section>
  );
}
