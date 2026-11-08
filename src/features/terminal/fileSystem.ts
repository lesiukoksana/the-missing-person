import { ARCHIVE } from '../../data/archive';
import { BLOG_POSTS } from '../../data/website/blog';
import { RECOVERY_FILES, type RecoveredFile } from '../../data/recovery';
import { isRequirementMet } from '../../store/selectors';
import type { GameState } from '../../types/game';
import { isDocumentOpen } from '../policeArchive/access';
import { displayStatus, isFileReadable } from '../recovery/fileAccess';

/**
 * The simulated case folder. Built fresh from game state for every command,
 * so locks and unlocks always match the rest of the game. Nothing here touches the real filesystem.
 */

export type FileRef =
  | { kind: 'readme' }
  | { kind: 'document'; id: string }
  | { kind: 'post'; slug: string }
  | { kind: 'recovered'; id: string }
  | { kind: 'box' };

export interface FileNode {
  kind: 'file';
  name: string;
  ref: FileRef;
  tag?: string;
}

export interface DirNode {
  kind: 'dir';
  name: string;
  children: FsNode[];
}

export type FsNode = FileNode | DirNode;

export const HOME_LABEL = '~/case_0917';

function dir(name: string, children: FsNode[]): DirNode {
  return { kind: 'dir', name, children };
}

function recoveredTag(file: RecoveredFile, state: GameState) {
  const status = displayStatus(file, state);
  return isFileReadable(file, state) ? undefined : status.toLowerCase();
}

/** Puts a recovered file at its path, creating folders on the way. */
function place(root: DirNode, file: RecoveredFile, state: GameState) {
  const parts = file.path.split('/');
  const name = parts.pop()!;
  let current = root;
  for (const part of parts) {
    let next = current.children.find((child): child is DirNode => child.kind === 'dir' && child.name === part);
    if (!next) {
      next = dir(part, []);
      current.children.push(next);
    }
    current = next;
  }
  current.children.push({ kind: 'file', name, ref: { kind: 'recovered', id: file.id }, tag: recoveredTag(file, state) });
}

export function buildFileSystem(state: GameState): DirNode {
  const boxOpen = state.solvedPuzzles.includes('terminalCode');

  const root = dir('case_0917', [
    { kind: 'file', name: 'README.txt', ref: { kind: 'readme' } },
    dir(
      'archive',
      ARCHIVE.map((doc) => ({
        kind: 'file' as const,
        name: `${doc.id}.txt`,
        ref: { kind: 'document' as const, id: doc.id },
        tag: isDocumentOpen(doc, state) ? undefined : 'locked',
      })),
    ),
    dir('site', [
      dir(
        'blog',
        BLOG_POSTS.map((post) => ({ kind: 'file' as const, name: `${post.slug}.txt`, ref: { kind: 'post' as const, slug: post.slug } })),
      ),
    ]),
  ]);

  const recoveryOpen = isRequirementMet({ kind: 'puzzle', puzzle: 'blogPassword' }, state);
  RECOVERY_FILES.forEach((file) => {
    const inBox = file.path.startsWith('reed_box/') || file.path.startsWith('site_restore/');
    if (inBox && !boxOpen) return;
    if (!inBox && !recoveryOpen) return;
    place(root, file, state);
  });

  if (!boxOpen) root.children.push({ kind: 'file', name: 'reed_box.enc', ref: { kind: 'box' }, tag: 'encrypted' });

  return root;
}

/** Resolves a path typed by the player against the current folder. Returns the node and its absolute segments. */
export function resolve(root: DirNode, cwd: string[], input: string): { node: FsNode; path: string[] } | null {
  const trimmed = input.trim();
  let segments = trimmed.startsWith('/') || trimmed.startsWith('~') ? [] : [...cwd];
  const parts = trimmed.replace(/^~\/?/, '').replace(/^\//, '').split('/').filter(Boolean);

  for (const part of parts) {
    if (part === '.') continue;
    if (part === '..') {
      segments = segments.slice(0, -1);
      continue;
    }
    segments.push(part);
  }

  let node: FsNode = root;
  for (const segment of segments) {
    if (node.kind !== 'dir') return null;
    const lower = segment.toLowerCase();
    const next: FsNode | undefined =
      node.children.find((child) => child.name.toLowerCase() === lower) ??
      // Lets people type a file without its extension.
      node.children.find((child) => child.kind === 'file' && child.name.toLowerCase().replace(/\.[^.]+$/, '') === lower);
    if (!next) return null;
    node = next;
  }
  return { node, path: segments.map((segment, index) => (index === segments.length - 1 ? node.name : segment)) };
}

/** Finds a file anywhere in the tree by name, for `read AD-14-0917-01` from any folder. */
export function findAnywhere(root: DirNode, name: string): FileNode | null {
  const lower = name.toLowerCase();
  const stack: FsNode[] = [...root.children];
  while (stack.length) {
    const node = stack.shift()!;
    if (node.kind === 'dir') stack.push(...node.children);
    else if (node.name.toLowerCase() === lower || node.name.toLowerCase().replace(/\.[^.]+$/, '') === lower) return node;
  }
  return null;
}

export function promptPath(cwd: string[]) {
  return cwd.length ? `${HOME_LABEL}/${cwd.join('/')}` : HOME_LABEL;
}
