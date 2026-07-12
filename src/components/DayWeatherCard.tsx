import { useDayWeather } from '../hooks/useDayWeather';
import { DataStatusBadge } from './DataStatusBadge';
import { WeatherDisplay } from './WeatherDisplay';

interface DayWeatherCardProps {
  dayId: string;
}

export function DayWeatherCard({ dayId }: DayWeatherCardProps) {
  const { weather, loading, error } = useDayWeather(dayId);

  if (loading) {
    return (
      <div className="card weather-card" aria-busy="true">
        <h2>Weather</h2>
        <p className="weather-muted">Loading forecast…</p>
      </div>
    );
  }

  if (error || !weather) {
    return null;
  }

  const showCurrent = weather.mode === 'current';

  return (
    <div className="card weather-card">
      <div className="weather-card-head">
        <h2>
          {showCurrent ? 'Current weather' : weather.mode === 'past' ? 'Weather' : 'Forecast'} —{' '}
          {weather.locationLabel}
        </h2>
        <DataStatusBadge
          mode={
            weather.mode === 'unavailable'
              ? 'offline'
              : weather.fromCache
                ? 'cached'
                : 'live'
          }
        />
      </div>
      <p className="weather-date">{weather.dateLabel}</p>
      <WeatherDisplay weather={weather} />
      <p className="weather-source">Source: Open-Meteo · Europe/Paris time</p>
    </div>
  );
}
