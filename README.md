# The Missing Person

Case #0917. Eleanor Vale, 26, disappeared from Ashford on 17 October 2014. Twelve years later her abandoned personal website is online again, with a new post: “I know you’re looking for me. You shouldn’t be.”

A browser-based mystery investigation game built with React, TypeScript and Vite. It runs entirely in the browser: no backend, no accounts, no external requests. All people, places, organisations, websites and records in it are fictional.

## Run it

Requires Node.js 20.19 or later (or 22.12+), as Vite 8 does.

```bash
npm install
npm run dev
```

Then open the address Vite prints, usually http://localhost:5173/.

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check and build to `dist/` |
| `npm run preview` | Serve the production build |
| `npm run typecheck` | Type-check only |

The build uses relative paths and hash routing, so `dist/` can be served from any static host or sub-folder.

## The game

The investigation is spread across nine areas, reached from the case overview:

| Area | What’s there |
| --- | --- |
| Eleanor’s Website | Her old site: blog, photographs with zoom and file metadata, guestbook, friends, contact page |
| Police Archive | Seven scanned case documents, with stamps, redactions and handwritten notes |
| Evidence Board | Pin evidence, drag it around, connect it, take notes |
| Messages & Emails | Email and text threads, including one deleted email to rebuild |
| Suspects | Profiles that change as you find evidence |
| Timeline | 2012 to 2026, with conflicting records that resolve as you learn more |
| Terminal | A simulated command line for reading, searching and decoding the case files |
| File Recovery | Deleted, corrupted and encrypted files, some restorable |
| Case Conclusion | File what you believe happened |

Areas unlock as you go, and locked areas always say how to open them. There are five puzzles and four endings, one of them secret. Reopening the case after an ending keeps your progress, so you can try for another ending.

Progress, notes, board layout and settings save automatically in your browser. **Settings → Reset investigation** starts over. A reset keeps your settings and the list of endings you have found.

### Accessibility

- Everything works with a keyboard. Evidence cards move with the arrow keys and connect from a list, so dragging is never required.
- Focus is always visible, and a skip link leads to the main content.
- Your system’s reduced-motion setting is respected. **Settings → Motion → Reduced** turns animation off regardless.
- Status is never shown by colour alone.
- Sound is off by default and only starts after you turn it on. It’s generated in the browser, with no audio files, and the game is fully playable without it.

### Safety

The terminal, file recovery and “browser” are simulations inside the page. Nothing in the game runs real commands, reads your files, or uses your camera, microphone, location or browsing data. In-game addresses use reserved `.example` domains, IP addresses come from documentation ranges, and phone numbers come from ranges set aside for fiction.

## Spoilers and the story bible

`docs/CANON.md` is the writers’ source of truth: the full solution, chronology, every clue, puzzle answer and ending condition. It isn’t bundled into the game. Puzzle answers do appear in the built JavaScript, as in any frontend-only game.

## Project structure

```
docs/CANON.md      Story bible (full spoilers)
src/
  app/             App root, hash router, section route table
  assets/          Film grain texture
  components/      App shell, navigation, dialogs, section gate, sound toggle
  data/            All story content: case file, sections, evidence catalog, blog, photos,
                   guestbook, archive documents, messages, recovered files, suspects,
                   timeline, board connections
  features/        One folder per area (personalWebsite, policeArchive, messages, evidenceBoard,
                   suspects, timeline, terminal, recovery, endings, investigation) plus puzzle logic
  hooks/           Discovery, motion, sound and document-title hooks
  pages/           Landing and not-found pages
  store/           Game state: reducer, React context, selectors (unlock rules, progress, case status)
  styles/          Design tokens, base styles, effects, one stylesheet per area
  types/           Shared types
  utils/           Persistence, formatting, the ambient sound engine
```

Story data, game state, UI, puzzle logic, navigation and persistence are kept separate. All content lives in `src/data/` and can be edited without touching components.

**Saving:** the save is one JSON object in LocalStorage under `the-missing-person:save`. On load it’s checked field by field, so a damaged or outdated save can’t break the game. An unreadable save is backed up to `the-missing-person:save:corrupt`, and the game starts fresh with a notice. Two open tabs stay in sync.
