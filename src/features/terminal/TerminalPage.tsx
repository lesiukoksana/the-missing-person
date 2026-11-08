import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { navigate } from '../../app/router';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useGame } from '../../store/GameContext';
import { checkinWord, runCommand, type Line } from './commands';
import { buildFileSystem, promptPath, resolve } from './fileSystem';

const MAX_LINES = 500;

const BANNER: Line[] = [
  { text: 'ASHFORD CASE TERMINAL 0.9 (simulated)', tone: 'accent' },
  { text: 'Connected to case_0917, a read-only working copy. This terminal cannot reach your computer.', tone: 'muted' },
  { text: "Type 'help' for commands.", tone: 'muted' },
  { text: '' },
];

export function TerminalPage() {
  const { state, dispatch } = useGame();
  useDocumentTitle('Terminal');

  const [output, setOutput] = useState<Line[]>(BANNER);
  const [input, setInput] = useState('');
  const [cwd, setCwd] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);
  const [mode, setMode] = useState<'command' | 'checkin'>('command');
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const leaveTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(leaveTimer.current), []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'nearest' });
  }, [output]);

  const prompt = `reader_0918@case0917:${promptPath(cwd)}$`;

  function append(next: Line[]) {
    setOutput((current) => [...current, ...next].slice(-MAX_LINES));
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const entry = input;
    setInput('');
    setCursor(null);

    if (mode === 'checkin') {
      setMode('command');
      const result = checkinWord(entry, state);
      append([{ text: 'word: ' + '•'.repeat(entry.length), tone: 'input' }, ...result.lines]);
      result.actions?.forEach(dispatch);
      if (result.navigate) {
        const target = result.navigate;
        leaveTimer.current = window.setTimeout(() => navigate(target), result.navigateDelay ?? 0);
      }
      return;
    }

    const trimmed = entry.trim();
    const nextHistory = trimmed ? [...history, trimmed] : history;
    if (trimmed) setHistory(nextHistory);

    const result = runCommand(entry, { state, cwd, history: nextHistory });
    if (result.clear) {
      setOutput([]);
    } else {
      append([{ text: `${prompt} ${entry}`, tone: 'input' }, ...result.lines]);
    }
    result.actions?.forEach(dispatch);
    if (result.cwd) setCwd(result.cwd);
    if (result.prompt) setMode(result.prompt);
    if (result.navigate) navigate(result.navigate);
  }

  function complete() {
    const parts = input.split(/\s+/);
    if (parts.length < 2) return;
    const partial = parts[parts.length - 1];
    const slash = partial.lastIndexOf('/');
    const folder = slash >= 0 ? partial.slice(0, slash + 1) : '';
    const stem = partial.slice(slash + 1).toLowerCase();
    const target = resolve(buildFileSystem(state), cwd, folder || '.');
    if (!target || target.node.kind !== 'dir') return;

    const matches = target.node.children.filter((child) => child.name.toLowerCase().startsWith(stem));
    if (matches.length === 1) {
      const match = matches[0];
      parts[parts.length - 1] = `${folder}${match.name}${match.kind === 'dir' ? '/' : ''}`;
      setInput(parts.join(' '));
    } else if (matches.length > 1) {
      append([
        { text: `${prompt} ${input}`, tone: 'input' },
        { text: matches.map((match) => match.name).join('   '), tone: 'muted' },
      ]);
    }
  }

  function handleKey(event: KeyboardEvent<HTMLInputElement>) {
    if (mode === 'checkin') return;
    if (event.key === 'ArrowUp' && history.length) {
      event.preventDefault();
      const next = cursor === null ? history.length - 1 : Math.max(0, cursor - 1);
      setCursor(next);
      setInput(history[next]);
    } else if (event.key === 'ArrowDown' && cursor !== null) {
      event.preventDefault();
      const next = cursor + 1;
      if (next >= history.length) {
        setCursor(null);
        setInput('');
      } else {
        setCursor(next);
        setInput(history[next]);
      }
    } else if (event.key === 'Tab' && input.includes(' ')) {
      event.preventDefault();
      complete();
    } else if (event.key === 'l' && event.ctrlKey) {
      event.preventDefault();
      setOutput([]);
    }
  }

  return (
    <div className="terminal-page">
      <header className="archive__header">
        <p className="kicker">File 07 · Simulated terminal. It runs no real commands</p>
        <h1 className="page-title">Terminal</h1>
      </header>

      {/* Clicking anywhere in the window puts the cursor back in the prompt. */}
      <div className="terminal scanlines" onClick={() => inputRef.current?.focus()}>
        <div className="terminal__output" role="log" aria-live="polite" aria-label="Terminal output">
          {output.map((line, index) => (
            <p key={index} className={`terminal__line${line.tone ? ` terminal__line--${line.tone}` : ''}`}>
              {line.text || ' '}
            </p>
          ))}
          <div ref={endRef} />
        </div>

        <form className="terminal__form" onSubmit={submit}>
          <label htmlFor="terminal-input" className="terminal__prompt">
            {mode === 'checkin' ? 'word:' : prompt}
          </label>
          <input
            id="terminal-input"
            ref={inputRef}
            className="terminal__input"
            type={mode === 'checkin' ? 'password' : 'text'}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKey}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            aria-describedby="terminal-help"
          />
        </form>
      </div>
      <p id="terminal-help" className="terminal__help">
        Type a command and press Enter. Arrow keys recall earlier commands and Tab completes names.
      </p>
    </div>
  );
}
