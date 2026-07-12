import { Link } from 'react-router-dom';
import { HeroBanner } from '../components/HeroBanner';
import { WeatherDisplay } from '../components/WeatherDisplay';
import { CITY_IMAGES } from '../data/content';
import { DAY_WEATHER_LOCATIONS } from '../data/weatherLocations';
import { useTripWeather } from '../hooks/useTripWeather';
import { getCurrentTripDayId } from '../utils/tripToday';

export function WeatherPage() {
  const { days, loading, error } = useTripWeather();
  const todayId = getCurrentTripDayId();

  return (
    <>
      <HeroBanner
        title="Trip weather"
        subtitle="Forecast by city · °C and °F"
        image={CITY_IMAGES.travel}
        theme="travel"
      />

      <p className="weather-page-intro">
        Each day uses the city where you&apos;ll spend most of your time. Tap a day for full details.
      </p>

      {loading && (
        <div className="card weather-card" aria-busy="true">
          <p className="weather-muted">Loading weather for all trip days…</p>
        </div>
      )}

      {error && (
        <div className="card weather-card">
          <p className="weather-muted">{error}</p>
        </div>
      )}

      {!loading &&
        !error &&
        days.map((row) => {
          const isToday = row.dayId === todayId;
          const loc = DAY_WEATHER_LOCATIONS[row.dayId];
          const w = row.weather;

          return (
            <Link
              key={row.dayId}
              to={`/itinerary/${row.dayId}`}
              className={`weather-day-link${isToday ? ' weather-day-link-today' : ''}`}
            >
              <div className="weather-day-header">
                <div>
                  {isToday && <span className="day-card-today-label">TODAY</span>}
                  <strong className="weather-day-date">{row.date}</strong>
                  <span className="weather-day-where">{row.where}</span>
                </div>
                {w && w.mode !== 'unavailable' && w.forecast && (
                  <span className="weather-day-icon" aria-hidden>
                    {w.current?.icon ?? w.forecast.icon}
                  </span>
                )}
              </div>
              {loc && (
                <p className="weather-day-location">
                  📍 {loc.label}
                </p>
              )}
              {w ? (
                <WeatherDisplay weather={w} compact />
              ) : (
                <p className="weather-muted">Weather unavailable</p>
              )}
            </Link>
          );
        })}

      <p className="weather-source weather-page-source">Source: Open-Meteo · Europe/Paris time</p>
    </>
  );
}
