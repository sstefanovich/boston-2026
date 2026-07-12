import { useState } from 'react';
import { HeroBanner } from '../components/HeroBanner';
import { PlaceActions } from '../components/PlaceActions';
import { ShowDriverOverlay } from '../components/ShowDriverOverlay';
import { TripMap } from '../components/TripMap';
import { WalkHint } from '../components/WalkHint';
import { CITY_IMAGES, HOTELS, MEETING_POINTS, RESTAURANTS, SIGHTS, type Place } from '../data/content';
import { openUrl, telUrl } from '../utils/links';

type Tab = 'hotels' | 'tours' | 'dining' | 'sights' | 'all';

export function PlacesPage() {
  const [tab, setTab] = useState<Tab>('all');
  const [driverPlace, setDriverPlace] = useState<Place | null>(null);

  const places =
    tab === 'hotels' ? HOTELS
    : tab === 'tours' ? MEETING_POINTS
    : tab === 'dining' ? RESTAURANTS
    : tab === 'sights' ? SIGHTS
    : [...HOTELS, ...MEETING_POINTS, ...RESTAURANTS, ...SIGHTS];

  return (
    <>
      <HeroBanner title="Maps & Places" subtitle="Hotels, restaurants, sights" image={CITY_IMAGES.boston} theme="boston" />
      <div className="tabs tabs-scroll">
        <button type="button" className={`tab ${tab === 'hotels' ? 'active' : ''}`} onClick={() => setTab('hotels')}>Hotels</button>
        <button type="button" className={`tab ${tab === 'tours' ? 'active' : ''}`} onClick={() => setTab('tours')}>Tours</button>
        <button type="button" className={`tab ${tab === 'dining' ? 'active' : ''}`} onClick={() => setTab('dining')}>Dining</button>
        <button type="button" className={`tab ${tab === 'sights' ? 'active' : ''}`} onClick={() => setTab('sights')}>Sights</button>
        <button type="button" className={`tab ${tab === 'all' ? 'active' : ''}`} onClick={() => setTab('all')}>All</button>
      </div>
      <div className="card trip-map-card">
        <h2>{tab === 'all' ? 'Trip map' : 'Visible places'}</h2>
        <p className="page-lead">Tap a pin to see details, then jump straight into Maps for directions.</p>
        <TripMap places={places} />
      </div>
      {places.map((p) => (
        <div key={p.id} className="card">
          <span className={`badge badge-${p.theme}`}>{p.city}</span>
          <h3 className="place-name">{p.name}</h3>
          <p className="place-address">{p.address}</p>
          <WalkHint place={p} />
          {p.phone && (
            <button type="button" className="btn btn-phone" onClick={() => openUrl(telUrl(p.phone!))}>
              📞 {p.phone}
            </button>
          )}
          {p.notes && <p className="place-notes">{p.notes}</p>}
          <div className="btn-row">
            <button type="button" className="btn btn-primary" onClick={() => setDriverPlace(p)}>
              📱 Show driver (high contrast)
            </button>
          </div>
          <PlaceActions place={p} />
        </div>
      ))}
      {driverPlace && <ShowDriverOverlay place={driverPlace} onClose={() => setDriverPlace(null)} />}
    </>
  );
}
