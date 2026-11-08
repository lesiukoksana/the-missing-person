import { Lock, Mail, MessageSquare, Puzzle } from 'lucide-react';
import { href, usePath } from '../../app/router';
import { THREADS, THREADS_BY_ID } from '../../data/messages';
import { useGame } from '../../store/GameContext';
import { describeRequirement } from '../../store/selectors';
import { isThreadListed, isThreadOpen } from './access';
import { ThreadView } from './ThreadView';

const KIND_ICONS = { email: Mail, sms: MessageSquare, reconstruction: Puzzle };

function ThreadList({ activeId }: { activeId: string | null }) {
  const { state } = useGame();
  const listed = THREADS.filter((thread) => isThreadListed(thread, state)).sort((a, b) =>
    b.sortDate.localeCompare(a.sortDate),
  );

  return (
    <nav className="inbox__list" aria-label="Conversations">
      <ul>
        {listed.map((thread) => {
          const open = isThreadOpen(thread, state);
          const unread = open && !state.discoveredMessages.includes(thread.id);
          const Icon = open ? KIND_ICONS[thread.kind] : Lock;
          return (
            <li key={thread.id}>
              <a
                className={`thread-row${unread ? ' thread-row--unread' : ''}${open ? '' : ' thread-row--locked'}`}
                href={href(`/messages/${thread.id}`)}
                aria-current={activeId === thread.id ? 'page' : undefined}
              >
                <Icon aria-hidden="true" size={16} className="thread-row__icon" />
                <span className="thread-row__main">
                  <span className="thread-row__title">
                    {thread.title}
                    {unread && <span className="thread-row__badge">New</span>}
                  </span>
                  <span className="thread-row__people">{thread.participants}</span>
                  <span className="thread-row__source">
                    {open || !thread.requirement ? thread.source : describeRequirement(thread.requirement, state)}
                  </span>
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function MessagesPage() {
  const path = usePath();
  const id = path.split('/')[2] ?? null;
  const thread = id ? THREADS_BY_ID[id] : null;
  const { state } = useGame();
  const visible = thread && isThreadListed(thread, state);

  return (
    <div className={`inbox${id ? ' inbox--reading' : ''}`}>
      <header className="archive__header">
        <p className="kicker">File 04 · Recovered correspondence</p>
        <h1 className="page-title">Messages &amp; Emails</h1>
      </header>

      <div className="inbox__body">
        <ThreadList activeId={id} />
        <section className="inbox__viewer" aria-label="Conversation">
          {id && thread && visible && <ThreadView key={thread.id} thread={thread} />}
          {id && (!thread || !visible) && (
            <div className="archive__empty">
              <p>There’s no conversation here.</p>
              <a className="button" href={href('/messages')}>
                Back to messages
              </a>
            </div>
          )}
          {!id && (
            <div className="archive__empty">
              <p>Choose a conversation to read it.</p>
              <p className="archive__empty-hint">
                Every thread says where it was copied from. Someone chose what to copy.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
