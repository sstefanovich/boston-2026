import { useState } from 'react';
import { ShowDriverOverlay } from './ShowDriverOverlay';
import { getTodaySummary } from '../utils/tripToday';
import { mapsDirectionsUrl, mapsPlaceUrl, mapsSearchForPlace, openUrl } from '../utils/links';

export function BackToHotelCard() {
  const [showDriver, setShowDriver] = useState(false);
  const { phase, hotel } = getTodaySummary();

  if (phase !== 'during' || !hotel) {
    return null;
  }

  const mapsUrl =
    hotel.lat != null && hotel.lng != null
      ? mapsPlaceUrl(hotel.lat, hotel.lng, hotel.name)
      : mapsSearchForPlace(hotel.name, hotel.address);

  return (
    <>
      <div className="card back-to-hotel-card">
        <h2>🏨 Back to hotel</h2>
        <p className="back-to-hotel-name">{hotel.name}</p>
        <p className="back-to-hotel-address">{hotel.address}</p>
        <div className="btn-row">
          <button type="button" className="btn btn-primary" onClick={() => setShowDriver(true)}>
            📱 Show driver
          </button>
          <button
            type="button"
            className="btn btn-map"
            onClick={() => openUrl(mapsDirectionsUrl(hotel.address, hotel.lat, hotel.lng))}
          >
            🧭 Directions
          </button>
          <button type="button" className="btn btn-map" onClick={() => openUrl(mapsUrl)}>
            📍 Map
          </button>
        </div>
      </div>
      {showDriver && <ShowDriverOverlay place={hotel} onClose={() => setShowDriver(false)} />}
    </>
  );
}
