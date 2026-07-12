import { useState } from 'react';
import type { Place } from '../data/content';
import { copyToClipboard } from '../utils/clipboard';
import {
  calendarEventUrl,
  mapsDirectionsUrl,
  mapsPlaceUrl,
  mapsSearchForPlace,
  openUrl,
} from '../utils/links';
import { boltDropoffUrl, uberDropoffUrl } from '../utils/rideLinks';

interface PlaceActionsProps {
  place: Place;
  showCalendar?: boolean;
  calTitle?: string;
  calStart?: string;
  calEnd?: string;
  /** Show Uber / Bolt (hotels, restaurants, meetings) */
  showRides?: boolean;
}

export function PlaceActions({
  place,
  showCalendar,
  calTitle,
  calStart,
  calEnd,
  showRides = true,
}: PlaceActionsProps) {
  const [copied, setCopied] = useState(false);

  const mapUrl =
    place.lat != null && place.lng != null
      ? mapsPlaceUrl(place.lat, place.lng, place.name)
      : mapsSearchForPlace(place.name, place.address);

  const handleCopy = async () => {
    const line = place.name ? `${place.name}\n${place.address}` : place.address;
    const ok = await copyToClipboard(line);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } else {
      alert('Could not copy — try selecting the address manually.');
    }
  };

  return (
    <div className="btn-row">
      <button type="button" className="btn btn-copy" onClick={handleCopy}>
        {copied ? '✓ Copied' : '📋 Copy address'}
      </button>
      <button type="button" className="btn btn-map" onClick={() => openUrl(mapUrl)}>
        📍 Map
      </button>
      <button
        type="button"
        className="btn btn-map"
        onClick={() => openUrl(mapsDirectionsUrl(place.address, place.lat, place.lng))}
      >
        🧭 Directions
      </button>
      {place.website && (
        <button type="button" className="btn btn-web" onClick={() => openUrl(place.website!)}>
          🌐 Website
        </button>
      )}
      {showRides && (
        <>
          <button type="button" className="btn btn-ride" onClick={() => openUrl(uberDropoffUrl(place.address))}>
            🚗 Uber
          </button>
          <button type="button" className="btn btn-ride" onClick={() => openUrl(boltDropoffUrl(place))}>
            ⚡ Bolt
          </button>
        </>
      )}
      {showCalendar && calStart && calEnd && (
        <button
          type="button"
          className="btn btn-cal"
          onClick={() =>
            openUrl(
              calendarEventUrl({
                title: calTitle || place.name,
                start: calStart,
                end: calEnd,
                location: place.address,
                details: place.notes,
              })
            )
          }
        >
          🗓️ Add
        </button>
      )}
    </div>
  );
}
