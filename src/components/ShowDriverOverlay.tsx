import type { Place } from '../data/content';
import { mapsDirectionsUrl, mapsPlaceUrl, mapsSearchForPlace, openUrl, telUrl } from '../utils/links';

interface ShowDriverOverlayProps {
  place: Place;
  onClose: () => void;
}

/** Full-screen high-contrast card for showing a taxi/ride driver a destination */
export function ShowDriverOverlay({ place, onClose }: ShowDriverOverlayProps) {
  const mapsUrl =
    place.lat != null && place.lng != null
      ? mapsPlaceUrl(place.lat, place.lng, place.name)
      : mapsSearchForPlace(place.name, place.address);
  const callLabel = place.kind === 'hotel' ? 'Call hotel' : 'Call';

  return (
    <div
      className="driver-overlay driver-overlay-hc"
      role="dialog"
      aria-modal="true"
      aria-labelledby="driver-title"
    >
      <button type="button" className="driver-overlay-backdrop" onClick={onClose} aria-label="Close" />
      <div className="driver-overlay-panel">
        <div className="driver-overlay-content">
          <h1 id="driver-title" className="driver-overlay-name">
            {place.name}
          </h1>
          <p className="driver-overlay-address">{place.address}</p>
          {place.notes && <p className="driver-overlay-notes">{place.notes}</p>}
          <div className="driver-overlay-actions">
            {place.phone && (
              <button
                type="button"
                className="driver-overlay-btn"
                onClick={() => openUrl(telUrl(place.phone!))}
              >
                📞 {callLabel}
              </button>
            )}
            <button type="button" className="driver-overlay-btn" onClick={() => openUrl(mapsUrl)}>
              📍 Open in Maps
            </button>
            <button
              type="button"
              className="driver-overlay-btn"
              onClick={() => openUrl(mapsDirectionsUrl(place.address, place.lat, place.lng))}
            >
              🧭 Directions
            </button>
          </div>
        </div>
        <footer className="driver-overlay-footer">
          <button type="button" className="driver-overlay-close" onClick={onClose}>
            ✕ Close
          </button>
        </footer>
      </div>
    </div>
  );
}
