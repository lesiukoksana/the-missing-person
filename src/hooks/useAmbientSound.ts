import { useEffect } from 'react';
import { startAmbient, stopAmbient } from '../utils/ambient';

/**
 * Keeps the ambient sound in line with the setting. A saved "on" setting never plays on page load:
 * it waits for the player's first click or key press, because sound must follow a deliberate action.
 */
export function useAmbientSound(enabled: boolean) {
  useEffect(() => {
    if (!enabled) {
      stopAmbient();
      return;
    }

    function begin() {
      startAmbient();
      window.removeEventListener('pointerdown', begin);
      window.removeEventListener('keydown', begin);
    }
    window.addEventListener('pointerdown', begin);
    window.addEventListener('keydown', begin);
    return () => {
      window.removeEventListener('pointerdown', begin);
      window.removeEventListener('keydown', begin);
    };
  }, [enabled]);
}
