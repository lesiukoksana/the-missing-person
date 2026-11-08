import { href } from '../app/router';
import { SECTIONS_BY_ID } from '../data/sections';
import type { SectionId } from '../types/game';

/** Holds a section's route until the section itself is built. */
export function SectionStub({ id }: { id: SectionId }) {
  const section = SECTIONS_BY_ID[id];

  return (
    <section className="notice-page" aria-labelledby="stub-title">
      <p className="kicker">File {section.index}</p>
      <h1 id="stub-title" className="page-title">
        {section.title}
      </h1>
      <p className="notice-page__body">{section.description}</p>
      <p className="notice-page__requirement">
        <strong>Not built yet.</strong> This section's route works, and its content comes in a
        later build.
      </p>
      <a className="button" href={href('/hub')}>
        Back to case overview
      </a>
    </section>
  );
}
