import { href } from '../app/router';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export function NotFoundPage() {
  useDocumentTitle('No record found');

  return (
    <section className="notice-page" aria-labelledby="not-found-title">
      <p className="kicker">Error 404</p>
      <h1 id="not-found-title" className="page-title">
        No record found
      </h1>
      <p className="notice-page__body">Nothing is filed at this address.</p>
      <a className="button" href={href('/hub')}>
        Back to case overview
      </a>
    </section>
  );
}
