import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { clearExchangeCache } from '../utils/exchange';
import { clearWeatherCache } from '../utils/weather';

interface RefreshContextValue {
  refreshNonce: number;
  refreshing: boolean;
  triggerRefresh: () => Promise<void>;
}

const RefreshContext = createContext<RefreshContextValue | null>(null);

export function RefreshProvider({ children }: { children: ReactNode }) {
  const [refreshNonce, setRefreshNonce] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const triggerRefresh = useCallback(async () => {
    setRefreshing(true);
    clearWeatherCache();
    clearExchangeCache();
    setRefreshNonce((n) => n + 1);
    await new Promise((r) => window.setTimeout(r, 350));
    setRefreshing(false);
  }, []);

  const value = useMemo(
    () => ({ refreshNonce, refreshing, triggerRefresh }),
    [refreshNonce, refreshing, triggerRefresh]
  );

  return <RefreshContext.Provider value={value}>{children}</RefreshContext.Provider>;
}

export function useRefresh() {
  const ctx = useContext(RefreshContext);
  if (!ctx) {
    throw new Error('useRefresh must be used within RefreshProvider');
  }
  return ctx;
}
