import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getNextUp } from '../utils/nextEvent';
import { getTodaySummary } from '../utils/tripToday';
import { mapsSearchUrl, openUrl } from '../utils/links';

export function NextUpCard() {
  const [tick, setTick] = useState(0);
  const summary = getTodaySummary();
  const next = getNextUp();

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 60_000);
    return () => window.clearInterval(id);
  }, []);

  void tick;

  if (summary.phase !== 'during' || !next || !summary.day) {
    return null;
  }

  const { event, kind, countdownLabel, timeLabel } = next;
  const mapQuery = event.mapQuery ?? event.address ?? event.location;

  return (
    <div className={`card next-up-card next-up-${kind}`}>
      <div className="next-up-head">
        <h2>{kind === 'now' ? 'Happening now' : kind === 'done' ? 'Today' : 'Next up'}</h2>
        <span className="next-up-countdown">{countdownLabel}</span>
      </div>
      <p className="next-up-title">{event.title}</p>
      <p className="next-up-time">{timeLabel}</p>
      {event.location && <p className="next-up-location">{event.location}</p>}
      <div className="btn-row">
        <Link to={`/itinerary/${summary.day.id}`} className="btn btn-primary">
          Day details
        </Link>
        {mapQuery && kind !== 'done' && (
          <button
            type="button"
            className="btn btn-map"
            onClick={() => openUrl(mapsSearchUrl(mapQuery))}
          >
            📍 Map
          </button>
        )}
      </div>
    </div>
  );
}
