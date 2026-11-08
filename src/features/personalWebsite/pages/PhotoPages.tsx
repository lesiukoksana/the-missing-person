import { useEffect, useState } from 'react';
import { href } from '../../../app/router';
import { PHOTOS, PHOTOS_BY_ID } from '../../../data/website/photos';
import { useDiscovery } from '../../../hooks/useDiscovery';
import { MetadataPuzzle } from '../MetadataPuzzle';
import { BonfireScene, PHOTO_ART } from '../photoArt';
import { PhotoInspector } from '../PhotoInspector';
import { ServerNotFoundPage } from './ErrorPages';

export function PhotosPage() {
  return (
    <section>
      <h1>photography</h1>
      <p className="eleanor-text">Click a picture for the big version and the file details.  I always keep the details.</p>
      <ul className="oldweb-gallery">
        {PHOTOS.map((photo) => {
          const Art = PHOTO_ART[photo.id];
          return (
            <li key={photo.id}>
              <a href={href(`/website/photos/${photo.id}`)}>
                <span className="oldweb-gallery__thumb photo-art">
                  {/* Egg 6: the thumbnail was never regenerated after the crop. */}
                  {photo.hasCroppedThumbnail ? <BonfireScene uncropped /> : <Art />}
                </span>
                <span className="oldweb-gallery__title">{photo.title}</span>
              </a>
              <span className="oldweb-date">{photo.date}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function PhotoDetailPage({ id }: { id: string }) {
  const photo = PHOTOS_BY_ID[id];
  const { record, discover } = useDiscovery();
  const [showThumbnail, setShowThumbnail] = useState(false);

  useEffect(() => {
    if (photo) record('viewedPhotos', photo.id);
  }, [photo, record]);

  if (!photo) return <ServerNotFoundPage />;

  const Art = PHOTO_ART[photo.id];

  function revealThumbnail() {
    setShowThumbnail(true);
    discover('bonfire-thumbnail');
  }

  return (
    <article>
      <h1>{photo.title}</h1>
      <p className="oldweb-date">{photo.date}</p>
      <p className="eleanor-text">{photo.description}</p>

      <PhotoInspector alt={photo.alt} art={<Art />} hotspots={photo.hotspots} />

      <details className="oldweb-details">
        <summary>File details</summary>
        <table className="oldweb-table">
          <tbody>
            {photo.metadata.map((row) => (
              <tr key={row.field}>
                <th scope="row">{row.field}</th>
                <td>{row.value}</td>
              </tr>
            ))}
            {photo.hasCroppedThumbnail && (
              <tr>
                <th scope="row">ThumbnailImage</th>
                <td>
                  {showThumbnail ? (
                    'Embedded, 1600 x 1200 source'
                  ) : (
                    <button type="button" className="old-button" onClick={revealThumbnail}>
                      View embedded thumbnail
                    </button>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {showThumbnail && (
          <figure className="oldweb-embedded-thumb">
            <div
              className="photo-art"
              role="img"
              aria-label="The same photograph uncropped. A second person stands at the left, pointing at the woman."
            >
              <BonfireScene uncropped />
            </div>
            <figcaption>
              The thumbnail stored inside the file still shows the whole picture. Someone was cropped
              out on 17 February 2015.
            </figcaption>
          </figure>
        )}

        {photo.hasMetadataPuzzle && <MetadataPuzzle photo={photo} />}
      </details>

      <p className="oldweb-backlink">
        <a href={href('/website/photos')}>&laquo; back to photos</a>
      </p>
    </article>
  );
}
