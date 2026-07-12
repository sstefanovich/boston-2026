import { Link } from 'react-router-dom';
import { HeroBanner } from '../components/HeroBanner';
import { HomeWeatherCard } from '../components/HomeWeatherCard';
import { BackToHotelCard } from '../components/BackToHotelCard';
import { NextUpCard } from '../components/NextUpCard';
import { TripBingoHomeCard } from '../components/TripBingoHomeCard';
import { ExpensesHomeCard } from '../components/ExpensesHomeCard';
import { TodaySummaryCard } from '../components/TodaySummaryCard';
import { TripCountdownCard } from '../components/TripCountdownCard';
import { TimeZoneBar } from '../components/TimeZoneBar';
import { TransitLinks } from '../components/TransitLinks';
import { getTransitForDay } from '../data/publicTransport';
import { APP_SUBTITLE, APP_TITLE, CITY_IMAGES, TIMELINE } from '../data/content';
import { getCurrentTripDayId, getTodaySummary } from '../utils/tripToday';

function getUpcomingDays() {
  const { phase, day } = getTodaySummary();
  if (phase === 'during' && day) {
    const idx = TIMELINE.findIndex((d) => d.id === day.id);
    return TIMELINE.slice(Math.max(0, idx), idx + 4);
  }
  if (phase === 'after') return TIMELINE.slice(-4);
  return TIMELINE.slice(0, 4);
}

export function HomePage() {
  const summary = getTodaySummary();
  const todayId = getCurrentTripDayId();
  const upcoming = getUpcomingDays();
  const heroBadge =
    summary.phase === 'during' && summary.day
      ? `Today · ${summary.day.date}`
      : 'Wicked good trip';

  return (
    <>
      <HeroBanner
        title={APP_TITLE}
        subtitle={APP_SUBTITLE}
        image={CITY_IMAGES.travel}
        theme="travel"
        badge={heroBadge}
      />

      <TripCountdownCard />

      <TimeZoneBar />

      <NextUpCard />

      <BackToHotelCard />

      <TodaySummaryCard />

      <TripBingoHomeCard />

      <ExpensesHomeCard />

      {todayId && getTransitForDay(todayId).length > 0 && (
        <TransitLinks links={getTransitForDay(todayId)} />
      )}

      <HomeWeatherCard />

      <h2 className="section-heading">
        {summary.phase === 'during' ? 'Today & coming up' : 'Upcoming days'}
      </h2>
      {upcoming.map((day) => {
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
              <strong>
                {day.date} — {day.where}
              </strong>
              <span>{day.highlights}</span>
            </div>
          </Link>
        );
      })}
      <Link to="/itinerary" className="btn btn-primary home-itinerary-cta">
        View full itinerary →
      </Link>
    </>
  );
}
