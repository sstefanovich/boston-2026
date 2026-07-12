import { useEffect, useState } from 'react';
import { useRefresh } from '../context/RefreshContext';
import { DAY_WEATHER_LOCATIONS } from '../data/weatherLocations';
import { dayIdToDate, fetchWeatherForDayId, type DayWeatherResult } from '../utils/weather';

export function useDayWeather(dayId: string | undefined) {
  const { refreshNonce } = useRefresh();
  const [weather, setWeather] = useState<DayWeatherResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!dayId) {
      setWeather(null);
      return;
    }

    const loc = DAY_WEATHER_LOCATIONS[dayId];
    const tripDate = dayIdToDate(dayId);
    if (!loc || !tripDate) {
      setWeather(null);
      setError(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchWeatherForDayId(dayId)
      .then((result) => {
        if (cancelled) return;
        setWeather(result);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError('Weather unavailable');
        setWeather(null);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [dayId, refreshNonce]);

  return { weather, loading, error };
}
