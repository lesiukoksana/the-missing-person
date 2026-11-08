import type { SectionDefinition, SectionId } from '../types/game';

export const SECTIONS: SectionDefinition[] = [
  {
    id: 'website',
    index: '01',
    path: '/website',
    title: 'Eleanor’s Website',
    description: 'Her personal site, abandoned for over a decade and somehow online again.',
    requirement: null,
  },
  {
    id: 'archive',
    index: '02',
    path: '/archive',
    title: 'Police Archive',
    description: 'Reports, interviews and notes from the original investigation.',
    requirement: null,
  },
  {
    id: 'board',
    index: '03',
    path: '/board',
    title: 'Evidence Board',
    description: 'Lay out what you have found and test how it connects.',
    requirement: null,
  },
  {
    id: 'messages',
    index: '04',
    path: '/messages',
    title: 'Messages & Emails',
    description: 'Private correspondence, including mail someone tried to delete.',
    requirement: { kind: 'documents', count: 1 },
  },
  {
    id: 'suspects',
    index: '05',
    path: '/suspects',
    title: 'Suspects',
    description: 'The people closest to the case, and what their accounts leave out.',
    requirement: { kind: 'documents', count: 1 },
  },
  {
    id: 'timeline',
    index: '06',
    path: '/timeline',
    title: 'Timeline',
    description: 'Twelve years of events, 2012 to 2026. Not every date agrees.',
    requirement: { kind: 'evidence', count: 3 },
  },
  {
    id: 'terminal',
    index: '07',
    path: '/terminal',
    title: 'Terminal',
    description: 'A simulated command line for searching and decoding case records.',
    requirement: { kind: 'evidence', count: 5 },
  },
  {
    id: 'recovery',
    index: '08',
    path: '/recovery',
    title: 'File Recovery',
    description: 'Deleted and corrupted files pulled from Eleanor’s old storage.',
    requirement: { kind: 'puzzle', puzzle: 'blogPassword' },
  },
  {
    id: 'conclusion',
    index: '09',
    path: '/conclusion',
    title: 'Case Conclusion',
    description: 'State what you believe happened. Your conclusion is final.',
    requirement: { kind: 'documents', count: 3 },
  },
];

export const SECTIONS_BY_ID = Object.fromEntries(
  SECTIONS.map((section) => [section.id, section]),
) as Record<SectionId, SectionDefinition>;
