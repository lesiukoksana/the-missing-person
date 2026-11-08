import { useSyncExternalStore } from 'react';

function subscribe(onChange: () => void) {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
}

function getPath() {
  return window.location.hash.slice(1) || '/';
}

export function usePath() {
  return useSyncExternalStore(subscribe, getPath);
}

export function navigate(path: string) {
  window.location.hash = path;
}

/** Changes route without adding a history entry, so Back doesn't land on a redirect. */
export function redirect(path: string) {
  window.location.replace(`#${path}`);
}

/** True for a section's own path and anything below it. */
export function isWithin(path: string, sectionPath: string) {
  return path === sectionPath || path.startsWith(`${sectionPath}/`);
}

export function href(path: string) {
  return `#${path}`;
}
