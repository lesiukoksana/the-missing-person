import { ArrowLeft, Paperclip, Trash2 } from 'lucide-react';
import { useEffect } from 'react';
import { href } from '../../app/router';
import type { Message, Thread } from '../../data/messages';
import { useDiscovery } from '../../hooks/useDiscovery';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useGame } from '../../store/GameContext';
import { describeRequirement } from '../../store/selectors';
import { isThreadOpen } from './access';
import { ReconstructionPuzzle } from './ReconstructionPuzzle';

function Attachments({ message }: { message: Message }) {
  if (!message.attachments) return null;
  return (
    <ul className="mail__attachments" aria-label="Attachments">
      {message.attachments.map((attachment) => (
        <li key={attachment.name}>
          <Paperclip aria-hidden="true" size={14} />
          {attachment.to ? <a href={href(attachment.to)}>{attachment.name}</a> : <span>{attachment.name}</span>}
        </li>
      ))}
    </ul>
  );
}

function EmailMessage({ message }: { message: Message }) {
  if (message.deleted) {
    return (
      <li className="mail mail--deleted">
        <p className="mail__deleted">
          <Trash2 aria-hidden="true" size={14} />
          <span>
            Message from {message.from}, {message.date}. {message.deleted}. Content not recoverable from this backup.
          </span>
        </p>
      </li>
    );
  }

  return (
    <li className="mail">
      <dl className="mail__head">
        <div>
          <dt>From</dt>
          <dd>{message.from}</dd>
        </div>
        {message.to && (
          <div>
            <dt>To</dt>
            <dd>{message.to}</dd>
          </div>
        )}
        <div>
          <dt>Date</dt>
          <dd>{message.date}</dd>
        </div>
        {message.subject && (
          <div>
            <dt>Subject</dt>
            <dd>{message.subject}</dd>
          </div>
        )}
      </dl>
      <p className={`mail__body${message.eleanor ? ' eleanor-text' : ''}`}>{message.body}</p>
      <Attachments message={message} />
    </li>
  );
}

function SmsMessage({ message }: { message: Message }) {
  return (
    <li className={`sms${message.mine ? ' sms--mine' : ''}`}>
      <span className="sms__sender">{message.from}</span>
      <p className={`sms__bubble${message.eleanor ? ' eleanor-text' : ''}`}>{message.body}</p>
      <time className="sms__time">{message.date}</time>
    </li>
  );
}

export function ThreadView({ thread }: { thread: Thread }) {
  const { state } = useGame();
  const { discover, record } = useDiscovery();
  const open = isThreadOpen(thread, state);
  useDocumentTitle(thread.title);

  useEffect(() => {
    if (!open) return;
    record('discoveredMessages', thread.id);
    thread.evidence.forEach((id) => discover(id));
  }, [open, thread, record, discover]);

  const back = (
    <a className="archive__back" href={href('/messages')}>
      <ArrowLeft aria-hidden="true" size={16} /> All messages
    </a>
  );

  const header = (
    <header className="doc__toolbar">
      <p className="doc__id">{thread.source}</p>
      <h2 id="thread-title" className="doc__title">
        {thread.title}
      </h2>
      <p className="doc__meta">{thread.participants}</p>
    </header>
  );

  if (!open) {
    return (
      <article className="doc" aria-labelledby="thread-title">
        {back}
        {header}
        <div className="archive__empty">
          <p>
            This email was deleted. Its header survives in the Courier’s mail archive, but the body is in
            pieces.
          </p>
          {thread.requirement && (
            <p className="notice-page__requirement">
              <strong>To recover the fragments:</strong> {describeRequirement(thread.requirement, state)} File
              Recovery can then read them.
            </p>
          )}
        </div>
      </article>
    );
  }

  return (
    <article className="doc" aria-labelledby="thread-title">
      {back}
      {header}

      {thread.kind === 'reconstruction' && <ReconstructionPuzzle thread={thread} />}

      {thread.kind === 'email' && (
        <ol className="mail-list">
          {thread.messages.map((message) => (
            <EmailMessage key={message.id} message={message} />
          ))}
        </ol>
      )}

      {thread.kind === 'sms' && (
        <ol className="sms-list">
          {thread.messages.map((message) => (
            <SmsMessage key={message.id} message={message} />
          ))}
        </ol>
      )}

      <details
        className="doc__details"
        onToggle={(event) => {
          if (event.currentTarget.open && thread.detailsEvidence) discover(thread.detailsEvidence);
        }}
      >
        <summary>Source details</summary>
        <dl>
          {thread.details.map(([field, value]) => (
            <div key={field}>
              <dt>{field}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </details>
    </article>
  );
}
