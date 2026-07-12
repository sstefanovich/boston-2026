import { useEffect, useState } from 'react';
import { useRefresh } from '../context/RefreshContext';
import { fetchExchangeRates, type ExchangeRates } from '../utils/exchange';

export function useExchangeRates() {
  const { refreshNonce } = useRefresh();
  const [rates, setRates] = useState<ExchangeRates | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const force = refreshNonce > 0;
    fetchExchangeRates(force)
      .then((data) => {
        if (cancelled) return;
        setRates(data);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError('Rates unavailable');
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [refreshNonce]);

  return { rates, loading, error };
}
