import type { ArchiveDocument } from '../../data/archive';
import { isRequirementMet } from '../../store/selectors';
import type { GameState } from '../../types/game';

export function isDocumentOpen(doc: ArchiveDocument, state: GameState) {
  return doc.requirement === null || isRequirementMet(doc.requirement, state);
}
