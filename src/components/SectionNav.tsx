import { FolderOpen, Lock } from 'lucide-react';
import { href, isWithin } from '../app/router';
import { SECTIONS } from '../data/sections';
import { useGame } from '../store/GameContext';
import { isSectionOpen } from '../store/selectors';

export function SectionNav({ path, onNavigate }: { path: string; onNavigate?: () => void }) {
  const { state } = useGame();

  return (
    <nav aria-label="Case index">
      <ul className="section-nav">
        <li>
          <a
            className="section-nav__link"
            href={href('/hub')}
            aria-current={path === '/hub' ? 'page' : undefined}
            onClick={onNavigate}
          >
            <span className="section-nav__index">00</span>
            <span className="section-nav__title">Case Overview</span>
            <FolderOpen aria-hidden="true" size={15} />
          </a>
        </li>
        {SECTIONS.map((section) => {
          const open = isSectionOpen(section, state);
          return (
            <li key={section.id}>
              <a
                className={`section-nav__link${open ? '' : ' section-nav__link--locked'}`}
                href={href(section.path)}
                aria-current={isWithin(path, section.path) ? 'page' : undefined}
                onClick={onNavigate}
              >
                <span className="section-nav__index">{section.index}</span>
                <span className="section-nav__title">
                  {section.title}
                  {!open && <span className="visually-hidden"> (locked)</span>}
                </span>
                {!open && <Lock aria-hidden="true" size={14} />}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
