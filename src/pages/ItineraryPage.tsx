import { Link } from 'react-router-dom';
import { HeroBanner } from '../components/HeroBanner';
import { CITY_IMAGES, TIMELINE } from '../data/content';
import { getCurrentTripDayId } from '../utils/tripToday';

export function ItineraryPage() {
  const todayId = getCurrentTripDayId();

  return (
    <>
      <HeroBanner title="Itinerary" subtitle="Aug 8 – 12, 2026" image={CITY_IMAGES.travel} theme="travel" />
      {TIMELINE.map((day) => {
        const isToday = day.id === todayId;
        return (
          <Link
            key={day.id}
            to={`/itinerary/${day.id}`}
            className={`day-card${isToday ? ' day-card-today' : ''}`}
          >
            <img src={day.image} alt="" loading="lazy" />
            <div className="day-card-body">
              {isToday && <span className="day-card-today-label">TODAY</span>}
              <strong>{day.date} · {day.where}</strong>
              <span>{day.highlights}</span>
            </div>
          </Link>
        );
      })}
    </>
  );
}
