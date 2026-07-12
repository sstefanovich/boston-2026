import type { DayWeatherResult } from '../utils/weather';
import { formatHighLowPair, formatTempPair } from '../utils/temperature';

interface WeatherDisplayProps {
  weather: DayWeatherResult;
  /** Compact layout for trip overview list */
  compact?: boolean;
}

export function WeatherDisplay({ weather, compact = false }: WeatherDisplayProps) {
  const { current, forecast } = weather;
  const showCurrent = weather.mode === 'current' && current;

  if (weather.mode === 'unavailable') {
    return <p className="weather-muted">{weather.message}</p>;
  }

  if (compact) {
    return (
      <div className="weather-compact-body">
        {showCurrent && current && (
          <p className="weather-compact-now">
            <span className="weather-icon-sm" aria-hidden>
              {current.icon}
            </span>
            Now {formatTempPair(current.tempC)} · {current.label}
          </p>
        )}
        {forecast && (
          <p className="weather-compact-range">
            {!showCurrent && (
              <span className="weather-icon-sm" aria-hidden>
                {forecast.icon}
              </span>
            )}
            {formatHighLowPair(forecast.highC, forecast.lowC)}
            {forecast.precipProb > 0 && <> · Rain {forecast.precipProb}%</>}
          </p>
        )}
        {weather.mode === 'past' && weather.message && (
          <p className="weather-compact-note">{weather.message}</p>
        )}
      </div>
    );
  }

  return (
    <>
      {showCurrent && current && (
        <div className="weather-current">
          <span className="weather-icon" aria-hidden>
            {current.icon}
          </span>
          <div className="weather-current-body">
            <p className="weather-temp">{formatTempPair(current.tempC)}</p>
            <p className="weather-desc">{current.label}</p>
            <p className="weather-meta">
              {current.humidity != null && <>Humidity {current.humidity}%</>}
              {current.humidity != null && current.windKmh != null && ' · '}
              {current.windKmh != null && <>Wind {current.windKmh} km/h</>}
            </p>
          </div>
        </div>
      )}

      {forecast && (
        <div className={showCurrent ? 'weather-forecast' : 'weather-forecast weather-forecast-only'}>
          {showCurrent && <p className="weather-subhead">Today&apos;s range</p>}
          {!showCurrent && (
            <div className="weather-current weather-current-compact">
              <span className="weather-icon" aria-hidden>
                {forecast.icon}
              </span>
              <p className="weather-desc">{forecast.label}</p>
            </div>
          )}
          <p className="weather-range-line">{formatHighLowPair(forecast.highC, forecast.lowC)}</p>
          <ul className="weather-stats">
            <li>
              <span className="weather-stat-label">Rain chance</span>
              <span className="weather-stat-value">{forecast.precipProb}%</span>
            </li>
            {forecast.precipMm > 0 && (
              <li>
                <span className="weather-stat-label">Rain amount</span>
                <span className="weather-stat-value">{forecast.precipMm} mm</span>
              </li>
            )}
          </ul>
        </div>
      )}

      {weather.message && <p className="weather-footnote">{weather.message}</p>}
    </>
  );
}
