import { FileText, Lock } from 'lucide-react';
import { href, usePath } from '../../app/router';
import { ARCHIVE, ARCHIVE_BY_ID } from '../../data/archive';
import { useGame } from '../../store/GameContext';
import { describeRequirement } from '../../store/selectors';
import { isDocumentOpen } from './access';
import { DocumentViewer } from './DocumentViewer';

function DocumentList({ activeId }: { activeId: string | null }) {
  const { state } = useGame();
  const readCount = state.readDocuments.filter((id) => id in ARCHIVE_BY_ID).length;

  return (
    <nav className="archive__list" aria-label="Case documents">
      <p className="archive__count">
        {readCount} of {ARCHIVE.length} read
      </p>
      <ul>
        {ARCHIVE.map((doc) => {
          const open = isDocumentOpen(doc, state);
          const read = state.readDocuments.includes(doc.id);
          return (
            <li key={doc.id}>
              <a
                className={`doc-card${open ? '' : ' doc-card--locked'}`}
                href={href(`/archive/${doc.id}`)}
                aria-current={activeId === doc.id ? 'page' : undefined}
              >
                <span className="doc-card__id">{doc.id}</span>
                <span className="doc-card__title">{doc.title}</span>
                <span className="doc-card__meta">
                  {doc.date} · {doc.author}
                </span>
                <span className="doc-card__state">
                  {open ? (
                    <>
                      <FileText aria-hidden="true" size={13} />
                      {read ? 'Read' : 'Unread'}
                    </>
                  ) : (
                    <>
                      <Lock aria-hidden="true" size={13} />
                      Locked
                    </>
                  )}
                </span>
                {!open && doc.requirement && (
                  <span className="doc-card__reason">{describeRequirement(doc.requirement, state)}</span>
                )}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function ArchivePage() {
  const path = usePath();
  const id = path.split('/')[2] ?? null;
  const doc = id ? ARCHIVE_BY_ID[id] : null;

  return (
    <div className={`archive${id ? ' archive--reading' : ''}`}>
      <header className="archive__header">
        <p className="kicker">File 02 · Westmarch Constabulary, Ashford Division</p>
        <h1 className="page-title">Police Archive</h1>
      </header>

      <div className="archive__body">
        <DocumentList activeId={id} />

        <section className="archive__viewer" aria-label="Document viewer">
          {id && doc && <DocumentViewer key={doc.id} doc={doc} />}
          {id && !doc && (
            <div className="archive__empty">
              <p>No document is filed under {id}.</p>
              <a className="button" href={href('/archive')}>
                Back to the document list
              </a>
            </div>
          )}
          {!id && (
            <div className="archive__empty">
              <p>Choose a document to read it.</p>
              <p className="archive__empty-hint">
                These are the records from the original investigation. Read them carefully, because the people
                who wrote them were not all careful.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
