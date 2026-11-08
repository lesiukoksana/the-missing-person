import { Volume2, VolumeX } from 'lucide-react';
import { useGame } from '../store/GameContext';
import { startAmbient, stopAmbient } from '../utils/ambient';

export function SoundToggle() {
  const { state, dispatch } = useGame();
  const on = state.settings.sound;

  function toggle() {
    // Start or stop inside the click itself, which browsers require for audio.
    if (on) stopAmbient();
    else startAmbient();
    dispatch({ type: 'updateSettings', settings: { sound: !on } });
  }

  return (
    <button type="button" className="text-button" aria-pressed={on} onClick={toggle}>
      {on ? <Volume2 aria-hidden="true" size={16} /> : <VolumeX aria-hidden="true" size={16} />}
      Sound {on ? 'on' : 'off'}
    </button>
  );
}
