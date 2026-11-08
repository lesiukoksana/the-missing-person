import { useEffect } from 'react';
import type { MotionPreference } from '../types/game';

/** Applies the in-game setting. The operating system preference is handled in CSS and always wins. */
export function useMotionPreference(motion: MotionPreference) {
  useEffect(() => {
    document.documentElement.dataset.motion = motion;
  }, [motion]);
}
