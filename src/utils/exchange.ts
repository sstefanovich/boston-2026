/** ECB reference rates via Frankfurter — no API key */

export const EXCHANGE_CACHE_MS = 12 * 60 * 60 * 1000;
const STORAGE_KEY = 'fb-travel-exchange-v1';

/** Offline estimate when fetch fails (update before trip if desired) */
export const USD_EUR_FALLBACK = 0.92;

export interface ExchangeRates {
  usdToEur: number;
  eurToUsd: number;
  rateDate: string;
  fetchedAt: Date;
  fromCache: boolean;
  offlineEstimate: boolean;
}

interface StoredExchange {
  usdToEur: number;
  rateDate: string;
  fetchedAt: number;
}

let memoryCache: { data: ExchangeRates; at: number } | null = null;

function readStorage(): StoredExchange | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredExchange;
    if (typeof parsed.usdToEur !== 'number' || !parsed.rateDate) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeStorage(usdToEur: number, rateDate: string): void {
  try {
    const payload: StoredExchange = {
      usdToEur,
      rateDate,
      fetchedAt: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* private mode / quota */
  }
}

function buildResult(
  usdToEur: number,
  rateDate: string,
  fetchedAt: Date,
  fromCache: boolean,
  offlineEstimate: boolean
): ExchangeRates {
  return {
    usdToEur,
    eurToUsd: usdToEur > 0 ? 1 / usdToEur : 0,
    rateDate,
    fetchedAt,
    fromCache,
    offlineEstimate,
  };
}

function fromStored(stored: StoredExchange, fromCache: boolean): ExchangeRates {
  return buildResult(
    stored.usdToEur,
    stored.rateDate,
    new Date(stored.fetchedAt),
    fromCache,
    false
  );
}

export function getCachedExchangeRates(): ExchangeRates | undefined {
  if (memoryCache && Date.now() - memoryCache.at < EXCHANGE_CACHE_MS) {
    return memoryCache.data;
  }
  const stored = readStorage();
  if (!stored) return undefined;
  if (Date.now() - stored.fetchedAt >= EXCHANGE_CACHE_MS) return undefined;
  const data = fromStored(stored, true);
  memoryCache = { data, at: Date.now() };
  return data;
}

export function clearExchangeCache(): void {
  memoryCache = null;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export async function fetchExchangeRates(force = false): Promise<ExchangeRates> {
  if (!force) {
    const hit = getCachedExchangeRates();
    if (hit) return hit;
  }

  try {
    const res = await fetch('https://api.frankfurter.dev/v1/latest?from=USD&to=EUR');
    if (!res.ok) throw new Error('Rates unavailable');
    const json = (await res.json()) as { date: string; rates: { EUR: number } };
    const usdToEur = json.rates.EUR;
    if (!usdToEur || usdToEur <= 0) throw new Error('Invalid rate');

    writeStorage(usdToEur, json.date);
    const data = buildResult(usdToEur, json.date, new Date(), false, false);
    memoryCache = { data, at: Date.now() };
    return data;
  } catch {
    const stored = readStorage();
    if (stored) {
      const data = fromStored(stored, true);
      memoryCache = { data, at: Date.now() };
      return data;
    }
    const data = buildResult(
      USD_EUR_FALLBACK,
      'estimate',
      new Date(),
      false,
      true
    );
    memoryCache = { data, at: Date.now() };
    return data;
  }
}

export function formatMoney(n: number, currency: 'USD' | 'EUR'): string {
  const code = currency === 'USD' ? 'USD' : 'EUR';
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}
