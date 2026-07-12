import { DAY_WEATHER_LOCATIONS } from '../data/weatherLocations';
import { TRIP_YEAR } from './tripToday';

const weatherCache = new Map<string, { result: DayWeatherResult; at: number }>();
export const WEATHER_CACHE_MS = 30 * 60 * 1000;

function cacheKey(dayId: string, lat: number, lng: number): string {
  return `${dayId}:${lat},${lng}`;
}

export function getCachedDayWeather(dayId: string): DayWeatherResult | undefined {
  const loc = DAY_WEATHER_LOCATIONS[dayId];
  if (!loc) return undefined;
  const hit = weatherCache.get(cacheKey(dayId, loc.lat, loc.lng));
  if (hit && Date.now() - hit.at < WEATHER_CACHE_MS) return hit.result;
  return undefined;
}

export function setCachedDayWeather(dayId: string, result: DayWeatherResult): void {
  const loc = DAY_WEATHER_LOCATIONS[dayId];
  if (!loc) return;
  weatherCache.set(cacheKey(dayId, loc.lat, loc.lng), { result, at: Date.now() });
}

export function clearWeatherCache(): void {
  weatherCache.clear();
}

export async function fetchWeatherForDayId(dayId: string): Promise<DayWeatherResult | null> {
  const loc = DAY_WEATHER_LOCATIONS[dayId];
  const tripDate = dayIdToDate(dayId);
  if (!loc || !tripDate) return null;

  const cached = getCachedDayWeather(dayId);
  if (cached) return { ...cached, fromCache: true };

  const result = await fetchDayWeather(loc.lat, loc.lng, loc.label, tripDate);
  setCachedDayWeather(dayId, result);
  return { ...result, fromCache: false };
}

const TIMEZONE = 'America/New_York';
const FORECAST_MAX_DAYS = 16;

export interface WeatherSnapshot {
  tempC: number;
  humidity?: number;
  windKmh?: number;
  code: number;
  label: string;
  icon: string;
}

export interface DayWeatherResult {
  locationLabel: string;
  dateLabel: string;
  isoDate: string;
  mode: 'current' | 'forecast' | 'past' | 'unavailable';
  current?: WeatherSnapshot;
  forecast?: WeatherSnapshot & {
    highC: number;
    lowC: number;
    precipProb: number;
    precipMm: number;
  };
  message?: string;
  fetchedAt: Date;
  fromCache?: boolean;
}

interface OpenMeteoDaily {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_probability_max: number[];
  precipitation_sum: number[];
}

interface OpenMeteoCurrent {
  temperature_2m: number;
  relative_humidity_2m: number;
  weather_code: number;
  wind_speed_10m: number;
}

const WMO: Record<number, { label: string; icon: string }> = {
  0: { label: 'Clear', icon: '☀️' },
  1: { label: 'Mostly clear', icon: '🌤️' },
  2: { label: 'Partly cloudy', icon: '⛅' },
  3: { label: 'Overcast', icon: '☁️' },
  45: { label: 'Fog', icon: '🌫️' },
  48: { label: 'Rime fog', icon: '🌫️' },
  51: { label: 'Light drizzle', icon: '🌦️' },
  53: { label: 'Drizzle', icon: '🌦️' },
  55: { label: 'Heavy drizzle', icon: '🌧️' },
  56: { label: 'Freezing drizzle', icon: '🌧️' },
  57: { label: 'Freezing drizzle', icon: '🌧️' },
  61: { label: 'Light rain', icon: '🌧️' },
  63: { label: 'Rain', icon: '🌧️' },
  65: { label: 'Heavy rain', icon: '🌧️' },
  66: { label: 'Freezing rain', icon: '🌨️' },
  67: { label: 'Freezing rain', icon: '🌨️' },
  71: { label: 'Light snow', icon: '🌨️' },
  73: { label: 'Snow', icon: '❄️' },
  75: { label: 'Heavy snow', icon: '❄️' },
  77: { label: 'Snow grains', icon: '❄️' },
  80: { label: 'Rain showers', icon: '🌦️' },
  81: { label: 'Rain showers', icon: '🌧️' },
  82: { label: 'Heavy showers', icon: '🌧️' },
  85: { label: 'Snow showers', icon: '🌨️' },
  86: { label: 'Heavy snow showers', icon: '❄️' },
  95: { label: 'Thunderstorm', icon: '⛈️' },
  96: { label: 'Thunderstorm & hail', icon: '⛈️' },
  99: { label: 'Thunderstorm & hail', icon: '⛈️' },
};

function wmo(code: number) {
  return WMO[code] ?? { label: 'Unknown', icon: '🌡️' };
}

export function dayIdToDate(dayId: string): Date | null {
  const m = dayId.match(/^aug(\d{1,2})$/);
  if (!m) return null;
  const day = Number.parseInt(m[1], 10);
  if (day < 1 || day > 31) return null;
  return new Date(TRIP_YEAR, 7, day);
}

function toIsoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function startOfLocalDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function daysFromToday(target: Date): number {
  const ms = startOfLocalDay(target).getTime() - startOfLocalDay(new Date()).getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

function formatFetchedTime(d: Date): string {
  return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

async function fetchForecastDay(
  lat: number,
  lng: number,
  isoDate: string,
  includeCurrent: boolean
): Promise<{ daily?: OpenMeteoDaily; current?: OpenMeteoCurrent }> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lng),
    timezone: TIMEZONE,
    forecast_days: String(FORECAST_MAX_DAYS),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_probability_max',
      'precipitation_sum',
    ].join(','),
  });
  if (includeCurrent) {
    params.set(
      'current',
      ['temperature_2m', 'relative_humidity_2m', 'weather_code', 'wind_speed_10m'].join(',')
    );
  }
  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  if (!res.ok) throw new Error('Forecast unavailable');
  const json = (await res.json()) as {
    daily?: OpenMeteoDaily;
    current?: OpenMeteoCurrent;
  };
  const idx = json.daily?.time.indexOf(isoDate) ?? -1;
  if (idx < 0) throw new Error('Date not in forecast range');
  return { daily: json.daily, current: json.current };
}

async function fetchArchiveDay(lat: number, lng: number, isoDate: string): Promise<OpenMeteoDaily> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lng),
    timezone: TIMEZONE,
    start_date: isoDate,
    end_date: isoDate,
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_probability_max',
      'precipitation_sum',
    ].join(','),
  });
  const res = await fetch(`https://archive-api.open-meteo.com/v1/archive?${params}`);
  if (!res.ok) throw new Error('Historical weather unavailable');
  const json = (await res.json()) as { daily: OpenMeteoDaily };
  return json.daily;
}

export async function fetchDayWeather(
  lat: number,
  lng: number,
  locationLabel: string,
  tripDate: Date
): Promise<DayWeatherResult> {
  const isoDate = toIsoDate(tripDate);
  const offset = daysFromToday(tripDate);
  const fetchedAt = new Date();
  const dateLabel = tripDate.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  if (offset > FORECAST_MAX_DAYS - 1) {
    return {
      locationLabel,
      dateLabel,
      isoDate,
      mode: 'unavailable',
      message: `Detailed forecast usually appears within ${FORECAST_MAX_DAYS} days of travel. Check again closer to ${dateLabel}.`,
      fetchedAt,
    };
  }

  if (offset < 0) {
    try {
      const daily = await fetchArchiveDay(lat, lng, isoDate);
      const i = 0;
      const w = wmo(daily.weather_code[i]);
      return {
        locationLabel,
        dateLabel,
        isoDate,
        mode: 'past',
        forecast: {
          highC: Math.round(daily.temperature_2m_max[i]),
          lowC: Math.round(daily.temperature_2m_min[i]),
          precipProb: daily.precipitation_probability_max[i] ?? 0,
          precipMm: daily.precipitation_sum[i] ?? 0,
          tempC: Math.round((daily.temperature_2m_max[i] + daily.temperature_2m_min[i]) / 2),
          code: daily.weather_code[i],
          label: w.label,
          icon: w.icon,
        },
        message: 'Recorded weather for this day.',
        fetchedAt,
      };
    } catch {
      return {
        locationLabel,
        dateLabel,
        isoDate,
        mode: 'unavailable',
        message: 'Historical weather could not be loaded.',
        fetchedAt,
      };
    }
  }

  try {
    const { daily, current } = await fetchForecastDay(lat, lng, isoDate, offset === 0);
    if (!daily) throw new Error('No daily data');
    const i = daily.time.indexOf(isoDate);
    const w = wmo(daily.weather_code[i]);
    const forecast = {
      highC: Math.round(daily.temperature_2m_max[i]),
      lowC: Math.round(daily.temperature_2m_min[i]),
      precipProb: daily.precipitation_probability_max[i] ?? 0,
      precipMm: Math.round((daily.precipitation_sum[i] ?? 0) * 10) / 10,
      tempC: Math.round((daily.temperature_2m_max[i] + daily.temperature_2m_min[i]) / 2),
      code: daily.weather_code[i],
      label: w.label,
      icon: w.icon,
    };

    if (offset === 0 && current) {
      const cw = wmo(current.weather_code);
      return {
        locationLabel,
        dateLabel,
        isoDate,
        mode: 'current',
        current: {
          tempC: Math.round(current.temperature_2m),
          humidity: current.relative_humidity_2m,
          windKmh: Math.round(current.wind_speed_10m),
          code: current.weather_code,
          label: cw.label,
          icon: cw.icon,
        },
        forecast,
        message: `Updated ${formatFetchedTime(fetchedAt)}`,
        fetchedAt,
      };
    }

    return {
      locationLabel,
      dateLabel,
      isoDate,
      mode: 'forecast',
      forecast,
      message:
        offset === 1
          ? 'Tomorrow’s forecast — can change.'
          : 'Forecast — check again closer to the date.',
      fetchedAt,
    };
  } catch {
    return {
      locationLabel,
      dateLabel,
      isoDate,
      mode: 'unavailable',
      message: 'Could not load weather. Check your connection and try again.',
      fetchedAt,
    };
  }
}
