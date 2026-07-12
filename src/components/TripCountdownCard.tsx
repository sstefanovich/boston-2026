import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { APP_TITLE } from '../data/content';
import { getTripCountdown, getTodaySummary } from '../utils/tripToday';

export function TripCountdownCard() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  const summary = getTodaySummary(now);
  const countdown = getTripCountdown(now);

  if (summary.phase !== 'before' || !countdown) {
    return null;
  }

  const { days, hours, minutes } = countdown;

  return (
    <div className="card trip-countdown-card" aria-live="polite">
      <p className="trip-countdown-eyebrow">{APP_TITLE}</p>
      <h2 className="trip-countdown-heading">Trip starts in</h2>
      <div className="trip-countdown-grid">
        <div className="trip-countdown-unit-block">
          <span className="trip-countdown-num">{days}</span>
          <span className="trip-countdown-unit">{days === 1 ? 'day' : 'days'}</span>
        </div>
        <div className="trip-countdown-unit-block">
          <span className="trip-countdown-num">{hours}</span>
          <span className="trip-countdown-unit">{hours === 1 ? 'hour' : 'hours'}</span>
        </div>
        <div className="trip-countdown-unit-block">
          <span className="trip-countdown-num">{minutes}</span>
          <span className="trip-countdown-unit">min</span>
        </div>
      </div>
      <p className="trip-countdown-departure">
        <strong>Sat 8 Aug</strong> · Boston · Aug 8–12
      </p>
      {summary.day && (
        <p className="trip-countdown-preview">{summary.day.highlights}</p>
      )}
      <Link to="/setup" className="btn btn-primary trip-countdown-cta">
        Before you go checklist →
      </Link>
      <Link to="/itinerary/aug8" className="btn trip-countdown-cta-secondary">
        First day itinerary →
      </Link>
    </div>
  );
}
