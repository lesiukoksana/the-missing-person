import { useCallback, useEffect } from 'react';
import { EVIDENCE_BY_ID, type EvidenceId } from '../data/evidence';
import { useGame } from '../store/GameContext';
import type { CollectionKey } from '../types/game';

export function useDiscovery() {
  const { dispatch } = useGame();

  const discover = useCallback(
    (id: EvidenceId) => {
      dispatch({
        type: 'collect',
        collection: 'discoveredEvidence',
        id,
        label: EVIDENCE_BY_ID[id].title,
        at: new Date().toISOString(),
      });
    },
    [dispatch],
  );

  /** Records something without logging it as a discovery. */
  const record = useCallback(
    (collection: CollectionKey, id: string) => {
      dispatch({ type: 'collect', collection, id, at: new Date().toISOString() });
    },
    [dispatch],
  );

  return { discover, record };
}

export function useDiscoverOnView(id: EvidenceId | undefined) {
  const { discover } = useDiscovery();

  useEffect(() => {
    if (id) discover(id);
  }, [id, discover]);
}
