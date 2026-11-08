import { EVIDENCE_BY_ID } from '../data/evidence';
import { SECTIONS } from '../data/sections';
import { PUZZLES, PUZZLES_BY_ID } from '../features/puzzles/definitions';
import type { GameState, Requirement, SectionDefinition } from '../types/game';

function plural(count: number, noun: string) {
  return `${count} ${noun}${count === 1 ? '' : 's'}`;
}

export function isRequirementMet(requirement: Requirement, state: GameState) {
  switch (requirement.kind) {
    case 'evidence':
      return state.discoveredEvidence.length >= requirement.count;
    case 'documents':
      return state.readDocuments.length >= requirement.count;
    case 'puzzle':
      return state.solvedPuzzles.includes(requirement.puzzle);
    case 'flag':
      return state.flags.includes(requirement.flag);
  }
}

/** Tells the player how to open locked content. */
export function describeRequirement(requirement: Requirement, state: GameState) {
  switch (requirement.kind) {
    case 'evidence':
      return `Discover ${plural(requirement.count, 'piece')} of evidence (${state.discoveredEvidence.length} so far).`;
    case 'documents':
      return `Read ${plural(requirement.count, 'document')} in the Police Archive (${state.readDocuments.length} so far).`;
    case 'puzzle':
      return `Solve “${PUZZLES_BY_ID[requirement.puzzle].title}”.`;
    case 'flag':
      return requirement.description;
  }
}

export function isSectionOpen(section: SectionDefinition, state: GameState) {
  return section.requirement === null || isRequirementMet(section.requirement, state);
}

export function countOpenSections(state: GameState) {
  return SECTIONS.filter((section) => isSectionOpen(section, state)).length;
}

/** Evidence from the catalog, ignoring anything a damaged or hand-edited save might hold. */
export function countKnownEvidence(state: GameState) {
  return state.discoveredEvidence.filter((id) => id in EVIDENCE_BY_ID).length;
}

export const TOTAL_EVIDENCE = Object.keys(EVIDENCE_BY_ID).length;

/** Half for puzzles, two fifths for evidence, the rest for filing a conclusion. */
export function getProgressPercent(state: GameState) {
  const puzzles = state.solvedPuzzles.length / PUZZLES.length;
  const evidence = Math.min(1, countKnownEvidence(state) / TOTAL_EVIDENCE);
  const concluded = state.ending ? 1 : 0;
  return Math.round((puzzles * 0.5 + evidence * 0.4 + concluded * 0.1) * 100);
}

export interface CaseStatus {
  label: string;
  detail: string;
  severity: 'quiet' | 'active' | 'alarm';
}

export function getCaseStatus(state: GameState): CaseStatus {
  if (state.ending) {
    return {
      label: 'Conclusion filed',
      detail: 'You have stated what you believe happened. The file stays open to you.',
      severity: 'active',
    };
  }
  if (state.solvedPuzzles.length >= 3) {
    return {
      label: 'Tampering suspected',
      detail: 'Records were changed after the case went inactive. Someone had access.',
      severity: 'alarm',
    };
  }
  if (state.solvedPuzzles.length >= 1 || state.discoveredEvidence.length >= 5) {
    return {
      label: 'Records in dispute',
      detail: 'Some of these records disagree with each other.',
      severity: 'active',
    };
  }
  if (state.discoveredEvidence.length >= 1 || state.readDocuments.length >= 1) {
    return {
      label: 'Under unofficial review',
      detail: 'You have started pulling records. Nobody has authorized this.',
      severity: 'active',
    };
  }
  return {
    label: 'Inactive',
    detail: 'No open lines of inquiry on record.',
    severity: 'quiet',
  };
}
