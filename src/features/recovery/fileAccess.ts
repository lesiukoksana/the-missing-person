import type { RecoveredFile } from '../../data/recovery';
import { isRequirementMet } from '../../store/selectors';
import type { GameState } from '../../types/game';
import { buildCheckinLog } from './checkinLog';

export function restoredFlag(file: RecoveredFile) {
  return `file:${file.id}`;
}

export function isFileAvailable(file: RecoveredFile, state: GameState) {
  return file.requirement === null || isRequirementMet(file.requirement, state);
}

export function isFileReadable(file: RecoveredFile, state: GameState) {
  if (file.sealed || file.rebuiltElsewhere) return false;
  if (file.status === 'recovered') return true;
  if (!isFileAvailable(file, state)) return false;
  if (file.restoresWithBox) return true;
  return state.unlocked.includes(restoredFlag(file));
}

/** Deleted files the player can restore right now. */
export function canRestore(file: RecoveredFile, state: GameState) {
  return (
    file.status === 'deleted' &&
    isFileAvailable(file, state) &&
    !state.unlocked.includes(restoredFlag(file))
  );
}

export type DisplayStatus = 'Recovered' | 'Restored' | 'Deleted' | 'Corrupted' | 'Rebuilt' | 'Encrypted' | 'Decrypted';

export function displayStatus(file: RecoveredFile, state: GameState): DisplayStatus {
  if (file.rebuiltElsewhere) {
    return state.solvedPuzzles.includes('emailReconstruction') ? 'Rebuilt' : 'Corrupted';
  }
  if (file.status === 'recovered') return 'Recovered';
  if (file.status === 'encrypted') {
    return !file.sealed && isFileReadable(file, state) ? 'Decrypted' : 'Encrypted';
  }
  return isFileReadable(file, state) ? 'Restored' : 'Deleted';
}

export function fileContent(file: RecoveredFile, state: GameState) {
  return file.id === 'checkin-log' ? buildCheckinLog(state).join('\n') : file.content;
}
