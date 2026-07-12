export type JournalScope = 'day' | 'place';

export interface JournalEntry {
  key: string;
  scope: JournalScope;
  targetId: string;
  text: string;
  updatedAt: number;
}

export type JournalEntries = Record<string, JournalEntry>;

const STORAGE_KEY = 'boston-travel-journal-v1';

export function journalKey(scope: JournalScope, targetId: string): string {
  return `${scope}:${targetId}`;
}

export function getJournalEntries(): JournalEntries {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as JournalEntries;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function persist(entries: JournalEntries): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    /* ignore */
  }
}

export function saveJournalEntry(scope: JournalScope, targetId: string, text: string): JournalEntries {
  const key = journalKey(scope, targetId);
  const next = { ...getJournalEntries() };
  if (!text.trim()) {
    delete next[key];
    persist(next);
    return next;
  }
  next[key] = {
    key,
    scope,
    targetId,
    text,
    updatedAt: Date.now(),
  };
  persist(next);
  return next;
}

export function deleteJournalEntry(scope: JournalScope, targetId: string): JournalEntries {
  const key = journalKey(scope, targetId);
  const next = { ...getJournalEntries() };
  delete next[key];
  persist(next);
  return next;
}

export function formatJournalUpdatedAt(updatedAt: number): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(updatedAt);
}
