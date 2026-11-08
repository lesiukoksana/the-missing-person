import { ArrowLeft, Lock } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { href } from '../../app/router';
import { ARCHIVE, type ArchiveDocument, type Block, type Mark } from '../../data/archive';
import { useDiscovery } from '../../hooks/useDiscovery';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useGame } from '../../store/GameContext';
import { describeRequirement } from '../../store/selectors';
import { isDocumentOpen } from './access';

const MARK_PATTERN = /(\[\[[a-z0-9-]+\]\])/;

function MarkedText({
  text,
  marks,
  onExamine,
}: {
  text: string;
  marks: Record<string, Mark>;
  onExamine: (id: string) => void;
}) {
  return (
    <>
      {text.split(MARK_PATTERN).map((part, index) => {
        const match = part.match(/^\[\[([a-z0-9-]+)\]\]$/);
        const mark = match ? marks[match[1]] : undefined;
        if (!match || !mark) return part;

        if (mark.kind === 'redaction') {
          return (
            <button
              key={index}
              type="button"
              className="doc-redaction"
              style={{ width: `${mark.text.length * 0.62}em` }}
              onClick={() => onExamine(match[1])}
            >
              <span className="visually-hidden">Redacted text. Examine the redaction.</span>
            </button>
          );
        }
        return (
          <button key={index} type="button" className="doc-struck" onClick={() => onExamine(match[1])}>
            <del>{mark.text}</del>
            <span className="visually-hidden"> (struck through, examine)</span>
          </button>
        );
      })}
    </>
  );
}

function renderBlock(block: Block, key: number, mark: (text: string) => ReactNode) {
  switch (block.kind) {
    case 'heading':
      return (
        <h3 key={key} className="doc-heading">
          {block.text}
        </h3>
      );
    case 'fields':
      return (
        <dl key={key} className="doc-fields">
          {block.rows.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{mark(value)}</dd>
            </div>
          ))}
        </dl>
      );
    case 'para':
      return (
        <p key={key} className="doc-para">
          {mark(block.text)}
        </p>
      );
    case 'transcript':
      return (
        <dl key={key} className="doc-transcript">
          {block.lines.map(([speaker, line], index) => (
            <div key={index}>
              <dt>{speaker}</dt>
              <dd>{mark(line)}</dd>
            </div>
          ))}
        </dl>
      );
    case 'table':
      return (
        <div key={key} className="doc-table-wrap" tabIndex={0} role="region" aria-label="Table">
          <table className="doc-table">
            <thead>
              <tr>
                {block.columns.map((column) => (
                  <th key={column} scope="col">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{mark(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'handwritten':
      return (
        <p key={key} className="doc-handwritten">
          <span className="visually-hidden">Handwritten note: </span>
          {block.text}
        </p>
      );
    case 'signature':
      return (
        <p key={key} className="doc-signature">
          {block.lines.map((line, index) => (
            <span key={index}>{line}</span>
          ))}
        </p>
      );
  }
}

function LockedDocument({ doc }: { doc: ArchiveDocument }) {
  const { state } = useGame();
  return (
    <div className="archive__empty">
      <p className="kicker">
        <Lock aria-hidden="true" size={12} /> {doc.id} · Locked
      </p>
      <h2 className="doc-locked-title">{doc.title}</h2>
      <p>{doc.summary}</p>
      {doc.requirement && (
        <p className="notice-page__requirement">
          <strong>To open this document:</strong> {describeRequirement(doc.requirement, state)}
        </p>
      )}
    </div>
  );
}

export function DocumentViewer({ doc }: { doc: ArchiveDocument }) {
  const { state, dispatch } = useGame();
  const { discover } = useDiscovery();
  const [examined, setExamined] = useState<Mark | null>(null);
  const open = isDocumentOpen(doc, state);
  useDocumentTitle(doc.title);

  useEffect(() => {
    if (!open) return;
    dispatch({
      type: 'collect',
      collection: 'readDocuments',
      id: doc.id,
      label: `Read: ${doc.title}`,
      at: new Date().toISOString(),
    });
    doc.evidence.forEach((id) => discover(id));
  }, [open, doc, dispatch, discover]);

  const index = ARCHIVE.indexOf(doc);
  const previous = ARCHIVE[index - 1];
  const next = ARCHIVE[index + 1];

  const pager = (
    <nav className="doc-pager" aria-label="Other documents">
      {previous ? (
        <a href={href(`/archive/${previous.id}`)}>← {previous.title}</a>
      ) : (
        <span />
      )}
      {next ? <a href={href(`/archive/${next.id}`)}>{next.title} →</a> : <span />}
    </nav>
  );

  if (!open) {
    return (
      <>
        <a className="archive__back" href={href('/archive')}>
          <ArrowLeft aria-hidden="true" size={16} /> All documents
        </a>
        <LockedDocument doc={doc} />
        {pager}
      </>
    );
  }

  function examine(id: string) {
    const mark = doc.marks[id];
    setExamined(mark);
    if (mark.evidence) discover(mark.evidence);
  }

  const mark = (text: string) => <MarkedText text={text} marks={doc.marks} onExamine={examine} />;

  return (
    <article className="doc" aria-labelledby="doc-title">
      <a className="archive__back" href={href('/archive')}>
        <ArrowLeft aria-hidden="true" size={16} /> All documents
      </a>

      <header className="doc__toolbar">
        <p className="doc__id">{doc.id}</p>
        <h2 id="doc-title" className="doc__title">
          {doc.title}
        </h2>
        <p className="doc__meta">
          {doc.date} · {doc.author} · {doc.status}
        </p>
      </header>

      {examined && (
        <p className="doc__examined" role="status">
          <strong>{examined.kind === 'redaction' ? 'The redaction' : 'The struck-through line'}:</strong>{' '}
          {examined.note}
        </p>
      )}

      <div className="doc__pages">
        {doc.pages.map((page, pageIndex) => (
          <section
            key={pageIndex}
            className={`doc-page${page.retyped ? ' doc-page--retyped' : ''}`}
            aria-label={`Page ${pageIndex + 1} of ${doc.pages.length}`}
          >
            <header className="doc-page__head">
              <span>Westmarch Constabulary · {doc.department}</span>
              <span>{doc.classification}</span>
            </header>
            {page.stamp && (
              <p className="doc-page__stamp" aria-label={`Stamp: ${page.stamp}`}>
                {page.stamp}
              </p>
            )}
            <div className="doc-page__body">{page.blocks.map((block, blockIndex) => renderBlock(block, blockIndex, mark))}</div>
            <footer className="doc-page__foot">
              <span>{doc.id}</span>
              <span>
                Page {pageIndex + 1} of {doc.pages.length}
              </span>
            </footer>
          </section>
        ))}
      </div>

      <details
        className="doc__details"
        onToggle={(event) => {
          if (event.currentTarget.open && doc.detailsEvidence) discover(doc.detailsEvidence);
        }}
      >
        <summary>Document details</summary>
        <dl>
          <div>
            <dt>Classification</dt>
            <dd>{doc.classification}</dd>
          </div>
          <div>
            <dt>Department</dt>
            <dd>{doc.department}</dd>
          </div>
          {doc.details.map(([field, value]) => (
            <div key={field}>
              <dt>{field}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </details>

      <section className="doc__related" aria-labelledby="related-title">
        <h3 id="related-title" className="section-heading">
          Connected records
        </h3>
        <ul>
          {doc.related.map((link) => (
            <li key={link.to}>
              <a href={href(link.to)}>{link.label}</a>
            </li>
          ))}
        </ul>
      </section>

      {pager}
    </article>
  );
}
