import { useMemo, useState } from 'react';
import { HeroBanner } from '../components/HeroBanner';
import { NavIcon } from '../components/NavIcon';
import { CITY_IMAGES } from '../data/content';
import {
  FALLOUT_AREA_LABEL,
  FALLOUT_LOCATIONS,
  type FalloutArea,
  type FalloutLocation,
} from '../data/falloutLocations';
import { mapsDirectionsUrl, mapsPlaceUrl, openUrl } from '../utils/links';

type AreaFilter = 'all' | FalloutArea;

const AREA_ORDER: FalloutArea[] = [
  'backbay',
  'fenway',
  'downtown',
  'northend',
  'charlestown',
  'cambridge',
];

function LocationCard({ spot }: { spot: FalloutLocation }) {
  const mapUrl = mapsPlaceUrl(spot.lat, spot.lng, spot.realName);
  const directionsUrl = mapsDirectionsUrl(spot.address, spot.lat, spot.lng);

  return (
    <article className="card fallout-card">
      <div className="fallout-card-head">
        <span className="fallout-icon-wrap" aria-hidden>
          <NavIcon name={spot.icon} size={28} />
        </span>
        <div>
          <span className="badge badge-fallout">{FALLOUT_AREA_LABEL[spot.area]}</span>
          <h3 className="fallout-game-name">{spot.gameName}</h3>
          <p className="fallout-real-name">→ {spot.realName}</p>
        </div>
      </div>
      <p className="place-address">{spot.address}</p>
      <p className="place-notes">{spot.tip}</p>
      {spot.tripTip && <p className="fallout-trip-tip">{spot.tripTip}</p>}
      <div className="btn-row">
        <button type="button" className="btn btn-map" onClick={() => openUrl(mapUrl)}>
          📍 Map
        </button>
        <button type="button" className="btn btn-map" onClick={() => openUrl(directionsUrl)}>
          🧭 Directions
        </button>
      </div>
    </article>
  );
}

export function FalloutPage() {
  const [area, setArea] = useState<AreaFilter>('all');

  const spots = useMemo(
    () =>
      area === 'all' ? FALLOUT_LOCATIONS : FALLOUT_LOCATIONS.filter((s) => s.area === area),
    [area]
  );

  const grouped = useMemo(() => {
    if (area !== 'all') return null;
    return AREA_ORDER.map((a) => ({
      area: a,
      items: FALLOUT_LOCATIONS.filter((s) => s.area === a),
    })).filter((g) => g.items.length > 0);
  }, [area]);

  return (
    <>
      <HeroBanner
        title="Fallout Boston"
        subtitle="Real places from Fallout 4 you can visit on this trip"
        image={CITY_IMAGES.fallout}
        theme="fallout"
        badge="Commonwealth"
      />

      <div className="card fallout-intro">
        <div className="fallout-intro-row">
          <span className="fallout-icon-wrap fallout-icon-lg" aria-hidden>
            <NavIcon name="fallout" size={36} />
          </span>
          <p>
            Bethesda rebuilt Boston as the Commonwealth. These are the landmarks that still
            exist in real life — map them while you hit Fenway, the Freedom Trail, Charlestown,
            and Cambridge.
          </p>
        </div>
      </div>

      <div className="tabs tabs-scroll">
        <button
          type="button"
          className={`tab ${area === 'all' ? 'active' : ''}`}
          onClick={() => setArea('all')}
        >
          All
        </button>
        {AREA_ORDER.map((a) => (
          <button
            key={a}
            type="button"
            className={`tab ${area === a ? 'active' : ''}`}
            onClick={() => setArea(a)}
          >
            {FALLOUT_AREA_LABEL[a]}
          </button>
        ))}
      </div>

      {grouped
        ? grouped.map((g) => (
            <section key={g.area}>
              <h2 className="fallout-section-title">
                <NavIcon name="fallout" size={18} /> {FALLOUT_AREA_LABEL[g.area]}
              </h2>
              {g.items.map((spot) => (
                <LocationCard key={spot.id} spot={spot} />
              ))}
            </section>
          ))
        : spots.map((spot) => <LocationCard key={spot.id} spot={spot} />)}
    </>
  );
}
