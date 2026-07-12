import { useEffect, useState } from 'react';
import { useRefresh } from '../context/RefreshContext';
import { TIMELINE } from '../data/content';
import { DAY_WEATHER_LOCATIONS } from '../data/weatherLocations';
import { fetchWeatherForDayId, type DayWeatherResult } from '../utils/weather';

export interface TripWeatherDay {
  dayId: string;
  date: string;
  where: string;
  weather: DayWeatherResult | null;
}

export function useTripWeather() {
  const { refreshNonce } = useRefresh();
  const [days, setDays] = useState<TripWeatherDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const tripDays = TIMELINE.filter((d) => DAY_WEATHER_LOCATIONS[d.id]);

    setLoading(true);
    setError(null);

    Promise.all(
      tripDays.map(async (day) => {
        try {
          const weather = await fetchWeatherForDayId(day.id);
          return { dayId: day.id, date: day.date, where: day.where, weather };
        } catch {
          return { dayId: day.id, date: day.date, where: day.where, weather: null };
        }
      })
    )
      .then((results) => {
        if (cancelled) return;
        setDays(results);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError('Could not load weather');
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [refreshNonce]);

  return { days, loading, error };
}
