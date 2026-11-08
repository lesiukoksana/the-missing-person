import { ArrowLeft, FileArchive, FileCheck2, FileWarning, FileX2, Lock, Unlock } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { href, usePath } from '../../app/router';
import { RECOVERY_BY_ID, RECOVERY_FILES, type RecoveredFile } from '../../data/recovery';
import { useDiscovery } from '../../hooks/useDiscovery';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useGame } from '../../store/GameContext';
import { describeRequirement } from '../../store/selectors';
import { PHOTO_ART } from '../personalWebsite/photoArt';
import {
  canRestore,
  displayStatus,
  fileContent,
  isFileAvailable,
  isFileReadable,
  restoredFlag,
  type DisplayStatus,
} from './fileAccess';

const STATUS_ICONS: Record<DisplayStatus, typeof FileCheck2> = {
  Recovered: FileCheck2,
  Restored: FileCheck2,
  Rebuilt: FileCheck2,
  Decrypted: Unlock,
  Deleted: FileX2,
  Corrupted: FileWarning,
  Encrypted: Lock,
};

const RESTORE_STEPS = ['Reading clusters…', 'Rebuilding file table…', 'Verifying…'];

function prefersReducedMotion() {
  return (
    document.documentElement.dataset.motion === 'reduced' ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

function StatusBadge({ status }: { status: DisplayStatus }) {
  const Icon = STATUS_ICONS[status];
  return (
    <span className={`file-status file-status--${status.toLowerCase()}`}>
      <Icon aria-hidden="true" size={13} />
      {status}
    </span>
  );
}

function FileBody({ file }: { file: RecoveredFile }) {
  const { state } = useGame();
  const content = fileContent(file, state);
  const Art = file.image ? PHOTO_ART[file.image] : null;

  return (
    <div className={`file-body file-body--${file.format}`}>
      {Art && (
        <div className="file-body__image photo-art" role="img" aria-label="Frame TE_0239, uncropped, with the camera’s date stamp.">
          <Art />
          <span className="file-body__stamp" aria-hidden="true">
            TE_0239   TC-12   2013-11-15 02:52
          </span>
        </div>
      )}
      <pre tabIndex={0}>{content}</pre>
    </div>
  );
}

function FileDetail({ file }: { file: RecoveredFile }) {
  const { state } = useGame();
  const { discover, record } = useDiscovery();
  const [step, setStep] = useState<number | null>(null);
  const timer = useRef<number | undefined>(undefined);
  useDocumentTitle(file.path.split('/').pop() ?? 'File');

  const readable = isFileReadable(file, state);
  const status = displayStatus(file, state);

  useEffect(() => {
    if (!readable) return;
    if (file.evidence) discover(file.evidence);
    if (file.readFlag) record('flags', file.readFlag);
  }, [readable, file, discover, record]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function restore() {
    const finish = () => {
      setStep(null);
      record('unlocked', restoredFlag(file));
    };
    if (prefersReducedMotion()) {
      finish();
      return;
    }
    const advance = (next: number) => {
      if (next >= RESTORE_STEPS.length) {
        finish();
        return;
      }
      setStep(next);
      timer.current = window.setTimeout(() => advance(next + 1), 450);
    };
    advance(0);
  }

  return (
    <article className="doc" aria-labelledby="file-title">
      <a className="archive__back" href={href('/recovery')}>
        <ArrowLeft aria-hidden="true" size={16} /> All files
      </a>
      <header className="doc__toolbar">
        <p className="doc__id">{file.source}</p>
        <h2 id="file-title" className="doc__title file-title">
          {file.path}
        </h2>
        <p className="doc__meta">
          <StatusBadge status={status} />
        </p>
      </header>

      <dl className="file-meta">
        <div>
          <dt>Type</dt>
          <dd>{file.type}</dd>
        </div>
        <div>
          <dt>Size</dt>
          <dd>{file.size}</dd>
        </div>
        <div>
          <dt>Modified</dt>
          <dd>{file.modified === 'today' ? 'Today' : file.modified}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>{readable && file.status !== 'recovered' ? 'Readable' : file.statusNote}</dd>
        </div>
      </dl>

      {file.rebuiltElsewhere && (
        <p className="notice-page__requirement">
          {state.solvedPuzzles.includes('emailReconstruction')
            ? 'The fragments have been put back in order.'
            : 'The six fragments can be read, but not in this order.'}{' '}
          <a href={href(file.rebuiltElsewhere.to)}>{file.rebuiltElsewhere.label}</a>.
        </p>
      )}

      {file.sealed && (
        <p className="notice-page__requirement">
          This archive is encrypted with a key that isn’t anywhere in the case file. It isn’t meant to be
          opened here. It’s meant to be sent.
        </p>
      )}

      {!file.sealed && !isFileAvailable(file, state) && file.requirement && (
        <p className="notice-page__requirement">
          <strong>{file.status === 'encrypted' ? 'Encrypted.' : 'Can’t be restored yet.'}</strong>{' '}
          {describeRequirement(file.requirement, state)}
          {file.requirement.kind === 'puzzle' && file.requirement.puzzle === 'terminalCode' && ' Use the Terminal.'}
        </p>
      )}

      {canRestore(file, state) && (
        <div className="restore">
          {step === null ? (
            <button type="button" className="button button--primary" onClick={restore}>
              Restore file
            </button>
          ) : (
            <div className="restore__progress" role="status">
              <span>{RESTORE_STEPS[step]}</span>
              <span className="restore__bar">
                <span style={{ width: `${((step + 1) / RESTORE_STEPS.length) * 100}%` }} />
              </span>
            </div>
          )}
        </div>
      )}

      {readable && <FileBody file={file} />}
    </article>
  );
}

export function RecoveryPage() {
  const path = usePath();
  const { state } = useGame();
  const id = path.split('/')[2] ?? null;
  const file = id ? RECOVERY_BY_ID[id] : null;

  const counts = RECOVERY_FILES.reduce<Record<string, number>>((totals, item) => {
    const status = displayStatus(item, state);
    totals[status] = (totals[status] ?? 0) + 1;
    return totals;
  }, {});

  return (
    <div className={`archive recovery${id ? ' archive--reading' : ''}`}>
      <header className="archive__header">
        <p className="kicker">File 08 · Simulated recovery tool. Nothing here touches your computer</p>
        <h1 className="page-title">File Recovery</h1>
        <p className="recovery__summary">
          {Object.entries(counts)
            .map(([status, count]) => `${count} ${status.toLowerCase()}`)
            .join(' · ')}
        </p>
      </header>

      <div className="archive__body recovery__body">
        <nav className="archive__list recovery__list" aria-label="Recovered files">
          <ul>
            {RECOVERY_FILES.map((item) => {
              const status = displayStatus(item, state);
              return (
                <li key={item.id}>
                  <a
                    className="rf-row"
                    href={href(`/recovery/${item.id}`)}
                    aria-current={id === item.id ? 'page' : undefined}
                  >
                    <FileArchive aria-hidden="true" size={15} className="rf-row__icon" />
                    <span className="rf-row__path">{item.path}</span>
                    <span className="rf-row__meta">
                      {item.size} · {item.modified === 'today' ? 'today' : item.modified.slice(0, 10)}
                    </span>
                    <StatusBadge status={status} />
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <section className="archive__viewer" aria-label="File details">
          {file && <FileDetail key={file.id} file={file} />}
          {id && !file && (
            <div className="archive__empty">
              <p>No file with that name.</p>
              <a className="button" href={href('/recovery')}>
                Back to the file list
              </a>
            </div>
          )}
          {!id && (
            <div className="archive__empty">
              <p>Choose a file to see what survived.</p>
              <p className="archive__empty-hint">
                Recovered from Eleanor’s seized laptop, the Courier’s mail server and her website’s last
                backup. Some files were deleted on purpose. Look at when.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
