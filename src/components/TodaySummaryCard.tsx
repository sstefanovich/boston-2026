import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AddressBlock } from './AddressBlock';
import { PlaceActions } from './PlaceActions';
import { ShowDriverOverlay } from './ShowDriverOverlay';
import type { Place } from '../data/content';
import { formatEventTimeRange } from '../utils/eventTime';
import { getTodaySummary } from '../utils/tripToday';
import { telUrl, openUrl } from '../utils/links';

export function TodaySummaryCard() {
  const [driverHotel, setDriverHotel] = useState<Place | null>(null);
  const summary = getTodaySummary();

  if (summary.phase === 'before') {
    return null;
  }

  if (summary.phase === 'after') {
    return (
      <div className="card today-card">
        <h2>Trip complete</h2>
        <p className="today-lead">Hope you had a wicked good time in Boston.</p>
        <Link to="/itinerary" className="btn today-cta">
          Browse trip days →
        </Link>
      </div>
    );
  }

  if (!summary.day) {
    return null;
  }

  const { day, events, hotel } = summary;

  return (
    <div className="card today-card">
      <span className={`badge badge-${day.theme}`}>Today</span>
      <h2>
        {day.date} · {day.where}
      </h2>
      <p className="today-highlights">{day.highlights}</p>
      {day.freeTime && (
        <p className="today-meta">
          <strong>Free time:</strong> {day.freeTime}
        </p>
      )}

      {events.length > 0 && (
        <div className="today-events">
          <p className="today-label">On the calendar</p>
          <ul>
            {events
              .sort((a, b) => a.start.localeCompare(b.start))
              .map((ev) => (
                <li key={ev.id}>
                  <strong>{ev.title}</strong>
                  <span className="today-event-time"> · {formatEventTimeRange(ev.start, ev.end)}</span>
                  {ev.location && <span> — {ev.location}</span>}
                  {ev.details && <span className="today-event-detail"> · {ev.details}</span>}
                </li>
              ))}
          </ul>
        </div>
      )}

      {day.dontMiss.length > 0 && (
        <div className="today-dont-miss">
          <p className="today-label">
            <span className="star">★</span> Don&apos;t miss
          </p>
          <ul>
            {day.dontMiss.slice(0, 4).map((item) => (
              <li key={item.text}>{item.text}</li>
            ))}
          </ul>
        </div>
      )}

      {hotel && (
        <div className="today-hotel">
          <p className="today-label">Your hotel</p>
          <p className="today-hotel-name">{hotel.name}</p>
          <AddressBlock address={hotel.address} />
          {hotel.phone && (
            <button type="button" className="btn btn-phone" onClick={() => openUrl(telUrl(hotel.phone!))}>
              📞 {hotel.phone}
            </button>
          )}
          <button type="button" className="btn btn-primary" onClick={() => setDriverHotel(hotel)}>
            📱 Show driver (high contrast)
          </button>
          <PlaceActions place={hotel} showRides />
        </div>
      )}

      <Link to={`/itinerary/${day.id}`} className="btn btn-primary today-cta">
        Full day details →
      </Link>

      {driverHotel && <ShowDriverOverlay place={driverHotel} onClose={() => setDriverHotel(null)} />}
    </div>
  );
}
