import { AddressBlock } from '../components/AddressBlock';
import { HeroBanner } from '../components/HeroBanner';
import { CALENDAR_EVENTS, CITY_IMAGES } from '../data/content';
import { calendarEventUrl, mapsSearchUrl, openUrl } from '../utils/links';

export function CalendarPage() {
  return (
    <>
      <HeroBanner
        title="Calendar"
        subtitle="Tap to add events to Google Calendar"
        image={CITY_IMAGES.travel}
        theme="travel"
      />
      <p className="page-lead">
        Opens Google Calendar in your browser. Sign in to the Google account you want on your phone.
      </p>
      {CALENDAR_EVENTS.map((ev) => (
        <div key={ev.id} className="card">
          <span className={`badge badge-${ev.theme}`}>{ev.dateLabel}</span>
          <h3 className="event-title">{ev.title}</h3>
          {ev.location && <p className="event-venue">{ev.location}</p>}
          <AddressBlock address={ev.address} />
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
              🗓️ Add to Google Calendar
            </button>
            {ev.mapQuery && (
              <button type="button" className="btn btn-map" onClick={() => openUrl(mapsSearchUrl(ev.mapQuery!))}>
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
    </>
  );
}
