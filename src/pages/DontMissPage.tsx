import { Link } from 'react-router-dom';
import { DontMissItemRow } from '../components/DontMissItem';
import { HeroBanner } from '../components/HeroBanner';
import { CITY_IMAGES, TIMELINE } from '../data/content';
import { mapsSearchUrl, openUrl } from '../utils/links';

export function DontMissPage() {
  return (
    <>
      <HeroBanner title="Don't Miss" subtitle="Free time & top picks" image={CITY_IMAGES.food} theme="food" />
      <div className="card">
        <p><span className="star">★</span> = must-do · Tap <strong>📍</strong> to open in Google Maps.</p>
      </div>
      {TIMELINE.map((day) => (
        <div key={day.id} className="card">
          <Link to={`/itinerary/${day.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
            <span className={`badge badge-${day.theme}`}>{day.date}</span>
            <h3 style={{ fontSize: '0.95rem' }}>{day.where}</h3>
          </Link>
          {day.freeTime && <p><strong>Free:</strong> {day.freeTime}</p>}
          <ul className="dont-miss-list">
            {day.dontMiss.map((item) => (
              <DontMissItemRow key={item.text} item={item} />
            ))}
          </ul>
          {day.rain && (
            <p style={{ marginTop: '0.5rem' }}>
              ☔ {day.rain}
              {day.rainMapQuery && (
                <button
                  type="button"
                  className="btn btn-map btn-compact"
                  style={{ marginLeft: '0.5rem', verticalAlign: 'middle' }}
                  onClick={(e) => {
                    e.preventDefault();
                    openUrl(mapsSearchUrl(day.rainMapQuery!));
                  }}
                >
                  📍
                </button>
              )}
            </p>
          )}
        </div>
      ))}
    </>
  );
}
