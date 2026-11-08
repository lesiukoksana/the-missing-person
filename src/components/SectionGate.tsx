import { Lock } from 'lucide-react';
import { href } from '../app/router';
import { SECTION_PAGES } from '../app/routes';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useGame } from '../store/GameContext';
import { describeRequirement, isSectionOpen } from '../store/selectors';
import type { SectionDefinition } from '../types/game';

/** The only way into a section, so a typed URL can't bypass its lock. */
export function SectionGate({ section }: { section: SectionDefinition }) {
  const { state } = useGame();
  useDocumentTitle(section.title);

  if (section.requirement && !isSectionOpen(section, state)) {
    return (
      <section className="notice-page" aria-labelledby="locked-title">
        <p className="kicker">
          File {section.index} · <Lock aria-hidden="true" size={12} /> Locked
        </p>
        <h1 id="locked-title" className="page-title">
          {section.title}
        </h1>
        <p className="notice-page__body">{section.description}</p>
        <p className="notice-page__requirement">
          <strong>To open this file:</strong> {describeRequirement(section.requirement, state)}
        </p>
        <a className="button" href={href('/hub')}>
          Back to case overview
        </a>
      </section>
    );
  }

  const Page = SECTION_PAGES[section.id];
  return <Page />;
}
