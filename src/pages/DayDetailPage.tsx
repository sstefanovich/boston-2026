import { Link, useParams } from 'react-router-dom';
import { AddressBlock } from '../components/AddressBlock';
import { DontMissItemRow } from '../components/DontMissItem';
import { DayWeatherCard } from '../components/DayWeatherCard';
import { HeroBanner } from '../components/HeroBanner';
import { TransitLinks } from '../components/TransitLinks';
import { getTransitForDay } from '../data/publicTransport';
import { CALENDAR_EVENTS, TIMELINE } from '../data/content';
import { formatEventTimeRange } from '../utils/eventTime';
import { calendarEventUrl, mapsSearchUrl, openUrl } from '../utils/links';

export function DayDetailPage() {
  const { dayId } = useParams();
  const day = TIMELINE.find((d) => d.id === dayId);
  const events = CALENDAR_EVENTS.filter((e) => e.dayId === dayId).sort((a, b) =>
    a.start.localeCompare(b.start)
  );

  if (!day) {
    return (
      <div className="card">
        <p>Day not found.</p>
        <Link to="/itinerary">← Back</Link>
      </div>
    );
  }

  return (
    <>
      <HeroBanner title={day.date} subtitle={`${day.weekday} · ${day.where}`} image={day.image} theme={day.theme} badge={day.where} />
      <Link to="/itinerary" className="btn" style={{ marginBottom: '0.75rem' }}>← All days</Link>

      <DayWeatherCard dayId={day.id} />

      <TransitLinks links={getTransitForDay(day.id)} />

      <div className="card">
        <h2>Today</h2>
        <p>{day.highlights}</p>
        {day.freeTime && <p><strong>Free time:</strong> {day.freeTime}</p>}
      </div>

      {day.dontMiss.length > 0 && (
        <div className="card">
          <h2><span className="star">★</span> Don&apos;t miss</h2>
          <ul className="dont-miss-list">
            {day.dontMiss.map((item) => (
              <DontMissItemRow key={item.text} item={item} />
            ))}
          </ul>
        </div>
      )}

      {day.rain && (
        <div className="card">
          <h2>☔ Rain plan</h2>
          <p>{day.rain}</p>
          {day.rainMapQuery && (
            <div className="btn-row">
              <button type="button" className="btn btn-map" onClick={() => openUrl(mapsSearchUrl(day.rainMapQuery!))}>
                📍 Map rain option
              </button>
            </div>
          )}
        </div>
      )}

      {events.length > 0 && (
        <div className="card">
          <h2>Booked events</h2>
          {events.map((ev) => (
            <div key={ev.id} className="event-block">
              <strong className="event-title">{ev.title}</strong>
              <p className="event-time">{formatEventTimeRange(ev.start, ev.end)}</p>
              <AddressBlock address={ev.address ?? ev.location} />
              {ev.details && <p className="event-details">{ev.details}</p>}
              <div className="btn-row">
                <button
                  type="button"
                  className="btn btn-cal"
                  onClick={() =>
                    openUrl(
                      calendarEventUrl({
                        title: ev.title,
                        start: ev.start,
                        end: ev.end,
                        location: ev.address ?? ev.location,
                        details: ev.details,
                      })
                    )
                  }
                >
                  🗓️ Calendar
                </button>
                {ev.mapQuery && (
                  <button
                    type="button"
                    className="btn btn-map"
                    onClick={() => openUrl(mapsSearchUrl(ev.mapQuery!))}
                  >
                    📍 Map
                  </button>
                )}
                {ev.website && (
                  <button type="button" className="btn btn-web" onClick={() => openUrl(ev.website!)}>
                    🌐 Website
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Link to="/dont-miss" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
        More free-time ideas →
      </Link>
    </>
  );
}
