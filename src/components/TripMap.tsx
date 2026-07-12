import { useEffect, useMemo } from 'react';
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from 'react-leaflet';
import type { CityTheme, Place } from '../data/content';
import { mapsDirectionsUrl, mapsPlaceUrl, openUrl } from '../utils/links';

interface TripMapProps {
  places: Place[];
}

const BOSTON_CENTER: [number, number] = [42.3601, -71.0589];

const THEME_COLORS: Record<CityTheme, string> = {
  boston: '#1e5f8c',
  northend: '#c44e3f',
  harbor: '#2a7fa8',
  cambridge: '#a51c30',
  sports: '#2d6a4f',
  travel: '#5c6b78',
  food: '#d4842a',
  fallout: '#3d7a4a',
};

function FitToPlaces({ places }: { places: Place[] }) {
  const map = useMap();

  useEffect(() => {
    const coords = places
      .filter((place) => place.lat != null && place.lng != null)
      .map((place) => [place.lat!, place.lng!] as [number, number]);

    if (coords.length === 0) return;
    if (coords.length === 1) {
      map.setView(coords[0], 14, { animate: false });
      return;
    }

    map.fitBounds(coords, {
      padding: [26, 26],
      maxZoom: 14,
      animate: false,
    });
  }, [map, places]);

  return null;
}

export function TripMap({ places }: TripMapProps) {
  const mappablePlaces = useMemo(
    () => places.filter((place) => place.lat != null && place.lng != null),
    [places]
  );
  const mapProps: any = { center: BOSTON_CENTER, zoom: 13, scrollWheelZoom: false };
  const tileLayerProps: any = {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  };

  if (mappablePlaces.length === 0) {
    return <div className="trip-map-empty">No map coordinates available for these places yet.</div>;
  }

  return (
    <div className="trip-map">
      <MapContainer {...mapProps}>
        <TileLayer {...tileLayerProps} />
        <FitToPlaces places={mappablePlaces} />
        {mappablePlaces.map((place) => {
          const color = THEME_COLORS[place.theme];
          const markerProps: any = {
            center: [place.lat!, place.lng!],
            pathOptions: { color: '#ffffff', fillColor: color, fillOpacity: 0.96, weight: 2 },
            radius: 9,
          };
          return (
            <CircleMarker key={place.id} {...markerProps}>
              <Popup>
                <div className="trip-map-popup">
                  <span className={`badge badge-${place.theme}`}>{place.city}</span>
                  <p className="trip-map-popup-title">{place.name}</p>
                  <p className="trip-map-popup-address">{place.address}</p>
                  {place.notes && <p className="trip-map-popup-notes">{place.notes}</p>}
                  <div className="trip-map-popup-actions">
                    <button
                      type="button"
                      className="btn btn-map trip-map-popup-btn"
                      onClick={() => openUrl(mapsPlaceUrl(place.lat!, place.lng!, place.name))}
                    >
                      Open in Maps
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary trip-map-popup-btn"
                      onClick={() => openUrl(mapsDirectionsUrl(place.address, place.lat, place.lng))}
                    >
                      Directions
                    </button>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
