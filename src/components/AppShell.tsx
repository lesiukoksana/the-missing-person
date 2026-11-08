import { Menu } from 'lucide-react';
import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react';
import { href, isWithin } from '../app/router';
import { CASE_FILE } from '../data/caseFile';
import { Modal } from './Modal';
import { SectionNav } from './SectionNav';
import { SettingsButton } from './SettingsButton';
import { SoundToggle } from './SoundToggle';

export function AppShell({ path, children }: { path: string; children: ReactNode }) {
  const mainRef = useRef<HTMLElement>(null);
  const previousPath = useRef(path);
  const [navOpen, setNavOpen] = useState(false);

  // Moves focus and scroll to the new page after in-app navigation. Skipped on first load,
  // so the first Tab still reaches the skip link.
  useEffect(() => {
    if (previousPath.current === path) return;
    previousPath.current = path;
    mainRef.current?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }, [path]);

  // A plain #main link would be read as a route by the hash router.
  function skipToContent(event: MouseEvent) {
    event.preventDefault();
    mainRef.current?.focus();
  }

  const caseMark = (
    <a className="case-mark" href={href('/hub')} onClick={() => setNavOpen(false)}>
      <span className="case-mark__number">Case {CASE_FILE.number}</span>
      <span className="case-mark__title">The Missing Person</span>
    </a>
  );

  return (
    <div className="shell">
      <a className="skip-link" href="#main" onClick={skipToContent}>
        Skip to content
      </a>

      <header className="shell__topbar">
        {caseMark}
        <button
          type="button"
          className="icon-button"
          aria-label="Open case index"
          onClick={() => setNavOpen(true)}
        >
          <Menu aria-hidden="true" size={22} />
        </button>
      </header>

      <aside className="shell__rail">
        {caseMark}
        <SectionNav path={path} />
        <div className="shell__controls">
          <SoundToggle />
          <SettingsButton />
        </div>
      </aside>

      <Modal
        open={navOpen}
        onClose={() => setNavOpen(false)}
        title="Case index"
        className="modal--drawer"
      >
        <SectionNav path={path} onNavigate={() => setNavOpen(false)} />
        <div className="shell__controls">
          <SoundToggle />
          <SettingsButton />
        </div>
      </Modal>

      <main
        id="main"
        className={`shell__main${isWithin(path, '/website') ? ' shell__main--site' : ''}`}
        ref={mainRef}
        tabIndex={-1}
      >
        <div key={path} className="page-transition">
          {children}
        </div>
      </main>
    </div>
  );
}
