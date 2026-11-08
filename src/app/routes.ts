import type { ComponentType } from 'react';
import { BoardPage } from '../features/evidenceBoard/BoardPage';
import { ConclusionPage } from '../features/endings/ConclusionPage';
import { MessagesPage } from '../features/messages/MessagesPage';
import { WebsitePage } from '../features/personalWebsite/WebsitePage';
import { ArchivePage } from '../features/policeArchive/ArchivePage';
import { RecoveryPage } from '../features/recovery/RecoveryPage';
import { SuspectsPage } from '../features/suspects/SuspectsPage';
import { TerminalPage } from '../features/terminal/TerminalPage';
import { TimelinePage } from '../features/timeline/TimelinePage';
import type { SectionId } from '../types/game';

export const SECTION_PAGES: Record<SectionId, ComponentType> = {
  website: WebsitePage,
  archive: ArchivePage,
  messages: MessagesPage,
  board: BoardPage,
  suspects: SuspectsPage,
  timeline: TimelinePage,
  recovery: RecoveryPage,
  terminal: TerminalPage,
  conclusion: ConclusionPage,
};
