import { TriangleAlert } from 'lucide-react';
import { useGame } from '../store/GameContext';

const MESSAGES = {
  corrupt: 'Your saved game couldn’t be read, so a new one was started.',
  unavailable: 'This browser is blocking storage, so progress won’t be saved after you close the page.',
};

export function StorageNotice() {
  const { storageIssue, dismissStorageIssue } = useGame();
  if (!storageIssue) return null;

  return (
    <div className="storage-notice" role="status">
      <TriangleAlert aria-hidden="true" size={18} />
      <p>{MESSAGES[storageIssue]}</p>
      <button type="button" className="text-button" onClick={dismissStorageIssue}>
        Dismiss
      </button>
    </div>
  );
}
