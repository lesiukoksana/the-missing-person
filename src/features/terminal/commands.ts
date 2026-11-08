import { ARCHIVE_BY_ID } from '../../data/archive';
import { EVIDENCE_BY_ID, type EvidenceId } from '../../data/evidence';
import { THREADS } from '../../data/messages';
import { RECOVERY_BY_ID } from '../../data/recovery';
import { BLOG_POSTS, BLOG_POSTS_BY_SLUG } from '../../data/website/blog';
import { GUESTBOOK } from '../../data/website/guestbook';
import type { GameAction } from '../../store/gameState';
import { describeRequirement, getCaseStatus, getProgressPercent } from '../../store/selectors';
import type { GameState } from '../../types/game';
import { isDocumentOpen } from '../policeArchive/access';
import { isThreadOpen } from '../messages/access';
import { checkBlogPassword } from '../puzzles/blogPassword';
import { PUZZLES, PUZZLES_BY_ID } from '../puzzles/definitions';
import { canRestore, displayStatus, fileContent, isFileReadable, restoredFlag } from '../recovery/fileAccess';
import { buildFileSystem, findAnywhere, promptPath, resolve, type DirNode, type FileNode } from './fileSystem';
import { documentText } from './text';

export type Tone = 'muted' | 'error' | 'accent' | 'alarm' | 'eleanor' | 'input';

export interface Line {
  text: string;
  tone?: Tone;
}

export interface CommandResult {
  lines: Line[];
  actions?: GameAction[];
  cwd?: string[];
  clear?: boolean;
  navigate?: string;
  /** Waits before navigating, so the last lines can be read. */
  navigateDelay?: number;
  /** Switches the input to a masked prompt for the next entry. */
  prompt?: 'checkin';
}

export interface CommandContext {
  state: GameState;
  cwd: string[];
  history: string[];
}

const now = () => new Date().toISOString();

function discover(state: GameState, id: EvidenceId): GameAction[] {
  if (state.discoveredEvidence.includes(id)) return [];
  return [{ type: 'collect', collection: 'discoveredEvidence', id, label: EVIDENCE_BY_ID[id].title, at: now() }];
}

function flag(state: GameState, id: string): GameAction[] {
  return state.flags.includes(id) ? [] : [{ type: 'collect', collection: 'flags', id, at: now() }];
}

const out = (text: string, tone?: Tone): Line => ({ text, tone });
const lines = (text: string, tone?: Tone) => text.split('\n').map((line) => out(line, tone));

const HELP: [string, string][] = [
  ['help', 'show this list'],
  ['ls [folder]', 'list files'],
  ['cd <folder>', 'change folder (cd .. goes up)'],
  ['pwd', 'show the current folder'],
  ['read <file>', 'print a file (also: cat)'],
  ['open <file>', 'open a file in its own viewer'],
  ['search <term>', 'search every record you can read'],
  ['decode <text>', 'decode base64, hex or binary'],
  ['restore <file>', 'restore a deleted file'],
  ['unlock <code>', 'try a combination on reed_box.enc'],
  ['status', 'case progress'],
  ['whoami', 'who this terminal thinks you are'],
  ['date', 'the date'],
  ['history', 'commands typed this session'],
  ['clear', 'clear the screen'],
];

const README = `CASE #0917 — working copy

Everything in this folder is a copy. Nothing you do here changes the originals,
and nothing here can reach anything outside this file.

archive/       police records
site/          eleanorvale.example, restored copy
recovery/      what came back from her laptop and the Courier's mail server
reed_box.enc   sealed. four digits.

Start with: help`;

const ALDOUS = `ALDOUS, Peter John
1955 – 2013

Former overlooker, Harrow Mill, 1984 – 2003.
Died 15 November 2013, in the boiler house.
Survived by a sister.`;

/* ---------------------------------------------------------------- reading */

function readFile(node: FileNode, state: GameState): CommandResult {
  const ref = node.ref;

  if (ref.kind === 'readme') return { lines: lines(README) };

  if (ref.kind === 'box') {
    return {
      lines: [
        out('reed_box.enc: encrypted container, 4 files + site_restore/ (stored alongside)', 'muted'),
        out('Locked with a four-digit combination. Try: unlock <code>'),
      ],
    };
  }

  if (ref.kind === 'document') {
    const doc = ARCHIVE_BY_ID[ref.id];
    if (!isDocumentOpen(doc, state)) {
      return {
        lines: [out(`${node.name}: locked.`, 'error'), out(doc.requirement ? describeRequirement(doc.requirement, state) : '', 'muted')],
      };
    }
    const actions: GameAction[] = state.readDocuments.includes(doc.id)
      ? []
      : [{ type: 'collect', collection: 'readDocuments', id: doc.id, label: `Read: ${doc.title}`, at: now() }];
    doc.evidence.forEach((id) => actions.push(...discover(state, id)));
    return { lines: documentText(doc).map((text) => out(text)), actions };
  }

  if (ref.kind === 'post') {
    const post = BLOG_POSTS_BY_SLUG[ref.slug];
    const actions = post.evidence ? discover(state, post.evidence) : [];
    actions.push(...flag(state, `read-post:${post.slug}`));
    return {
      lines: [
        out(`${post.title}  ·  ${post.date}${post.time ? ` ${post.time}` : ''}`, 'accent'),
        out(''),
        ...post.paragraphs.flatMap((paragraph) => [out(paragraph, 'eleanor'), out('')]),
      ],
      actions,
    };
  }

  const file = RECOVERY_BY_ID[ref.id];
  if (!isFileReadable(file, state)) {
    const status = displayStatus(file, state);
    const result: Line[] = [out(`${node.name}: ${status.toLowerCase()}. ${file.statusNote}.`, 'error')];
    if (file.rebuiltElsewhere) result.push(out(`${file.rebuiltElsewhere.label}: open ${file.id}`, 'muted'));
    else if (canRestore(file, state)) result.push(out(`Try: restore ${node.name}`, 'muted'));
    else if (file.requirement && !file.sealed) result.push(out(describeRequirement(file.requirement, state), 'muted'));
    return { lines: result };
  }

  const actions = file.evidence ? discover(state, file.evidence) : [];
  if (file.readFlag) actions.push(...flag(state, file.readFlag));
  const tone: Tone | undefined = file.format === 'eleanor' ? 'eleanor' : undefined;
  return { lines: lines(fileContent(file, state), tone), actions };
}

/* ---------------------------------------------------------------- search */

function searchCorpus(state: GameState) {
  const corpus: { where: string; text: string }[] = [];

  Object.values(ARCHIVE_BY_ID).forEach((doc) => {
    if (!isDocumentOpen(doc, state)) return;
    documentText(doc).forEach((text) => corpus.push({ where: `archive/${doc.id}.txt`, text }));
  });
  BLOG_POSTS.forEach((post) =>
    [post.title, ...post.paragraphs].forEach((text) => corpus.push({ where: `site/blog/${post.slug}.txt`, text })),
  );
  GUESTBOOK.forEach((entry) => {
    if (entry.revealAfter && !state.solvedPuzzles.includes(entry.revealAfter)) return;
    if (entry.revealFlag && !state.flags.includes(entry.revealFlag)) return;
    corpus.push({ where: `site/guestbook (${entry.name})`, text: entry.message });
  });
  THREADS.forEach((thread) => {
    if (thread.kind === 'reconstruction' || !isThreadOpen(thread, state)) return;
    thread.messages.forEach((message) =>
      message.body.split('\n').forEach((text) => corpus.push({ where: `messages/${thread.id}`, text })),
    );
  });
  Object.values(RECOVERY_BY_ID).forEach((file) => {
    if (!isFileReadable(file, state)) return;
    fileContent(file, state)
      .split('\n')
      .forEach((text) => corpus.push({ where: file.path, text }));
  });
  return corpus;
}

function search(term: string, state: GameState): CommandResult {
  const query = term.trim().toLowerCase();
  if (query.length < 3) return { lines: [out('search: use at least 3 characters.', 'error')] };

  const matches = searchCorpus(state).filter((entry) => entry.text.toLowerCase().includes(query));
  if (matches.length === 0) return { lines: [out(`No matches for “${term.trim()}” in anything you can read.`, 'muted')] };

  const shown = matches.slice(0, 14);
  const result = shown.map((match) => {
    const index = match.text.toLowerCase().indexOf(query);
    const start = Math.max(0, index - 40);
    const excerpt = `${start > 0 ? '…' : ''}${match.text.slice(start, index + query.length + 50).trim()}`;
    return out(`${match.where}: ${excerpt}`);
  });
  result.unshift(out(`${matches.length} match${matches.length === 1 ? '' : 'es'}`, 'accent'));
  if (matches.length > shown.length) result.push(out(`…and ${matches.length - shown.length} more. Try a narrower term.`, 'muted'));
  return { lines: result };
}

/* ---------------------------------------------------------------- decode */

function printable(text: string) {
  return text.length > 0 && /^[\x20-\x7E\n\t’‘]+$/.test(text);
}

export function decodeText(input: string): { method: string; text: string } | null {
  const compact = input.replace(/\s+/g, '');

  if (/^[01]+$/.test(compact) && compact.length % 8 === 0) {
    const text = compact.match(/.{8}/g)!.map((byte) => String.fromCharCode(parseInt(byte, 2))).join('');
    if (printable(text)) return { method: 'binary', text };
  }
  if (/^[0-9a-fA-F]+$/.test(compact) && compact.length % 2 === 0) {
    const text = compact.match(/.{2}/g)!.map((byte) => String.fromCharCode(parseInt(byte, 16))).join('');
    if (printable(text)) return { method: 'hex', text };
  }
  if (/^[A-Za-z0-9+/]+={0,2}$/.test(compact) && compact.length % 4 === 0) {
    try {
      const text = atob(compact);
      if (printable(text)) return { method: 'base64', text };
    } catch {
      // Not base64 after all.
    }
  }
  return null;
}

/* ---------------------------------------------------------------- unlock */

function unlock(code: string, state: GameState): CommandResult {
  if (state.solvedPuzzles.includes('terminalCode')) {
    return { lines: [out('reed_box is already open. Try: ls reed_box', 'muted')] };
  }
  const digits = code.trim();
  if (!/^\d{4}$/.test(digits)) return { lines: [out('unlock: the lock takes four digits. Usage: unlock 0000', 'error')] };

  if (digits === '0245') {
    return {
      lines: [
        out('The combination turns.', 'accent'),
        out(''),
        out('reed_box/'),
        out('  letter.pdf'),
        out('  marsh_tally.jpg'),
        out('  annex_b_original.tif'),
        out('  photo_sb_supplied.jpg'),
        out('site_restore/   (stored alongside by the sender)'),
        out('  checkin.php'),
        out('  checkin.log'),
        out('  owls.zip'),
        out(''),
        out('recovery/owlcam/TE_0228-TE_0240.JPG can now be restored from the original card.', 'muted'),
      ],
      actions: [
        { type: 'solvePuzzle', puzzle: 'terminalCode', label: `Puzzle solved: ${PUZZLES_BY_ID.terminalCode.title}`, at: now() },
      ],
    };
  }
  if (digits === '0252') return { lines: [out('Nothing. So close to what the camera thought.', 'error')] };
  if (digits === '0314') return { lines: [out('Nothing. That’s the minute he did.', 'error')] };
  if (digits === '0352') return { lines: [out('Nothing. That’s the minute he said he arrived.', 'error')] };
  return { lines: [out('The lock doesn’t move.', 'error')] };
}

/* ---------------------------------------------------------------- hidden */

function ping(target: string): CommandResult {
  const host = target.trim() || 'eleanorvale.example';
  const replies = new Date().getDate() === 17 && host.toLowerCase().includes('eleanorvale');
  const result: Line[] = [out(`PING ${host}: 56 data bytes`)];
  for (let seq = 0; seq < 4; seq += 1) {
    result.push(
      replies && seq === 0
        ? out(`64 bytes from ${host}: icmp_seq=0 time=0.917 ms`, 'accent')
        : out('Request timed out.', 'muted'),
    );
  }
  result.push(out(`--- 4 packets sent, ${replies ? 1 : 0} received ---`, 'muted'));
  return { lines: result };
}

function whoami(state: GameState) {
  if (state.flags.includes('still-online')) return 'unknown user';
  if (state.checkIns.length > 0) return 'someone who typed the word';
  return 'reader_0918';
}

function status(state: GameState): CommandResult {
  const caseStatus = getCaseStatus(state);
  const result: Line[] = [
    out(`CASE #0917 · ${caseStatus.label.toUpperCase()}`, caseStatus.severity === 'alarm' ? 'alarm' : 'accent'),
    out(caseStatus.detail, 'muted'),
    out(''),
    out(`progress         ${getProgressPercent(state)}%`),
    out(`evidence         ${state.discoveredEvidence.length}`),
    out(`documents read   ${state.readDocuments.length} / ${Object.keys(ARCHIVE_BY_ID).length}`),
    out(''),
    ...PUZZLES.map((puzzle) => out(`[${state.solvedPuzzles.includes(puzzle.id) ? 'x' : ' '}] ${puzzle.title}`)),
  ];
  if (state.checkIns.length > 0) result.push(out(''), out(`check-ins recorded: ${state.checkIns.length}`, 'muted'));
  return { lines: result };
}

/** The STILL ONLINE route: every condition from canon section 10, ending with a deliberate check-in. */
export function checkinWord(word: string, state: GameState): CommandResult {
  const result = checkBlogPassword(word);
  if (!result.correct) return { lines: [out('no.', 'error')] };

  const at = now();
  const actions: GameAction[] = [{ type: 'checkIn', at }];
  if (!state.solvedPuzzles.includes('blogPassword')) {
    actions.push({ type: 'solvePuzzle', puzzle: 'blogPassword', label: `Puzzle solved: ${PUZZLES_BY_ID.blogPassword.title}`, at });
  }

  const knowingly = state.flags.includes('read-checkin-php');
  const secretRoute =
    knowingly &&
    state.solvedPuzzles.includes('terminalCode') &&
    state.flags.includes('read-checkin-log') &&
    state.flags.includes('found-te-0917') &&
    state.flags.includes('read-still');

  if (!knowingly) {
    return { lines: [out('ok.', 'accent'), out('session recorded.', 'muted')], actions };
  }
  if (!secretRoute) {
    return {
      lines: [out('ok.', 'accent'), out('You read what this does. You typed it anyway.', 'muted')],
      actions: [...actions, ...flag(state, 'checked-in-knowingly')],
    };
  }
  return {
    lines: [
      out('ok.', 'accent'),
      out(''),
      out('…'),
      out(''),
      out('ok.', 'alarm'),
      out(''),
      out('next check-in due: the 17th', 'muted'),
    ],
    actions: [
      ...actions,
      ...flag(state, 'checked-in-knowingly'),
      ...flag(state, 'still-online'),
      { type: 'reachEnding', ending: 'stillOnline', at },
    ],
    navigate: '/ending',
    navigateDelay: 3500,
  };
}

/* ---------------------------------------------------------------- dispatcher */

function listDir(node: DirNode): Line[] {
  if (node.children.length === 0) return [out('(empty)', 'muted')];
  return [...node.children]
    .sort((a, b) => Number(b.kind === 'dir') - Number(a.kind === 'dir') || a.name.localeCompare(b.name))
    .map((child) =>
      child.kind === 'dir'
        ? out(`${child.name}/`, 'accent')
        : out(`${child.name}${child.tag ? `   [${child.tag}]` : ''}`, child.tag ? 'muted' : undefined),
    );
}

function openTarget(node: FileNode): string | null {
  const ref = node.ref;
  if (ref.kind === 'document') return `/archive/${ref.id}`;
  if (ref.kind === 'post') return `/website/blog/${ref.slug}`;
  if (ref.kind === 'recovered') {
    const file = RECOVERY_BY_ID[ref.id];
    return file.rebuiltElsewhere ? file.rebuiltElsewhere.to : `/recovery/${ref.id}`;
  }
  return null;
}

function findFile(root: DirNode, cwd: string[], name: string): FileNode | null {
  const resolved = resolve(root, cwd, name);
  if (resolved?.node.kind === 'file') return resolved.node;
  if (!name.includes('/')) return findAnywhere(root, name);
  return null;
}

export function runCommand(input: string, context: CommandContext): CommandResult {
  const { state, cwd, history } = context;
  const trimmed = input.trim();
  if (!trimmed) return { lines: [] };

  const [rawName] = trimmed.split(/\s+/);
  const name = rawName.toLowerCase();
  const arg = trimmed.slice(rawName.length).trim();
  const root = buildFileSystem(state);

  switch (name) {
    case 'help':
      return {
        lines: [
          out('Commands', 'accent'),
          ...HELP.map(([command, description]) => out(`  ${command.padEnd(16)} ${description}`)),
          out(''),
          out('Up and down arrows go through earlier commands. Tab completes file names.', 'muted'),
        ],
      };

    case 'ls':
    case 'dir': {
      const target = arg ? resolve(root, cwd, arg) : resolve(root, cwd, '.');
      if (!target) return { lines: [out(`ls: ${arg}: no such file or folder`, 'error')] };
      if (target.node.kind === 'file') return { lines: [out(target.node.name)] };
      return { lines: listDir(target.node) };
    }

    case 'cd': {
      if (!arg || arg === '~') return { lines: [], cwd: [] };
      const target = resolve(root, cwd, arg);
      if (!target) return { lines: [out(`cd: ${arg}: no such folder`, 'error')] };
      if (target.node.kind !== 'dir') return { lines: [out(`cd: ${arg}: not a folder. Try: read ${arg}`, 'error')] };
      return { lines: [], cwd: target.path };
    }

    case 'pwd':
      return { lines: [out(promptPath(cwd))] };

    case 'whoami':
      return { lines: [out(whoami(state))] };

    case 'status':
      return status(state);

    case 'date': {
      const today = new Date();
      const days = Math.floor((today.getTime() - new Date(2014, 9, 17).getTime()) / 86_400_000);
      return {
        lines: [
          out(today.toLocaleString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })),
          out(`${days} days since Friday 17 October 2014.`, 'muted'),
        ],
      };
    }

    case 'read':
    case 'cat': {
      if (!arg) return { lines: [out(`${name}: which file? Usage: ${name} <file>`, 'error')] };
      if (arg.toLowerCase() === 'aldous') return { lines: lines(ALDOUS, 'accent') };
      const resolved = resolve(root, cwd, arg);
      if (resolved?.node.kind === 'dir') return { lines: [out(`${name}: ${arg} is a folder. Try: ls ${arg}`, 'error')] };
      const node = findFile(root, cwd, arg);
      if (!node) return { lines: [out(`${name}: ${arg}: no such file. Try: ls`, 'error')] };
      return readFile(node, state);
    }

    case 'open': {
      if (!arg) return { lines: [out('open: which file? Usage: open <file>', 'error')] };
      const recovered = RECOVERY_BY_ID[arg];
      const node = recovered ? findAnywhere(root, recovered.path.split('/').pop()!) : findFile(root, cwd, arg);
      if (!node) {
        if (recovered?.rebuiltElsewhere) return { lines: [out(`Opening ${recovered.path}…`, 'muted')], navigate: recovered.rebuiltElsewhere.to };
        return { lines: [out(`open: ${arg}: no such file`, 'error')] };
      }
      const target = openTarget(node);
      if (!target) return { lines: [out(`open: ${node.name} has no viewer. Try: read ${node.name}`, 'error')] };
      return { lines: [out(`Opening ${node.name}…`, 'muted')], navigate: target };
    }

    case 'search':
      return search(arg, state);

    case 'decode': {
      if (!arg) return { lines: [out('decode: what should I decode? Usage: decode <text>', 'error')] };
      const decoded = decodeText(arg);
      if (!decoded) return { lines: [out('decode: not valid base64, hex or binary.', 'error')] };
      return { lines: [out(`${decoded.method}:`, 'muted'), ...lines(decoded.text, 'accent')] };
    }

    case 'restore': {
      if (!arg) return { lines: [out('restore: which file? Usage: restore <file>', 'error')] };
      const node = findFile(root, cwd, arg);
      if (!node || node.ref.kind !== 'recovered') return { lines: [out(`restore: ${arg}: nothing to restore`, 'error')] };
      const file = RECOVERY_BY_ID[node.ref.id];
      if (isFileReadable(file, state)) return { lines: [out(`${node.name} is already readable.`, 'muted')] };
      if (!canRestore(file, state)) {
        const why = file.requirement && !file.sealed ? describeRequirement(file.requirement, state) : file.statusNote;
        return { lines: [out(`restore: ${node.name} can’t be restored. ${why}`, 'error')] };
      }
      return {
        lines: [out(`Restoring ${node.name}… done.`, 'accent'), out(`Try: read ${node.name}`, 'muted')],
        actions: [{ type: 'collect', collection: 'unlocked', id: restoredFlag(file), at: now() }],
      };
    }

    case 'unlock':
      return unlock(arg, state);

    case 'history':
      return {
        lines: history.length ? history.map((command, index) => out(`${String(index + 1).padStart(4)}  ${command}`)) : [out('(no commands yet)', 'muted')],
      };

    case 'clear':
      return { lines: [], clear: true };

    case 'ping':
      return ping(arg);

    case 'checkin':
      return { lines: [out('word:', 'muted')], prompt: 'checkin' };

    case 'exit':
    case 'logout':
      return { lines: [out('Closing the terminal.', 'muted')], navigate: '/hub' };

    case 'sudo':
      return { lines: [out('There is nobody here with more authority than you.', 'muted')] };

    case 'rm':
      return { lines: [out('rm: this is a copy. Deleting things is how this started.', 'error')] };

    default:
      return { lines: [out(`${rawName}: command not found. Type help for a list.`, 'error')] };
  }
}
