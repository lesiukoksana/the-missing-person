import { useState, type FormEvent } from 'react';
import type { Photo } from '../../data/website/photos';
import { useDiscovery } from '../../hooks/useDiscovery';
import { useGame } from '../../store/GameContext';
import { PUZZLES_BY_ID } from '../puzzles/definitions';
import { checkTakenDate, SUSPECT_FIELD } from '../puzzles/photoMetadata';

const FIELD_FEEDBACK: Record<string, string> = {
  FileName: 'Nothing strange about the name.',
  Make: 'An unusual make, compared with her other photos. Worth remembering. But what contradicts the caption?',
  Model: 'An unusual model, compared with her other photos. Worth remembering. But what contradicts the caption?',
  ImageSize: 'It’s been cropped, yes. Why would that matter? Keep looking.',
  Software: 'It’s been edited. That’s not a contradiction in itself.',
  ModifyDate: 'That only says when the file was edited. Which field shows when the photo was taken?',
};

export function MetadataPuzzle({ photo }: { photo: Photo }) {
  const { state, dispatch } = useGame();
  const { discover, record } = useDiscovery();
  const [field, setField] = useState('');
  const [fieldFound, setFieldFound] = useState(false);
  const [date, setDate] = useState('');
  const [feedback, setFeedback] = useState('');

  if (state.solvedPuzzles.includes('photoMetadata')) {
    return (
      <section className="file-report file-report--solved" aria-labelledby="report-title">
        <h3 id="report-title">File discrepancy logged</h3>
        <p>
          The caption says October 2013, at dusk. The camera says <strong>15 November 2013, 02:52</strong>.
          That’s the night of the Harrow Mill fire, and it’s the camera from the wheel house.
        </p>
        <p>Eleanor edited this file on 14 October 2014, three days before she disappeared. Why would she disguise it?</p>
        <p className="file-report__unlock">Unlocked in the Police Archive: DI Reed’s investigator notes.</p>
      </section>
    );
  }

  function submitField(event: FormEvent) {
    event.preventDefault();
    if (!field) {
      setFeedback('Choose a field first.');
    } else if (field === SUSPECT_FIELD) {
      setFieldFound(true);
      setFeedback('');
    } else {
      setFeedback(FIELD_FEEDBACK[field] ?? 'Not that one.');
    }
  }

  function submitDate(event: FormEvent) {
    event.preventDefault();
    const result = checkTakenDate(date);
    if (!result.correct) {
      setFeedback(result.feedback);
      return;
    }
    const at = new Date().toISOString();
    dispatch({
      type: 'solvePuzzle',
      puzzle: 'photoMetadata',
      label: `Puzzle solved: ${PUZZLES_BY_ID.photoMetadata.title}`,
      at,
    });
    discover('frame-blue-hour');
    record('unlocked', 'doc-reed-notes');
  }

  return (
    <section className="file-report" aria-labelledby="report-title">
      <h3 id="report-title">Does this file match its caption?</h3>
      {fieldFound ? (
        <form onSubmit={submitDate}>
          <label htmlFor="taken-date">
            <code>{SUSPECT_FIELD}</code> contradicts the caption. On what date was this photo really taken?
          </label>
          <div className="old-form-row">
            <input
              id="taken-date"
              type="text"
              value={date}
              autoComplete="off"
              onChange={(event) => setDate(event.target.value)}
            />
            <button type="submit" className="old-button">
              Log it
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={submitField}>
          <label htmlFor="report-field">Which field contradicts “{photo.date}”, “evening light”?</label>
          <div className="old-form-row">
            <select id="report-field" value={field} onChange={(event) => setField(event.target.value)}>
              <option value="">Choose a field</option>
              {photo.metadata.map((row) => (
                <option key={row.field} value={row.field}>
                  {row.field}
                </option>
              ))}
            </select>
            <button type="submit" className="old-button">
              Check
            </button>
          </div>
        </form>
      )}
      {feedback && (
        <p className="old-feedback" role="alert">
          {feedback}
        </p>
      )}
    </section>
  );
}
