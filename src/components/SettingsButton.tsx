import { Settings as SettingsIcon } from 'lucide-react';
import { useState } from 'react';
import { navigate } from '../app/router';
import { useGame } from '../store/GameContext';
import type { MotionPreference } from '../types/game';
import { Modal } from './Modal';
import { SoundToggle } from './SoundToggle';

export function SettingsButton() {
  const { state, dispatch } = useGame();
  const [open, setOpen] = useState(false);
  const [confirmingReset, setConfirmingReset] = useState(false);

  function closeSettings() {
    setOpen(false);
    setConfirmingReset(false);
  }

  function confirmReset() {
    dispatch({ type: 'reset' });
    closeSettings();
    navigate('/');
  }

  return (
    <>
      <button type="button" className="text-button" onClick={() => setOpen(true)}>
        <SettingsIcon aria-hidden="true" size={16} />
        Settings
      </button>

      <Modal open={open} onClose={closeSettings} title="Settings">
        <div className="field">
          <label htmlFor="motion-setting">Motion</label>
          <select
            id="motion-setting"
            value={state.settings.motion}
            onChange={(event) =>
              dispatch({
                type: 'updateSettings',
                settings: { motion: event.target.value as MotionPreference },
              })
            }
          >
            <option value="system">Follow system setting</option>
            <option value="reduced">Reduced</option>
          </select>
          <p className="field__hint">Reduced turns off animation, film grain movement and glitches.</p>
        </div>

        <div className="field">
          <span className="field__label">Sound</span>
          <SoundToggle />
          <p className="field__hint">A quiet ambient drone. It only starts when you turn it on, and the game is fully playable without it.</p>
        </div>

        <div className="danger-zone">
          <h3>Reset investigation</h3>
          {confirmingReset ? (
            <>
              <p role="alert">
                This erases all evidence, solved puzzles, notes and your filed conclusion. It can't be undone. The list of endings you've found is kept.
              </p>
              <div className="button-row">
                <button type="button" className="button button--danger" onClick={confirmReset}>
                  Erase and start over
                </button>
                <button
                  type="button"
                  className="button button--ghost"
                  onClick={() => setConfirmingReset(false)}
                >
                  Keep my progress
                </button>
              </div>
            </>
          ) : (
            <>
              <p>Clear all progress and start a new game. Your settings are kept.</p>
              <button
                type="button"
                className="button button--ghost"
                onClick={() => setConfirmingReset(true)}
              >
                Reset investigation
              </button>
            </>
          )}
        </div>
      </Modal>
    </>
  );
}
