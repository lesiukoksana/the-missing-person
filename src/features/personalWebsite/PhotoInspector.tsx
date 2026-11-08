import { useState, type ReactNode } from 'react';
import type { Hotspot } from '../../data/website/photos';
import { useDiscovery } from '../../hooks/useDiscovery';

const ZOOM_LEVELS = [1, 2, 4];

interface PhotoInspectorProps {
  alt: string;
  art: ReactNode;
  hotspots?: Hotspot[];
}

export function PhotoInspector({ alt, art, hotspots = [] }: PhotoInspectorProps) {
  const { discover } = useDiscovery();
  const [zoom, setZoom] = useState(1);
  const [noticed, setNoticed] = useState<Hotspot | null>(null);

  const reachable = hotspots.filter((spot) => zoom >= spot.minZoom);

  function examine(spot: Hotspot) {
    setNoticed(spot);
    if (spot.evidence) discover(spot.evidence);
  }

  return (
    <div className="inspector">
      <div className="inspector__controls" role="group" aria-label="Zoom">
        <span>Zoom:</span>
        {ZOOM_LEVELS.map((level) => (
          <button
            key={level}
            type="button"
            className="old-button"
            aria-pressed={zoom === level}
            onClick={() => setZoom(level)}
          >
            {level * 100}%
          </button>
        ))}
      </div>

      {/* Scrolling, not transforms, so keyboard and touch panning work as normal. */}
      <div className="inspector__viewport" tabIndex={0} role="region" aria-label={`Photograph: ${alt}`}>
        <div className="inspector__image photo-art" style={{ width: `${zoom * 100}%` }}>
          <div role="img" aria-label={alt}>
            {art}
          </div>
          {reachable.map((spot) => (
            <button
              key={spot.id}
              type="button"
              className="inspector__hotspot"
              style={{
                left: `${spot.x}%`,
                top: `${spot.y}%`,
                width: `${spot.width}%`,
                height: `${spot.height}%`,
              }}
              aria-label={`Examine: ${spot.label}`}
              onClick={() => examine(spot)}
            />
          ))}
        </div>
      </div>

      <p className="inspector__hint">Zoom in and click anything that catches your eye.</p>

      {noticed && (
        <p className="inspector__note" role="status">
          <strong>{noticed.label}:</strong> {noticed.note}
        </p>
      )}
    </div>
  );
}
