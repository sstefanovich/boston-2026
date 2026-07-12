import { useState } from 'react';
import { HeroBanner } from '../components/HeroBanner';
import { PlaceActions } from '../components/PlaceActions';
import { ShowDriverOverlay } from '../components/ShowDriverOverlay';
import { CITY_IMAGES, HOTELS, QUICK_REF_SLANG, type Place } from '../data/content';
import { openUrl, telUrl } from '../utils/links';

export function QuickRefPage() {
  const [driverHotel, setDriverHotel] = useState<Place | null>(null);

  return (
    <>
      <HeroBanner title="Quick Reference" subtitle="Pin this screen" image={CITY_IMAGES.boston} theme="boston" badge="Essentials" />

      <div className="card">
        <h2>Boston slang</h2>
        <table className="quick-ref-table">
          <thead>
            <tr>
              <th></th>
              <th>Say it</th>
              <th>Means</th>
            </tr>
          </thead>
          <tbody>
            {QUICK_REF_SLANG.map((r) => (
              <tr key={r.label}>
                <td>{r.label}</td>
                <td>{r.slang}</td>
                <td>{r.meaning}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="card">
        <h2>Hotels — show driver</h2>
        <p className="page-lead">Tap fullscreen to show your driver the hotel name and address.</p>
        {HOTELS.map((h) => (
          <div key={h.id} className="hotel-driver-block">
            <span className={`badge badge-${h.theme}`}>{h.city}</span>
            <h3 className="place-name">{h.name}</h3>
            <p className="place-address">{h.address}</p>
            {h.phone && (
              <button type="button" className="btn btn-phone" onClick={() => openUrl(telUrl(h.phone!))}>
                📞 {h.phone}
              </button>
            )}
            {h.notes && <p className="place-notes">{h.notes}</p>}
            <div className="btn-row">
              <button type="button" className="btn btn-primary" onClick={() => setDriverHotel(h)}>
                📱 Show driver (high contrast)
              </button>
            </div>
            <PlaceActions place={h} />
          </div>
        ))}
      </div>
      <div className="card">
        <h2>Tipping</h2>
        <p>Restaurants: 18–20% before tax. Bars: $1–2 per drink or ~20%. Rideshare: optional but appreciated.</p>
      </div>

      {driverHotel && <ShowDriverOverlay place={driverHotel} onClose={() => setDriverHotel(null)} />}
    </>
  );
}
