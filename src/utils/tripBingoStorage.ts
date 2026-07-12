const STORAGE_KEY = 'boston-travel-bingo-v1';

export function getBingoChecked(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const ids = JSON.parse(raw) as string[];
    return new Set(Array.isArray(ids) ? ids : []);
  } catch {
    return new Set();
  }
}

export function saveBingoChecked(checked: Set<string>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...checked]));
  } catch {
    /* ignore */
  }
}

export function toggleBingoItem(id: string): Set<string> {
  const next = getBingoChecked();
  if (next.has(id)) next.delete(id);
  else next.add(id);
  saveBingoChecked(next);
  return next;
}

export function clearBingo(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
