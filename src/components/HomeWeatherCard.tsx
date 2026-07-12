import { Link } from 'react-router-dom';
import { useDayWeather } from '../hooks/useDayWeather';
import { getHomeWeatherDayId, getTodaySummary } from '../utils/tripToday';
import { DataStatusBadge } from './DataStatusBadge';
import { WeatherDisplay } from './WeatherDisplay';

export function HomeWeatherCard() {
  const dayId = getHomeWeatherDayId();
  const { phase } = getTodaySummary();
  const { weather, loading, error } = useDayWeather(dayId);

  const heading =
    phase === 'during'
      ? 'Weather today'
      : phase === 'before'
        ? 'First day weather'
        : 'Last day weather';

  if (loading) {
    return (
      <div className="card weather-card" aria-busy="true">
        <h2>{heading}</h2>
        <p className="weather-muted">Loading forecast…</p>
      </div>
    );
  }

  if (error || !weather) {
    return null;
  }

  return (
    <div className="card weather-card home-weather-card">
      <div className="home-weather-head">
        <h2>{heading}</h2>
        <div className="home-weather-meta">
          <DataStatusBadge
            mode={
              weather.mode === 'unavailable'
                ? 'offline'
                : weather.fromCache
                  ? 'cached'
                  : 'live'
            }
          />
          <Link to="/weather" className="home-weather-link">
            All days →
          </Link>
        </div>
      </div>
      {phase === 'before' && (
        <p className="weather-muted home-weather-note">Trip hasn&apos;t started — showing Jun 6.</p>
      )}
      {phase === 'after' && (
        <p className="weather-muted home-weather-note">Trip complete — last day shown.</p>
      )}
      <p className="weather-date">{weather.dateLabel} · {weather.locationLabel}</p>
      <WeatherDisplay weather={weather} />
      <p className="weather-source">Pull down to refresh · Open-Meteo</p>
    </div>
  );
}
