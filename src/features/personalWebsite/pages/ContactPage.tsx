import { useState, type FormEvent } from 'react';
import { useDiscovery } from '../../../hooks/useDiscovery';

const PAGE_SOURCE = `<!-- contact.html  made by hand, sorry -->
<h1>get in touch</h1>
<p>eleanor [at] eleanorvale [dot] example</p>

<form action="/cgi-bin/formmail.pl" method="post">
  <input type="hidden" name="recipient" value="eleanor@eleanorvale.example">
  <input type="hidden" name="bcc" value="s.bennett@ashfordcourier.example">
  <!-- bcc added 12/10/14 -->
  <!-- if it's urgent, don't -->
  <input type="text" name="subject">
  <textarea name="message"></textarea>
  <input type="submit" value="send">
</form>`;

export function ContactPage() {
  const { discover } = useDiscovery();
  const [showSource, setShowSource] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [bounced, setBounced] = useState(false);

  function send(event: FormEvent) {
    event.preventDefault();
    if (!message.trim()) {
      setError('Please write a message first.');
      return;
    }
    setError('');
    setBounced(true);
  }

  function viewSource() {
    setShowSource(true);
    discover('contact-source');
  }

  return (
    <section>
      <h1>get in touch</h1>
      <p className="eleanor-text">Prints, questions, corrections.  Especially corrections.</p>
      <p>
        <code>eleanor [at] eleanorvale [dot] example</code>
      </p>

      {bounced ? (
        <div className="oldweb-bounce" role="status">
          <p>
            <strong>Mail delivery failed: returning message to sender.</strong>
          </p>
          <p>
            This message could not be delivered to one or more recipients.
            <br />
            <code>eleanor@eleanorvale.example</code>: mailbox unavailable
          </p>
          <button type="button" className="old-button" onClick={() => setBounced(false)}>
            OK
          </button>
        </div>
      ) : (
        <form className="oldweb-form" onSubmit={send}>
          <label htmlFor="contact-subject">subject</label>
          <input
            id="contact-subject"
            type="text"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
          />
          <label htmlFor="contact-message">message</label>
          <textarea
            id="contact-message"
            rows={5}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
          {error && (
            <p className="old-feedback" role="alert">
              {error}
            </p>
          )}
          <div>
            <button type="submit" className="old-button">
              send
            </button>
          </div>
        </form>
      )}

      <p className="oldweb-source-toggle">
        <button
          type="button"
          className="oldweb-linkbutton"
          aria-expanded={showSource}
          onClick={() => (showSource ? setShowSource(false) : viewSource())}
        >
          {showSource ? 'hide page source' : 'view page source'}
        </button>
      </p>
      {showSource && (
        <pre className="oldweb-source" tabIndex={0}>
          <code>{PAGE_SOURCE}</code>
        </pre>
      )}
    </section>
  );
}
